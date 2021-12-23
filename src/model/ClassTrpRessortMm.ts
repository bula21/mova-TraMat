import { TrpRessortMm } from "@/services/TrpClient";

class ClassTrpRessortMm implements TrpRessortMm {
  id?: number;
  createdOn?: Date | undefined;
  modifiedOn?: Date | undefined;
  ressort?: string | undefined;
}

export default ClassTrpRessortMm;
