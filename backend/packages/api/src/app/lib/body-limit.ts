import { INestApplication } from '@nestjs/common';
import express from 'express';

export function applyBodyLimit(app: INestApplication, limit: string) {
  app.use(express.json({ limit }));

  app.use(express.urlencoded({
    extended: true, limit,
  }));
}
