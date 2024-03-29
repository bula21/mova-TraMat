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
//   const transportState = Convert.toTransportState(json);
//   const packaging = Convert.toPackaging(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TransportState {
  id: number;
  state: string;
}

export interface Packaging {
  id: number;
  description: string;
  abbreviation: string;
}

export interface TrpTypePeople {
  id: number;
  description: string;
}

export interface TrpTypeClient {
  id: number;
  description: string;
  acronym: string;
}

// eslint-disable-next-line quotes
function transform(val: any, typ: any, getProps: any, key: any = ''): any {
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
    const result: any = {
    };
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

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toTransportState(json: string): TransportState[] {
    return cast(JSON.parse(json), a(r("TransportState")));
  }

  public static transportStateToJson(value: TransportState[]): string {
    return JSON.stringify(uncast(value, a(r("TransportState"))), null, 2);
  }

  public static toPackaging(json: string): Packaging[] {
    return cast(JSON.parse(json), a(r("Packaging")));
  }

  public static packagingToJson(value: Packaging[]): string {
    return JSON.stringify(uncast(value, a(r("Packaging"))), null, 2);
  }

  public static toTrpTypePeople(json: string): TrpTypePeople[] {
    return cast(JSON.parse(json), a(r("TrpTypePeople")));
  }

  public static trpTypePeopleToJson(value: TrpTypePeople[]): string {
    return JSON.stringify(uncast(value, a(r("TrpTypePeople"))), null, 2);
  }

  public static toTrpTypeClient(json: string): TrpTypeClient[] {
    return JSON.parse(json);
  }

  public static trpTypeClientToJson(value: TrpTypeClient[]): string {
    return JSON.stringify(value);
  }
}

// eslint-disable-next-line quotes
function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {
    };
    typ.props.forEach((p: any) => map[p.json] = {
      key: p.js, typ: p.typ,
    });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {
    };
    typ.props.forEach((p: any) => map[p.js] = {
      key: p.json, typ: p.typ,
    });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}



function a(typ: any) {
  return {
    arrayItems: typ,
  };
}
function u(...typs: any[]) {
  return {
    unionMembers: typs,
  };
}

function o(props: any[], additional: any) {
  return {
    props, additional,
  };
}
function m(additional: any) {
  return {
    props: [], additional,
  };
}

function r(name: string) {
  return {
    ref: name,
  };
}

const typeMap: any = {
  TransportState: o([
    {
      json: "id", js: "id", typ: 0,
    },
    {
      json: "state", js: "state", typ: "",
    },
  ], false),
  Packaging: o([
    {
      json: "id", js: "id", typ: 0,
    },
    {
      json: "description", js: "description", typ: "",
    },
    {
      json: "abbreviation", js: "abbreviation", typ: "",
    },
  ], false),
  TrpTypePeople: o([
    {
      json: "id", js: "id", typ: 0,
    },
    {
      json: "description", js: "description", typ: "",
    },
  ], false),
};
