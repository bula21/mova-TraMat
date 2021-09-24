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
    people = [new PositionPeople()];
    goods = [new PositionGoods];
    construction = [new PositionConstruction()];
    state?: number;
    shipper?: Client;
    receiver?: Client;
    principal?: Client;
    delivery_date?: Date;
    pick_up_date?: Date;
    tour?: number;
    anlage?: number;
    rasterLagerplatz?: string;
    delivery_only?: boolean;


    constructor(id?: number, modified_on?: Date, created_on?: Date, modified_by?: number,
        remarks?: string,
        state?: number,
        shipper?: Client,
        receiver?: Client,
        principal?: Client,
        delivery_date?: Date,
        pick_up_date?: Date,
        tour?: number,
        anlage?: number,
        rasterLagerplatz?: string,
        delivery_only?: boolean) {
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
        this.anlage = anlage;
        this.rasterLagerplatz = rasterLagerplatz;
        this.delivery_only = delivery_only;
    }

    public calcCBM(): number {

        let cbm = 0;

        if (this.goods.length > 0) {
            this.goods.forEach((good: PositionGoods) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                cbm = cbm + (good.length! / 100 * good.width! / 100 * good.height! / 100) * good.quantity!;
            });
            return Math.round(cbm * 1000) / 1000;
        }

        if (this.people.length > 0) {
            this.people.forEach((people: PositionPeople) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                cbm = cbm + (people.length! / 100 * people.width! / 100 * people.height! / 100) * people.quantity_of_luggage!;
            });
            return Math.round(cbm * 1000) / 1000;
        } else {
            return 0;
        }
    }

    public calcLuaggage(): number {
        let nrPices = 0;
        if (this.people.length > 0) {
            this.people.forEach((people: PositionPeople) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                nrPices = people.quantity_of_luggage! + nrPices;
            });
            return nrPices;
        } else {
            return 0;
        }
    }

    public calcQuantity(): number {

        let nrPices = 0;

        if (this.goods.length > 0) {
            this.goods.forEach((good: PositionGoods) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                nrPices = good.quantity! + nrPices;
            });
            return nrPices;
        }

        if (this.construction.length > 0) {
            this.construction.forEach((cons: PositionConstruction) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                nrPices = cons.quantity! + nrPices;
            });
            return nrPices;
        }

        if (this.people.length > 0) {
            this.people.forEach((people: PositionPeople) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                nrPices = people.quantity_of_people! + nrPices;
            });
            return nrPices;
        } else {
            return 0;
        }

    }

    public calcWeight(): number {

        let weight = 0;

        if (this.goods.length > 0) {
            this.goods.forEach((good: PositionGoods) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                weight = (good.gross_weight! * good.quantity!) + weight;
            });
            return Math.round(weight * 1000) / 1000;
        }

        if (this.construction.length > 0) {
            this.construction.forEach((cons: PositionConstruction) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                weight = (cons.weight! * cons.quantity!) + weight;
            });
            return Math.round(weight * 1000) / 1000;
        }

        if (this.people.length > 0) {
            this.people.forEach((people: PositionPeople) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                weight = (people.weight! * people.quantity_of_luggage!) + weight;
            });
            return Math.round(weight * 1000) / 1000;
        } else {
            return 0;
        }
    }
}

export default Order;