<template>
  <!-- print multiple transport orders -->
  <v-container>
    <input @keyup.enter="printOrder()">
    <div id="pdf-multiple-orders" />
    <v-alert
      v-if="errorMessage.length > 0"
      type="warning"
    >
      {{ errorMessage }}
    </v-alert>
    <div
      id="divider"
      style="background-color:#000000; height: 1px; width:100%;"
      class="mt-4"
    />
    <!-- actions print-->
    <v-card-actions class="mt-1 mr-n2">
      <v-spacer />
      <v-btn
        color="orange"
        text
        @click="close()"
      >
        Schliessen
      </v-btn>
      <v-btn color="blue darken-2" text @click="sendEmail()">
        Versenden
        <v-icon right dark>
          mdi-email-fast-outline
        </v-icon>
      </v-btn>
      <v-btn
        color="blue darken-2"
        text
        @click="printOrder()"
      >
        PDF
        <v-icon
          right
          dark
        >
          mdi-printer
        </v-icon>
      </v-btn>
    </v-card-actions>
     <!-- Dialog Send Email -->
    <v-dialog v-model="dialogSend" persistent max-width="550px">
      <v-card>
        <v-card-title class="headline">
          Transport-Auftrag versenden
        </v-card-title>
        <v-card-text>
          Gib die Email Adresse des Empfängers ein
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field v-model="sendEmailAdress" label="Empfänger Email Adresse" outlined
                hint="Standard Wert Email Auftraggeber" persistent-hint required />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange darken-1" text @click="dialogSend = false;">
            Abbrechen!
          </v-btn>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="createEmail()">
            Ok, versenden!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Warn Permissions-->
    <DialogPermissions :dialog-warn-permissions="warnPermissions" @closePermissions="closePermissions()" />
  </v-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue, Prop } from "vue-property-decorator";
import { format } from "fecha";
import { jsPDF } from "jspdf";
import PDFObject from "pdfobject";
import DirectusAPI from "@/services/DirectusAPI";
import Order from "@/model/Order";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as logo from "@/assets/Mova22Logo.json";
import { DIRECTUS_ROLES } from "../Const";
import DialogPermissions from "./DialogPermissions.vue";
import SendEmail from "@/services/SendEmail";

@Component({
  components: {
    DialogPermissions,
  },
})
export default class PrintMultipleTransportOrder extends Vue {
  @Prop({
    type: Array, required: true,
  })
  orders!: Order[];

  private firstAndLastName = "";
  private Email = "";
  private fileName = "";
  public errorMessage = "";
  public warnPermissions = false;
  public dialogSend = false;
  public sendEmailAdress = "";
  private arrayOrderId : number[] = [];

  // eslint-disable-next-line new-cap
  private orderPDF = new jsPDF();
  private packagingUntisFromIdToDes = new Map();
  private typePeopleFromIdToDes = new Map();

  async mounted(): Promise<void> {
    window.addEventListener("keyup", this.handleEnter);
    const nameEmail = await DirectusAPI.fetchNameEmail();
    this.Email = nameEmail[2];
    this.firstAndLastName = `${nameEmail[0]} ${nameEmail[1]}`;
    const featchPackaging = await DirectusAPI.fetchPackaging();
    featchPackaging.forEach((value) => {
      this.packagingUntisFromIdToDes.set(value.id, value.abbreviation);
    });

    const typPeopleResp = await DirectusAPI.fetchTrpTypePeople();
    typPeopleResp.forEach((value) => {
      this.typePeopleFromIdToDes.set(value.id, value.description);
    });

    this.orderPDF = this.generatePDF();
    if (this.orderPDF.internal.pages.length < 16) {
      PDFObject.embed(this.orderPDF.output("datauristring"), "#pdf-multiple-orders");
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
      // this.printOrder();
    }
  }

  public closePermissions(): void {
    this.warnPermissions = false;
  }

  public async printOrder(): Promise<void> {
    this.fileName = `Orders_${format(new Date(), "YYYY-MM-DD HH:mm:ss")}.pdf`;
    this.orderPDF.save(this.fileName);
    this.close();
  }

  public sendEmail(): void {
    if (this.$store.state.authorisation === DIRECTUS_ROLES["Transport MA"] || this.$store.state.authorisation === DIRECTUS_ROLES.Administrator) {
      if (this.orders[0].principal!.email) {
        this.sendEmailAdress = this.orders[0].principal!.email;
      }
      this.dialogSend = true;
    } else {
      this.warnPermissions = true;
    }
  }
  
  public createEmail(): void {
    const localFileName = `Orders${this.arrayOrderId}.pdf`;
    const htmlBody = `<html><body>Guten Tag<br><br>Im Anhang finden Sie die Lieferscheine/Transport-Aufträge für Aufträge mit IDs: ${this.arrayOrderId}<br><br>Informationen zur Anlieferung im Pfadibundeslager (mova) sind <a href="https://bula21.sharepoint.com/:b:/s/share-externe/EY0yFKMD0gRHpZGT1faKgn4BEWsckIV5NR73OPsYVwEGvw?e=oMZTTE">hier</a> zu finden.<br>Des informations sur la livraison au camp fédéral scout (mova) sont disponibles <a href="https://bula21.sharepoint.com/:b:/s/share-externe/ESTBds8GVO9Nhwt5oF7RaysBiokVdvdwV_J4127LW7HKcg?e=KsoXL2">ici</a>.<br><br>Freundliche Grüsse<br><br>Verein Bundeslager 2021<br>c/o Pfadibewegung Schweiz<br>Teilbereich Transport<br>Speichergasse 31<br>CH-3011 Bern</body></html>`;
    SendEmail.submitEmail([{
      email: this.sendEmailAdress, name: this.orders[0].principal!.name!,
    }], `Lieferscheine / Transport-Aufträge Order IDs: ${this.arrayOrderId}`,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    htmlBody, localFileName, this.orderPDF.output("datauristring").split(",")[1]);
    this.dialogSend = false;
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
      this.arrayOrderId.push(orderToPrint.id!);
      pdf.addPage("a4", "p");
      const borderLeft = 1.2;
      let pageNr = 1;

      if (orderToPrint.deliveryOnly) {
        // check and mark if only delivery
        pdf.setFontSize(32);
        pdf.setTextColor(255, 0, 0);
        pdf.text("Nur Anlieferung / kein Transport durch BuLa", borderLeft + 0.5, 4.5, undefined, -45);
      }

      pdf.setTextColor(0, 0, 0);

      // document creation DIN A4 21,0 cm x 29,7 cm
      pdf.setFontSize(9);
      pdf.setFont("Helvetica", "normal");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pdf.text(`Seite ${pageNr}`, 19.5, 28.7, undefined, undefined, "right");
      pdf.addImage(logo.image.data, "PNG", 16, 0.7, 3.5, 1.4);
      pdf.setFontSize(11);
      pdf.setFont("Helvetica", "bolditalic");
      pdf.text("Verein Bundeslager 2021", borderLeft, 1.2);
      pdf.text("c/o Pfadibewegung Schweiz", borderLeft, 1.7);
      pdf.setFont("Helvetica", "normal");
      pdf.text("TB Transport", borderLeft, 2.2);
      pdf.text("Speichergasse 31", borderLeft, 2.7);
      pdf.text("CH-3011 Bern", borderLeft, 3.2);
      pdf.setFont("Helvetica", "italic");
      pdf.text(
        `Gedruckt: ${format(new Date(), "DD.MM.YYYY HH:mm:ss")}`,
        19.5,
        2.7,
        null,
        null,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "right",
      );
      pdf.text(
        `Sachbearbeiter/-in: ${this.firstAndLastName}, ${this.Email}`,
        19.5,
        3.2,
        null,
        null,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        "right",
      );
      pdf.setLineWidth(0.02);
      pdf.setDrawColor(0, 0, 0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      pdf.setLineDash([0.05]);
      pdf.line(1, 4, 20, 4);
      pdf.setFontSize(12);
      pdf.setFont("Helvetica", "bold");
      pdf.text(
        `${"L I E F E R S C H E I N / T R A N S P O R T - A U F T R A G"
        + "\t \t ID: "}${orderToPrint.id}`,
        borderLeft,
        4.5,
      );
      pdf.line(1, 4.7, 20, 4.7);
      pdf.setFontSize(11);
      pdf.setFont("Helvetica", "bold");
      pdf.text(`Auftraggeber: \t${orderToPrint.principal?.id}`, borderLeft, 5.5);
      pdf.setFont("Helvetica", "normal");
      pdf.text(
        `${orderToPrint.principal?.name
        }\n${orderToPrint.principal?.street
        }\n${orderToPrint.principal?.zipcode
        } ${orderToPrint.principal?.place
        }\n${orderToPrint.principal?.phone
        }\n${orderToPrint.principal?.email}`,
        1.2,
        6,
      );

      pdf.setFont("Helvetica", "italic");

      try {
        pdf.text(`Anlagen ID Liefern: ${orderToPrint.anlage?.anlagenId} ${orderToPrint.anlage?.anlagenname} `, 10.5, 6);
      } catch {
        console.log("no Anlage ID by print PDF");
      }

      try {
        pdf.text(`Raster Lagerplatz Liefern: ${orderToPrint.rasterLagerplatz}`, 10.5, 6.5);
      } catch {
        console.log("no Raster Lagerplatz by print PDF");
      }
      pdf.setFont("Helvetica", "italic");
      try {
        pdf.text(`Anlagen ID Laden: ${orderToPrint.anlagePickUp?.anlagenId} ${orderToPrint.anlagePickUp?.anlagenname} `, 10.5, 7.2);
      } catch {
        console.log("no Anlage ID PickUp by print PDF");
      }
      try {
        pdf.text(`Raster Lagerplatz Laden: ${orderToPrint.rasterLagerplatzPickUp}`, 10.5, 7.7);
      } catch {
        console.log("no Raster Lagerplatz PickUp by print PDF");
      }

      pdf.setFont("Helvetica", "normal");
      pdf.setFont("Helvetica", "bold");
      pdf.text(`Ladeadresse: \t${orderToPrint.shipper?.id}`, borderLeft, 8.5);
      pdf.setFont("Helvetica", "normal");
      pdf.text(
        `${orderToPrint.shipper?.name
        }\n${orderToPrint.shipper?.street
        }\n${orderToPrint.shipper?.zipcode
        } ${orderToPrint.shipper?.place
        }\n${orderToPrint.shipper?.phone
        }\n${orderToPrint.shipper?.email}`,
        1.2,
        9,
      );

      pdf.setFont("Helvetica", "bold");
      pdf.text(`Lieferadresse: \t${orderToPrint.receiver?.id}`, 10.5, 8.5);
      pdf.setFont("Helvetica", "normal");
      pdf.text(
        `${orderToPrint.receiver?.name
        }\n${orderToPrint.receiver?.street
        }\n${orderToPrint.receiver?.zipcode
        } ${orderToPrint.receiver?.place
        }\n${orderToPrint.receiver?.phone
        }\n${orderToPrint.receiver?.email}`,
        10.5,
        9,
      );

      pdf.line(1, 11.5, 20, 11.5);
      pdf.setFont("Helvetica", "normal");
      if (orderToPrint.people!.length > 0) {
        pdf.text("Sendungsart: \t    Personentransport", borderLeft, 12.2);
      }
      if (orderToPrint.goods!.length > 0) {
        pdf.text("Sendungsart: \t    Warentransport", borderLeft, 12.2);
      }
      if (orderToPrint.construction!.length > 0) {
        pdf.text("Sendungsart: \t    Spezialleistung mit Fahrzeug", borderLeft, 12.2);
      }
      pdf.text(
        `Abholbereit ab: \t ${format(orderToPrint.pickUpDate!, "DD.MM.YYYY HH:mm")}`,
        borderLeft,
        12.7,
      );
      pdf.text(
        `Zustellung bis: \t  ${format(orderToPrint.deliveryDate!, "DD.MM.YYYY HH:mm")}`,
        borderLeft,
        13.2,
      );
      pdf.text(`Tour:         \t \t${orderToPrint.tour}`, borderLeft, 13.7);
      pdf.line(1, 14.2, 20, 14.2);
      pdf.setFont("Helvetica", "bold");
      // people order
      if (orderToPrint.people!.length > 0) {
        pdf.text("Anz. Personen", borderLeft, 14.9);
        pdf.text("Typ Pers.", borderLeft + 3.5, 14.9);
        pdf.text("Anz. Gepäckstk.", borderLeft + 6.5, 14.9);
        pdf.text("Beschr. Gepäckstk.", borderLeft + 10.3, 14.9);
        pdf.text("Gewicht (kg)", borderLeft + 16, 14.9);
        pdf.setFont("Helvetica", "normal");
        let currPos = 15.4;
        for (let i = 0; orderToPrint.people!.length > i; i++) {
          if (currPos > 29.7 - 5) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          pdf.text(
            `${orderToPrint.people![i].quantityOfPeople}`,
            borderLeft,
            currPos,
          );
          const typePeople = this.breakLines(
            this.typePeopleFromIdToDes.get(orderToPrint.people![i].typePeople),
            12,
          );
          pdf.text(
            typePeople[0],
            borderLeft + 3.5,
            currPos,
          );
          pdf.text(
            `${orderToPrint.people![i].quantityOfLuggage}`,
            borderLeft + 6.5,
            currPos,
          );
          const descBag = this.breakLines(
            orderToPrint.people![i].descriptionOfLuagge!,
            22,
          );
          pdf.text(descBag[0], borderLeft + 10.3, currPos);
          pdf.text(`${orderToPrint.people![i].weight}`, borderLeft + 16, currPos);

          if (descBag[1] > 0) {
            currPos += 0.5 * descBag[1];
          }

          if (typePeople[1] > 0) {
            currPos += 0.5 * typePeople[1];
          }

          currPos += 0.5;

          if (currPos > 29.7 - 3) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          pdf.setFont("Helvetica", "italic");
          pdf.setFontSize(10);
          pdf.text(
            `Dims Gepäck (LxBxH) cm: ${orderToPrint.people![i].length
            }x${orderToPrint.people![i].width
            }x${orderToPrint.people![i].height}`,
            borderLeft,
            currPos,
          );

          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);

          if (currPos > 29.7 - 10) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          if (i === orderToPrint.people!.length - 1) {
            const posiPeople = i * 0.5 + currPos + 0.5;
            pdf.line(1, posiPeople, 20, posiPeople);
            pdf.setFont("Helvetica", "bold");
            pdf.text("Summe:", borderLeft, posiPeople + 0.5);
            pdf.setFont("Helvetica", "normal");
            pdf.text(
              `Pers.: ${orderToPrint.calcQuantity()}`,
              borderLeft + 3.5,
              posiPeople + 0.5,
            );
            pdf.text(
              `Gepäckstk.: ${orderToPrint.calcLuaggage()}`,
              borderLeft + 6.5,
              posiPeople + 0.5,
            );
            pdf.text(
              `${orderToPrint.calcCBM()} m^3`,
              borderLeft + 10.3,
              posiPeople + 0.5,
            );
            pdf.text(
              `${orderToPrint.calcWeight()} kg`,
              borderLeft + 16,
              posiPeople + 0.5,
            );
            pdf.line(1, posiPeople + 0.7, 20, posiPeople + 0.7);
            pdf.line(1, posiPeople + 0.8, 20, posiPeople + 0.8);
            const bemerkung = this.breakLines(orderToPrint.remarks!, 46);
            pdf.text(`Bemerkung: ${bemerkung[0]}`, borderLeft, posiPeople + 1.6);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.0]);
            pdf.line(borderLeft, posiPeople + 6.5, 8, posiPeople + 6.5);
            pdf.setFont("Helvetica", "italic");
            pdf.setFontSize(10);
            pdf.text(
              "Datum, (Stempel), Unterschirft",
              borderLeft,
              posiPeople + 7,
            );
          }
          currPos += 0.8;
        }
      }
      // goods order
      if (orderToPrint.goods!.length > 0) {
        pdf.text("Markierung", borderLeft, 14.9);
        pdf.text("Anzahl", borderLeft + 4, 14.9);
        pdf.text("VerpkEin", borderLeft + 5.5, 14.9);
        pdf.text("Warenbeschreibung Inhalt", borderLeft + 8.5, 14.9);
        pdf.text("Brutto Gewicht (kg)", borderLeft + 15, 14.9);
        pdf.setFont("Helvetica", "normal");
        let currPos = 15.4;
        for (let i = 0; orderToPrint.goods!.length > i; i++) {
          if (currPos > 29.7 - 5) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          const arrayMark = this.breakLines(orderToPrint.goods![i].marking!, 14);
          pdf.text(arrayMark[0], borderLeft, currPos);
          pdf.text(`${orderToPrint.goods![i].quantity!}`, borderLeft + 4, currPos);
          pdf.text(
            `${this.packagingUntisFromIdToDes.get(
              orderToPrint.goods![i].packingUnit!,
            )}`,
            borderLeft + 5.5,
            currPos,
          );
          const arrayDesc = this.breakLines(
            orderToPrint.goods![i].goodsDescription!,
            26,
          );
          pdf.text(arrayDesc[0], borderLeft + 8.5, currPos);
          pdf.text(
            `${orderToPrint.goods![i].grossWeight!}`,
            borderLeft + 15,
            currPos,
          );

          if (arrayMark[1] > arrayDesc[1] && arrayMark[1] > 0) {
            currPos += 0.5 * arrayMark[1];
          }
          if (arrayDesc[1] > arrayMark[1] && arrayDesc[1] > 0) {
            currPos += 0.5 * arrayDesc[1];
          }

          currPos += 0.5;

          if (currPos > 29.7 - 3) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          pdf.setFont("Helvetica", "italic");
          pdf.setFontSize(8);
          pdf.text(
            `Gefahrgut: ${orderToPrint.goods![i].dangerousGoods
            }, Stapelbar: ${orderToPrint.goods![i].stapelbar}, (LxBxH) cm: ${orderToPrint.goods![i].length
            }x${orderToPrint.goods![i].width
            }x${orderToPrint.goods![i].height
            }, Warenwert (CHF): ${orderToPrint.goods![i].valueChf
            }, Netto Geweicht (kg): ${orderToPrint.goods![i].netWeight}, Kommission: ${orderToPrint.goods![i].kommissionieren}`,
            borderLeft,
            currPos,
          );

          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);

          if (currPos > 29.7 - 9) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          if (i === orderToPrint.goods!.length - 1) {
            const positGoods = i * 0.5 + currPos + 0.5;
            pdf.line(1, positGoods, 20, positGoods);
            pdf.setFont("Helvetica", "bold");
            pdf.text("Summe:", borderLeft, positGoods + 0.5);
            pdf.setFont("Helvetica", "normal");
            pdf.text(
              `${orderToPrint.calcQuantity()} Stk.`,
              borderLeft + 4,
              positGoods + 0.5,
            );
            pdf.text(
              `${orderToPrint.calcCBM()} m^3`,
              borderLeft + 8.5,
              positGoods + 0.5,
            );
            pdf.text(
              `${orderToPrint.calcWeight()} kg`,
              borderLeft + 15,
              positGoods + 0.5,
            );
            pdf.line(1, positGoods + 0.7, 20, positGoods + 0.7);
            pdf.line(1, positGoods + 0.8, 20, positGoods + 0.8);
            const bemerkung = this.breakLines(orderToPrint.remarks!, 46);
            pdf.text(`Bemerkung: ${bemerkung[0]}`, borderLeft, positGoods + 1.6);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.0]);
            pdf.line(borderLeft, positGoods + 6.5, 8, positGoods + 6.5);
            pdf.setFont("Helvetica", "italic");
            pdf.setFontSize(10);
            pdf.text(
              "Datum, (Stempel), Unterschirft \n \nWir übergeben Ihnen obige Sendung vollständig und in äusserlich gutem Zustand. Allfällige Reklamationen \noder Schadensmeldungen sind sofort mitzuteilen und innert 24 Studen schriftlich zu bestätigen.",
              borderLeft,
              positGoods + 7,
            );
          }
          currPos += 0.8;
        }
      }
      // constr. order
      if (orderToPrint.construction!.length > 0) {
        pdf.text("Quantität Leistung", borderLeft, 14.9);
        pdf.text("Beschreibung", borderLeft + 4, 14.9);
        pdf.text("Gewicht (kg)", borderLeft + 15, 14.9);
        pdf.setFont("Helvetica", "normal");
        let currPos = 15.4;
        for (let i = 0; orderToPrint.construction!.length > i; i++) {
          if (currPos > 29.7 - 5) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          pdf.text(
            `${orderToPrint.construction![i].quantity!}`,
            borderLeft,
            currPos,
          );
          const arrayDes = this.breakLines(
            orderToPrint.construction![i].description!,
            27,
          );
          pdf.text(arrayDes[0], borderLeft + 4, currPos);
          pdf.text(
            `${orderToPrint.construction![i].weight}`,
            borderLeft + 15,
            currPos,
          );

          if (arrayDes[1] > 0) {
            currPos += 0.5 * arrayDes[1];
          }

          currPos += 0.5;

          pdf.setFont("Helvetica", "normal");
          pdf.setFontSize(12);

          if (currPos > 29.7 - 9) {
            pdf.addPage("a4", "p");
            currPos = 2;
            pageNr += 1;
            pdf.setFontSize(9);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.text(`Seite ${pageNr}`, 19.5, 28.7, null, null, "right");
            pdf.setFontSize(11);
            pdf.setLineWidth(0.02);
            pdf.setDrawColor(0, 0, 0);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.05]);
          }

          if (i === orderToPrint.construction!.length - 1) {
            const positCons = i * 0.5 + currPos + 0.5;
            pdf.line(1, positCons, 20, positCons);
            pdf.setFont("Helvetica", "bold");
            pdf.text("Summe:", borderLeft, positCons + 0.5);
            pdf.setFont("Helvetica", "normal");
            pdf.text(
              `Quantität Leistungen: ${orderToPrint.calcQuantity()}`,
              borderLeft + 4,
              positCons + 0.5,
            );
            pdf.text(
              `${orderToPrint.calcWeight()} kg`,
              borderLeft + 15,
              positCons + 0.5,
            );
            pdf.line(1, positCons + 0.7, 20, positCons + 0.7);
            pdf.line(1, positCons + 0.8, 20, positCons + 0.8);
            const bemerkung = this.breakLines(orderToPrint.remarks!, 46);
            pdf.text(`Bemerkung: ${bemerkung[0]}`, borderLeft, positCons + 1.6);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pdf.setLineDash([0.0]);
            pdf.line(borderLeft, positCons + 6.5, 8, positCons + 6.5);
            pdf.setFont("Helvetica", "italic");
            pdf.setFontSize(10);
            pdf.text("Datum, (Stempel), Unterschirft", borderLeft, positCons + 7);
          }
          currPos += 0.8;
        }
      }
    });
    return pdf;
  }


  public async close(): Promise<void> {
    this.$emit("closePrintMultiple");
  }
}
</script>

<style scoped>
.pdfobject-container {
  height: 33rem;
  border: 0.5rem solid rgba(0, 0, 0, 0.1);
}
</style>
