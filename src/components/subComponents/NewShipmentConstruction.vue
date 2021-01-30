<template>
  <v-form
    ref="formConst"
    v-model="validFormConst"
    eager-validation
  >
    <v-divider />
    <br>
    <v-row>
      <v-col cols="3">
        <v-text-field
          v-model="quantity"
          label="Quantität Leistung*"
          :rules="quanityRules"
          required
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="bruttoWeight"
          label="Gewicht (kg)*"
          :rules="weightRules"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="goodsDescripttion"
          :rules="requiredRules"
          required
          rows="4"
          label="Beschreibung Bauleistung mit Fahrzeug*"
          row-height="7"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PositionConstruction from "@/model/PositionConstruction";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NewShipmentConstruction extends Vue {
  @Prop({ type: PositionConstruction, required: true })
  currenpos!: PositionConstruction;
  // @ts-ignore
  private pQuantity: number = null;
  // @ts-ignore
  private pBruttoWeight: number = null;
  // @ts-ignore
  private pGoodsDescripttion = "";
  // @ts-ignore
  //formConst
  private pValidFormConst = true;
  // @ts-ignore
  private quanityRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^[0123456789]+$/.test(v) || "Nur ganze positive Zahlen erlaubt",
  ];
  // @ts-ignore
  private weightRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => v !== null || v !== undefined || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/.test(v) ||
      "Nur Zahlen mit max. 3 Kommastellen",
  ];
  // @ts-ignore
  private requiredRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => v !== " " || "Wert ist erforderlich",
  ];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    // @ts-ignore
    this.$refs.formConst.validate();
    // @ts-ignore
    this.$refs.formConst.resetValidation();

    // @ts-ignore
    this.pQuantity = this.currenpos.quantity;
    // @ts-ignore
    this.pBruttoWeight = this.currenpos.weight;
    // @ts-ignore
    this.pGoodsDescripttion = this.currenpos.description;
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

  public get goodsDescripttion(): string {
    return this.pGoodsDescripttion;
  }
  public set goodsDescripttion(v: string) {
    this.pGoodsDescripttion = v;
    this.$emit("update:goodsDescripttion", this.pGoodsDescripttion);
  }
  public set validFormConst(v: boolean) {
    this.pValidFormConst = v;
    this.$emit("update:validFormConst", this.pValidFormConst);
  }
  public get validFormConst(): boolean {
    return this.pValidFormConst;
  }
}
</script>
