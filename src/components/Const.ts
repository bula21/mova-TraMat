export const SEARCH_CATEGORIES = ["Order ID", "Status", "Liefertermin", "Ladetermin",
  "Auftraggeber Firma/Name", "Auftraggeber ID", "Auftraggeber Email",
  "Lieferadresse Name", "Ladeadresse Name", "Lieferadresse Ort", "Ladeadresse Ort",
  "Ladeadresse PLZ", "Lieferadresse PLZ"];

export enum DIRECTUS_ROLES {
  "Administrator"="Administrator",
  "Public"="Public",
  "Lagerbauten"="Lagerbauten",
  "Dienstleiter/in"="Dienstleiter/in",
  "Besteller/in"="Besteller/in",
  "Ressortleitung"="Ressortleitung",
  "Bereichsleitung Infra"="Bereichsleitung Infra",
  "Lagerplatz"="Lagerplatz",
  "Transport MA"="Transport MA",
  "Programmmaterial"="Programmmaterial"
}

export enum ORDER_TYPE {
  "Warentransport"="Warentransport",
  "Personentransport"="Personentransport",
  "Bauleistung mit Fahrzeug"="Bauleistung mit Fahrzeug"
}

export enum TRP_TYP_CLIENT {
  "mova",
  "external"
}
