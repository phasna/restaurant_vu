/** Affichage date `YYYY-MM-DD` en français (sans heure). */
export function formatDateLongFr(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Aujourd'hui en local `YYYY-MM-DD`. */
export function todayIsoLocal() {
  const n = new Date();
  const z = (x) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${z(n.getMonth() + 1)}-${z(n.getDate())}`;
}

/** +n jours en local `YYYY-MM-DD`. */
export function addDaysIsoLocal(isoDate, days) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const z = (x) => String(x).padStart(2, "0");
  return `${dt.getFullYear()}-${z(dt.getMonth() + 1)}-${z(dt.getDate())}`;
}
