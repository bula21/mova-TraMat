export const SEARCH_CATEGORIES = ["Order ID", "Status", "Liefertermin", "Ladetermin",
  "Auftraggeber Firma/Name", "Auftraggeber ID", "Auftraggeber Email",
  "Lieferadresse Name", "Ladeadresse Name", "Lieferadresse Ort", "Ladeadresse Ort",
  "Ladeadresse PLZ", "Lieferadresse PLZ"];

export const DIRECTUS_ROLES = {
  // no warn
  Administrator: "Administrator",
  "Transport MA": "Transport MA",
  // warn
  Public: "Public",
  Lagerbauten: "Lagerbauten",
  "Dienstleiter/in": "Dienstleiter/in",
  "Besteller/in": "Besteller/in",
  Ressortleitung: "Ressortleitung",
  "Bereichsleitung Infra": "Bereichsleitung Infra",
  Lagerplatz: "Lagerplatz",
  Programmmaterial: "Programmmaterial",
};

export const ORDER_TYPE = {
  Warentransport: "Warentransport",
  Personentransport: "Personentransport",
  "Bauleistung mit Fahrzeug": "Bauleistung mit Fahrzeug",
};

export const TRP_TYP_CLIENT = {
  mova: 1,
  external: 2,
};

export const TRP_TYP_CLIENT_STRING = {
  mova: "mova",
  external: "external",
};
