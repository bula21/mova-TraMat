import { Type } from "@/services/TrpClient";

class ClientType implements Type {
  id?: number;
  description?: string | undefined;
  acronym?: string | undefined;
}

export default ClientType;
