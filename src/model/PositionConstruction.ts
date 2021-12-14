import { Construction } from "@/services/TrpOrder";

class PositionConstruction implements Construction {
  id?: number;
  weight?: number | undefined;
  quantity?: number | undefined;
  description?: string | undefined;
  order?: number | undefined;
  owner?: number | undefined;
  statusdirectus?: string | undefined;
}

export default PositionConstruction;
