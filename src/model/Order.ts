/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AnlageClass, Construction, Good, OwnerClass, Person, Principal, State, TrpOrder } from "@/services/TrpOrder";

class Order implements TrpOrder {
  id?: number;
  createdOn?: Date | undefined;
  modifiedBy?: OwnerClass | undefined;
  modifiedOn?: Date | undefined;
  remarks?: string | null | undefined;
  state?: State | undefined;
  shipper?: Principal | undefined;
  receiver?: Principal | undefined;
  principal?: Principal | undefined;
  deliveryDate?: Date | undefined;
  pickUpDate?: Date | undefined;
  tour?: null | undefined;
  owner?: OwnerClass | undefined;
  rasterLagerplatz?: string | null | undefined;
  anlage?: AnlageClass | null | undefined;
  deliveryOnly?: boolean | undefined;
  document?: null | undefined;
  statusdirectus?: string | undefined;
  construction?: Construction[] | undefined;
  goods?: Good[] | undefined;
  people?: Person[] | undefined;

  public calcCBM(): number {
    let cbm = 0;
    
    if (this.goods!.length > 0) {
      this.goods!.forEach((good: Good) => {
        cbm = cbm + (good.length! / 100 * good.width! / 100 * good.height! / 100) * good.quantity!;
      });
      return Math.round(cbm * 1000) / 1000;
    }

    if (this.people!.length > 0) {
      this.people!.forEach((people: Person) => {
        cbm = cbm + (people.length! / 100 * people.width! / 100 * people.height! / 100) * people.quantityOfLuggage!;
      });
      return Math.round(cbm * 1000) / 1000;
    } else {
      return 0;
    }
  }

  public calcLuaggage(): number {
    let nrPices = 0;
    if (this.people!.length > 0) {
      this.people!.forEach((people: Person) => {
        nrPices = people.quantityOfLuggage! + nrPices;
      });
      return nrPices;
    } else {
      return 0;
    }
  }

  public calcQuantity(): number {
    let nrPices = 0;

    if (this.goods!.length > 0) {
      this.goods!.forEach((good: Good) => {
        nrPices = good.quantity! + nrPices;
      });
      return nrPices;
    }

    if (this.construction!.length > 0) {
      this.construction!.forEach((cons: Construction) => {
        nrPices = cons.quantity! + nrPices;
      });
      return nrPices;
    }

    if (this.people!.length > 0) {
      this.people!.forEach((people: Person) => {
        nrPices = people.quantityOfLuggage! + nrPices;
      });
      return nrPices;
    } else {
      return 0;
    }
  }

  public calcWeight(): number {
    let weight = 0;

    if (this.goods!.length > 0) {
      this.goods!.forEach((good: Good) => {
        weight = (good.grossWeight! * good.quantity!) + weight;
      });
      return Math.round(weight * 1000) / 1000;
    }

    if (this.construction!.length > 0) {
      this.construction!.forEach((cons: Construction) => {
        weight = (cons.weight! * cons.quantity!) + weight;
      });
      return Math.round(weight * 1000) / 1000;
    }

    if (this.people!.length > 0) {
      this.people!.forEach((people: Person) => {
        weight = (people.weight! * people.quantityOfLuggage!) + weight;
      });
      return Math.round(weight * 1000) / 1000;
    } else {
      return 0;
    }
  }
}

export default Order;
