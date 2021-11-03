import { AnlageClass } from "@/services/TrpOrder";

class Anlage implements AnlageClass {
  id?: number;
  status?: string | undefined;
  sort?: null | undefined;
  owner?: number | undefined;
  createdOn?: Date | undefined;
  modifiedBy?: number | undefined;
  modifiedOn?: Date | undefined;
  beschreibung?: string | undefined;
  avantiLink?: null | undefined;
  anlagenname?: string | undefined;
  kontaktperson?: number | undefined;
  standort?: null | undefined;
  standortcode?: null | undefined;
  plannachfuehrung?: null | undefined;
  anlagenID?: string | undefined;
  ordnerLink?: string | undefined;
}

export default Anlage;
