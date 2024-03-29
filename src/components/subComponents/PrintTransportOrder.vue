<template>
  <!-- print transport order -->
  <v-container>
    <input @keyup.enter="printOrder()">
    <div id="objectPDF" />
    <div id="divider" style="background-color:#000000; height: 1px; width:100%;" class="mt-4" />
    <!-- actions print-->
    <v-card-actions class="mt-1 mr-n2">
      <v-spacer />
      <v-btn color="orange" text @click="close()">
        Schliessen
      </v-btn>
      <v-btn color="blue darken-2" text @click="sendEmail()">
        Versenden
        <v-icon right dark>
          mdi-email-fast-outline
        </v-icon>
      </v-btn>
      <v-btn color="blue darken-2" text @click="printOrder()">
        PDF
        <v-icon right dark>
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
export default class PrintTransportOrder extends Vue {
  @Prop({
    type: Order, required: true,
  })
  order!: Order;

  private firstAndLastName = "";
  private Email = "";
  private fileName = "";
  public dialogSend = false;
  public warnPermissions = false;
  public sendEmailAdress = "";

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

    this.orderPDF = await this.generatePDF();
    PDFObject.embed(this.orderPDF.output("datauristring"), "#objectPDF");
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
    this.fileName = `Order${this.order.id}.pdf`;
    this.orderPDF.save(this.fileName);
    this.close();
  }

  public sendEmail(): void {
    if (this.$store.state.authorisation === DIRECTUS_ROLES["Transport MA"] || this.$store.state.authorisation === DIRECTUS_ROLES.Administrator) {
      if (this.order.principal!.email) {
        this.sendEmailAdress = this.order.principal!.email;
      }
      this.dialogSend = true;
    } else {
      this.warnPermissions = true;
    }
  }

  public createEmail(): void {
    const localFileName = `Order${this.order.id}.pdf`;
    // eslint-disable-next-line prefer-template
    const htmlBody = "<html><body>Guten Tag<br><br>"
      + "Du hast die Transporte mit den IDs: " + this.order.id + " bei der Transportcrew vom mova bestellt. Diese wurden nun von uns disponiert und ein Datum fixiert. Jetzt kann der Transport bald erfolgen, es fehlen nur noch folgende letzte Schritte:<br><br>"
      + "<ol><li><strong>Lieferscheine überprüfen</strong><br>Sieh dir die Lieferscheine an und kontrolliere, ob alles stimmt z.B. wichtig Datum, Transportgut, Abhol- und Anlieferort. Sollte etwas nicht stimmen, melde dich umgehend auf 20_log_21_trp_tramat_request, dort wird dir geholfen, dein Transport korrekt zu erfassen.</li>"
      + "<li><strong>Dokumente ausdrucken und mitgeben</strong><br>Drucke die Lieferscheine im Anhang aus und gebe sie dem Transport mit. Diese werden Beim Check-In auf dem Lagerplatz benötigt, um das Material an die richtige Stelle zu leiten. Zudem gibt es <a href='https://bula21.sharepoint.com/:b:/s/share-externe/EcPzBOxnshdEmI0mNhfBL5ABZhilQiobOEUpmY0Aay4SZQ?e=ydi1a4'>hier</a> noch eine allgemeine Information für alle Anlieferungen im Pfadibundeslager (mova). Diese Dokumente sind zwingend für jede Anlieferung mitzubringen.</li></ol>"
      + "Bei Fragen, darfst du dich jederzeit im Slakchannel: 20_log_21_trp_tramat_request melden. Wir helfen dir sehr gerne weiter."
      + "<br><br>Vielen Dank und beste Grüsse"
      + "<br>TBL Materialtransport<br><br>"
      + "<hr>"
      + "<br>Bonne journée<br><br>"
      + "Tu as commandé des transports chez nous avec l'ID: " + this.order.id + " Nous les avons maintenant planifiés et fixés à une date. Maintenant, le transport peut bientôt avoir lieu, il ne manque plus que les dernières étapes:<br><br>"
      + "<ol><li><strong>contrôler les bons de livraison</strong><br>Regarde les bons de livraison et vérifie que tout est correct. (important la date, marchandise transportée, lieu d'enlèvement et de livraison) Si quelque chose ne correspond pas, tu dois te rendre immédiatement sur 20_log_21_trp_tramat_request, où l'on t'aidera à enregistrer correctement ton transport.</li>"
      + "<li><strong>imprimer les documents et les remettre</strong><br>Imprime les bons de livraison en annexe et remets-les au transport. Ceux-ci sont nécessaires lors de l'enregistrement sur l'aire de stockage pour pouvoir attribuer le matériel. De plus, tu trouveras <a href='https://bula21.sharepoint.com/:b:/s/share-externe/EWUjVQqJuCZIuDa7drYi-yEBkLHXz-e275D-stWl_NufAw?e=aYyBJk'>ici</a> une information générale pour toutes les livraisons dans le camp fédéral scout (mova). Ces documents doivent impérativement être apportés pour chaque livraison.</li></ol>"
      + "Si tu as des questions, tu peux toujours t'annoncer dans le Slakchannel : 20_log_21_trp_tramat_request nous t'aiderons très volontiers."
      + "<br><br>Merci beaucoup et meilleures salutations"
      + "<br>Responsable de sous-secteur Materialtransport, Logistique<br>";
    SendEmail.submitEmail(this.sendEmailAdress, `Lieferschein / Transport-Auftrag Order ID: ${this.order.id}`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      htmlBody, localFileName, this.orderPDF.output("blob"));
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

  private async generatePDF(): Promise<jsPDF> {
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF("p", "cm", "a4");

    const borderLeft = 1.2;
    let pageNr = 1;

    if (this.order.deliveryOnly) {
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
      + "\t \t ID: "}${this.order.id}`,
      borderLeft,
      4.5,
    );
    pdf.line(1, 4.7, 20, 4.7);
    pdf.setFontSize(11);
    pdf.setFont("Helvetica", "bold");
    pdf.text(`Auftraggeber: \t${this.order.principal?.id}`, borderLeft, 5.5);
    pdf.setFont("Helvetica", "normal");
    pdf.text(
      `${this.order.principal?.name
      }\n${this.order.principal?.street
      }\n${this.order.principal?.zipcode
      } ${this.order.principal?.place
      }\n${this.order.principal?.phone
      }\n${this.order.principal?.email}`,
      1.2,
      6,
    );

    pdf.setFont("Helvetica", "italic");

    try {
      pdf.text(`Anlagen ID Liefern: ${this.order.anlage?.anlagenId} ${this.order.anlage?.anlagenname} `, 10.5, 6);
    } catch {
      console.log("no Anlage ID by print PDF");
    }

    try {
      pdf.text(`Raster Lagerplatz Liefern: ${this.order.rasterLagerplatz}`, 10.5, 6.5);
    } catch {
      console.log("no Raster Lagerplatz by print PDF");
    }
    pdf.setFont("Helvetica", "italic");
    try {
      pdf.text(`Anlagen ID Laden: ${this.order.anlagePickUp?.anlagenId} ${this.order.anlagePickUp?.anlagenname} `, 10.5, 7.2);
    } catch {
      console.log("no Anlage ID PickUp by print PDF");
    }
    try {
      pdf.text(`Raster Lagerplatz Laden: ${this.order.rasterLagerplatzPickUp}`, 10.5, 7.7);
    } catch {
      console.log("no Raster Lagerplatz PickUp by print PDF");
    }

    pdf.setFont("Helvetica", "normal");
    pdf.setFont("Helvetica", "bold");
    pdf.text(`Ladeadresse: \t${this.order.shipper?.id}`, borderLeft, 8.5);
    pdf.setFont("Helvetica", "normal");
    pdf.text(
      `${this.order.shipper?.name
      }\n${this.order.shipper?.street
      }\n${this.order.shipper?.zipcode
      } ${this.order.shipper?.place
      }\n${this.order.shipper?.phone
      }\n${this.order.shipper?.email}`,
      1.2,
      9,
    );

    pdf.setFont("Helvetica", "bold");
    pdf.text(`Lieferadresse: \t${this.order.receiver?.id}`, 10.5, 8.5);
    pdf.setFont("Helvetica", "normal");
    pdf.text(
      `${this.order.receiver?.name
      }\n${this.order.receiver?.street
      }\n${this.order.receiver?.zipcode
      } ${this.order.receiver?.place
      }\n${this.order.receiver?.phone
      }\n${this.order.receiver?.email}`,
      10.5,
      9,
    );

    pdf.line(1, 11.5, 20, 11.5);
    pdf.setFont("Helvetica", "normal");
    if (this.order.people!.length > 0) {
      pdf.text("Sendungsart: \t    Personentransport", borderLeft, 12.2);
    }
    if (this.order.goods!.length > 0) {
      pdf.text("Sendungsart: \t    Warentransport", borderLeft, 12.2);
    }
    if (this.order.construction!.length > 0) {
      pdf.text("Sendungsart: \t    Spezialleistung mit Fahrzeug", borderLeft, 12.2);
    }
    pdf.text(
      `Abholbereit ab: \t ${format(this.order.pickUpDate!, "DD.MM.YYYY HH:mm")}`,
      borderLeft,
      12.7,
    );
    pdf.text(
      `Zustellung bis: \t  ${format(this.order.deliveryDate!, "DD.MM.YYYY HH:mm")}`,
      borderLeft,
      13.2,
    );
    pdf.text(`Tour:         \t \t${this.order.tour}`, borderLeft, 13.7);
    pdf.line(1, 14.2, 20, 14.2);
    pdf.setFont("Helvetica", "bold");
    // people order
    if (this.order.people!.length > 0) {
      pdf.text("Anz. Personen", borderLeft, 14.9);
      pdf.text("Typ Pers.", borderLeft + 3.5, 14.9);
      pdf.text("Anz. Gepäckstk.", borderLeft + 6.5, 14.9);
      pdf.text("Beschr. Gepäckstk.", borderLeft + 10.3, 14.9);
      pdf.text("Gewicht (kg)", borderLeft + 16, 14.9);
      pdf.setFont("Helvetica", "normal");
      let currPos = 15.4;
      for (let i = 0; this.order.people!.length > i; i++) {
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
          `${this.order.people![i].quantityOfPeople}`,
          borderLeft,
          currPos,
        );
        const typePeople = this.breakLines(
          this.typePeopleFromIdToDes.get(this.order.people![i].typePeople),
          12,
        );
        pdf.text(
          typePeople[0],
          borderLeft + 3.5,
          currPos,
        );
        pdf.text(
          `${this.order.people![i].quantityOfLuggage}`,
          borderLeft + 6.5,
          currPos,
        );
        const descBag = this.breakLines(
          this.order.people![i].descriptionOfLuagge!,
          22,
        );
        pdf.text(descBag[0], borderLeft + 10.3, currPos);
        pdf.text(`${this.order.people![i].weight}`, borderLeft + 16, currPos);

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
          `Dims Gepäck (LxBxH) cm: ${this.order.people![i].length
          }x${this.order.people![i].width
          }x${this.order.people![i].height}`,
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

        if (i === this.order.people!.length - 1) {
          const posiPeople = i * 0.5 + currPos + 0.5;
          pdf.line(1, posiPeople, 20, posiPeople);
          pdf.setFont("Helvetica", "bold");
          pdf.text("Summe:", borderLeft, posiPeople + 0.5);
          pdf.setFont("Helvetica", "normal");
          pdf.text(
            `Pers.: ${this.order.calcQuantity()}`,
            borderLeft + 3.5,
            posiPeople + 0.5,
          );
          pdf.text(
            `Gepäckstk.: ${this.order.calcLuaggage()}`,
            borderLeft + 6.5,
            posiPeople + 0.5,
          );
          pdf.text(
            `${this.order.calcCBM()} m^3`,
            borderLeft + 10.3,
            posiPeople + 0.5,
          );
          pdf.text(
            `${this.order.calcWeight()} kg`,
            borderLeft + 16,
            posiPeople + 0.5,
          );
          pdf.line(1, posiPeople + 0.7, 20, posiPeople + 0.7);
          pdf.line(1, posiPeople + 0.8, 20, posiPeople + 0.8);
          const bemerkung = this.breakLines(this.order.remarks!, 46);
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
    if (this.order.goods!.length > 0) {
      pdf.text("Markierung", borderLeft, 14.9);
      pdf.text("Anzahl", borderLeft + 4, 14.9);
      pdf.text("VerpkEin", borderLeft + 5.5, 14.9);
      pdf.text("Warenbeschreibung Inhalt", borderLeft + 8.5, 14.9);
      pdf.text("Brutto Gewicht (kg)", borderLeft + 15, 14.9);
      pdf.setFont("Helvetica", "normal");
      let currPos = 15.4;
      for (let i = 0; this.order.goods!.length > i; i++) {
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

        const arrayMark = this.breakLines(this.order.goods![i].marking!, 14);
        pdf.text(arrayMark[0], borderLeft, currPos);
        pdf.text(`${this.order.goods![i].quantity!}`, borderLeft + 4, currPos);
        pdf.text(
          `${this.packagingUntisFromIdToDes.get(
            this.order.goods![i].packingUnit!,
          )}`,
          borderLeft + 5.5,
          currPos,
        );
        const arrayDesc = this.breakLines(
          this.order.goods![i].goodsDescription!,
          26,
        );
        pdf.text(arrayDesc[0], borderLeft + 8.5, currPos);
        pdf.text(
          `${this.order.goods![i].grossWeight!}`,
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
          `Gefahrgut: ${this.order.goods![i].dangerousGoods
          }, Stapelbar: ${this.order.goods![i].stapelbar}, (LxBxH) cm: ${this.order.goods![i].length
          }x${this.order.goods![i].width
          }x${this.order.goods![i].height
          }, Warenwert (CHF): ${this.order.goods![i].valueChf
          }, Netto Geweicht (kg): ${this.order.goods![i].netWeight}, Kommission: ${this.order.goods![i].kommissionieren}`,
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

        if (i === this.order.goods!.length - 1) {
          const positGoods = i * 0.5 + currPos + 0.5;
          pdf.line(1, positGoods, 20, positGoods);
          pdf.setFont("Helvetica", "bold");
          pdf.text("Summe:", borderLeft, positGoods + 0.5);
          pdf.setFont("Helvetica", "normal");
          pdf.text(
            `${this.order.calcQuantity()} Stk.`,
            borderLeft + 4,
            positGoods + 0.5,
          );
          pdf.text(
            `${this.order.calcCBM()} m^3`,
            borderLeft + 8.5,
            positGoods + 0.5,
          );
          pdf.text(
            `${this.order.calcWeight()} kg`,
            borderLeft + 15,
            positGoods + 0.5,
          );
          pdf.line(1, positGoods + 0.7, 20, positGoods + 0.7);
          pdf.line(1, positGoods + 0.8, 20, positGoods + 0.8);
          const bemerkung = this.breakLines(this.order.remarks!, 46);
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
    if (this.order.construction!.length > 0) {
      pdf.text("Quantität Leistung", borderLeft, 14.9);
      pdf.text("Beschreibung", borderLeft + 4, 14.9);
      pdf.text("Gewicht (kg)", borderLeft + 15, 14.9);
      pdf.setFont("Helvetica", "normal");
      let currPos = 15.4;
      for (let i = 0; this.order.construction!.length > i; i++) {
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
          `${this.order.construction![i].quantity!}`,
          borderLeft,
          currPos,
        );
        const arrayDes = this.breakLines(
          this.order.construction![i].description!,
          27,
        );
        pdf.text(arrayDes[0], borderLeft + 4, currPos);
        pdf.text(
          `${this.order.construction![i].weight}`,
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

        if (i === this.order.construction!.length - 1) {
          const positCons = i * 0.5 + currPos + 0.5;
          pdf.line(1, positCons, 20, positCons);
          pdf.setFont("Helvetica", "bold");
          pdf.text("Summe:", borderLeft, positCons + 0.5);
          pdf.setFont("Helvetica", "normal");
          pdf.text(
            `Quantität Leistungen: ${this.order.calcQuantity()}`,
            borderLeft + 4,
            positCons + 0.5,
          );
          pdf.text(
            `${this.order.calcWeight()} kg`,
            borderLeft + 15,
            positCons + 0.5,
          );
          pdf.line(1, positCons + 0.7, 20, positCons + 0.7);
          pdf.line(1, positCons + 0.8, 20, positCons + 0.8);
          const bemerkung = this.breakLines(this.order.remarks!, 46);
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
    return pdf;
  }

  public async close(): Promise<void> {
    this.$emit("closePrint");
  }
}
</script>

<style scoped>
.pdfobject-container {
  height: 33rem;
  border: 0.5rem solid rgba(0, 0, 0, 0.1);
}
</style>
