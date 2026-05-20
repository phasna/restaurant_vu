import type { Request, Response, NextFunction } from "express";
import { ReservationService } from "../services/ReservationService";
import type { CancelReservationBodyDto, CreateReservationDto } from "../dtos";

export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateReservationDto;
      const data = await this.service.createReservation(body);
      res.status(201).json(data);
    } catch (e) {
      next(e);
    }
  };

  getByToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getByToken(req.params.token);
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CancelReservationBodyDto;
      const data = await this.service.cancelReservation(req.params.id, body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  };
}
