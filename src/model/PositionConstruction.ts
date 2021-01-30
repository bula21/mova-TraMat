class PositionConstruction {

    id?: number;
    quantity?: number;
    description?: string;
    weight?: number;
    fk_order?: number;

    constructor(id?: number, quantity?: number, description?: string, weight?: number,
        fk_order?: number,) {

        this.id = id;
        this.description = description;
        this.quantity = quantity;
        this.fk_order = fk_order;
        this.weight = weight;
    }
}

export default PositionConstruction;