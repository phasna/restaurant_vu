# Évaluation — Réservation restaurant

- **`backend/`** — API Express + TypeORM + **Swagger / OpenAPI**.

## Démarrage rapide

1. Terminal 1 — API :

```bash
cd backend
npm install
npm run dev
```

2. Swagger : `http://localhost:3000/api-docs`  
   OpenAPI JSON : `http://localhost:3000/openapi.json`

## Génération des types TS côté front

Avec l’API démarrée :

```bash
cd backend
npm run generate:types
cp openapi.d.ts ../frontend/src/types/openapi.d.ts
```
