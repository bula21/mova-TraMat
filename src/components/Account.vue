<template>
  <v-container class="mx-auto overflow-hidden">
    <v-row
      class="mt-8 ml-3"
      dense
    >
      <h2>
        <v-icon
          class="mb-1"
          color="black"
        >
          mdi-account
        </v-icon>
        Account
      </h2>
    </v-row>
    <v-form>
      <v-avatar
        class="mt-5 ml-3"
        color="orange"
        size="90"
      >
        <span class="white--text headline">{{ abbreviation }}</span>
      </v-avatar>
      <v-container class="ml-0">
        <v-row class="mt-3">
          <v-col
            :lg="7"
            :md="7"
            :sm="11"
          >
            <v-text-field
              v-model="firstAndLastName"
              label="Name"
              filled
              readonly
            />
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col
            :lg="7"
            :md="7"
            :sm="11"
          >
            <v-text-field
              v-model="Email"
              label="Email"
              filled
              readonly
            />
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col
            :lg="7"
            :md="7"
            :sm="11"
          >
            <v-text-field
              v-model="authorisation"
              label="Rechte"
              filled
              readonly
            />
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col
            :lg="7"
            :md="7"
            :sm="11"
          >
            <v-text-field
              v-model="authorisationDescript"
              label="Beschreibung Rechte"
              filled
              readonly
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import DirectusAPI from "@/services/DirectusAPI";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Account extends Vue {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private abbreviation = "UK";
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    const auth = await this.fetchAuthorisation();
    this.authorisation = auth[0];
    this.authorisationDescript = auth[1];
    const nameEmail = await this.fetchNameEmail();
    this.Email = nameEmail[2];
    this.firstAndLastName = nameEmail[0] + " " + nameEmail[1];
    this.abbreviation = nameEmail[0].substr(0, 1) + nameEmail[1].substr(0, 1);
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