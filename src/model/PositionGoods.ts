import { Good } from "@/services/TrpOrder";

class PositionGoods implements Good {
  stapelbar?: boolean;
  kommissionieren?: boolean;
  id?: number;
  marking?: string | null | undefined;
  quantity?: number | undefined;
  packingUnit?: number | undefined;
  goodsDescription?: string | undefined;
  valueChf?: number | undefined;
  grossWeight?: number | undefined;
  netWeight?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  dangerousGoods?: boolean | undefined;
  length?: number | undefined;
  order?: number | undefined;
  owner?: number | undefined;
  statusdirectus?: string | undefined;
}

export default PositionGoods;
