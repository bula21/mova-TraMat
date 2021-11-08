import { ModifiedBy, TrpClient, Type } from "@/services/TrpClient";

class Client implements TrpClient {
  id?: number;
  createdOn?: Date | undefined;
  modifiedBy?: ModifiedBy | undefined;
  modifiedOn?: Date | undefined;
  name?: string | undefined;
  street?: string | undefined;
  place?: string | undefined;
  phone?: null | string;
  zipcode?: number | undefined;
  email?: string | null | undefined;
  type?: Type | undefined;
}

export default Client;
