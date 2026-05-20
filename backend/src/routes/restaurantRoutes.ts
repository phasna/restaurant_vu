import { Router } from "express";
import type { RestaurantController } from "../controllers/RestaurantController";

export function createRestaurantRouter(
  controller: RestaurantController
): Router {
  const r = Router();

  /**
   * @openapi
   * /restaurants:
   *   get:
   *     summary: List restaurants
   *     tags: [Restaurants]
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Restaurant'
   */
  r.get("/", controller.list);

  /**
   * @openapi
   * /restaurants/{id}:
   *   get:
   *     summary: Get restaurant by id
   *     tags: [Restaurants]
   *     parameters:
   *       - in: path
   *         name: id
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
   *               $ref: '#/components/schemas/Restaurant'
   *       404:
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiError'
   */
  r.get("/:id", controller.getById);

  /**
   * @openapi
   * /restaurants/{id}/slots:
   *   get:
   *     summary: List time slots for a restaurant on a given day
   *     tags: [Restaurants]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *           example: "2026-05-18"
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/SlotResponse'
   *       400:
   *         description: Bad request
   *       404:
   *         description: Restaurant not found
   */
  r.get("/:id/slots", controller.listSlots);

  return r;
}
