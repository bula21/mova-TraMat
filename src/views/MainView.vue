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
    NavigationMenu,
  },
})
export default class MainView extends Vue {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private firstAndLastName = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private Email = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private authorisation = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private authorisationDescript = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private abbreviation = "AA";

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    const auth = await this.fetchAuthorisation();
    this.authorisation = auth[0];
    this.authorisationDescript = auth[1];
    const nameEmail = await this.fetchNameEmail();
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

  private async fetchAuthorisation(): Promise<string[]> {
    const roles = await DirectusAPI.directusAPI.getRoles();

    let myRole = await DirectusAPI.directusAPI.getMyPermissions();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    myRole = myRole.data[0].role;

    let roleName = "";
    let roleDescri = "";

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roles.data.forEach((element) => {
      if (element.id === myRole) {
        roleName = element.name;
        roleDescri = element.description;
      }
    });
    return [roleName, roleDescri];
  }

  private async fetchNameEmail() {
    const user = await DirectusAPI.directusAPI.getMe();
    return [user.data.first_name, user.data.last_name, user.data.email];
  }
}
</script>
