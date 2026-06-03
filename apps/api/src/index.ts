import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { connectDb } from "./config/db";
import { healthRoutes } from "./modules/health/health.route";

const port = Number(process.env.PORT) || 3001;

await connectDb();

const app = new Elysia()
  .use(cors())
  .use(healthRoutes)
  .listen(port);

console.log(`API running at http://${app.server?.hostname}:${app.server?.port}`);
