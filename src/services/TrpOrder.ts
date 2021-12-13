/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-empty */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-return-assign */
/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
// To parse this data:
//
//   import { Convert } from "./file";
//
//   const trpOrder = Convert.toTrpOrder(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TrpOrder {
  id?: number;
  createdOn?: Date;
  modifiedBy?: ModifiedBy;
  modifiedOn?: Date;
  remarks?: null | string;
  state?: State;
  shipper?: Principal;
  receiver?: Principal;
  principal?: Principal;
  deliveryDate?: Date;
  pickUpDate?: Date;
  tour?: null;
  owner?: ModifiedBy;
  rasterLagerplatz?: null | string;
  anlage?: Anlage | null;
  deliveryOnly?: boolean;
  document?: null;
  statusdirectus?: string;
  construction?: Construction[];
  goods?: Good[];
  people?: Person[];
  // methodes
  calcCBM(): number;
  calcLuaggage(): number;
  calcQuantity(): number;
  calcWeight(): number;
}

export interface Anlage {
  id?: number;
  status?: string;
  sort?: null;
  owner?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
  beschreibung?: null | string;
  avantiLink?: null | string;
  anlagenname?: string;
  kontaktperson?: number;
  standort?: string | null;
  standortcode?: string | null;
  plannachfuehrung?: Date | null;
  anlagenId?: string;
  ordnerLink?: string;
}

export interface Construction {
  id?: number;
  weight?: number;
  quantity?: number;
  description?: string;
  order?: number;
  owner?: number;
  statusdirectus?: string;
}

export interface Good {
  id?: number;
  marking?: null | string;
  quantity?: number;
  packingUnit?: number;
  goodsDescription?: string;
  valueChf?: number;
  grossWeight?: number;
  netWeight?: number;
  width?: number;
  height?: number;
  dangerousGoods?: boolean;
  length?: number;
  order?: number;
  owner?: number;
  statusdirectus?: string;
}

export interface ModifiedBy {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface Person {
  id?: number;
  quantityOfPeople?: number;
  typePeople?: number;
  quantityOfLuggage?: number;
  weight?: number;
  width?: number;
  length?: number;
  height?: number;
  descriptionOfLuagge?: string;
  order?: number;
  owner?: number;
  statusdirectus?: string;
}

export interface Principal {
  id?: number;
  createdOn?: Date;
  modifiedBy?: ModifiedBy;
  modifiedOn?: Date;
  name?: string;
  street?: string;
  place?: string;
  phone?: null | string;
  zipcode?: number;
  email?: null | string;
  type?: Type;
}

export interface Type {
  id?: number;
  description?: string;
  acronym?: string;
}

export interface State {
  id?: number;
  state?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertTrpOrder {
  public static toTrpOrder(json: string): TrpOrder[] {
    return cast(JSON.parse(json), a(r("TrpOrder")));
  }

  public static trpOrderToJson(value: TrpOrder[]): string {
    return JSON.stringify(uncast(value, a(r("TrpOrder"))), null, 2);
  }

  public static toAnlage(json: string): Anlage[] {
    return cast(JSON.parse(json), a(r("Anlage")));
  }

  public static anlageToJson(value: Anlage[]): string {
    return JSON.stringify(uncast(value, a(r("Anlage"))), null, 2);
  }

  public static toGood(json: string): Good[] {
    return cast(JSON.parse(json), a(r("Good")));
  }

  public static goodToJson(value: Good[]): string {
    return JSON.stringify(uncast(value, a(r("Good"))), null, 2);
  }

  public static toPeople(json: string): Person[] {
    return cast(JSON.parse(json), a(r("Person")));
  }

  public static peopleToJson(value: Person[]): string {
    return JSON.stringify(uncast(value, a(r("Person"))), null, 2);
  }

  public static toConstruction(json: string): Construction[] {
    return cast(JSON.parse(json), a(r("Construction")));
  }

  public static constructionToJson(value: Construction[]): string {
    return JSON.stringify(uncast(value, a(r("Construction"))), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ""): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ""): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) { }
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any; }, additional: any, val: any): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "TrpOrder": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "created_on", js: "createdOn", typ: u(undefined, Date) },
    { json: "modified_by", js: "modifiedBy", typ: u(undefined, r("ModifiedBy")) },
    { json: "modified_on", js: "modifiedOn", typ: u(undefined, Date) },
    { json: "remarks", js: "remarks", typ: u(undefined, u(null, "")) },
    { json: "state", js: "state", typ: u(undefined, r("State")) },
    { json: "shipper", js: "shipper", typ: u(undefined, r("Principal")) },
    { json: "receiver", js: "receiver", typ: u(undefined, r("Principal")) },
    { json: "principal", js: "principal", typ: u(undefined, r("Principal")) },
    { json: "delivery_date", js: "deliveryDate", typ: u(undefined, Date) },
    { json: "pick_up_date", js: "pickUpDate", typ: u(undefined, Date) },
    { json: "tour", js: "tour", typ: u(undefined, null) },
    { json: "owner", js: "owner", typ: u(undefined, r("ModifiedBy")) },
    { json: "raster_lagerplatz", js: "rasterLagerplatz", typ: u(undefined, u(null, "")) },
    { json: "anlage", js: "anlage", typ: u(undefined, u(r("Anlage"), null, 0)) },
    { json: "delivery_only", js: "deliveryOnly", typ: u(undefined, true) },
    { json: "document", js: "document", typ: u(undefined, null) },
    { json: "statusdirectus", js: "statusdirectus", typ: u(undefined, "") },
    { json: "construction", js: "construction", typ: u(undefined, a(r("Construction"))) },
    { json: "goods", js: "goods", typ: u(undefined, a(r("Good"))) },
    { json: "people", js: "people", typ: u(undefined, a(r("Person"))) },
  ], false),
  "Anlage": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "status", js: "status", typ: u(undefined, "") },
    { json: "sort", js: "sort", typ: u(undefined, null) },
    { json: "owner", js: "owner", typ: u(undefined, 0) },
    { json: "created_on", js: "createdOn", typ: u(undefined, Date) },
    { json: "modified_by", js: "modifiedBy", typ: u(undefined, 0) },
    { json: "modified_on", js: "modifiedOn", typ: u(undefined, Date) },
    { json: "beschreibung", js: "beschreibung", typ: u(undefined, u(null, "")) },
    { json: "avanti_link", js: "avantiLink", typ: u(undefined, u(null, "")) },
    { json: "anlagenname", js: "anlagenname", typ: u(undefined, "") },
    { json: "kontaktperson", js: "kontaktperson", typ: u(undefined, 0) },
    { json: "standort", js: "standort", typ: u(undefined, null, "") },
    { json: "standortcode", js: "standortcode", typ: u(undefined, null, "") },
    { json: "plannachfuehrung", js: "plannachfuehrung", typ: u(undefined, null, Date) },
    { json: "anlagen_id", js: "anlagenId", typ: u(undefined, "") },
    { json: "ordner_link", js: "ordnerLink", typ: u(undefined, "") },
  ], false),
  "Construction": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "weight", js: "weight", typ: u(undefined, 0) },
    { json: "quantity", js: "quantity", typ: u(undefined, 0) },
    { json: "description", js: "description", typ: u(undefined, "") },
    { json: "order", js: "order", typ: u(undefined, 0) },
    { json: "owner", js: "owner", typ: u(undefined, 0) },
    { json: "statusdirectus", js: "statusdirectus", typ: u(undefined, "") },
  ], false),
  "Good": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "marking", js: "marking", typ: u(undefined, u(null, "")) },
    { json: "quantity", js: "quantity", typ: u(undefined, 0) },
    { json: "packing_unit", js: "packingUnit", typ: u(undefined, 0) },
    { json: "goods_description", js: "goodsDescription", typ: u(undefined, "") },
    { json: "value_chf", js: "valueChf", typ: u(undefined, 0) },
    { json: "gross_weight", js: "grossWeight", typ: u(undefined, 0) },
    { json: "net_weight", js: "netWeight", typ: u(undefined, 0) },
    { json: "width", js: "width", typ: u(undefined, 3.14) },
    { json: "height", js: "height", typ: u(undefined, 3.14) },
    { json: "dangerous_goods", js: "dangerousGoods", typ: u(undefined, true) },
    { json: "length", js: "length", typ: u(undefined, 3.14) },
    { json: "order", js: "order", typ: u(undefined, 0) },
    { json: "owner", js: "owner", typ: u(undefined, 0) },
    { json: "statusdirectus", js: "statusdirectus", typ: u(undefined, "") },
  ], false),
  "ModifiedBy": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "first_name", js: "firstName", typ: u(undefined, "") },
    { json: "last_name", js: "lastName", typ: u(undefined, "") },
    { json: "email", js: "email", typ: u(undefined, "") },
  ], false),
  "Person": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "quantity_of_people", js: "quantityOfPeople", typ: u(undefined, 0) },
    { json: "type_people", js: "typePeople", typ: u(undefined, 0) },
    { json: "quantity_of_luggage", js: "quantityOfLuggage", typ: u(undefined, 0) },
    { json: "weight", js: "weight", typ: u(undefined, 0) },
    { json: "width", js: "width", typ: u(undefined, 0) },
    { json: "length", js: "length", typ: u(undefined, 0) },
    { json: "height", js: "height", typ: u(undefined, 0) },
    { json: "description_of_luagge", js: "descriptionOfLuagge", typ: u(undefined, "") },
    { json: "order", js: "order", typ: u(undefined, 0) },
    { json: "owner", js: "owner", typ: u(undefined, 0) },
    { json: "statusdirectus", js: "statusdirectus", typ: u(undefined, "") },
  ], false),
  "Principal": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "created_on", js: "createdOn", typ: u(undefined, Date) },
    { json: "modified_by", js: "modifiedBy", typ: u(undefined, r("ModifiedBy")) },
    { json: "modified_on", js: "modifiedOn", typ: u(undefined, Date) },
    { json: "name", js: "name", typ: u(undefined, "") },
    { json: "street", js: "street", typ: u(undefined, "") },
    { json: "place", js: "place", typ: u(undefined, "") },
    { json: "phone", js: "phone", typ: u(undefined, u(null, "")) },
    { json: "zipcode", js: "zipcode", typ: u(undefined, 0) },
    { json: "email", js: "email", typ: u(undefined, u(null, "")) },
    { json: "type", js: "type", typ: u(undefined, r("Type")) },
  ], false),
  "Type": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "description", js: "description", typ: u(undefined, "") },
    { json: "acronym", js: "acronym", typ: u(undefined, "") },
  ], false),
  "State": o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "state", js: "state", typ: u(undefined, "") },
  ], false),
};
