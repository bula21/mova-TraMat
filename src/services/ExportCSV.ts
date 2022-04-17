/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createObjectCsvStringifier } from "csv-writer";
import { format } from "fecha";
import ClientDisplay from "@/model/ClientDisplay";
import { TrpOrder } from "./TrpOrder";

class ExportCSV {
  createCsvClients(fieldsClients: string[], clients: ClientDisplay[]): string {
    const csvWriter = createObjectCsvStringifier({
      header: fieldsClients,
    });
    return `${fieldsClients.join(",")}\n${csvWriter.stringifyRecords(clients)}`;
  }

  public createCsvOrder(fieldsOrder: string[], trpOrders: TrpOrder[], packagingUntisFromIdToDes: Map<number, string>): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any = [];

    let maxPosNr = 0;

    fieldsOrder.push("cbm");
    fieldsOrder.push("totalweight");
    fieldsOrder.push("deliveryTime");
    fieldsOrder.push("pickUpTime");
    fieldsOrder.push("anlagen_name");
    fieldsOrder.push("principal_name");
    fieldsOrder.push("principal_street");
    fieldsOrder.push("principal_zipcode");
    fieldsOrder.push("principal_place");
    fieldsOrder.push("principal_email");
    fieldsOrder.push("principal_phone");
    fieldsOrder.push("principal_ressort");
    fieldsOrder.push("principal_bereich");
    fieldsOrder.push("receiver_name");
    fieldsOrder.push("receiver_street");
    fieldsOrder.push("receiver_zipcode");
    fieldsOrder.push("receiver_place");
    fieldsOrder.push("receiver_email");
    fieldsOrder.push("receiver_phone");
    fieldsOrder.push("shipper_name");
    fieldsOrder.push("shipper_street");
    fieldsOrder.push("shipper_zipcode");
    fieldsOrder.push("shipper_place");
    fieldsOrder.push("shipper_email");
    fieldsOrder.push("shipper_phone");

    trpOrders.forEach((x: TrpOrder) => {
      const row: Record<string, unknown> = {
      };
      row.id = x.id;
      row.remarks = x.remarks;
      row.state = x.state?.state;
      row.deliveryDate = format(x.deliveryDate!, "YYYY-MM-DD");
      row.deliveryTime = format(x.deliveryDate!, "HH:mm");
      row.pickUpDate = format(x.pickUpDate!, "YYYY-MM-DD");
      row.pickUpTime = format(x.pickUpDate!, "HH:mm");
      row.cbm = x.calcCBM();
      row.totalweight = x.calcWeight();
      row.deliveryOnly = x.deliveryOnly;
      row.statusdirectus = x.statusdirectus;
      row.costTrpExternal = x.costTrpExternal;

      let modifiedBy = "";
      let owner = "";
      let anlage = "";
      let goods = "";
      let people = "";
      let construction = "";
      let tour = "";
      let rasterLagerplatz = "";
      let document = false;
      let rasterLagerplatzPickUp = "";
      let anlagePickUp = "";

      if (x.tour) {
        // eslint-disable-next-line prefer-destructuring
        tour = x.tour;
      }

      if (x.document) {
        document = true;
      }

      if (x.rasterLagerplatz) {
        // eslint-disable-next-line prefer-destructuring
        rasterLagerplatz = x.rasterLagerplatz;
      }

      if (x.rasterLagerplatzPickUp) {
        // eslint-disable-next-line prefer-destructuring
        rasterLagerplatzPickUp = x.rasterLagerplatzPickUp;
      }

      if (x.modifiedBy) {
        modifiedBy = `${x.modifiedBy.firstName} ${x.modifiedBy.lastName}`;
      }

      if (x.createdOn) {
        row.createdOn = format(new Date(x.createdOn!), "YYYY-MM-DD HH:mm:ss");
      }

      if (x.modifiedOn) {
        row.modifiedOn = format(new Date(x.modifiedOn!), "YYYY-MM-DD HH:mm:ss");
      }

      if (x.owner) {
        owner = `${x.owner.firstName} ${x.owner.lastName}`;
      }

      if (x.anlage) {
        anlage = x.anlage.anlagenId!;
      }

      if (x.anlagePickUp) {
        anlagePickUp = x.anlagePickUp.anlagenId!;
      }

      row.tour = tour;
      row.document = document;
      row.rasterLagerplatz = rasterLagerplatz;
      row.rasterLagerplatzPickUp = rasterLagerplatzPickUp;
      row.modifiedBy = modifiedBy;
      row.owner = owner;
      row.anlage = anlage;
      row.anlagePickUp = anlagePickUp;
      row.anlagen_name = x.anlage?.anlagenname;
      row.principal = x.principal?.id;
      row.principal_name = x.principal?.name;
      row.principal_street = x.principal?.street;
      row.principal_zipcode = x.principal?.zipcode;
      row.principal_place = x.principal?.place;
      row.principal_email = x.principal?.email;
      row.principal_phone = x.principal?.phone;
      row.principal_ressort = x.principal?.ressortDepartment?.trpRessortMm?.ressort;
      row.principal_bereich = x.principal?.ressortDepartment?.department;
      row.receiver = x.receiver?.id;
      row.receiver_name = x.receiver?.name;
      row.receiver_street = x.receiver?.street;
      row.receiver_zipcode = x.receiver?.zipcode;
      row.receiver_place = x.receiver?.place;
      row.receiver_email = x.receiver?.email;
      row.receiver_phone = x.receiver?.phone;
      row.shipper = x.shipper?.id;
      row.shipper_name = x.shipper?.name;
      row.shipper_street = x.shipper?.street;
      row.shipper_zipcode = x.shipper?.zipcode;
      row.shipper_place = x.shipper?.place;
      row.shipper_email = x.shipper?.email;
      row.shipper_phone = x.shipper?.phone;

      if (x.goods!.length > 0) {
        let posNr = 0;
        let position = "";

        x.goods!.forEach((element) => {
          posNr += 1;
          position = `pos_${posNr}_`;
          row[`${position}goods_dangerousGoods`] = element.dangerousGoods;
          row[`${position}goodsDescription`] = element.goodsDescription;
          row[`${position}goods_grossWeight`] = element.grossWeight;
          row[`${position}goods_netWeight`] = element.netWeight;
          row[`${position}goods_length`] = element.length;
          row[`${position}goods_width`] = element.width;
          row[`${position}goods_height`] = element.height;
          row[`${position}goods_packingUnit`] = packagingUntisFromIdToDes.get(element.packingUnit!);
          row[`${position}goods_marking`] = element.marking;
          row[`${position}goods_quantity`] = element.quantity;
          row[`${position}goods_valueChf`] = element.valueChf;
          row[`${position}goods_kommissionieren`] = element.kommissionieren;
          row[`${position}goods_stapelbar`] = element.stapelbar;
          if (maxPosNr < posNr) {
            maxPosNr = posNr;
          }
        });
        goods = `Anz. Pos: ${posNr}`;
      }
      row.goods = goods;

      if (x.people!.length > 0) {
        let posNr = 0;

        x.people!.forEach(() => {
          posNr += 1;
          if (maxPosNr < posNr) {
            maxPosNr = posNr;
          }
        });
        people = `Anz. Pos: ${posNr}`;
      }
      row.people = people;


      if (x.construction!.length > 0) {
        let posNr = 0;
        let position = "";

        x.construction!.forEach((element) => {
          posNr += 1;
          position = `pos_${posNr}_`;
          row[`${position}const_description`] = element.description;
          row[`${position}const_quantity`] = element.quantity;
          row[`${position}const_weight`] = element.weight;
          if (maxPosNr < posNr) {
            maxPosNr = posNr;
          }
        });
        construction = `Anz. Pos: ${posNr}`;
      }
      row.construction = construction;
      rows.push(row);
    });

    for (let z = 0; z < maxPosNr; z++) {
      const position = `pos_${z + 1}_`;
      fieldsOrder.push(`${position}goods_dangerousGoods`, `${position}goodsDescription`,
        `${position}goods_grossWeight`, `${position}goods_netWeight`, `${position}goods_length`,
        `${position}goods_width`, `${position}goods_height`, `${position}goods_packingUnit`, `${position}goods_marking`, `${position}goods_quantity`,
        `${position}goods_valueChf`, `${position}goods_kommissionieren`, `${position}goods_stapelbar`);
      fieldsOrder.push(`${position}const_description`, `${position}const_quantity`, `${position}const_weight`);
    }

    const csvWriter = createObjectCsvStringifier({
      header: fieldsOrder,
    });

    return `${fieldsOrder.join(",")}\n${csvWriter.stringifyRecords(rows)}`;
  }

  public sendCsvDownload(name: string, content: string) {
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      // add UTF-8 BOM so Excel doesn't hiccup
      `data:text/plain;charset=utf-8,%EF%BB%BF${encodeURIComponent(content)}`,
    );
    link.setAttribute("download", name);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default new ExportCSV();
