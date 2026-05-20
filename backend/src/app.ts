import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import { runSeed } from "./seed/seed";
import { createRestaurantRouter } from "./routes/restaurantRoutes";
import { createReservationRouter } from "./routes/reservationRoutes";
import {
  restaurantController,
  reservationController,
} from "./container";
import { errorHandler } from "./middleware/errorHandler";
import { buildSwaggerSpec } from "./swagger";

async function bootstrap() {
  await AppDataSource.initialize();
  await runSeed();

  const app = express();
  app.use(cors());
  app.use(express.json());

  const swaggerSpec = buildSwaggerSpec();
  app.get("/openapi.json", (_req, res) => {
    res.json(swaggerSpec);
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/restaurants", createRestaurantRouter(restaurantController));
  app.use("/reservations", createReservationRouter(reservationController));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use(errorHandler);

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
