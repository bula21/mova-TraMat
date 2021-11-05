<template>
  <v-container>
    <!-- Dialog Warn Permissions-->
    <v-dialog
      v-model="dialogWarnPermissions"
      max-width="500"
      :retain-focus="false"
    >
      <v-card>
        <v-card-title class="headline">
          Unzureichende Berechtigungen
        </v-card-title>
        <v-card-text>
          Du hast keine Berechtigung, diese Aktion durchzuführen.
          <br>
          Bitte melde allfällige Änderung zu Kunden (Änderung von Kunden für mova crew nicht erlaubt) / Transporte (Änderungen in einem Transport nur im Status "new" möglich) via:
          <a
            href="https://bulacafe21.slack.com/archives/C01Q6N2HL2X"
            target="_blank"
          >
            #20_log_21_trp_tramat_request</a>
          oder löse ein Ticket über den
          <a
            href="https://voila.bula21.ch/servicedesk/customer/portal/8"
            target="_blank"
          >
            Service Desk</a>.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="closePermissions()"
          >
            Ok, verstanden!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class DialogPermissions extends Vue {
  @Prop({ type: Boolean, required: true })
  dialogWarnPermissions!: boolean;

  private closePermissions(): void {
    this.$emit("closePermissions");
  }
}
</script>
