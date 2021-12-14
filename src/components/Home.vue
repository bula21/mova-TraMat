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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DirectusAPI from "@/services/DirectusAPI";

@Component
export default class Home extends Vue {
  private newOrders = 0;
  private currentOrder = 0;
  private inProcessOrders = 0;

  async mounted(): Promise<void> {
    const orders = await Home.fetchHomeOrders();
    this.newOrders = orders[0];
    this.currentOrder = orders[1];
    this.inProcessOrders = orders[2];
  }

  private static async fetchHomeOrders(): Promise<number[]> {
    const ordersNew = await DirectusAPI.getTrpOrder({
      state: "1",
    }, -1);

    const orderCurrent = await DirectusAPI.getTrpOrder({
      state: "3",
    }, -1);

    const orderInProcess = await DirectusAPI.getTrpOrder({
      state: "2",
    }, -1);
    return [ordersNew.length, orderCurrent.length, orderInProcess.length];
  }
}

</script>
