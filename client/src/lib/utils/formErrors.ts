import { ApiError } from '@/services/apiError';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

// Moves the API's per-field validation messages onto the matching form fields.
// Only fields the form actually renders are listed, so a message is never set
// on a field the user can't see. Returns true when at least one was applied,
// so the caller can fall back to a generic message otherwise.
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): boolean {
  if (!(error instanceof ApiError) || !error.fieldErrors) return false;

  let applied = false;
  for (const field of fields) {
    const message = error.fieldErrors[field]?.[0];
    if (message) {
      setError(field, { type: 'server', message });
      applied = true;
    }
  }
  return applied;
}
