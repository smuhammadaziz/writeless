import { Elysia } from "elysia";
import { getHealthStatus } from "./health.controller";

export const healthRoutes = new Elysia().get("/health", () =>
  getHealthStatus()
);
