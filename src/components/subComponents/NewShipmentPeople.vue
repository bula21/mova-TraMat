<template>
  <v-form
    ref="formPeople"
    v-model="validFormPeople"
    eager-validation
  >
    <v-divider />
    <br>
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model="quantity"
          :rules="quanityRules"
          required
          label="Anzahl Personen"
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedTypeOfPeople"
          label="Typ Personen"
          :items="typeOfPeople"
          :rules="requiredRules"
          required
          dense
          outlined
          class="mt-3"
        />
      </v-col>
    </v-row>
    <v-row class="mt-0 ml-0">
      <h4> Details Gepäck </h4>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="3">
        <v-text-field
          v-model="quantityOfLuagge"
          label="Anz. Gepäckstücke"
          :rules="quanityRules"
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
          required
        />
      </v-col>
      <v-col cols="9">
        <v-textarea
          v-model="goodsDescripttion"
          :rules="requiredRules"
          rows="2"
          label="Beschreibung Gepäckstücke"
          row-height="7"
          hint="Falls kein Gepäck bitte vermerken"
          persistent-hint
          required
        />
      </v-col>
      <v-col
        cols="4"
        class="mt-n7"
      >
        <v-text-field
          v-model="length"
          :rules="dimRules"
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
          required
          label="Länge (cm)"
        />
      </v-col>
      <v-col
        cols="4"
        class="mt-n7"
      >
        <v-text-field
          v-model="width"
          :rules="dimRules"
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
          required
          label="Breite (cm)"
        />
      </v-col>
      <v-col
        cols="4"
        class="mt-n7"
      >
        <v-text-field
          v-model="height"
          :rules="dimRules"
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
          required
          label="Höhe (cm)"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="bruttoWeight"
          :rules="weightRules"
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
          required
          label="Gewicht (kg)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PositionPeople from "@/model/PositionPeople";
import DirectusAPI from "@/services/DirectusAPI";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NewShipmentPeople extends Vue {
  @Prop({ type: PositionPeople, required: true })
  currenpos!: PositionPeople;
  // @ts-ignore
  private typeOfPeople: string[] = [];
  // @ts-ignore
  private typeOfPeopleConv = new Map();
  // @ts-ignore
  private pQuantity: number = null;
  // @ts-ignore
  private pQuantityOfLuagge: number = null;
  // @ts-ignore
  private pBruttoWeight: number = null;
  // @ts-ignore
  private pGoodsDescripttion = " ";
  // @ts-ignore
  private pLength: number = null;
  // @ts-ignore
  private pWidth: number = null;
  // @ts-ignore
  private pHeight: number = null;
  // @ts-ignore
  private pSelectedTypeOfPeople = "";
  // @ts-ignore
  //formPeople
  private pValidFormPeople = true;
  // @ts-ignore
  private quanityRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^[0123456789]+$/.test(v) || "Nur ganze positive Zahlen erlaubt",
  ];
  // @ts-ignore
  private requiredRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => v !== " " || "Wert ist erforderlich",
  ];
  // @ts-ignore
  private dimRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>  (v !== null || v!==undefined) || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^[0-9]{1,11}(?:\.[0-9]{1})?$/.test(v) ||
      "Nur Zahlen mit max. 1 Kommastelle",
  ];
  // @ts-ignore
  private weightRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => (v !== null || v!==undefined) || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/.test(v) ||
      "Nur Zahlen mit max. 3 Kommastellen",
  ];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    const resp = await this.fetchTypeOfPeople();
    this.typeOfPeople = resp;
    // @ts-ignore
    this.$refs.formPeople.validate();
    // @ts-ignore
    this.$refs.formPeople.resetValidation();

    // @ts-ignore
    this.pQuantity = this.currenpos.quantity_of_people;
    // @ts-ignore
    this.pQuantityOfLuagge = this.currenpos.quantity_of_luggage;
    // @ts-ignore
    this.pBruttoWeight = this.currenpos.weight;
    // @ts-ignore
    this.pGoodsDescripttion = this.currenpos.description_of_luagge;
    // @ts-ignore
    this.pLength = this.currenpos.length;
    // @ts-ignore
    this.pWidth = this.currenpos.width;
    // @ts-ignore
    this.pHeight = this.currenpos.height;
    // @ts-ignore
    this.pSelectedTypeOfPeople = this.typeOfPeopleConv.get(this.currenpos.type_people);
    // @ts-ignore
  }

  private async fetchTypeOfPeople(): Promise<string[]> {
    let typeOfPeople: string[] = [];
    const data = await DirectusAPI.directusAPI.getItems("trp_typ_people");
    await data.data.forEach((value) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      typeOfPeople.push(value.description);
      // @ts-ignore
      this.typeOfPeopleConv.set(value.id, value.description);
    });
    return typeOfPeople;
  }
  public get quantity(): number {
    return this.pQuantity;
  }
  public set quantity(v: number) {
    this.pQuantity = v;
    this.$emit("update:quantity", this.pQuantity);
  }
  public get bruttoWeight(): number {
    return this.pBruttoWeight;
  }
  public set bruttoWeight(v: number) {
    this.pBruttoWeight = v;
    this.$emit("update:bruttoWeight", this.pBruttoWeight);
  }

  public get quantityOfLuagge(): number {
    return this.pQuantityOfLuagge;
  }
  public set quantityOfLuagge(v: number) {
    this.pQuantityOfLuagge = v;
    this.$emit("update:quantityOfLuagge", this.pQuantityOfLuagge);
  }
  public get goodsDescripttion(): string {
    return this.pGoodsDescripttion;
  }
  public set goodsDescripttion(v: string) {
    this.pGoodsDescripttion = v;
    this.$emit("update:goodsDescripttion", this.pGoodsDescripttion);
  }
  public get length(): number {
    return this.pLength;
  }
  public set length(v: number) {
    this.pLength = v;
    this.$emit("update:length", this.pLength);
  }
  public get width(): number {
    return this.pWidth;
  }
  public set width(v: number) {
    this.pWidth = v;
    this.$emit("update:width", this.pWidth);
  }
  public get height(): number {
    return this.pHeight;
  }
  public set height(v: number) {
    this.pHeight = v;
    this.$emit("update:height", this.pHeight);
  }
  public get selectedTypeOfPeople(): string {
    return this.pSelectedTypeOfPeople;
  }
  public set selectedTypeOfPeople(v: string) {
    this.pSelectedTypeOfPeople = v;
    this.$emit("update:selectedTypeOfPeople", this.pSelectedTypeOfPeople);
  }
  public set validFormPeople(v: boolean) {
    this.pValidFormPeople = v;
    this.$emit("update:validFormPeople", this.pValidFormPeople);
  }
  public get validFormPeople(): boolean {
    return this.pValidFormPeople;
  }
}
</script>
