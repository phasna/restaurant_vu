import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/presentation/views/HomeView.vue"),
    },
    {
      path: "/etablissements",
      name: "etablissements",
      component: () => import("@/presentation/views/EstablishmentsView.vue"),
    },
    {
      path: "/reservation/creneau",
      name: "reservation-creneau",
      component: () => import("@/presentation/views/SlotSelectionView.vue"),
    },
    {
      path: "/reservation/finalisation",
      name: "reservation-finalisation",
      component: () =>
        import("@/presentation/views/FinalizeReservationView.vue"),
    },
    {
      path: "/reservation/confirmation",
      name: "reservation-confirmation",
      component: () => import("@/presentation/views/ConfirmationView.vue"),
    },
    {
      path: "/ma-reservation",
      name: "ma-reservation",
      component: () => import("@/presentation/views/ManageReservationView.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("@/presentation/views/ContactView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/presentation/views/NotFoundView.vue"),
    },
  ],
});

export default router;
