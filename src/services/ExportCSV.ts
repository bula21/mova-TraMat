/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { createObjectCsvStringifier } from "csv-writer";

class ExportCSV {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public createCsvClients(fieldsClients: any[], rows: any[]): string {
        const csvWriter = createObjectCsvStringifier({
            header: fieldsClients,
        });
        return fieldsClients.join(",") + "\n" + csvWriter.stringifyRecords(rows);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public createCsvOrder(fieldsOrder: any[], rows: any[]): string {
        const fieldNames = fieldsOrder.map((x) => x.field);
        fieldNames.push("cbm");
        fieldNames.push("totalweight");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rows.forEach((x: any) => {

            const weightCBM = this.calcWeightCBM(x);
            x.cbm = weightCBM[1];
            x.totalweight = weightCBM[0];

            //@ts-ignore
            if (x.modified_by) {
                //@ts-ignore
                const newRow = x.modified_by.first_name + " " + x.modified_by.last_name;
                //@ts-ignore
                x.modified_by = newRow;
            }

            if (x.anlage) {
                //@ts-ignore
                const newRow = x.anlage.id;
                //@ts-ignore
                x.anlage = newRow;
            }

            if (x.state) {
                //@ts-ignore
                const newState = x.state.state;
                //@ts-ignore
                x.state = newState;
            }

            if (x.principal) {
                //@ts-ignore
                const newAdress = "ID: " + x.principal.id + "|" + x.principal.name +
                    "|" + x.principal.street + "|" + x.principal.street + "|" +
                    x.principal.zipcode + " " + x.principal.place + "|" +
                    x.principal.email + "|" + x.principal.phone;
                x.principal = newAdress;
            }
            if (x.receiver) {
                //@ts-ignore
                const newAdress = "ID: " + x.receiver.id + "|" + x.receiver.name +
                    "|" + x.receiver.street + "|" + x.receiver.street + "|" +
                    x.receiver.zipcode + " " + x.receiver.place + "|" +
                    x.receiver.email + "|" + x.receiver.phone;
                x.receiver = newAdress;
            }
            if (x.shipper) {
                //@ts-ignore
                const newAdress = "ID: " + x.shipper.id + "|" + x.shipper.name +
                    "|" + x.shipper.street + "|" + x.shipper.street + "|" +
                    x.shipper.zipcode + " " + x.shipper.place + "|" +
                    x.shipper.email + "|" + x.shipper.phone;
                x.shipper = newAdress;
            }

            if (x.goods.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let posNr = 0;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                x.goods.forEach((element: any) => {
                    posNr++;
                    const position = "Pos: " + posNr + "\n";
                    const dangerous_goods = "| Gefahrgut: " + element.dangerous_goods;
                    const goods_description = "| Beschreibung: " + element.goods_description;
                    const gross_weight = "| Brutto(kg): " + element.gross_weight;
                    const net_weight = "| Netto(kg): " + element.net_weight;
                    const dims = "| LxBxH cm: " + element.length + "x" + element.width + "x" + element.height;
                    const marking = "| Markierung: " + element.marking;
                    const packing_unit = "| Verp.Einheit: " + element.packing_unit.description;
                    const quantity = " Anz.: " + element.quantity;
                    const value_chf = "| Warenwert(CHF): " + element.value_chf;

                    x["goodsPos" + posNr] = position + quantity + packing_unit + gross_weight + net_weight + goods_description + dims + value_chf + dangerous_goods + marking;
                    fieldNames.push("goodsPos" + posNr);
                });
                x.goods = "Anz. Pos: " + posNr;
            }

            if (x.people.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let posNr = 0;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                x.people.forEach((element: any) => {
                    posNr++;
                    const position = "Pos: " + posNr + "\n";
                    const description_of_luagge = "| Besch. Gepäck: " + element.description_of_luagge;
                    const quantity_of_people = "Anz. Pers: " + element.quantity_of_people;
                    const quantity_of_luggage = "| Anz. Gepäck: " + element.quantity_of_luggage;
                    const type_people = "| Typ. Pers.: " + element.type_people.description;
                    const dims = "| LxBxH cm: " + element.length + "x" + element.width + "x" + element.height;
                    const weight = "| Gewicht(kg): " + element.weight;

                    x["peoplePos" + posNr] = position + quantity_of_people + type_people + quantity_of_luggage + description_of_luagge + weight + dims;
                    fieldNames.push("peoplePos" + posNr);
                });
                x.people = "Anz. Pos: " + posNr;
            }

            if (x.construction.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let posNr = 0;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                x.construction.forEach((element: any) => {
                    posNr++;
                    const position = "Pos: " + posNr + "\n";
                    const description = "Besch.: " + element.description;
                    const quantity = "| Quantität.: " + element.quantity;
                    const weight = "| Gewicht(kg): " + element.weight;

                    x["constructionPos" + posNr] = position + description + quantity + weight;
                    fieldNames.push("constructionPos" + posNr);
                });
                x.construction = "Anz. Pos: " + posNr;
            }
        });

        const csvWriter = createObjectCsvStringifier({
            header: fieldNames,
        });

        return fieldNames.join(",") + "\n" + csvWriter.stringifyRecords(rows);
    }
    public sendCsvDownload(name: string, content: string) {
        const link = document.createElement("a");
        link.setAttribute(
            "href",
            // add UTF-8 BOM so Excel doesn't hiccup
            "data:text/plain;charset=utf-8,%EF%BB%BF" + encodeURIComponent(content)
        );
        link.setAttribute("download", name);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private calcWeightCBM(order: any): [number, number] {
        let weight = 0;
        let cbm = 0;

        if (order.people.length > 0) {
            // @ts-ignore
            order.people.forEach((value) => {
                // @ts-ignore
                weight = value.weight + weight;
                cbm =
                    // @ts-ignore
                    ((((value.length / 100) * value.height) / 100) * value.width) /
                    100 +
                    cbm;
            });
            // @ts-ignore
            cbm = cbm.toFixed(3);
            return [weight, cbm];
        }
        if (order.goods.length > 0) {
            // @ts-ignore
            order.goods.forEach((value) => {
                // @ts-ignore
                weight = value.gross_weight + weight;

                cbm =
                    // @ts-ignore
                    ((((value.length / 100) * value.height) / 100) * value.width) /
                    100 +
                    cbm;
            });
            // @ts-ignore
            cbm = cbm.toFixed(3);
            return [weight, cbm];

        }
        if (order.construction.length > 0) {
            // @ts-ignore
            order.construction.forEach((value) => {
                // @ts-ignore
                weight = value.weight + weight;
                // @ts-ignore
                cbm = 0;
            });
            return [weight, cbm];
        } else {
            return [weight, cbm];
        }
    }
}

export default new ExportCSV();