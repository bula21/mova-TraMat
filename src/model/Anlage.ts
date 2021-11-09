/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Anlage } from "@/services/TrpOrder";

class AnlageClass implements Anlage {
  id?: number;
  status?: string | undefined;
  sort?: null | undefined;
  owner?: number | undefined;
  createdOn?: Date | undefined;
  modifiedBy?: number | undefined;
  modifiedOn?: Date | undefined;
  beschreibung?: string | null | undefined;
  avantiLink?: string | null | undefined;
  anlagenname?: string | undefined;
  kontaktperson?: number | undefined;
  standort?: null | undefined;
  standortcode?: null | undefined;
  plannachfuehrung?: null | undefined;
  anlagenId?: string | undefined;
  ordnerLink?: string | undefined;
}

export default AnlageClass;
