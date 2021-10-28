class PositionGoods {
    id?: number;
    quantity?: number;
    packing_unit?: string;
    goods_description?: string;
    marking?: string;
    length?: number;
    height?: number;
    width?: number;
    gross_weight?: number;
    net_weight?: number;
    fk_order?: number;
    value_chf?: number;
    dangerous_goods?: boolean;

    constructor(id?: number, quantity?: number, packing_unit?: string, marking?: string, goods_description?: string, length?: number
      , gross_weight?: number,
      width?: number,
      net_weight?: number,
      value_chf?: number,
      fk_order?: number,
      height?: number,
      dangerous_goods?: boolean) {
      this.id = id;
      this.packing_unit = packing_unit;
      this.quantity = quantity;
      this.length = length;
      this.height = height;
      this.width = width;
      this.fk_order = fk_order;
      this.marking = marking;
      this.goods_description = goods_description;
      this.gross_weight = gross_weight;
      this.net_weight = net_weight;
      this.value_chf = value_chf;
      this.dangerous_goods = dangerous_goods;
    }
}

export default PositionGoods;
