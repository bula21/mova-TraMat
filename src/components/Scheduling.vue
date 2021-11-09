<template>
  <v-container>
    <v-row
      class="my-2"
      dense
    >
      <h2>
        <v-icon
          class="mb-1"
          color="black"
        >
          mdi-chart-timeline
        </v-icon>
        Disposition
      </h2>
    </v-row>
    <v-row>
      <v-col
        :lg="6"
        :md="6"
        :sm="6"
        class="text-left"
      >
        <h3 class="mb-4">
          Aufträge
        </h3>
        <!-- table orders-->
        <v-data-table
          dense
          :headers="headers"
          :items="orders"
          item-key="idO"
          class="elevation-1"
          sort-by="id"
          multi-sort
        >
          <template #[`item.actions`]="{ item }">
            <v-icon
              small
              class="text-center"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-col>

      <v-col
        :lg="6"
        :md="6"
        :sm="6"
        class="text-left"
      >
        <h3 class="mb-4">
          Tour
        </h3>
        <!-- table tour-->
        <v-data-table
          dense
          :headers="headers"
          :items="orders"
          item-key="idO"
          class="elevation-1"
          sort-by="id"
          multi-sort
        >
          <template #[`item.actions`]="{ item }">
            <v-icon
              small
              class="text-center"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Scheduling extends Vue {
  private orders = [];
  private headers = [
    {
      text: "Actions", value: "actions", sortable: false,
    },
    {
      text: "Order ID",
      align: "start",
      value: "id",
    },
    {
      text: "Status", value: "state",
    },
    {
      text: "delivery_date", value: "delivery_date",
    },
    {
      text: "pick_up_date", value: "pick_up_date",
    },
    {
      text: "Auftraggeber Name", value: "principal",
    },
    {
      text: "Auftraggeber ID", value: "principal_id",
    },
    {
      text: "Ladeadresse Name", value: "shipper",
    },
    {
      text: "Ladeadresse Ort", value: "shipper_place",
    },
    {
      text: "Ladeadresse PLZ", value: "shipper_zip",
    },
    {
      text: "Lieferadresse Name", value: "receiver",
    },
    {
      text: "Lieferadresse Ort", value: "receiver_place",
    },
    {
      text: "Lieferadresse PLZ", value: "receiver_zip",
    },
    {
      text: "Gewicht kg", value: "weight",
    },
    {
      text: "M^3", value: "cbm",
    },
    {
      text: "Positionen", value: "pos",
    },
    {
      text: "Beschreibung Pos.", value: "posDescription",
    },
  ];
}
</script>
