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
          label="Anzahl Leistung"
          :rules="quanityRules"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="bruttoWeight"
          label="Gewicht (kg)"
          :rules="weightRules"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          v-model="goodsDescripttion"
          :rules="requiredRules"
          required
          rows="4"
          label="Beschreibung*"
          row-height="7"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PositionConstruction from "@/model/PositionConstruction";

@Component
export default class NewShipmentConstruction extends Vue {
  @Prop({
    type: PositionConstruction, required: true,
  })
  currenpos!: PositionConstruction;

  private pQuantity: number | undefined = 0;
  private pBruttoWeight: number | undefined = 0;
  private pGoodsDescripttion: string | undefined = " ";
  // formConst
  private pValidFormConst = true;
  private quanityRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      if (v) {
        return /^[0123456789]+$/.test(v) || "Nur ganze positive Zahlen erlaubt";
      }
      return true;
    },
  ];

  private weightRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      if (v) {
        return /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/.test(v) || "Nur Zahlen mit max. 3 Kommastellen";
      }
      return true;
    },
  ];

  private requiredRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => v !== " " || "Wert ist erforderlich",
  ];

  async mounted(): Promise<void> {
    (this.$refs.formConst as Vue & { validate: () => boolean; }).validate();
    (this.$refs.formConst as Vue & { resetValidation: () => boolean; }).resetValidation();

    this.pQuantity = this.currenpos.quantity;
    this.pBruttoWeight = this.currenpos.weight;
    this.pGoodsDescripttion = this.currenpos.description;
  }

  public get quantity(): number | undefined {
    return this.pQuantity;
  }

  public set quantity(v: number | undefined) {
    this.pQuantity = v;
    if (this.pQuantity) {
      this.$emit("update:quantity", this.pQuantity);
    } else {
      this.$emit("update:quantity", 0);
    }
  }

  public get bruttoWeight(): number | undefined {
    return this.pBruttoWeight;
  }

  public set bruttoWeight(v: number | undefined) {
    this.pBruttoWeight = v;
    if (this.pBruttoWeight) {
      this.$emit("update:bruttoWeight", this.pBruttoWeight);
    } else {
      this.$emit("update:bruttoWeight", 0);
    }
  }

  public get goodsDescripttion(): string | undefined {
    return this.pGoodsDescripttion;
  }

  public set goodsDescripttion(v: string | undefined) {
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
