import { RestaurantService } from "./services/RestaurantService";
import { ReservationService } from "./services/ReservationService";
import { RestaurantController } from "./controllers/RestaurantController";
import { ReservationController } from "./controllers/ReservationController";

const restaurantService = new RestaurantService();
const reservationService = new ReservationService();

export const restaurantController = new RestaurantController(
  restaurantService
);
export const reservationController = new ReservationController(
  reservationService
);
