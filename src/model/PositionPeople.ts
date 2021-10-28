class PositionPeople {
    id?: number;
    quantity_of_people?: number;
    type_people?: string;
    quantity_of_luggage?: number;
    description_of_luagge?: string;
    length?: number;
    height?: number;
    width?: number;
    weight?: number;
    fk_order?: number;

    constructor(id?: number, quantity_of_people?: number, type_people?: string, quantity_of_luggage?: number, description_of_luagge?: string, length?: number
      , height?: number,
      width?: number,
      weight?: number,
      fk_order?: number) {
      this.id = id;
      this.type_people = type_people;
      this.quantity_of_people = quantity_of_people;
      this.length = length;
      this.height = height;
      this.width = width;
      this.fk_order = fk_order;
      this.quantity_of_luggage = quantity_of_luggage;
      this.description_of_luagge = description_of_luagge;
      this.weight = weight;
    }
}

export default PositionPeople;
