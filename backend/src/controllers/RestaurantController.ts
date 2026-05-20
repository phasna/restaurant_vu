import type { Request, Response, NextFunction } from "express";
import { RestaurantService } from "../services/RestaurantService";

export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.listRestaurants();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const row = await this.service.getRestaurant(req.params.id);
      if (!row) {
        res.status(404).json({
          statusCode: 404,
          message: "Restaurant not found",
        });
        return;
      }
      res.json(row);
    } catch (e) {
      next(e);
    }
  };

  listSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const date = String(req.query.date ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        res.status(400).json({
          statusCode: 400,
          message: "Query param date is required (YYYY-MM-DD)",
          field: "date",
        });
        return;
      }
      const data = await this.service.listSlotsForDate(req.params.id, date);
      res.json(data);
    } catch (e) {
      next(e);
    }
  };
}
