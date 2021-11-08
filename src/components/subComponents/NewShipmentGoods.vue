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
import { Component, Prop, Vue } from "vue-property-decorator";
import PositionGoods from "@/model/PositionGoods";
import DirectusAPI from "@/services/DirectusAPI";

@Component
export default class NewShipmentGoods extends Vue {
  @Prop({
    type: PositionGoods, required: true,
  })
  currenpos!: PositionGoods;

  private packingUnit: string[] = [];
  private pQuantity: number | undefined = undefined;
  private pBruttoWeight: number | undefined = undefined;
  private pNettoWeight: number | undefined = undefined;
  private pGoodsDescripttion: string | undefined = "";
  private pLength: number | undefined = undefined;
  private pWidth: number | undefined = undefined;
  private pHeight: number | undefined = undefined;
  private pMarking: string | null | undefined = "";
  private pValueCHF: number | undefined = undefined;
  private pDangerousGoods: boolean | undefined = false;
  private pPackingUnitSelected: string | undefined = "";

  // formGoods
  private pValidFormGoods = true;
  private packagingUntisConv = new Map();

  private quanityRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^[0123456789]+$/.test(v) || "Nur ganze positive Zahlen erlaubt",
  ];

  private requiredRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  private weightRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => (v !== null || v !== undefined) || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/.test(v)
      || "Nur Zahlen mit max. 3 Kommastellen",
  ];

  private dimRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => (v !== null || v !== undefined) || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^[0-9]{1,11}(?:\.[0-9]{1})?$/.test(v)
      || "Nur Zahlen mit max. 1 Kommastelle",
  ];

  private valueCHFRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^[0-9]{1,11}(?:\.[0-9]{1,2})?$/.test(v)
      || "Nur Zahlen mit max. 2 Kommastelle",
  ];

  async mounted(): Promise<void> {
    const resp1 = await DirectusAPI.fetchPackaging();
    resp1.forEach((value) => {
      this.packagingUntisConv.set(value.id,
        `${value.abbreviation}=${value.description}`);
      this.packingUnit.push(`${value.abbreviation}=${value.description}`);
    });

    (this.$refs.formGoods as Vue & { validate: () => boolean; }).validate();
    (this.$refs.formGoods as Vue & { resetValidation: () => boolean; }).resetValidation();

    this.pPackingUnitSelected = this.packagingUntisConv.get(this.currenpos.packingUnit);
    this.pQuantity = this.currenpos.quantity;
    this.pBruttoWeight = this.currenpos.grossWeight;
    this.pNettoWeight = this.currenpos.netWeight;
    this.pGoodsDescripttion = this.currenpos.goodsDescription;
    this.pLength = this.currenpos.length;
    this.pWidth = this.currenpos.width;
    this.pHeight = this.currenpos.height;
    this.pMarking = this.currenpos.marking;
    this.pValueCHF = this.currenpos.valueChf;
    this.pDangerousGoods = this.currenpos.dangerousGoods;
  }

  public get quantity(): number | undefined {
    return this.pQuantity;
  }

  public set quantity(v: number | undefined) {
    this.pQuantity = v;
    this.$emit("update:quantity", this.pQuantity);
  }

  public get bruttoWeight(): number | undefined {
    return this.pBruttoWeight;
  }

  public set bruttoWeight(v: number | undefined) {
    this.pBruttoWeight = v;
    this.$emit("update:bruttoWeight", this.pBruttoWeight);
  }

  public get nettoWeight(): number | undefined {
    return this.pNettoWeight;
  }

  public set nettoWeight(v: number | undefined) {
    this.pNettoWeight = v;
    this.$emit("update:nettoWeight", this.pNettoWeight);
  }

  public get goodsDescripttion(): string | undefined {
    return this.pGoodsDescripttion;
  }

  public set goodsDescripttion(v: string | undefined) {
    this.pGoodsDescripttion = v;
    this.$emit("update:goodsDescripttion", this.pGoodsDescripttion);
  }

  public get length(): number | undefined {
    return this.pLength;
  }

  public set length(v: number | undefined) {
    this.pLength = v;
    this.$emit("update:length", this.pLength);
  }

  public get width(): number | undefined {
    return this.pWidth;
  }

  public set width(v: number | undefined) {
    this.pWidth = v;
    this.$emit("update:width", this.pWidth);
  }

  public get height(): number | undefined {
    return this.pHeight;
  }

  public set height(v: number | undefined) {
    this.pHeight = v;
    this.$emit("update:height", this.pHeight);
  }

  public get marking(): string | undefined | null {
    return this.pMarking;
  }

  public set marking(v: string | undefined | null) {
    this.pMarking = v;
    this.$emit("update:marking", this.pMarking);
  }

  public get valueCHF(): number | undefined {
    return this.pValueCHF;
  }

  public set valueCHF(v: number | undefined) {
    this.pValueCHF = v;
    this.$emit("update:valueCHF", this.pValueCHF);
  }

  public get dangerousGoods(): boolean | undefined {
    return this.pDangerousGoods;
  }

  public set dangerousGoods(v: boolean | undefined) {
    this.pDangerousGoods = v;
    this.$emit("update:dangerousGoods", this.pDangerousGoods);
  }

  public get packingUnitSelected(): string | undefined {
    return this.pPackingUnitSelected;
  }

  public set packingUnitSelected(v: string | undefined) {
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
