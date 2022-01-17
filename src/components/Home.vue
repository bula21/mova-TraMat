<!--eslint-disable no-mixed-spaces-and-tabs -->
<!-- eslint-disable no-tabs -->
<template>
  <v-container>
    <v-row
      class="mt-8 ml-3"
      dense
    >
      <h2>
        <v-icon
          class="mb-1"
          color="black"
        >
          mdi-home
        </v-icon>
        Home
      </h2>
    </v-row>
    <v-row
      class="mt-8 ml-3 text-center"
      dense
    >
      <v-col cols="4">
        <h5 :class="{'subheading': $vuetify.breakpoint.xs}">
          Status: New
        </h5>
        <v-progress-circular
          class="mt-4"
          :rotate="360"
          :size="100"
          :width="15"
          :value="100"
          color="teal"
        >
          {{ newOrders }}
        </v-progress-circular>
      </v-col>
      <v-col cols="4">
        <h5 :class="{'subheading': $vuetify.breakpoint.xs}">
          Status: Checked
        </h5>
        <v-progress-circular
          class="mt-4"
          :rotate="360"
          :size="100"
          :width="15"
          :value="100"
          color="primary"
        >
          {{ currentOrder }}
        </v-progress-circular>
      </v-col>
      <v-col cols="4">
        <h5 :class="{'subheading': $vuetify.breakpoint.xs}">
          Status: Scheduled
        </h5>
        <v-progress-circular
          class="mt-4"
          :rotate="360"
          :size="100"
          :width="15"
          :value="100"
          color="pink"
        >
          {{ inProcessOrders }}
        </v-progress-circular>
      </v-col>
    </v-row>
    <v-row class="pt-10">
      <v-divider />
    </v-row>
    <v-row
      justify="center"
      class="pt-10 ml-3"
    >
      <v-col
        cols="6"
        align="center"
      >
        <h4>
          Nützliche IDs für Auftragserfassung
        </h4>
      </v-col>
      <v-col
        cols="6"
        align="center"
      >
        <h4>
          Anleitungen TraMat
        </h4>
      </v-col>
    </v-row>
    <v-row class="ml-3">
      <v-col cols="6">
        <div align="center">
          <v-card
            flat
            width="320px"
          >
            <v-textarea
              v-model="helpId"
              auto-grow
              outlinded
              filled
              readonly
              background-color="amber lighten-4"
              rows="4"
            />
          </v-card>
        </div>
      </v-col>
      <v-col
        cols="6"
        class="mt-n1"
      >
        <div align="center">
          <a
            href="https://bula21.sharepoint.com/:f:/g/ErQ7KcFynNlKvULcAB9hSaEBokuTgTsO4Gh8acmmz64MOA?e=xha89b"
            target="_blank"
          >Transportauftrag erfassen / Saisir la commande</a>
        </div>
      </v-col>
    </v-row>
    <v-row class="pt-4">
      <v-divider />
    </v-row>
    <v-row class="ml-3 pt-8">
      <v-col align="center">
        <h4>
          ACHTUNG, welche Transporte gehören in den TraMat?
        </h4>
        <h5>
          Eine Entscheidungshilfe findest du im Diagramm unten. Für mehr Infos klicke auf die Links im Diagramm.
        </h5>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div
          align="center"
          id="pdf-diagramm"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PDFObject from "pdfobject";
import DirectusAPI from "@/services/DirectusAPI";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Diagramm from "@/assets/diagramm.json";
import Order from "@/model/Order";

@Component({
})
export default class Home extends Vue {
  private newOrders = 0;
  private currentOrder = 0;
  private inProcessOrders = 0;
  private helpId = "ID Lagerplatz Ulrichen: \t\t\t\t\t\t31\nID Transportzentrale: \t\t\t\t\t\t\t30\nID Flughafen Münster: \t\t\t\t\t\t186\nID Programmspot Oberwald: \t\t\t187";


  async mounted(): Promise<void> {
    const prom = Home.fetchHomeOrders();
    prom.then((valuei) => {
      valuei.forEach((valuei1, idxi) => {
        valuei1.then((valuei2) => {
          if (idxi === 0) {
            this.newOrders = valuei2.length;
          }
          if (idxi === 1) {
            this.currentOrder = valuei2.length;
          }
          if (idxi === 2) {
            this.inProcessOrders = valuei2.length;
          }
        });
      });
    });
    Home.loadDiagramm();
  }

  private static async loadDiagramm(): Promise<void> {
    PDFObject.embed(Diagramm.pdf.data, "#pdf-diagramm");
  }

  private static async fetchHomeOrders(): Promise<Promise<Order[]>[]> {
    const homeOrderPormises: Promise<Order[]>[] = [];
    const ordersNew = DirectusAPI.getTrpOrder({
      state: "1",
    }, -1);
    homeOrderPormises.push(ordersNew);

    const orderCurrent = DirectusAPI.getTrpOrder({
      state: "3",
    }, -1);
    homeOrderPormises.push(orderCurrent);

    const orderInProcess = DirectusAPI.getTrpOrder({
      state: "2",
    }, -1);
    homeOrderPormises.push(orderInProcess);

    return homeOrderPormises;
  }
}
</script>
<style scoped>
.pdfobject-container {
  width: 100%;
  height: 880px;
  border: 0.5rem solid rgba(0, 0, 0, 0.1);
}
</style>
