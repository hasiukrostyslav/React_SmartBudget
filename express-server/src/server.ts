/// <reference path="./types/express.d.ts" />
import { app } from './app';

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
