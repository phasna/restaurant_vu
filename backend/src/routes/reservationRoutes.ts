import { Router } from "express";
import type { ReservationController } from "../controllers/ReservationController";

export function createReservationRouter(
  controller: ReservationController
): Router {
  const r = Router();

  /**
   * @openapi
   * /reservations:
   *   post:
   *     summary: Create a reservation
   *     tags: [Reservations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateReservation'
   *     responses:
   *       201:
   *         description: Created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ReservationResponse'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiError'
   */
  r.post("/", controller.create);

  /**
   * @openapi
   * /reservations/by-token/{token}:
   *   get:
   *     summary: Get reservation by opaque token
   *     tags: [Reservations]
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ReservationResponse'
   *       400:
   *         description: Bad request
   *       404:
   *         description: Not found
   */
  r.get("/by-token/:token", controller.getByToken);

  /**
   * @openapi
   * /reservations/{id}/cancel:
   *   patch:
   *     summary: Cancel a reservation (requires token)
   *     tags: [Reservations]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CancelReservationBody'
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CancelResponse'
   *       400:
   *         description: Validation / business rule error
   */
  r.patch("/:id/cancel", controller.cancel);

  return r;
}
