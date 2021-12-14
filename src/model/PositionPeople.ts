import { Person } from "@/services/TrpOrder";

class PositionPeople implements Person {
  id?: number;
  quantityOfPeople?: number | undefined;
  typePeople?: number | undefined;
  quantityOfLuggage?: number | undefined;
  weight?: number | undefined;
  width?: number | undefined;
  length?: number | undefined;
  height?: number | undefined;
  descriptionOfLuagge?: string | undefined;
  order?: number | undefined;
  owner?: number | undefined;
  statusdirectus?: string | undefined;
}

export default PositionPeople;
