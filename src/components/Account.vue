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
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Account extends Vue {
  get abbreviation(): string {
    return this.$store.state.abbreviation;
  }

  get firstAndLastName(): string {
    return this.$store.state.firstAndLastName;
  }

  get authorisation(): string {
    return this.$store.state.authorisation;
  }

  get authorisationDescript(): string {
    return this.$store.state.authorisationDescript;
  }

  get Email(): string {
    return this.$store.state.Email;
  }
}
</script>
