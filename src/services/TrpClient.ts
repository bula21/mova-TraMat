// To parse this data:
//
//   import { Convert } from "./file";
//
//   const trpClient = Convert.toTrpClient(json);
export interface Role {
  id?: number;
  name?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipWhitelist?: any[];
  externalID?: string;
  moduleListing?: null;
  collectionListing?: null;
  enforce2Fa?: boolean;
}

export interface Type {
  id?: number;
  description?: string;
  acronym?: string;
}

export interface ModifiedBy {
  id?: number;
  status?: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
  email?: string;
  token?: string;
  timezone?: string;
  locale?: null | string;
  localeOptions?: null;
  avatar?: null;
  company?: string;
  title?: null;
  emailNotifications?: boolean;
  lastAccessOn?: Date;
  lastPage?: string;
  externalID?: string;
  theme?: string;
  the2FaSecret?: null;
  passwordResetToken?: null;
}

export interface TrpClient {
  id?: number;
  createdOn?: Date;
  modifiedBy?: ModifiedBy;
  modifiedOn?: Date;
  name?: string;
  street?: string;
  place?: string;
  phone?: string;
  zipcode?: number;
  email?: null | string;
  type?: Type;
}

// Converts JSON strings to/from your types
export class ConvertTrpClient {
  public static toTrpClient(json: string): TrpClient[] {
    return JSON.parse(json);
  }

  public static trpClientToJson(value: TrpClient[]): string {
    return JSON.stringify(value);
  }
}
