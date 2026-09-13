import { app } from './app';
import { env } from './config/env';
import pool from './db/index';
import { logger } from './middleware/logger.middleware';

// How long to let in-flight requests finish before killing the process.
// Most platforms send SIGKILL ~30s after SIGTERM, so stay well inside that.
const SHUTDOWN_TIMEOUT_MS = 10_000;

const server = app.listen(env.PORT, () => {
  logger.info(`Server is running on port ${env.PORT}`);
});

let shuttingDown = false;

async function shutdown(signal: string) {
  // Platforms often send SIGTERM then SIGINT; only the first one should act.
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`${signal} received, shutting down`);

  // Force-exit if a hung connection keeps server.close() from resolving,
  // otherwise the platform's SIGKILL cuts off the pool mid-drain anyway.
  const forceExit = setTimeout(() => {
    logger.error('Shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  try {
    // Stop accepting new connections and wait for open requests to finish.
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    // Only then release DB clients — closing earlier would fail in-flight work.
    await pool.end();
    logger.info('Shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, 'Error during shutdown');
    process.exit(1);
  }
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// Node terminates on an unhandled rejection by default, with no indication of
// which promise. Log it first so the cause survives in the platform's logs.
process.on('unhandledRejection', (reason) => {
  logger.error({ err: reason }, 'Unhandled promise rejection');
  void shutdown('unhandledRejection');
});

// The process state is unknown after this point; drain and exit rather than
// keep serving requests from a corrupted runtime.
process.on('uncaughtException', (error) => {
  logger.error({ err: error }, 'Uncaught exception');
  void shutdown('uncaughtException');
});
