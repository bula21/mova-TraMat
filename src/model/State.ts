/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { State } from "@/services/TrpOrder";

class ClassState implements State {
  id?: number;
  state?: string;
}

export default ClassState;
