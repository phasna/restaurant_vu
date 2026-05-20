import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const servers = [
  {
    url: "http://localhost:3000",
    description: "Local development",
  },
];

export function buildSwaggerSpec() {
  return swaggerJsdoc({
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Restaurant reservations API",
        version: "1.0.0",
        description:
          "",
      },
      servers,
      tags: [
        { name: "Restaurants", description: "Restaurants and availability" },
        { name: "Reservations", description: "Booking lifecycle" },
      ],
      components: {
        schemas: {
          Restaurant: {
            type: "object",
            required: [
              "id",
              "name",
              "description",
              "address",
              "cuisineType",
              "imageUrl",
            ],
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              description: { type: "string" },
              address: { type: "string" },
              cuisineType: { type: "string" },
              imageUrl: { type: "string", format: "uri" },
            },
          },
          SlotStatus: {
            type: "string",
            enum: ["free", "nearly_full", "full"],
          },
          SlotResponse: {
            type: "object",
            required: [
              "id",
              "restaurantId",
              "date",
              "startTime",
              "endTime",
              "totalCapacity",
              "bookedCovers",
              "status",
            ],
            properties: {
              id: { type: "string", format: "uuid" },
              restaurantId: { type: "string", format: "uuid" },
              date: { type: "string", example: "2026-05-18" },
              startTime: { type: "string", example: "19:00" },
              endTime: { type: "string", example: "20:30" },
              totalCapacity: { type: "integer", minimum: 1 },
              bookedCovers: { type: "integer", minimum: 0 },
              status: { $ref: "#/components/schemas/SlotStatus" },
            },
          },
          CreateReservation: {
            type: "object",
            required: [
              "restaurantId",
              "timeSlotId",
              "customerName",
              "customerEmail",
              "customerPhone",
              "covers",
            ],
            properties: {
              restaurantId: { type: "string", format: "uuid" },
              timeSlotId: { type: "string", format: "uuid" },
              customerName: { type: "string" },
              customerEmail: { type: "string", format: "email" },
              customerPhone: { type: "string" },
              covers: { type: "integer", minimum: 1 },
            },
          },
          ReservationCustomer: {
            type: "object",
            required: ["name", "email", "phone"],
            properties: {
              name: { type: "string" },
              email: { type: "string", format: "email" },
              phone: { type: "string" },
            },
          },
          ReservationSlot: {
            type: "object",
            required: ["id", "date", "startTime", "endTime"],
            properties: {
              id: { type: "string", format: "uuid" },
              date: { type: "string" },
              startTime: { type: "string" },
              endTime: { type: "string" },
            },
          },
          ReservationResponse: {
            type: "object",
            required: [
              "id",
              "token",
              "status",
              "message",
              "restaurant",
              "slot",
              "covers",
              "customer",
            ],
            properties: {
              id: { type: "string", format: "uuid" },
              token: { type: "string", format: "uuid" },
              status: { type: "string", enum: ["confirmed", "cancelled"] },
              message: { type: "string" },
              restaurant: {
                type: "object",
                required: ["id", "name"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  name: { type: "string" },
                },
              },
              slot: { $ref: "#/components/schemas/ReservationSlot" },
              covers: { type: "integer" },
              customer: { $ref: "#/components/schemas/ReservationCustomer" },
            },
          },
          CancelReservationBody: {
            type: "object",
            required: ["token"],
            properties: {
              token: { type: "string", format: "uuid" },
            },
          },
          CancelResponse: {
            type: "object",
            required: ["message", "reservation"],
            properties: {
              message: { type: "string" },
              reservation: { $ref: "#/components/schemas/ReservationResponse" },
            },
          },
          ApiError: {
            type: "object",
            required: ["statusCode", "message"],
            properties: {
              statusCode: { type: "integer" },
              message: { type: "string" },
              field: { type: "string" },
            },
          },
        },
      },
    },
    apis: [path.join(__dirname, "routes", "*.{ts,js}")],
  });
}
