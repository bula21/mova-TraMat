<template>
  <!-- print labels for transport orders -->
  <v-container>
    <input @keyup.enter="printLabels()">
    <div id="pdf-multiple-labels" />
    <v-alert v-if="errorMessage.length > 0" type="warning">
      {{ errorMessage }}
    </v-alert>
    <div id="divider" style="background-color:#000000; height: 1px; width:100%;" class="mt-4" />
    <!-- actions print-->
    <v-card-actions class="mt-1 mr-n2">
      <v-spacer />
      <v-btn color="orange" text @click="close()">
        Schliessen
      </v-btn>
      <v-btn color="blue darken-2" text @click="printLabels()">
        PDF
        <v-icon right dark>
          mdi-printer
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable indent */
import { Component, Vue, Prop } from "vue-property-decorator";
import { format } from "fecha";
import { jsPDF } from "jspdf";
import PDFObject from "pdfobject";
import DirectusAPI from "@/services/DirectusAPI";
import Order from "@/model/Order";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as logo from "@/assets/Mova22Logo.json";

const QRious = require("qrious");

@Component({
  components: {
  },
})
export default class PrintLables extends Vue {
  @Prop({
    type: Array, required: true,
  })
  orders!: Order[];

  private firstAndLastName = "";
  private Email = "";
  private fileName = "";
  public errorMessage = "";

  // eslint-disable-next-line new-cap
  private orderPDF = new jsPDF();
  private packagingUntisFromIdToDes = new Map();

  async mounted(): Promise<void> {
    window.addEventListener("keyup", this.handleEnter);
    const nameEmail = await DirectusAPI.fetchNameEmail();
    this.Email = nameEmail[2];
    this.firstAndLastName = `${nameEmail[0]} ${nameEmail[1]}`;
    const featchPackaging = await DirectusAPI.fetchPackaging();
    featchPackaging.forEach((value) => {
      this.packagingUntisFromIdToDes.set(value.id, value.abbreviation);
    });

    this.orderPDF = this.generatePDF();
    if (this.orderPDF.internal.pages.length < 16) {
      PDFObject.embed(this.orderPDF.output("datauristring"), "#pdf-multiple-labels");
    } else {
      this.errorMessage = "No preview possible please download pdf to view it";
    }
  }

  destroyed(): void {
    window.removeEventListener("keyup", this.handleEnter);
  }

  // eslint-disable-next-line class-methods-use-this
  private handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      // this.printLabels();
    }
  }

  public async printLabels(): Promise<void> {
    this.fileName = `Labels_${format(new Date(), "YYYY-MM-DD HH:mm:ss")}.pdf`;
    this.orderPDF.save(this.fileName);
    this.close();
  }

  // eslint-disable-next-line class-methods-use-this
  private breakLines(text: string, spaceLine: number): [string, number] {
    let newText = " ";
    let lineBreaks = 0;

    if (text !== null) {
      newText = text;

      if (text.length > spaceLine) {
        newText = "";
        lineBreaks = Math.ceil(text.length / spaceLine);
        newText = text.substring(0, spaceLine);
        for (let i = 1; lineBreaks > i; i++) {
          newText = `${newText}\n${text.substring(spaceLine * i, i * spaceLine + spaceLine)}`;
        }
      }
      lineBreaks -= 1;
      return [newText, lineBreaks];
    }
    return [newText, lineBreaks];
  }

  private generatePDF(): jsPDF {
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF("p", "cm", "a4");

    if (this.orders.length > 0) {
      if (this.orders) {
        pdf.deletePage(1);
      }
    }

    this.orders.forEach((orderToPrint) => {
      // document creation DIN A4 21,0 cm x 29,7 cm
      pdf.addPage("a4", "p");
      const borderLeft = 1.2;
      let posNr = 0;
      const DINA4width = 21.00;
      const firstColSize = 4.8;
      const secondColSize = firstColSize + 8;
      const smallGrid = (secondColSize - firstColSize) / 3;
      const smallGridFirstCol = firstColSize + smallGrid + 0.2;
      let offset = 0;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont("Helvetica", "normal");

      // if trp type goods
      if (orderToPrint.goods!.length > 0) {
        for (let i = 0; orderToPrint.goods!.length > i; i++) {
          for (let z = 1; orderToPrint.goods![i].quantity! >= z; z++) {
            posNr += 1;
            pdf.setLineWidth(0.04);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.0]);
            // lines around label
            pdf.line(borderLeft, 1.5 + offset, (DINA4width - borderLeft), 1.5 + offset);
            pdf.line(borderLeft, 1.5 + offset, borderLeft, 11.85 + offset);
            pdf.line(borderLeft, 11.85 + offset, (DINA4width - borderLeft), 11.85 + offset);
            pdf.line((DINA4width - borderLeft), 1.5 + offset, (DINA4width - borderLeft), 11.85 + offset);
            // raster in label
            pdf.line(firstColSize, 1.5 + offset, firstColSize, 11.85 + offset);
            pdf.line(secondColSize, 1.5 + offset, secondColSize, 11.85 + offset);
            // lieferadresse
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Lieferadresse", 1.5, 2.2 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(12);
            const textLieferadresseReciver = this.breakLines(orderToPrint.receiver!.name!, 60);
            pdf.text(`${textLieferadresseReciver[0]
              }\n${orderToPrint.receiver?.street
              }\n${orderToPrint.receiver?.zipcode} ${orderToPrint.receiver?.place}`,
              firstColSize + 0.2, 2.2 + offset);
            // raster lagerplatz
            pdf.line(borderLeft, 3.5 + offset, secondColSize, 3.5 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Rasterpalnnr.", 1.5, 4.4 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(32);
            if (orderToPrint.rasterLagerplatz) {
              pdf.text(`${orderToPrint.rasterLagerplatz}`, firstColSize + 0.2, 4.65 + offset);
            }
            // anlage id
            pdf.line(borderLeft, 5 + offset, (DINA4width - borderLeft), 5 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Anlagen ID", 1.5, 5.9 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(22);
            if (orderToPrint.anlage?.anlagenId && orderToPrint.anlage.anlagenname) {
              pdf.text(`${orderToPrint.anlage.anlagenId} ${orderToPrint.anlage.anlagenname}`, firstColSize + 0.2, 6.0 + offset);
            }
            // lieferdatum
            pdf.line(borderLeft, 6.5 + offset, secondColSize, 6.5 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Lieferdatum\nZeit", 1.5, 7.0 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(12);
            pdf.text(`${format(orderToPrint.deliveryDate!, "YYYY-MM-DD")
              }\n${format(orderToPrint.deliveryDate!, "HH:mm")}`, firstColSize + 0.2, 7.0 + offset);
            // container
            pdf.line(borderLeft, 7.7 + offset, secondColSize, 7.7 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Container", 1.5, 8.2 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(13);
            if (this.packagingUntisFromIdToDes.get(orderToPrint.goods![i].packingUnit) === "CONT") {
              pdf.text("X", firstColSize + 0.2, 8.2 + offset);
            }
            // paket
            pdf.line(borderLeft, 8.9 + offset, DINA4width - borderLeft, 8.9 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Paket", 1.5, 9.4 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(13);
            if (this.packagingUntisFromIdToDes.get(orderToPrint.goods![i].packingUnit) === "PK") {
              pdf.text("X", firstColSize + 0.2, 9.4 + offset);
            }
            // gewicht
            pdf.line(borderLeft, 10.1 + offset, DINA4width - borderLeft, 10.1 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Gewicht", 1.5, 10.6 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(12);
            pdf.text(`${orderToPrint.goods![i].grossWeight} kg`, firstColSize + 0.2, 10.6 + offset);
            // smaler grid
            pdf.line(firstColSize + smallGrid, 6.5 + offset, firstColSize + smallGrid, 11.85 + offset);
            pdf.line(firstColSize + smallGrid * 2, 6.5 + offset, firstColSize + smallGrid * 2, 11.85 + offset);
            // ep
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Europalette", smallGridFirstCol, 7.0 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(13);
            if (this.packagingUntisFromIdToDes.get(orderToPrint.goods![i].packingUnit) === "EP") {
              pdf.text("X", smallGridFirstCol + smallGrid, 7.0 + offset);
            }
            // ewp
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Einweg-\npalette", smallGridFirstCol, 8.2 + offset);
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(13);
            if (this.packagingUntisFromIdToDes.get(orderToPrint.goods![i].packingUnit) === "XP") {
              pdf.text("X", smallGridFirstCol + smallGrid, 8.2 + offset);
            }
            // packstk. x of x
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Packstück\nNr.", smallGridFirstCol, 9.4 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(12);
            pdf.text(`${z.toFixed()} von ${orderToPrint.goods![i].quantity}`, smallGridFirstCol + smallGrid, 9.4 + offset);
            // id
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("TraMat\nTransport-\nID", smallGridFirstCol, 10.6 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(12);
            pdf.text(`${orderToPrint.id}`, smallGridFirstCol + smallGrid, 10.6 + offset);
            // mova logo
            pdf.addImage(logo.image.data, "PNG", secondColSize + 0.67, 1.88 + offset, 5.5, 2.5);
            // medRaster
            pdf.line(secondColSize, 7.7 + offset, secondColSize, 7.7 + offset);
            pdf.line(secondColSize + 2.2, 5 + offset, secondColSize + 2.2, 11.85 + offset);
            // GIS-Coordinates QR Code or delivery yes/no
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("QR Code\nGIS\nMovaMap", secondColSize + 0.2, 5.5 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(12);

            if (orderToPrint.anlage?.standort) {
              const qr = new QRious({
                background: "white",
                backgroundAlpha: 1.0,
                foreground: "black",
                foregroundAlpha: 1.0,
                level: "H",
                size: 500,
                value: orderToPrint.anlage!.standort,
              });
              const dataQR = qr.toDataURL();
              pdf.addImage(dataQR, "JPEG", secondColSize + 2.8, 5.1 + offset, 3.6, 3.6);
            } else {
              console.log("could not generate QR code");
            }
            // only delivery yes/no
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(9);
            pdf.text("Nur\nAnlieferung", secondColSize + 0.2, 9.35 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(9);
            if (orderToPrint.deliveryOnly) {
              pdf.text("Ja", secondColSize + 0.2 + 2.2, 9.35 + offset);
            } else {
              pdf.text("Nein", secondColSize + 0.2 + 2.2, 9.35 + offset);
            }
            // principal
            pdf.setFont("Helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text("Auftrag-\ngeber", secondColSize + 0.2, 10.6 + offset);
            pdf.setFont("Helvetica", "normal");
            pdf.setFontSize(10);
            const principalText = this.breakLines(orderToPrint.principal!.name!, 28);
            let principalTextEmail = "";
            try {
              principalTextEmail = this.breakLines(orderToPrint.principal!.email!, 26)[0];
            } catch {
              principalTextEmail = "null";
            }
            pdf.text(`${principalText[0]
              }\n${orderToPrint.principal?.phone
              }\n${principalTextEmail}`, secondColSize + 0.2 + 2.2, 10.6 + offset);

            offset = 13.00;

            if (posNr % 2 === 0) {
              pdf.addPage("a4", "p");
              offset = 0;
            }
          }
        }
        if (orderToPrint.goods!.length === 1 && orderToPrint.goods![0].quantity! % 2 === 0) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          pdf.deletePage(pdf.internal.getNumberOfPages());
        }
      }

      if (orderToPrint.construction!.length > 0) {
        for (let y = 0; orderToPrint.construction!.length > y; y++) {
          posNr += 1;

          pdf.setLineWidth(0.04);
          pdf.setDrawColor(0, 0, 0);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          pdf.setLineDash([0.0]);
          // lines around label
          pdf.line(borderLeft, 1.5 + offset, (DINA4width - borderLeft), 1.5 + offset);
          pdf.line(borderLeft, 1.5 + offset, borderLeft, 11.85 + offset);
          pdf.line(borderLeft, 11.85 + offset, (DINA4width - borderLeft), 11.85 + offset);
          pdf.line((DINA4width - borderLeft), 1.5 + offset, (DINA4width - borderLeft), 11.85 + offset);
          // raster in label
          pdf.line(firstColSize, 1.5 + offset, firstColSize, 11.85 + offset);
          pdf.line(secondColSize, 1.5 + offset, secondColSize, 11.85 + offset);
          // lieferadresse
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("Lieferadresse", 1.5, 2.2 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);
          const textLieferadresseReciver = this.breakLines(orderToPrint.receiver!.name!, 60);
          pdf.text(`${textLieferadresseReciver[0]
            }\n${orderToPrint.receiver?.street
            }\n${orderToPrint.receiver?.zipcode} ${orderToPrint.receiver?.place}`,
            firstColSize + 0.2, 2.2 + offset);
          // raster lagerplatz
          pdf.line(borderLeft, 3.5 + offset, secondColSize, 3.5 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("Rasterpalnnr.", 1.5, 4.4 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(32);
          if (orderToPrint.rasterLagerplatz) {
            pdf.text(`${orderToPrint.rasterLagerplatz}`, firstColSize + 0.2, 4.65 + offset);
          }
          // anlage id
          pdf.line(borderLeft, 5 + offset, (DINA4width - borderLeft), 5 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("Anlagen ID", 1.5, 5.9 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(22);
          if (orderToPrint.anlage?.anlagenId && orderToPrint.anlage.anlagenname) {
            pdf.text(`${orderToPrint.anlage.anlagenId} ${orderToPrint.anlage.anlagenname}`, firstColSize + 0.2, 6.0 + offset);
          }
          // lieferdatum
          pdf.line(borderLeft, 6.5 + offset, secondColSize, 6.5 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("Lieferdatum\nZeit", 1.5, 7.4 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);
          pdf.text(`${format(orderToPrint.deliveryDate!, "YYYY-MM-DD HH:mm")
            }`, firstColSize + 0.2, 7.55 + offset);
          // pos. x of x
          pdf.line(borderLeft, 8.3 + offset, secondColSize, 8.3 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("Position", 1.5, 9.25 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);
          pdf.text(`${(y + 1).toFixed()} von ${orderToPrint.construction?.length}`, firstColSize + 0.2, 9.25 + offset);
          // gewicht
          pdf.line(borderLeft, 10.1 + offset, DINA4width - borderLeft, 10.1 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("Gewicht", 1.5, 10.6 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);
          pdf.text(`${orderToPrint.construction![y].weight} kg`, firstColSize + 0.2, 10.6 + offset);
          // smaler grid
          pdf.line(firstColSize + smallGrid, 10.1 + offset, firstColSize + smallGrid, 11.85 + offset);
          pdf.line(firstColSize + smallGrid * 2, 10.1 + offset, firstColSize + smallGrid * 2, 11.85 + offset);
          // id
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("TraMat\nTransport-\nID", smallGridFirstCol, 10.6 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);
          pdf.text(`${orderToPrint.id}`, smallGridFirstCol + smallGrid, 10.6 + offset);
          // mova logo
          pdf.addImage(logo.image.data, "PNG", secondColSize + 0.67, 1.88 + offset, 5.5, 2.5);
          // medRaster
          pdf.line(secondColSize, 7.7 + offset, secondColSize, 7.7 + offset);
          pdf.line(secondColSize + 2.2, 5 + offset, secondColSize + 2.2, 11.85 + offset);
          // GIS-Coordinates QR Code or delivery yes/no
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("QR Code\nGIS\nMovaMap", secondColSize + 0.2, 5.5 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);

          if (orderToPrint.anlage?.standort) {
            const qr = new QRious({
              background: "white",
              backgroundAlpha: 1.0,
              foreground: "black",
              foregroundAlpha: 1.0,
              level: "H",
              size: 500,
              value: orderToPrint.anlage!.standort,
            });
            const dataQR = qr.toDataURL();
            pdf.addImage(dataQR, "JPEG", secondColSize + 2.8, 5.1 + offset, 3.6, 3.6);
          } else {
            console.log("could not generate QR code");
          }
          // only delivery yes/no
          pdf.line(secondColSize, 8.9 + offset, DINA4width - borderLeft, 8.9 + offset);
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(9);
          pdf.text("Nur\nAnlieferung", secondColSize + 0.2, 9.35 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(9);
          if (orderToPrint.deliveryOnly) {
            pdf.text("Ja", secondColSize + 0.2 + 2.2, 9.35 + offset);
          } else {
            pdf.text("Nein", secondColSize + 0.2 + 2.2, 9.35 + offset);
          }
          // principal
          pdf.setFont("Helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("Auftrag-\ngeber", secondColSize + 0.2, 10.6 + offset);
          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(10);
          const principalText = this.breakLines(orderToPrint.principal!.name!, 28);
          let principalTextEmail = "";
          try {
            principalTextEmail = this.breakLines(orderToPrint.principal!.email!, 26)[0];
          } catch {
            principalTextEmail = "null";
          }
          pdf.text(`${principalText[0]
            }\n${orderToPrint.principal?.phone
            }\n${principalTextEmail}`, secondColSize + 0.2 + 2.2, 10.6 + offset);

          offset = 13.00;

          if (posNr % 2 === 0) {
            if (orderToPrint.construction!.length > posNr) {
              pdf.addPage("a4", "p");
            }
            offset = 0;
          }
        }
      }

      if (orderToPrint.people!.length > 0) {
        // generate remark if typ people
        pdf.setFontSize(32);
        pdf.setTextColor(255, 0, 0);
        pdf.text("Es gibt kein Label für Personentransporte...", borderLeft + 0.5, 4.5, undefined, -45);
      }
    });
    return pdf;
  }

  public async close(): Promise<void> {
    this.$emit("closePrintMultipleLabels");
  }
}
</script>

<style scoped>
.pdfobject-container {
  height: 33rem;
  border: 0.5rem solid rgba(0, 0, 0, 0.1);
}
</style>
