<template>
  <v-container>
    <!-- Dialog Warn Delete -->
    <v-dialog
      v-model="dialogWarnDelete"
      max-width="500"
      :retain-focus="false"
    >
      <v-card>
        <v-card-title class="headline">
          Löschen
        </v-card-title>
        <v-card-text>
          Bist du sicher, dass du diesen Vorgang fortsetzen möchtest?
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="closeDeleteWarn()"
          >
            Abbrechen!
          </v-btn>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="deletConfirmed()"
          >
            Ok, löschen!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
  },
})
export default class DialogDeleteWarn extends Vue {
  @Prop({
    type: Boolean, required: true,
  })
  dialogWarnDelete!: boolean;

  private closeDeleteWarn(): void {
    this.$emit("closeDeleteWarn");
  }

  private deletConfirmed(): void {
    this.$emit("deletConfirmed");
  }
}
</script>
