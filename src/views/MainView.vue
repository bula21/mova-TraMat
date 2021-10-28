<template>
  <v-main style="padding: 0px 0px 0px;">
    <NavigationMenu />
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavigationMenu from "@/components/NavigationMenu.vue";
import DirectusAPI from "@/services/DirectusAPI";

@Component({
  components: {
    NavigationMenu
  }
})
export default class MainView extends Vue {
  private firstAndLastName = "";
  private Email = "";
  private authorisation = "";
  private authorisationDescript = "";
  private abbreviation = "AA";

  async mounted(): Promise<void> {
    const auth = await DirectusAPI.fetchAuthorisation();
    this.authorisation = auth[0];
    this.authorisationDescript = auth[1];
    const nameEmail = await DirectusAPI.fetchNameEmail();
    this.Email = nameEmail[2];
    this.firstAndLastName = nameEmail[0] + " " + nameEmail[1];
    this.abbreviation = nameEmail[0].substr(0, 1) + nameEmail[1].substr(0, 1);
    this.$store.commit("updateAuthorisation", this.authorisation);
    this.$store.commit(
      "updateAuthorisationDescript",
      this.authorisationDescript
    );
    this.$store.commit("updateEmail", this.Email);
    this.$store.commit("updatefirstAndLastName", this.firstAndLastName);
    this.$store.commit("updatefirstAndLastName", this.firstAndLastName);
    this.$store.commit("updateAbbreviation", this.abbreviation);
  }
}
</script>
