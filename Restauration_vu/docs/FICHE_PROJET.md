# Fiche — Travail réalisé sur le projet L’ESSENCE (Vue 3)

Emplacement de ce document : **`Restauration_vu/docs/FICHE_PROJET.md`**

---

## 1. Contexte

- **Stack** : Vue 3, Vite, Tailwind CSS v4, Headless UI, Heroicons, **Vue Router**, **Pinia**.
- **Objectif** : passer d’une maquette / filaires à une app structurée (architecture type évaluation), puis **pages complètes** et **branchement API** du dossier `backend/` (à la racine du repo `Restauranration`).

---

## 2. Première étape — Barre de navigation

- Fichier initial : `components/Nav_bar/navBar.vue` (remplacé plus tard par l’architecture `presentation/`).
- Barre alignée maquette : fond blanc, logo **L'ESSENCE** en serif, liens centrés avec **soulignement** pour l’actif, bouton noir **Réserver**.
- Mobile : burger, logo centré, panneau avec liens + CTA.

> L’ancien `navBar.vue` isolé a été **supprimé** au profit de `AppNavBar.vue`.

---

## 3. Header accueil (étape intermédiaire)

- `components/Accueil/Header.vue` : Nav + **héro** (*L'art de l'essentiel.*, texte, boutons, zone visuelle).
- `App.vue` importait ce `Header`.

> Ce fichier a été **supprimé** : le contenu est dans `HomeView.vue` + composants `presentation/components/accueil/`.

---

## 4. Architecture (Pinia + Router + dossiers)

| Zone | Rôle |
|------|------|
| `src/presentation/components/` | Composants **dumb** (props + emits, pas d’HTTP). |
| `src/presentation/views/` | **Pages** : composition + Router / Pinia. |
| `src/stores/` | **Pinia** : état + appels API. |
| `src/services/` | Client **HTTP** + fonctions **API**. |
| `src/constants/` | Navigation, images accueil, clés session. |
| `src/router/index.js` | Routes. |
| `src/main.js` | `createApp` + **Pinia** + **Router**. |
| `src/App.vue` | `<RouterView />` uniquement. |

### Navigation

- `src/constants/navigation.js` : **Accueil**, **Nos Établissements**, **Mes Réservations** + `CTA_RESERVE_LABEL` (*Réserver une table*).

### Layout

- `presentation/components/layout/AppPageLayout.vue` : Nav + **FlashBanner** (store flash) + `<slot />` + **AppFooter**.
- `AppNavBar.vue` : props `links`, `activePath`, `ctaLabel`, `brand` ; emits `logo-click`, `navigate`, `cta-click`.

---

## 5. Page d’accueil (maquette filaire)

### Composants accueil (dumb)

- `AccueilHero.vue` — héro + prop `imageSrc`.
- `AccueilSplitSection.vue` — blocs texte + image, `reverse` pour alterner.
- `AccueilDestinationsSection.vue` + `DestinationCard.vue` — grille destinations.
- `AccueilSensGallery.vue` — bandeau sombre + prop `images[]`.
- `AccueilNewsletterCta.vue` — email + abonnement (mock côté vue).

### Images

- `src/constants/accueilImages.js` — URLs Unsplash optimisées (`w=`, `q=`).

### Typo

- `index.html` — Google Fonts Playfair + DM Sans.
- `src/assets/base.css` — `@theme` Tailwind (`--font-serif`, `--font-sans`) + `body`.

### Vue

- `presentation/views/HomeView.vue` — assemble tout le scroll accueil.

---

## 6. Autres pages + backend (API réelle)

### HTTP & proxy

- `src/services/http.js` — `apiRequest` ; en dev, `API_BASE_URL` par défaut **`/api`** si pas de `.env`.
- `vite.config.js` — proxy **`/api` → `http://localhost:3000`**.
- `src/services/api.js` — `listRestaurants`, `listSlots`, `createReservation`, `getReservationByToken`, `cancelReservation`.

### Stores

- `stores/restaurants.js` — liste restaurants.
- `stores/booking.js` — sélection restaurant / date / créneau, formulaire, `fetchSlots`, `submitReservation`, `resetFlow`.
- `stores/reservation.js` — chargement par **token**, **annulation**.
- `stores/flashMessages.js` — succès / erreur globaux.

### Session

- `src/constants/storage.js` — `SESSION_LAST_RESERVATION` (dernière réponse POST).

### Utilitaires

- `src/utils/dateDisplay.js` — `todayIsoLocal`, `formatDateLongFr`, etc.

### Composants booking / forms / établissements

- `booking/SlotStatusBadge.vue`, `TimeSlotGrid.vue`, `BookingSummaryCard.vue`
- `establishments/EstablishmentRow.vue`
- `forms/LabeledInput.vue`, `LabeledTextarea.vue`
- `feedback/FlashBanner.vue`

### Vues

| Fichier | Rôle |
|---------|------|
| `HomeView.vue` | Accueil complet. |
| `EstablishmentsView.vue` | `GET /restaurants`. |
| `SlotSelectionView.vue` | `GET /restaurants/:id/slots?date=`. |
| `FinalizeReservationView.vue` | `POST /reservations`. |
| `ConfirmationView.vue` | Query `token` ou session ; avis = mock. |
| `ManageReservationView.vue` | `GET by-token`, `PATCH cancel` ; pas de modification date/heure (non prévu par l’API). |
| `ContactView.vue` | Mock (flash). |
| `NotFoundView.vue` | 404. |

### Env

- `.env.example` — rappel `VITE_API_BASE_URL` pour la **production**.

---

## 7. Ce qui n’a pas été fait dans le code (hors conversation)

- **Commits Git** : non créés par l’assistant (sauf si tu le demandes explicitement).
- **API « modifier réservation »** : n’existe pas sur le backend actuel — seulement annulation + nouvelle réservation.
- **Contact / avis / newsletter** : parties mock ou sans endpoint dédié.

---

## 8. Lancer le projet

1. **API** : `cd backend && npm install && npm run dev` (port **3000**).
2. **Front** : `cd Restauration_vu && npm install && npm run dev` (Vite utilise le **proxy `/api`** vers le backend).

Parcours démo : Établissements → Réserver → date + créneau → Finaliser → Confirmation (noter le **token**) → Mes Réservations → Annuler si besoin.

---

## 9. Fiche complémentaire (brief évaluation)

Pour le détail de la **vérification** par rapport au sujet d’évaluation et des **correctifs** appliqués (dates Pinia, `useRoute`, erreur `customerName`, page confirmation sans e-mail + lien token, etc.) : voir **`docs/FICHE_MODIFICATIONS_EVALUATION.md`**.

---

*Document généré pour synthétiser les changements depuis le début de la conversation sur ce dépôt.*
