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
//   const trpClient = Convert.toTrpClient(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TrpClient {
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
  ressortDepartment?: RessortDepartment | null;
}

export interface ModifiedBy {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface RessortDepartment {
  id?: number;
  createdOn?: Date;
  modifiedOn?: Date;
  department?: string;
  trpRessortMm?: TrpRessortMm;
}

export interface TrpRessortMm {
  id?: number;
  createdOn?: Date;
  modifiedOn?: Date;
  ressort?: string;
}

export interface Type {
  id?: number;
  description?: string;
  acronym?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class ConvertTrpClient {
  public static toTrpClient(json: string): TrpClient[] {
    return cast(JSON.parse(json), a(r("TrpClient")));
  }

  public static trpClientToJson(value: TrpClient[]): string {
    return JSON.stringify(uncast(value, a(r("TrpClient"))), null, 2);
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
        result[key] = val[key];
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
  TrpClient: o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "created_on", js: "createdOn", typ: u(undefined, Date) },
    { json: "modified_by", js: "modifiedBy", typ: u(undefined, null, "", r("ModifiedBy")) },
    { json: "modified_on", js: "modifiedOn", typ: u(undefined, Date) },
    { json: "name", js: "name", typ: u(undefined, "") },
    { json: "street", js: "street", typ: u(undefined, "") },
    { json: "place", js: "place", typ: u(undefined, "") },
    { json: "phone", js: "phone", typ: u(undefined, u(null, "")) },
    { json: "zipcode", js: "zipcode", typ: u(undefined, 0) },
    { json: "email", js: "email", typ: u(undefined, u(null, "")) },
    { json: "type", js: "type", typ: u(undefined, r("Type")) },
    { json: "ressort_department", js: "ressortDepartment", typ: u(undefined, u(r("RessortDepartment"), null, 0)) },
  ], false),
  ModifiedBy: o([
    { json: "id", js: "id", typ: u(undefined, 0, null) },
    { json: "first_name", js: "firstName", typ: u(undefined, "", null) },
    { json: "last_name", js: "lastName", typ: u(undefined, "", null) },
    { json: "email", js: "email", typ: u(undefined, "", null) },
  ], false),
  RessortDepartment: o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "created_on", js: "createdOn", typ: u(undefined, Date) },
    { json: "modified_on", js: "modifiedOn", typ: u(undefined, Date) },
    { json: "department", js: "department", typ: u(undefined, "") },
    { json: "trp_ressort_mm", js: "trpRessortMm", typ: u(undefined, r("TrpRessortMm")) },
  ], false),
  TrpRessortMm: o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "created_on", js: "createdOn", typ: u(undefined, Date) },
    { json: "modified_on", js: "modifiedOn", typ: u(undefined, Date) },
    { json: "ressort", js: "ressort", typ: u(undefined, "") },
  ], false),
  Type: o([
    { json: "id", js: "id", typ: u(undefined, 0) },
    { json: "description", js: "description", typ: u(undefined, "") },
    { json: "acronym", js: "acronym", typ: u(undefined, "") },
  ], false),
};
