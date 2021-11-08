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
          label="Anzahl Personen*"
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="selectedTypeOfPeople"
          label="Typ Personen*"
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
          label="Anz. Gepäckstücke*"
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
          label="Beschreibung Gepäckstücke*"
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
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
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
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
          required
          label="Höhe (cm)*"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-model="bruttoWeight"
          :rules="weightRules"
          hint="Falls kein Gepäck 0 eintragen"
          persistent-hint
          required
          label="Gewicht (kg)*"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import PositionPeople from "@/model/PositionPeople";
import DirectusAPI from "@/services/DirectusAPI";

@Component
export default class NewShipmentPeople extends Vue {
  @Prop({
    type: PositionPeople, required: true,
  })
  currenpos!: PositionPeople;

  private typeOfPeople: string[] = [];
  private typeOfPeopleConv = new Map();
  private pQuantity: number | undefined = undefined;
  private pQuantityOfLuagge: number | undefined = undefined;
  private pBruttoWeight: number | undefined = undefined;
  private pGoodsDescripttion: string | undefined = "";
  private pLength: number | undefined = undefined;
  private pWidth: number | undefined = undefined;
  private pHeight: number | undefined = undefined;
  private pSelectedTypeOfPeople: string | undefined = "";

  // formPeople
  private pValidFormPeople = true;

  private quanityRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^[0123456789]+$/.test(v) || "Nur ganze positive Zahlen erlaubt",
  ];

  private requiredRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => v !== " " || "Wert ist erforderlich",
  ];

  private dimRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => (v !== null || v !== undefined) || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^[0-9]{1,11}(?:\.[0-9]{1})?$/.test(v)
      || "Nur Zahlen mit max. 1 Kommastelle",
  ];

  private weightRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => (v !== null || v !== undefined) || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/.test(v)
      || "Nur Zahlen mit max. 3 Kommastellen",
  ];

  async mounted(): Promise<void> {
    const resp = await DirectusAPI.fetchTrpTypePeople();
    resp.forEach((value) => {
      this.typeOfPeople.push(value.description);
      this.typeOfPeopleConv.set(value.id, value.description);
    });

    (this.$refs.formPeople as Vue & { validate: () => boolean; }).validate();
    (this.$refs.formPeople as Vue & { resetValidation: () => boolean; }).resetValidation();

    this.pQuantity = this.currenpos.quantityOfPeople;
    this.pQuantityOfLuagge = this.currenpos.quantityOfLuggage;
    this.pBruttoWeight = this.currenpos.weight;
    this.pGoodsDescripttion = this.currenpos.descriptionOfLuagge;
    this.pLength = this.currenpos.length;
    this.pWidth = this.currenpos.width;
    this.pHeight = this.currenpos.height;
    this.pSelectedTypeOfPeople = this.typeOfPeopleConv.get(this.currenpos.typePeople);
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

  public get quantityOfLuagge(): number | undefined {
    return this.pQuantityOfLuagge;
  }

  public set quantityOfLuagge(v: number | undefined) {
    this.pQuantityOfLuagge = v;
    this.$emit("update:quantityOfLuagge", this.pQuantityOfLuagge);
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

  public get selectedTypeOfPeople(): string | undefined {
    return this.pSelectedTypeOfPeople;
  }

  public set selectedTypeOfPeople(v: string | undefined) {
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
