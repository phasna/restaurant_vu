import { AppDataSource } from "../data-source";
import { Restaurant } from "../entities/Restaurant";
import { TimeSlot } from "../entities/TimeSlot";
import { Reservation } from "../entities/Reservation";
import { v4 as uuidv4 } from "uuid";

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(base: Date, days: number): Date {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + days);
  return copy;
}

const SLOT_DEFS: Array<{
  startTime: string;
  endTime: string;
  totalCapacity: number;
}> = [
  { startTime: "12:00", endTime: "13:30", totalCapacity: 24 },
  { startTime: "12:30", endTime: "14:00", totalCapacity: 20 },
  { startTime: "13:00", endTime: "14:30", totalCapacity: 16 },
  { startTime: "19:00", endTime: "20:30", totalCapacity: 30 },
  { startTime: "19:30", endTime: "21:00", totalCapacity: 28 },
  { startTime: "20:00", endTime: "21:30", totalCapacity: 22 },
];

const RESTAURANT_SEEDS: Array<
  Pick<Restaurant, "name" | "description" | "address" | "cuisineType" | "imageUrl">
> = [
  {
    name: "Le Petit Bistrot",
    description: "Cuisine française de saison, carte courte et produits locaux.",
    address: "12 rue des Lilas, Lyon",
    cuisineType: "Française",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  },
  {
    name: "Sakura Sushi",
    description: "Bar à sushi et sashimis, poisson livré le matin même.",
    address: "5 avenue Voltaire, Paris",
    cuisineType: "Japonaise",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
  },
  {
    name: "Trattoria Roma",
    description: "Pâtes fraîches maison et antipasti à partager.",
    address: "8 place Bellecour, Lyon",
    cuisineType: "Italienne",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
  },
  {
    name: "Green Bowl",
    description: "Bowls végétariens, jus pressés à froid et desserts sans gluten.",
    address: "22 cours Gambetta, Bordeaux",
    cuisineType: "Végétarienne",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
  },
  {
    name: "Smoke & Fire BBQ",
    description: "Viandes fumées longuement, sauces maison et sides généreux.",
    address: "3 quai des Chartrons, Bordeaux",
    cuisineType: "Américaine / BBQ",
    imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
  },
];

export async function runSeed(): Promise<void> {
  const restaurantRepo = AppDataSource.getRepository(Restaurant);
  const slotRepo = AppDataSource.getRepository(TimeSlot);
  const reservationRepo = AppDataSource.getRepository(Reservation);

  const restaurants = await restaurantRepo.save(
    RESTAURANT_SEEDS.map((r) => restaurantRepo.create(r))
  );

  const today = new Date();
  const daysAhead = 10;
  const slots: TimeSlot[] = [];

  for (const restaurant of restaurants) {
    for (let d = 0; d < daysAhead; d += 1) {
      const dateStr = formatDate(addDays(today, d));
      for (const def of SLOT_DEFS) {
        slots.push(
          slotRepo.create({
            restaurantId: restaurant.id,
            date: dateStr,
            startTime: def.startTime,
            endTime: def.endTime,
            totalCapacity: def.totalCapacity,
          })
        );
      }
    }
  }

  await slotRepo.save(slots);

  // Pre-book some covers to create varied slot statuses (first restaurant, today, first 3 slots)
  const firstResto = restaurants[0];
  const todayStr = formatDate(today);
  const todaySlots = await slotRepo.find({
    where: { restaurantId: firstResto.id, date: todayStr },
    order: { startTime: "ASC" },
    take: 3,
  });

  if (todaySlots[0]) {
    await reservationRepo.save(
      reservationRepo.create({
        restaurantId: firstResto.id,
        timeSlotId: todaySlots[0].id,
        customerName: "Alice Dupont",
        customerEmail: "alice@example.com",
        customerPhone: "+33601020304",
        covers: Math.floor(todaySlots[0].totalCapacity * 0.45),
        token: uuidv4(),
        status: "confirmed",
      })
    );
  }
  if (todaySlots[1]) {
    await reservationRepo.save(
      reservationRepo.create({
        restaurantId: firstResto.id,
        timeSlotId: todaySlots[1].id,
        customerName: "Bob Martin",
        customerEmail: "bob@example.com",
        customerPhone: "+33605060708",
        covers: Math.floor(todaySlots[1].totalCapacity * 0.75),
        token: uuidv4(),
        status: "confirmed",
      })
    );
  }
  if (todaySlots[2]) {
    await reservationRepo.save(
      reservationRepo.create({
        restaurantId: firstResto.id,
        timeSlotId: todaySlots[2].id,
        customerName: "Chloé Bernard",
        customerEmail: "chloe@example.com",
        customerPhone: "+33609080706",
        covers: todaySlots[2].totalCapacity,
        token: uuidv4(),
        status: "confirmed",
      })
    );
  }
}
