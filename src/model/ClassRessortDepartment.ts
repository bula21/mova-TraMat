import { RessortDepartment, TrpRessortMm } from "@/services/TrpClient";

class ClassRessortDepartment implements RessortDepartment {
  id?: number;
  createdOn?: Date | undefined;
  modifiedOn?: Date | undefined;
  department?: string | undefined;
  trpRessortMm?: TrpRessortMm | undefined;
}

export default ClassRessortDepartment;
