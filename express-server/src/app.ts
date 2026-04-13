import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
