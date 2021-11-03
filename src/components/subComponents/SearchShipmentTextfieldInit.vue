<template>
  <v-form>
    <v-row>
      <v-col cols="4">
        <v-select
          v-model="searchCategory"
          :items="items"
          label="Bitte auswählen"
          dense
          outlined
          class="mt-3"
        />
      </v-col>
      <v-col cols="7">
        <v-text-field
          v-model="search"
          label="Search"
        />
      </v-col>
      <v-col cols="1">
        <v-btn
          class="mt-1 mr-1"
          fab
          dark
          color="blue"
          small
          @click="AddButtonClicked()"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <v-btn
          class="mt-1"
          fab
          dark
          color="orange"
          small
          @click="MinusButtonClicked()"
        >
          <v-icon dark>
            mdi-minus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as search from "@/components/Const";

@Component
export default class SearchShipmentTextfieldInit extends Vue {
  items: string[] = search.SEARCH_CATEGORIES;
  private pSearch = "";
  private pSearchCategory = "";

  get search(): string {
    return this.pSearch;
  }

  set search(value: string) {
    this.pSearch = value;
    this.$emit("update:search", this.pSearch);
  }

  get searchCategory(): string {
    return this.pSearchCategory;
  }

  set searchCategory(value: string) {
    this.pSearchCategory = value;
    this.$emit("update:searchCategory", this.pSearchCategory);
  }

  AddButtonClicked(): void {
    this.$emit("AddButtonClicked");
  }

  MinusButtonClicked(): void {
    this.$emit("MinusButtonClicked");
  }
}
</script>
