<template>
  <!-- print transport order -->
  <v-container>
    <input @keyup.enter="printOrder()">
    <div id="objectPDF" />
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
  </v-container>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue, Prop } from "vue-property-decorator";
import Order from "@/model/Order";
import DirectusAPI from "@/services/DirectusAPI";
import { format } from "fecha";
import { jsPDF } from "jspdf";
import PDFObject from "pdfobject";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as logo from "@/assets/Mova22Logo.json";

@Component({
  components: {},
})
export default class PrintTransportOrder extends Vue {
  /* eslint-disable @typescript-eslint/ban-ts-comment */

  @Prop({ type: Order, required: true })
  order!: Order;

  // @ts-ignore
  private firstAndLastName = "";
  // @ts-ignore
  private Email = "";
  // @ts-ignore
  private fileName = "";
  // @ts-ignore
  private orderPDF = new jsPDF();
  private packagingUntisFromIdToDes = new Map();

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    window.addEventListener("keyup", this.handleEnter);
    const nameEmail = await this.fetchNameEmail();
    this.Email = nameEmail[2];
    this.firstAndLastName = nameEmail[0] + " " + nameEmail[1];
    const featchPackaging = await DirectusAPI.directusAPI.getItems(
      "trp_packing_unit"
    );
    featchPackaging.data.forEach((value) => {
      //@ts-ignore
      this.packagingUntisFromIdToDes.set(value.id, value.abbreviation);
    });
    this.orderPDF = await this.generatePDF();
    PDFObject.embed(this.orderPDF.output("datauristring"), "#objectPDF");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  destroyed() {
    window.removeEventListener("keyup", this.handleEnter);
  }

  private handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.printOrder();
    }
  }

  private async fetchNameEmail() {
    const user = await DirectusAPI.directusAPI.getMe();
    return [user.data.first_name, user.data.last_name, user.data.email];
  }

  private async printOrder(): Promise<void> {
    this.fileName = this.order.id + ".pdf";
  }

  private breakLines(text: string, spaceLine: number): [string, number] {
    let newText = text;
    let lineBreaks = 0;
    if (text.length > spaceLine) {
      newText = "";
      lineBreaks = Math.ceil(text.length / spaceLine);
      newText = text.substring(0, spaceLine);
      for (let i = 1; lineBreaks > i; i++) {
        newText =
          newText +
          "\n" +
          text.substring(spaceLine * i, i * spaceLine + spaceLine);
      }
    }
    lineBreaks = lineBreaks - 1;
    return [newText, lineBreaks];
  }

  private async generatePDF(): Promise<jsPDF> {
    let pdf = new jsPDF("p", "cm", "a4");

    const borderLeft = 1.2;
    let pageNr = 1;

    //document creation DIN A4 21,0 cm x 29,7 cm
    pdf.setFontSize(9);
    pdf.setFont("Helvetica", "normal");
    //@ts-ignore
    pdf.text("Seite " + pageNr, 19.5, 28.7, null, null, "right");
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
      "Gerduckt: " + format(new Date(), "DD.MM.YYYY HH:mm:ss"),
      19.5,
      2.7,
      null,
      null,
      //@ts-ignore
      "right"
    );
    pdf.text(
      "Sachbearbeiter/-in: " + this.firstAndLastName + ", " + this.Email,
      19.5,
      3.2,
      null,
      null,
      //@ts-ignore
      "right"
    );
    pdf.setLineWidth(0.02);
    pdf.setDrawColor(0, 0, 0);
    //@ts-ignore
    pdf.setLineDash([0.05]);
    pdf.line(1, 4, 20, 4);
    pdf.setFontSize(12);
    pdf.setFont("Helvetica", "bold");
    pdf.text(
      "L I E F E R S C H E I N / T R A N S P O R T - A U F T R A G" +
        "\t \t ID: " +
        this.order.id,
      borderLeft,
      4.5
    );
    pdf.line(1, 4.7, 20, 4.7);
    pdf.setFontSize(11);
    pdf.setFont("Helvetica", "bold");
    pdf.text("Auftraggeber: \t" + this.order.principal?.id, borderLeft, 5.5);
    pdf.setFont("Helvetica", "normal");
    pdf.text(
      this.order.principal?.name +
        "\n" +
        this.order.principal?.street +
        "\n" +
        this.order.principal?.zipcode +
        " " +
        this.order.principal?.place +
        "\n" +
        this.order.principal?.phone +
        "\n" +
        this.order.principal?.email,
      1.2,
      6
    );
    pdf.setFont("Helvetica", "bold");
    pdf.text("Ladeadresse: \t" + this.order.shipper?.id, borderLeft, 8.5);
    pdf.setFont("Helvetica", "normal");
    pdf.text(
      this.order.shipper?.name +
        "\n" +
        this.order.shipper?.street +
        "\n" +
        this.order.shipper?.zipcode +
        " " +
        this.order.shipper?.place +
        "\n" +
        this.order.shipper?.phone +
        "\n" +
        this.order.shipper?.email,
      1.2,
      9
    );

    pdf.setFont("Helvetica", "bold");
    pdf.text("Lieferadresse: \t" + this.order.receiver?.id, 10.5, 8.5);
    pdf.setFont("Helvetica", "normal");
    pdf.text(
      this.order.receiver?.name +
        "\n" +
        this.order.receiver?.street +
        "\n" +
        this.order.receiver?.zipcode +
        " " +
        this.order.receiver?.place +
        "\n" +
        this.order.receiver?.phone +
        "\n" +
        this.order.receiver?.email,
      10.5,
      9
    );
    pdf.line(1, 11.5, 20, 11.5);
    pdf.setFont("Helvetica", "normal");
    if (this.order.people.length > 0) {
      pdf.text("Sendungsart: \t    Personentransport", borderLeft, 12.2);
    }
    if (this.order.goods.length > 0) {
      pdf.text("Sendungsart: \t    Warentransport", borderLeft, 12.2);
    }
    if (this.order.construction.length > 0) {
      pdf.text("Sendungsart: \t    Bauleistung mit Fahrzeug", borderLeft, 12.2);
    }
    pdf.text(
      "Abholbereit ab: \t " +
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        format(this.order.pick_up_date!, "DD.MM.YYYY HH:mm"),
      borderLeft,
      12.7
    );
    pdf.text(
      "Zustellung bis: \t  " +
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        format(this.order.delivery_date!, "DD.MM.YYYY HH:mm"),
      borderLeft,
      13.2
    );
    pdf.text("Tour:         \t \t" + this.order.tour, borderLeft, 13.7);
    pdf.line(1, 14.2, 20, 14.2);
    pdf.setFont("Helvetica", "bold");
    //people order
    if (this.order.people.length > 0) {
      pdf.text("Markierung", borderLeft, 14.9);
    }
    //goods order
    if (this.order.goods.length > 0) {
      pdf.text("Markierung", borderLeft, 14.9);
      pdf.text("Anzahl", borderLeft + 4, 14.9);
      pdf.text("VerpkEin", borderLeft + 5.5, 14.9);
      pdf.text("Warenbeschreibung Inhalt", borderLeft + 8.5, 14.9);
      pdf.text("Brutto Gewicht (kg)", borderLeft + 15, 14.9);
      pdf.setFont("Helvetica", "normal");
      let currPos = 15.4;
      for (let i = 0; this.order.goods.length > i; i++) {
        if (currPos > 29.7 - 5) {
          pdf.addPage("a4", "p");
          currPos = 2;
          pageNr = pageNr + 1;
          pdf.setFontSize(9);
          //@ts-ignore
          pdf.text("Seite " + pageNr, 19.5, 28.7, null, null, "right");
          pdf.setFontSize(11);
          pdf.setLineWidth(0.02);
          pdf.setDrawColor(0, 0, 0);
          //@ts-ignore
          pdf.setLineDash([0.05]);
        }

        let arrayMark = this.breakLines(this.order.goods[i].marking!, 17);
        pdf.text(arrayMark[0], borderLeft, currPos);
        pdf.text(this.order.goods[i].quantity! + "", borderLeft + 4, currPos);
        pdf.text(
          this.packagingUntisFromIdToDes.get(
            this.order.goods[i].packing_unit!
          ) + "",
          borderLeft + 5.5,
          currPos
        );
        let arrayDesc = this.breakLines(
          this.order.goods[i].goods_description!,
          30
        );
        pdf.text(arrayDesc[0], borderLeft + 8.5, currPos);
        pdf.text(
          this.order.goods[i].gross_weight! + "",
          borderLeft + 15,
          currPos
        );

        if (arrayMark[1] > arrayDesc[1] && arrayMark[1] > 0) {
          currPos = currPos + 0.5 * arrayMark[1];
        }
        if (arrayDesc[1] > arrayMark[1] && arrayDesc[1] > 0) {
          currPos = currPos + 0.5 * arrayDesc[1];
        }

        currPos = currPos + 0.5;

        if (currPos > 29.7 - 3) {
          pdf.addPage("a4", "p");
          currPos = 2;
          pageNr = pageNr + 1;
          pdf.setFontSize(9);
          //@ts-ignore
          pdf.text("Seite " + pageNr, 19.5, 28.7, null, null, "right");
          pdf.setFontSize(11);
          pdf.setLineWidth(0.02);
          pdf.setDrawColor(0, 0, 0);
          //@ts-ignore
          pdf.setLineDash([0.05]);
        }

        pdf.setFont("Helvetica", "italic");
        pdf.setFontSize(10);
        pdf.text(
          "Gefahrgut: " +
            this.order.goods[i].dangerous_goods +
            ", (LxBxH): " +
            this.order.goods[i].length +
            "x" +
            this.order.goods[i].width +
            "x" +
            this.order.goods[i].height +
            ", Warenwert (CHF): " +
            this.order.goods[i].value_chf +
            ", Netto Geweicht (kg): " +
            this.order.goods[i].net_weight,
          borderLeft,
          currPos
        );

        pdf.setFont("Helvetica", "normal");
        pdf.setFontSize(12);

        if (currPos > 29.7 - 9) {
          pdf.addPage("a4", "p");
          currPos = 2;
          pageNr = pageNr + 1;
          pdf.setFontSize(9);
          //@ts-ignore
          pdf.text("Seite " + pageNr, 19.5, 28.7, null, null, "right");
          pdf.setFontSize(11);
          pdf.setLineWidth(0.02);
          pdf.setDrawColor(0, 0, 0);
          //@ts-ignore
          pdf.setLineDash([0.05]);
        }

        if (i === this.order.goods.length - 1) {
          const positGoods = i * 0.6 + currPos;
          pdf.line(1, positGoods, 20, positGoods);
          pdf.setFont("Helvetica", "bold");
          pdf.text("Summe:", borderLeft, positGoods + 0.5);
          pdf.setFont("Helvetica", "normal");
          pdf.text(
            this.order.calcQuantity() + " Stk.",
            borderLeft + 4,
            positGoods + 0.5
          );
          pdf.text(
            this.order.calcCBM() + " m^3",
            borderLeft + 8.5,
            positGoods + 0.5
          );
          pdf.text(
            this.order.calcWeight() + " kg",
            borderLeft + 15,
            positGoods + 0.5
          );
          pdf.line(1, positGoods + 0.7, 20, positGoods + 0.7);
          pdf.line(1, positGoods + 0.8, 20, positGoods + 0.8);
          let bemerkung = this.breakLines(this.order.remarks + "", 15 * 9);
          pdf.text("Bemerkung: " + bemerkung[0], borderLeft, positGoods + 1.6);
          //@ts-ignore
          pdf.setLineDash([0.0]);
          pdf.line(borderLeft, positGoods + 6.5, 8, positGoods + 6.5);
          pdf.setFont("Helvetica", "italic");
          pdf.setFontSize(10);
          pdf.text(
            "Datum, (Stempel), Unterschirft \n" +
              "Wir übergeben Ihnen obige Sendung vollstädndig und in äusserlich gutem Zustand. Allfällige Reklamationen \noder Schadensmeldungen sind sofort mitzuteilen und innert 24 Studen schriftlich zu bestätigen.",
            borderLeft,
            positGoods + 7
          );
        }
        currPos = currPos + 0.8;
      }
    }
    //constr. order
    if (this.order.construction.length > 0) {
      pdf.text("Markierung", borderLeft, 14.9);
    }

    this.order.remarks;

    return pdf;
  }

  // @ts-ignore
  private async close(): Promise<void> {
    this.$emit("closePrint");
  }
}
</script>

<style>
.pdfobject-container {
  height: 30rem;
  border: 0.5rem solid rgba(0, 0, 0, 0.1);
}
</style>
