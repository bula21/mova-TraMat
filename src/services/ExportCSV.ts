/* eslint-disable indent */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createObjectCsvStringifier } from "csv-writer";
import ClientDisplay from "@/model/ClientDisplay";
import { TrpOrder } from "./TrpOrder";

class ExportCSV {
  createCsvClients(fieldsClients: string[], clients: ClientDisplay[]): string {
    const csvWriter = createObjectCsvStringifier({
      header: fieldsClients,
    });
    return `${fieldsClients.join(",")}\n${csvWriter.stringifyRecords(clients)}`;
  }

  public createCsvOrder(fieldsOrder: string[], trpOrders: TrpOrder[], packagingUntisFromIdToDes: Map<number, string>, typePeopleFromIdToDes: Map<number, string>): string {
    const rows = [{
    }];

    fieldsOrder.push("cbm");
    fieldsOrder.push("totalweight");

    trpOrders.forEach((x: TrpOrder) => {
      const row: Record<string, unknown> = {
      };
      row.id = x.id;
      row.createdOn = x.createdOn!.toISOString().substring(0, 10);
      row.modifiedOn = x.modifiedOn!.toISOString().substring(0, 10);
      row.remarks = x.remarks;
      row.state = x.state?.state;
      row.deliveryDate = x.deliveryDate!.toISOString().substring(0, 10);
      row.pickUpDate = x.pickUpDate!.toISOString().substring(0, 10);
      row.cbm = x.calcCBM();
      row.totalweight = x.calcWeight();
      row.deliveryOnly = x.deliveryOnly;
      row.statusdirectus = x.statusdirectus;

      let modifiedBy = "";
      let owner = "";
      let anlage = "";
      let principal = "";
      let receiver = "";
      let shipper = "";
      let goods = "";
      let people = "";
      let construction = "";
      let tour = "";
      let rasterLagerplatz = "";
      let document = false;

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

      if (x.modifiedBy) {
        modifiedBy = `${x.modifiedBy.firstName} ${x.modifiedBy.lastName}`;
      }

      if (x.owner) {
        owner = `${x.owner.firstName} ${x.owner.lastName}`;
      }

      if (x.anlage?.id) {
        anlage = `ID: ${x.anlage.id}|${x.anlage.anlagenname}`;
      }

      if (x.principal) {
        principal = `ID: ${x.principal.id}|${x.principal.name
        }|${x.principal.street}|${x.principal.zipcode} ${x.principal.place}|${x.principal.email}|${x.principal.phone}`;
      }

      if (x.receiver) {
        receiver = `ID: ${x.receiver.id}|${x.receiver.name
          // eslint-disable-next-line indent
          }|${x.receiver.street}|${x.receiver.zipcode} ${x.receiver.place}|${x.receiver.email}|${x.receiver.phone}`;
      }
      if (x.shipper) {
        shipper = `ID: ${x.shipper.id}|${x.shipper.name
          }|${x.shipper.street}|${x.shipper.zipcode} ${x.shipper.place}|${x.shipper.email}|${x.shipper.phone}`;
      }

      row.tour = tour;
      row.document = document;
      row.rasterLagerplatz = rasterLagerplatz;
      row.modifiedBy = modifiedBy;
      row.owner = owner;
      row.anlage = anlage;
      row.principal = principal;
      row.receiver = receiver;
      row.shipper = shipper;

      if (x.goods!.length > 0) {
        let posNr = 0;

        x.goods!.forEach((element) => {
          posNr += 1;
          const position = `Pos: ${posNr}\n`;
          const dangerousGgoods = `| Gefahrgut: ${element.dangerousGoods}`;
          const goodsDescription = `| Beschreibung: ${element.goodsDescription}`;
          const grossWeight = `| Brutto(kg): ${element.grossWeight}`;
          const netWeight = `| Netto(kg): ${element.netWeight}`;
          const dims = `| LxBxH cm: ${element.length}x${element.width}x${element.height}`;
          const marking = `| Markierung: ${element.marking}`;
          const packingUnit = `| Verp.Einheit: ${packagingUntisFromIdToDes.get(element.packingUnit!)}`;
          const quantity = ` Anz.: ${element.quantity}`;
          const valueChf = `| Warenwert(CHF): ${element.valueChf}`;

          row[`goodsPos${posNr}`] = position + quantity + packingUnit + grossWeight + netWeight + goodsDescription + dims + valueChf + dangerousGgoods + marking;
          fieldsOrder.push(`goodsPos${posNr}`);
        });
        goods = `Anz. Pos: ${posNr}`;
      }
      row.goods = goods;

      if (x.people!.length > 0) {
        let posNr = 0;

        x.people!.forEach((element) => {
          posNr += 1;
          const position = `Pos: ${posNr}\n`;
          const descriptionOfLuagge = `| Besch. Gepäck: ${element.descriptionOfLuagge}`;
          const quantityOfPeople = `Anz. Pers: ${element.quantityOfPeople}`;
          const quantityOfLuggage = `| Anz. Gepäck: ${element.quantityOfLuggage}`;
          const typePeople = `| Typ. Pers.: ${typePeopleFromIdToDes.get(element.typePeople!)}`;
          const dims = `| LxBxH cm: ${element.length}x${element.width}x${element.height}`;
          const weight = `| Gewicht(kg): ${element.weight}`;

          row[`peoplePos${posNr}`] = position + quantityOfPeople + typePeople + quantityOfLuggage + descriptionOfLuagge + weight + dims;
          fieldsOrder.push(`peoplePos${posNr}`);
        });
        people = `Anz. Pos: ${posNr}`;
      }
      row.people = people;

      if (x.construction!.length > 0) {
        let posNr = 0;

        x.construction!.forEach((element) => {
          posNr += 1;
          const position = `Pos: ${posNr}\n`;
          const description = `Besch.: ${element.description}`;
          const quantity = `| Quantität.: ${element.quantity}`;
          const weight = `| Gewicht(kg): ${element.weight}`;

          row[`constructionPos${posNr}`] = position + description + quantity + weight;
          fieldsOrder.push(`constructionPos${posNr}`);
        });
        construction = `Anz. Pos: ${posNr}`;
      }
      row.construction = construction;
      rows.push(row);
    });

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
