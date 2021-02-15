<template>
  <!-- print transport order -->
  <v-container>
    <input @keyup.enter="printOrder()">
    <header class="order_header">
      <address>
        <strong> Verein Bundeslager 2021 </strong><br>
        <strong> c/o Pfadibewegung Schweiz </strong><br>
        TB Transport <br>
        Speichergasse 31 <br>
        CH-3011 Bern
        <v-spacer />  Sachbearbeiter:  {{ firstAndLastName }}, {{ Email }}
      </address>
    </header>
    <v-divider class="mb-2" />
    L I E F E R S C H E I N<br>
    <v-divider class="mt-2" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue,Prop } from "vue-property-decorator";
import Order from "@/model/Order";
import DirectusAPI from "@/services/DirectusAPI";

@Component({
  components: {},
})
export default class PrintTransportOrder extends Vue {
  /* eslint-disable @typescript-eslint/ban-ts-comment */

  @Prop({ type: Order, required: true })
  order! : Order;

  // @ts-ignore
  private firstAndLastName = "";
  // @ts-ignore
  private Email = "";

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    window.addEventListener("keyup", this.handleEnter);

    const nameEmail = await this.fetchNameEmail();
    this.Email = nameEmail[2];
    this.firstAndLastName = nameEmail[0] + " " + nameEmail[1];
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
    throw new Error("Method not implemented.");
  }
}
</script>

<style scoped>
.order_header {
  padding: 18px;
  color: "black";
}
</style>
