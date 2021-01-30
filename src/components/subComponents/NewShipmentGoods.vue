<template>
  <v-form
    ref="formGoods"
    v-model="validFormGoods"
    eager-validation
  >
    <v-divider />
    <br>
    <v-row>
      <v-col cols="2">
        <v-text-field
          v-model="quantity"
          :rules="quanityRules"
          label="Anzahl (Stk.)*"
          required
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="packingUnitSelected"
          :rules="requiredRules"
          label="Verpackungseinheit*"
          :items="packingUnit"
          dense
          outlined
          class="mt-3"
          required
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="bruttoWeight"
          :rules="weightRules"
          label="Brutto Gewicht (kg)*"
          required
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="nettoWeight"
          :rules="weightRules"
          label="Netto Gewicht (kg)*"
          required
        />
      </v-col>
      <v-col
        cols="12"
        class="mt-n7"
      >
        <v-textarea
          v-model="goodsDescripttion"
          :rules="requiredRules"
          rows="2"
          label="Warenbeschreibung*"
          row-height="7"
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
          required
          label="Länge (cm)*"
        />
      </v-col>
      <v-col
        cols="4"
        class="mt-n7"
      >
        <v-text-field
          v-model="width"
          :rules="dimRules"
          required
          label="Breite (cm)*"
        />
      </v-col>
      <v-col
        cols="4"
        class="mt-n7"
      >
        <v-text-field
          v-model="height"
          :rules="dimRules"
          required
          label="Höhe (cm)*"
        />
      </v-col>
      <v-col
        cols="8"
        class="mt-n7"
      >
        <v-text-field
          v-model="marking"
          label="Markierung"
        />
      </v-col>
      <v-col
        cols="4"
        class="mt-n7"
      >
        <v-checkbox
          v-model="dangerousGoods"
          label="Gefahrgut"
          color="red"
          hide-details
        />
      </v-col>
      <v-col
        cols="4"
        class="mt-n7"
      >
        <v-text-field
          v-model="valueCHF"
          :rules="valueCHFRules"
          label="Warenwert in CHF*"
          required
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PositionGoods from "@/model/PositionGoods";
import DirectusAPI from "@/services/DirectusAPI";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class NewShipmentGoods extends Vue {
  @Prop({ type: PositionGoods, required: true })
  currenpos!: PositionGoods;

  // @ts-ignore
  private packingUnit: string[] = [];
  // @ts-ignore
  private pQuantity: number = null;
  // @ts-ignore
  private pBruttoWeight: number = null;
  // @ts-ignore
  private pNettoWeight: number = null;
  // @ts-ignore
  private pGoodsDescripttion = "";
  // @ts-ignore
  private pLength: number = null;
  // @ts-ignore
  private pWidth: number = null;
  // @ts-ignore
  private pHeight: number = null;
  // @ts-ignore
  private pMarking = "";
  // @ts-ignore
  private pValueCHF: number = null;
  // @ts-ignore
  private pDangerousGoods = false;
  // @ts-ignore
  private pPackingUnitSelected = "";
  // @ts-ignore
  //formGoods
  private pValidFormGoods = true;
  private packagingUntisConv = new Map();
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
  // @ts-ignore
  private dimRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => (v !== null || v!==undefined) || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^[0-9]{1,11}(?:\.[0-9]{1})?$/.test(v) ||
      "Nur Zahlen mit max. 1 Kommastelle",
  ];
  // @ts-ignore
  private valueCHFRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^[0-9]{1,11}(?:\.[0-9]{1,2})?$/.test(v) ||
      "Nur Zahlen mit max. 2 Kommastelle",
  ];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    const resp = await this.fetchPackagingUnits();
    this.packingUnit = resp;
    // @ts-ignore
    this.$refs.formGoods.validate();
    // @ts-ignore
    this.$refs.formGoods.resetValidation();

    this.pPackingUnitSelected = this.packagingUntisConv.get(
      this.currenpos.packing_unit
    );
     // @ts-ignore
    this.pQuantity = this.currenpos.quantity;
     // @ts-ignore
    this.pBruttoWeight = this.currenpos.gross_weight;
     // @ts-ignore
    this.pNettoWeight = this.currenpos.net_weight;
     // @ts-ignore
    this.pGoodsDescripttion = this.currenpos.goods_description;
     // @ts-ignore
    this.pLength = this.currenpos.length;
     // @ts-ignore
    this.pWidth = this.currenpos.width;
     // @ts-ignore
    this.pHeight = this.currenpos.height;
     // @ts-ignore
    this.pMarking = this.currenpos.marking;
     // @ts-ignore
    this.pValueCHF = this.currenpos.value_chf;
     // @ts-ignore
    this.pDangerousGoods = this.currenpos.dangerous_goods;
  }

  private async fetchPackagingUnits(): Promise<string[]> {
    let packagingUntis: string[] = [];
    const data = await DirectusAPI.directusAPI.getItems("trp_packing_unit");
    data.data.forEach((value) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      packagingUntis.push(value.abbreviation + "=" + value.description);
      // @ts-ignore
      this.packagingUntisConv.set(
        // @ts-ignore
        value.id,
        // @ts-ignore
        value.abbreviation + "=" + value.description
      );
    });
    return packagingUntis;
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

  public get nettoWeight(): number {
    return this.pNettoWeight;
  }
  public set nettoWeight(v: number) {
    this.pNettoWeight = v;
    this.$emit("update:nettoWeight", this.pNettoWeight);
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
  public get marking(): string {
    return this.pMarking;
  }
  public set marking(v: string) {
    this.pMarking = v;
    this.$emit("update:marking", this.pMarking);
  }
  public get valueCHF(): number {
    return this.pValueCHF;
  }
  public set valueCHF(v: number) {
    this.pValueCHF = v;
    this.$emit("update:valueCHF", this.pValueCHF);
  }

  public get dangerousGoods(): boolean {
    return this.pDangerousGoods;
  }
  public set dangerousGoods(v: boolean) {
    this.pDangerousGoods = v;
    this.$emit("update:dangerousGoods", this.pDangerousGoods);
  }

  public get packingUnitSelected(): string {
    return this.pPackingUnitSelected;
  }
  public set packingUnitSelected(v: string) {
    this.pPackingUnitSelected = v;
    this.$emit("update:packingUnitSelected", this.pPackingUnitSelected);
  }
  public set validFormGoods(v: boolean) {
    this.pValidFormGoods = v;
    this.$emit("update:validFormGoods", this.pValidFormGoods);
  }
  public get validFormGoods(): boolean {
    return this.pValidFormGoods;
  }
}
</script>
