import Client from "./Client";
import PositionPeople from "./PositionPeople";
import PositionGoods from "./PositionGoods";
import PositionConstruction from "./PositionConstruction";

class Order {

    id?: number;
    modified_on?: Date;
    created_on?: Date;
    modified_by?: number;
    remarks?: string;
    people = [new PositionPeople()]
    goods = [new PositionGoods];
    construction = [new PositionConstruction()]
    state?: string;
    shipper?: Client;
    receiver?: Client;
    principal?: Client;
    delivery_date?: Date;
    pick_up_date?: Date;
    tour?: number;


    constructor(id?: number, modified_on?: Date, created_on?: Date, modified_by?: number,
        remarks?: string,
        state?: string,
        shipper?: Client,
        receiver?: Client,
        principal?: Client,
        delivery_date?: Date,
        pick_up_date?: Date,
        tour?: number) {
        this.id = id;
        this.modified_on = modified_on;
        this.created_on = created_on;
        this.modified_by = modified_by;
        this.remarks = remarks;
        this.state = state;
        this.shipper = shipper;
        this.receiver = receiver;
        this.principal = principal;
        this.delivery_date = delivery_date;
        this.pick_up_date = pick_up_date;
        this.tour = tour;
    }
}

export default Order;