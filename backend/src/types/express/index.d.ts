// src/types/express/index.d.ts

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {}; //  this line is REQUIRED
