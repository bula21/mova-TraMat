// To parse this data:
//
//   import { Convert } from "./file";
//
//   const trpOrder = Convert.toTrpOrder(json);

export interface OwnerClass {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface State {
  id?: number;
  state?: string;
}

export interface PrincipalModifiedBy {
  id?: number;
}

export interface Type {
  id?: number;
  description?: string;
  acronym?: string;
}

export interface Principal {
  id?: number;
  createdOn?: Date;
  modifiedBy?: PrincipalModifiedBy;
  modifiedOn?: Date;
  name?: string;
  street?: string;
  place?: string;
  phone?: string;
  zipcode?: number;
  email?: null | string;
  type?: Type;
}

export interface AnlageClass {
  id?: number;
  status?: string;
  sort?: null;
  owner?: number;
  createdOn?: Date;
  modifiedBy?: number;
  modifiedOn?: Date;
  beschreibung?: string;
  avantiLink?: null;
  anlagenname?: string;
  kontaktperson?: number;
  standort?: null;
  standortcode?: null;
  plannachfuehrung?: null;
  anlagenID?: string;
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

export interface TrpOrder {
  id?: number;
  createdOn?: Date;
  modifiedBy?: OwnerClass;
  modifiedOn?: Date;
  remarks?: null | string;
  state?: State;
  shipper?: Principal;
  receiver?: Principal;
  principal?: Principal;
  deliveryDate?: Date;
  pickUpDate?: Date;
  tour?: null;
  owner?: OwnerClass;
  rasterLagerplatz?: null | string;
  anlage?: AnlageClass | null;
  deliveryOnly?: boolean;
  document?: null;
  statusdirectus?: string;
  construction?: Construction[];
  goods?: Good[];
  people?: Person[];
}

// Converts JSON strings to/from your types
export class ConvertTrpOrder {
  public static toTrpOrder(json: string): TrpOrder[] {
    return JSON.parse(json);
  }

  public static trpOrderToJson(value: TrpOrder[]): string {
    return JSON.stringify(value);
  }
  
  public static toTrpGood(json: string): Good {
    return JSON.parse(json);
  }

  public static trpGoodToJson(value: Good): string {
    return JSON.stringify(value);
  }
  
  public static toTrpPerson(json: string): Person {
    return JSON.parse(json);
  }

  public static trpPersonToJson(value: Person): string {
    return JSON.stringify(value);
  }
  
  public static toTrpConst(json: string): Construction {
    return JSON.parse(json);
  }

  public static trpConstToJson(value: Construction): string {
    return JSON.stringify(value);
  }
  
  public static toAnlage(json: string): AnlageClass[] {
    return JSON.parse(json);
  }

  public static anlageToJson(value: AnlageClass[]): string {
    return JSON.stringify(value);
  }
}
