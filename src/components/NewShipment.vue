<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<!-- First Window -->
<template>
  <v-container>
    <!-- Dialog Search Client -->
    <v-dialog
      v-model="dialog"
      persistent
    >
      <v-card>
        <SearchCustomer
          @clientUpdate="updateSearchClients"
          @closeSearch="dialog=false"
        />
      </v-card>
    </v-dialog>
    <v-row
      class="my-2"
      dense
    >
      <h2>
        <v-icon
          class="mb-1"
          color="black"
        >
          mdi-truck
        </v-icon>
        Transport Erfassen
      </h2>
    </v-row>
    <v-row class="my-1">
      <v-col
        :lg="8"
        :md="8"
        :sm="11"
      >
        <v-progress-linear
          :value="progress"
          height="22"
          striped
          color="deep-orange"
        >
          <strong>Fortschritt {{ Math.ceil(getProgress) }}%</strong>
        </v-progress-linear>
      </v-col>
    </v-row>
    <v-window 
      :key="componentKey"
      v-model="step"
    >
      <v-window-item :value="1">
        <v-form
          ref="formFirst"
          v-model="validFormFirst"
          eager-validation
        >
          <v-row>
            <v-col
              :lg="4"
              :md="4"
              :sm="6"
              :xs="6"
            >
              <v-card
                flat
                max-width="500px"
              >
                <h3 class="mt-3">
                  Ladeadresse*
                </h3>
                <v-row class="mt-0">
                  <v-col
                    :lg="6"
                    :md="6"
                    :sm="6"
                    :xs="6"
                  >
                    <v-text-field
                      v-model="pickupID"
                      :rules="idRules"
                      label="Kunden ID"
                      outlined
                      required
                      @change="triggerUdatePickupID('pickup')"
                    />
                  </v-col>
                  <v-col class="text-left">
                    <v-btn
                      :class="marginButtons()"
                      rounded
                      dark
                      color="blue"
                      @click="searchCustomer('pickup')"
                    >
                      Suchmenü
                      <v-icon
                        right
                        dark
                      >
                        mdi-account-search
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mt-n7">
                  <v-col>
                    <v-textarea
                      v-model="pickupAddress"
                      label="Ladeadresse"
                      filled
                      auto-grow
                      readonly
                      :rules="idRulesText"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col
              :lg="4"
              :md="4"
              :sm="5"
              :xs="5"
            >
              <v-card
                flat
                max-width="500px"
              >
                <h3 class="mt-3">
                  Auftraggeber*
                </h3>
                <v-row class="mt-0">
                  <v-col
                    :lg="6"
                    :md="6"
                    :sm="6"
                    :xs="6"
                  >
                    <v-text-field
                      v-model="principalID"
                      :rules="idRules"
                      label="Kunden ID"
                      outlined
                      required
                      @change="triggerUdatePickupID('principal')"
                    />
                  </v-col>
                  <v-col class="text-left">
                    <v-btn
                      :class="marginButtons()"
                      rounded
                      dark
                      color="blue"
                      @click="searchCustomer('principal')"
                    >
                      Suchmenü
                      <v-icon
                        right
                        dark
                      >
                        mdi-account-search
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mt-n7">
                  <v-col>
                    <v-textarea
                      v-model="principalAddress"
                      label="Auftraggeber"
                      filled
                      auto-grow
                      readonly
                      :rules="idRulesText"
                    />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              :lg="8"
              :md="8"
              :sm="11"
            >
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              :lg="8"
              :md="8"
              :sm="11"
            >
              <v-card
                flat
                max-width="1000px"
              >
                <h3 class="mt-5">
                  Lieferadresse*
                </h3>
                <v-row class="mt-0">
                  <v-col
                    :lg="4"
                    :md="4"
                    :sm="4"
                  >
                    <v-text-field
                      v-model="deliveryID"
                      :rules="idRules"
                      label="Kunden ID"
                      outlined
                      required
                      @change="triggerUdatePickupID('delivery')"
                    />
                  </v-col>
                  <v-col class="text-left">
                    <v-btn
                      class="mt-2"
                      rounded
                      dark
                      color="blue"
                      @click="searchCustomer('delivery')"
                    >
                      Suchmenü
                      <v-icon
                        right
                        dark
                      >
                        mdi-account-search
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mt-n7">
                  <v-col
                    :lg="6"
                    :md="6"
                    :xs="12"
                    :sm="12"
                  >
                    <v-textarea
                      v-model="deliveryAddress"
                      label="Lieferadresse"
                      filled
                      auto-grow
                      readonly
                      :rules="idRulesText"
                    />
                  </v-col>
                  <v-col
                    :lg="3"
                    :md="3"
                    :xs="3"
                    :sm="3"
                  >
                    <v-text-field
                      v-model="anlagenID"
                      label="Anlagen ID"
                      outlined
                      hint="Falls vorhanden"
                      persistent-hint
                      @change="triggerUdatePickupID('anlagen')"
                    />
                    <v-text-field
                      v-model="rasterLagerplatz"
                      label="Raster Lagerplatz"
                      hint="Falls vorhanden Bsp. 54H"
                      :rules="notRequired ? rasterLagerplatzRules : []"
                      :required="!notRequired"
                      persistent-hint
                      outlined
                      @change="triggerUpdateRaster()"
                    />
                  </v-col>
                  <v-col
                    :lg="3"
                    :md="3"
                    :xs="3"
                    :sm="3"
                  >
                    <v-subheader class="ml-n3">
                      {{ anlagenDescription }}
                    </v-subheader>
                    <v-spacer class="mt-13" />
                    <a
                      href="https://bula21.sharepoint.com/:f:/g/EqVc5B0NQUVJpOB4kHgj6UYBhcennFmyHEstYhyTEkYbcA?e=HE4Yc2"
                      target="_blank"
                    >Raster Lagerplatz</a>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              :lg="8"
              :md="8"
              :sm="11"
            >
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              :lg="4"
              :md="4"
              :sm="6"
              class="text-left"
            >
              <v-btn
                :disabled="step === 1"
                color="orange"
                dark
                @click="back()"
              >
                Zurück
              </v-btn>
            </v-col>
            <v-col
              :lg="4"
              :md="4"
              :sm="5"
              class="text-right"
            >
              <v-btn
                :disabled="step === 3"
                color="blue"
                dark
                @click="next()"
              >
                Weiter
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-window-item>
      <!-- Second Window -->
      <v-window-item :value="2">
        <v-form
          ref="formSecond"
          v-model="validFormSecond"
          eager-validation
        >
          <v-row class="mt-n3">
            <v-col
              :lg="2"
              :md="2"
              :sm="3"
              :xs="2"
            >
              <v-menu
                ref="menuDatePickup"
                v-model="menuDatePickup"
                :close-on-content-click="false"
                :return-value.sync="datePickup"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="datePickup"
                    label="Abholbereit ab*"
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="datePickup"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="menuDatePickup = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuDatePickup.save(datePickup), triggerUpdateDatePickUp()"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              :lg="2"
              :md="2"
              :sm="3"
              :xs="2"
            >
              <v-text-field
                v-model="pickupTime"
                :rules="timeRules"
                label="Bereit ab Uhrzeit*"
                prepend-icon="mdi-clock-time-four-outline"
                hint="Falls egal 00:00 einragen"
                @change="triggerUpdateDatePickUp()"
              />
            </v-col>
          </v-row>
          <v-row class="mt-n7">
            <v-col
              :lg="2"
              :md="2"
              :sm="3"
              :xs="2"
            >
              <v-menu
                ref="menuDateDelivery"
                v-model="menuDateDelivery"
                :close-on-content-click="false"
                :return-value.sync="dateDelivery"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateDelivery"
                    label="Zustellung bis*"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="dateDelivery"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="menuDateDelivery = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuDateDelivery.save(dateDelivery),triggerUpdateDateDelivery()"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col
              :lg="2"
              :md="2"
              :sm="3"
              :xs="2"
            >
              <v-text-field
                v-model="deliveryTime"
                label="Zustellen bis Uhrzeit*"
                :rules="timeRules"
                prepend-icon="mdi-clock-time-four-outline"
                hint="Falls egal 00:00 einragen"
                @change="triggerUpdateDateDelivery()"
              />
            </v-col>
          </v-row>
          <v-row class="mt-n3">
            <v-col
              :lg="4"
              :md="4"
              :sm="6"
            >
              <v-select
                v-model="type"
                label="Sendungsart*"
                :items="orderType"
                :rules="orderTypeRules"
                dense
                outlined
                class="mt-3"
                required
              />
            </v-col>
            <v-col
              :lg="4"
              :md="4"
              :sm="5"
            >
              <v-btn
                class="mt-2 mr-1"
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
                class="mt-2"
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
        <v-row>
          <v-col
            :lg="8"
            :md="8"
            :sm="11"
          >
            <div v-if="type === orderType[0]">
              <div
                v-for="(posGoods, indxGoods) in orderPositionsGoods"
                :key="indxGoods"
              >
                <component
                  :is="posGoods"
                  :currenpos="currentOrder.goods[indxGoods]"
                  :quantity.sync="currentOrder.goods[indxGoods].quantity"
                  :brutto-weight.sync="currentOrder.goods[indxGoods].gross_weight"
                  :netto-weight.sync="currentOrder.goods[indxGoods].net_weight"
                  :goods-descripttion.sync="currentOrder.goods[indxGoods].goods_description"
                  :length.sync="currentOrder.goods[indxGoods].length"
                  :width.sync="currentOrder.goods[indxGoods].width"
                  :height.sync="currentOrder.goods[indxGoods].height"
                  :marking.sync="currentOrder.goods[indxGoods].marking"
                  :value-c-h-f.sync="currentOrder.goods[indxGoods].value_chf"
                  :dangerous-goods.sync="currentOrder.goods[indxGoods].dangerous_goods"
                  :packing-unit-selected.sync="currentOrder.goods[indxGoods].packing_unit"
                  :valid-form-goods.sync="validFormGoods[indxGoods]"
                />
              </div>
            </div>
            <div v-else-if="type === orderType[1]">
              <div
                v-for="(posPeople, indxPeople) in orderPositionsPeople"
                :key="indxPeople"
              >
                <component
                  :is="posPeople"
                  :currenpos="currentOrder.people[indxPeople]"
                  :quantity.sync="currentOrder.people[indxPeople].quantity_of_people"
                  :brutto-weight.sync="currentOrder.people[indxPeople].weight"
                  :quantity-of-luagge.sync="currentOrder.people[indxPeople].quantity_of_luggage"
                  :goods-descripttion.sync="currentOrder.people[indxPeople].description_of_luagge"
                  :length.sync="currentOrder.people[indxPeople].length"
                  :width.sync="currentOrder.people[indxPeople].width"
                  :height.sync="currentOrder.people[indxPeople].height"
                  :selected-type-of-people.sync="currentOrder.people[indxPeople].type_people"
                  :valid-form-people.sync="validFormPeople[indxPeople]"
                />
              </div>
            </div>
            <div v-else-if="type === orderType[2]">
              <div
                v-for="(posCons, indexCons) in orderPositionsConstruction"
                :key="indexCons"
              >
                <component
                  :is="posCons"
                  :currenpos="currentOrder.construction[indexCons]"
                  :quantity.sync="currentOrder.construction[indexCons].quantity"
                  :brutto-weight.sync="currentOrder.construction[indexCons].weight"
                  :goods-descripttion.sync="currentOrder.construction[indexCons].description"
                  :valid-form-const.sync="validFormConst[indexCons]"
                />
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            :lg="8"
            :md="8"
            :sm="11"
          >
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            :lg="4"
            :md="4"
            :sm="6"
            class="text-left"
          >
            <v-btn
              :disabled="step === 1"
              color="orange"
              dark
              @click="back()"
            >
              Zurück
            </v-btn>
          </v-col>
          <v-col
            :lg="4"
            :md="4"
            :sm="5"
            class="text-right"
          >
            <v-btn
              :disabled="step === 3"
              color="blue"
              dark
              @click="next()"
            >
              Weiter
            </v-btn>
          </v-col>
        </v-row>
      </v-window-item>
      <!-- Third Window -->
      <v-window-item :value="3">
        <v-row class="mt-n7">
          <v-col
            :lg="8"
            :md="8"
            :sm="11"
          >
            <v-col cols="12">
              <v-textarea
                v-model="remarksTrpOrder"
                rows="4"
                label="Bemerkungen (z.B. Details Gefahrgut, Fixtermine, sonstige Infos etc.)"
                row-height="7"
                hint="Abhol-/Liefertermin gilt als frühster/spätester Abhol-/Liefertermin. Fixtermine bitte explizit erwähnen (gelten erst als definitiv, sobald bestätigt)."
                persistent-hint
                @change="triggerUpdateRemarks()"
              />
            </v-col>
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col
            :lg="4"
            :md="4"
            :sm="4"
            :xs="4"
          >
            <v-checkbox
              v-model="onlyDelivery"
              label="Nur Anlieferung / Abholung (kein Transport durch BuLa!)"
              color="red"
              hide-details
              @change="triggerUpdateDeliveryOnly()"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            :lg="8"
            :md="8"
            :sm="11"
          >
            <h3> Übersicht </h3>
          </v-col>
        </v-row>
        <v-row class="mt-n3">
          <v-col
            :lg="4"
            :md="4"
            :sm="6"
          >
            <v-col>
              ID: {{ pickupID }}
              <v-textarea
                v-model="pickupAddress"
                label="Ladeadresse"
                filled
                readonly
              />
            </v-col>
          </v-col>
          <v-col
            :lg="4"
            :md="4"
            :sm="5"
          >
            <v-col>
              ID: {{ principalID }}
              <v-textarea
                v-model="principalAddress"
                label="Auftraggeber"
                filled
                readonly
              />
            </v-col>
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col
            :lg="4"
            :md="4"
            :sm="6"
          >
            <v-col>
              ID: {{ deliveryID }}
              <v-textarea
                v-model="deliveryAddress"
                label="Lieferadresse"
                filled
                readonly
              />
              <v-textarea
                v-model="overViewAnlage"
                label="Anlage ID / Raster Lagerplatz"
                filled
                readonly
                rows="2"
              />
            </v-col>
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col
            :lg="8"
            :md="8"
            :sm="11"
          >
            <div>
              <v-col cols="9">
                Sendungsdetails
                <v-textarea
                  v-model="orderDetails"
                  label="Sendungsdetails"
                  filled
                  readonly
                  rows="16"
                />
              </v-col>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            :lg="8"
            :md="8"
            :sm="11"
          >
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            :lg="4"
            :md="4"
            :sm="6"
            class="text-left"
          >
            <v-btn
              :disabled="step === 1"
              color="orange"
              dark
              @click="back()"
            >
              Zurück
            </v-btn>
          </v-col>
          <v-col
            :lg="4"
            :md="4"
            :sm="5"
            class="text-right"
          >
            <v-btn
              color="success"
              dark
              @click="submit()"
            >
              Absenden
            </v-btn>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
    <!-- Dialog Warn not mova client -->
    <v-dialog
      v-model="dialogWarn"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Dies ist kein mova Kunde
        </v-card-title>
        <v-card-text>Bitte Kunde überprüfen! <br> Normalerweise sind nur mova Adressen unsere Kunden.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialogWarn = false"
          >
            Ok, verstanden!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Warn Order not complete or error-->
    <v-dialog
      v-model="dialogWarnOrder"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          {{ titleDialogOrder }}
        </v-card-title>
        <v-card-text> {{ textDialogOrder }} </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialogWarnOrder = false"
          >
            Ok, verstanden!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchCustomer from "@/components/subComponents/SearchCustomer.vue";
import NewShipmentGoods from "@/components/subComponents/NewShipmentGoods.vue";
import NewShipmentPeople from "@/components/subComponents/NewShipmentPeople.vue";
import NewShipmentConstruction from "@/components/subComponents/NewShipmentConstruction.vue";
import Client from "@/model/Client";
import Order from "@/model/Order";
import DirectusAPI from "@/services/DirectusAPI";
import PositionGoods from "@/model/PositionGoods";
import PositionPeople from "@/model/PositionPeople";
import PositionConstruction from "@/model/PositionConstruction";
import { format } from "fecha";

const countOfSteps = 3;

@Component({
  components: {
    SearchCustomer,
    NewShipmentGoods,
    NewShipmentPeople,
    NewShipmentConstruction,
  },
})
export default class NewShipment extends Vue {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  private dialog = false;
  // @ts-ignore
  private dialogWarn = false;
  // @ts-ignore
  private dialogWarnOrder = false;
  // @ts-ignore
  private titleDialogOrder = "";
  // @ts-ignore
  private textDialogOrder = "";
  private progress = 0.0;
  private step = 1;
  private orderPositionsGoods = [NewShipmentGoods];
  private orderPositionsPeople = [NewShipmentPeople];
  private orderPositionsConstruction = [NewShipmentConstruction];
  // @ts-ignore
  private searchClient = new Client();
  // @ts-ignore
  private pickupID: number = null;
  // @ts-ignore
  private pickupAddress = "";
  // @ts-ignore
  private deliveryID: number = null;
  // @ts-ignore
  private deliveryAddress = "";
  // @ts-ignore
  private principalID: number = null;
  // @ts-ignore
  private anlagenID: number = null;
  // @ts-ignore
  private anlagenDescription = "--";
  // @ts-ignore
  private rasterLagerplatz = "";
  // @ts-ignore
  private principalAddress = "";
  // @ts-ignore
  private orderType = [
    "Warentransport",
    "Personentransport",
    "Bauleistung mit Fahrzeug",
  ];
  // @ts-ignore
  private type = "";
  // @ts-ignore
  private menuDatePickup = false;
  // @ts-ignore
  private menuDateDelivery = false;
  // @ts-ignore
  private datePickup = new Date().toISOString().substring(0, 10);
  // @ts-ignore
  private dateDelivery = new Date().toISOString().substring(0, 10);
  // @ts-ignore
  private pickupTime = "00:00";
  // @ts-ignore
  private deliveryTime = "00:00";
  // @ts-ignore
  private onlyDelivery = false;
  // @ts-ignore
  private remarksTrpOrder = "";
  private currentOrder = new Order();
  // @ts-ignore
  private componentKey = 0;
  // @ts-ignore
  //formFirst
  private validFormFirst = true;
  // @ts-ignore
  //formSecond
  private validFormSecond = true;
  // @ts-ignore
  //formGoods
  private validFormGoods = [true];
  // @ts-ignore
  //formPeople
  private validFormPeople = [true];
  // @ts-ignore
  //formConst
  private validFormConst = [true];
  private packagingUntis = new Map();
  private typePeople = new Map();
  // @ts-ignore
  private idRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];
  // @ts-ignore
  private orderTypeRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];
  // @ts-ignore
  private timeRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v) ||
      "Wert ungültig (Format hh:mm)",
  ];
  // @ts-ignore
  private notRequired = true;
  // @ts-ignore
  private rasterLagerplatzRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      if (this.currentOrder.receiver?.type === 1) {
        this.notRequired = false;
        return !!v || "Wert ist erforderlich";
      } else {
        this.notRequired = true;
        return true;
      }
    }
  ];
  // @ts-ignore
  private idRulesText = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: string) => {
      return !/^Kunden ID nicht vorhanden$/.test(v) || "ID ungültig";
    },
  ];

  // @ts-ignore
  private marginButtons() {
    switch (this.$vuetify.breakpoint.name) {
      case "xs":
        return "mt-n10";
      case "sm":
        return "mt-n10";
      case "md":
        return "mt-n10";
      case "lg":
        return "mt-2";
      case "xl":
        return "mt-2";
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    window.addEventListener("keyup", this.handleEnter);

    const upadePick = this.datePickup + " " + this.pickupTime;
    const upadeDateTimePick = new Date(upadePick);
    this.currentOrder.pick_up_date = upadeDateTimePick;
    const upadeDeli = this.dateDelivery + " " + this.deliveryTime;
    const upadeDateTimeDeli = new Date(upadeDeli);
    this.currentOrder.delivery_date = upadeDateTimeDeli;
    this.currentOrder.goods[0].dangerous_goods = false;

    const data = await DirectusAPI.directusAPI.getItems("trp_packing_unit");
    data.data.forEach((value) => {
      this.packagingUntis.set(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value.abbreviation + "=" + value.description,
        // @ts-ignore
        value.id
      );
    });

    const typPeopleResp = await DirectusAPI.directusAPI.getItems(
      "trp_typ_people"
    );
    typPeopleResp.data.forEach((value) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.typePeople.set(value.description, value.id);
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  destroyed() {
    window.removeEventListener("keyup", this.handleEnter);
  }

  get getProgress(): number {
    this.progress = (this.step / countOfSteps) * 100;
    return this.progress;
  }

  private handleEnter(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      this.next();
    }
    if (event.key === "ArrowLeft") {
      this.back();
    }
  }
  // @ts-ignore
  private genereateDetails(): string {
    let orderDetails = "";

    switch (this.type) {
      case this.orderType[0]:
        orderDetails = this.printOrderDetails(
          this.currentOrder.delivery_date,
          this.currentOrder.pick_up_date,
          this.currentOrder.remarks,
          this.currentOrder.goods
        );
        break;

      case this.orderType[1]:
        orderDetails = this.printOrderDetails(
          this.currentOrder.delivery_date,
          this.currentOrder.pick_up_date,
          this.currentOrder.remarks,
          this.currentOrder.goods,
          this.currentOrder.people
        );
        break;

      case this.orderType[2]:
        orderDetails = this.printOrderDetails(
          this.currentOrder.delivery_date,
          this.currentOrder.pick_up_date,
          this.currentOrder.remarks,
          this.currentOrder.goods,
          this.currentOrder.people,
          this.currentOrder.construction
        );
        break;

      default:
        orderDetails = "";
        break;
    }
    return orderDetails;
  }

  printOrderDetails(
    delivery_date: Date | undefined,
    pick_up_date: Date | undefined,
    remarks: string | undefined,
    goods?: PositionGoods[] | undefined,
    people?: PositionPeople[] | undefined,
    construction?: PositionConstruction[] | undefined
  ): string {
    let details = "";
    const newLine = "\n";

    try {
      // @ts-ignore
      details =
        "Ladetermin: " + pick_up_date?.toLocaleString().substring(0, 16) + "\n";
      // @ts-ignore
      details =
        details +
        "Liefertermin: " +
        // @ts-ignore
        delivery_date.toLocaleString().substring(0, 16) +
        "\n";
      // @ts-ignore
      details = details + "Sendungstyp: " + this.type + "\n";
    } catch {
      details = "Ladetermin: " + "\n";
      details = details + "Liefertermin: " + "\n";
      details = details + "Sendungstyp: " + "\n";
    }

    let posDetails = "";

    if (this.orderType[0] === this.type && !!goods) {
      goods.forEach((element, idx) => {
        posDetails =
          posDetails +
          "*******Sendungs Position " +
          idx +
          "*******" +
          newLine +
          "Anzahl: " +
          element.quantity +
          newLine +
          "Verpackungseinheit: " +
          element.packing_unit +
          newLine +
          "Brutto Gewicht: " +
          element.gross_weight +
          newLine +
          "Netto Gewicht: " +
          element.net_weight +
          newLine +
          "Warenbeschreibung: " +
          element.goods_description +
          newLine +
          "Warenwert: " +
          element.value_chf +
          newLine +
          "Gefahrgut: " +
          element.dangerous_goods +
          newLine +
          "Markierung: " +
          element.marking +
          newLine +
          "Dims: " +
          element.length +
          "x" +
          element.width +
          "x" +
          element.height +
          newLine;
      });
    }

    if (this.orderType[1] === this.type && !!people) {
      people.forEach((element, idx) => {
        posDetails =
          posDetails +
          "*******Sendungs Position " +
          idx +
          "*******" +
          newLine +
          "Anzahl: " +
          element.quantity_of_people +
          newLine +
          "Typ Personen: " +
          element.type_people +
          newLine +
          "Anzahl Gepäck Stk.: " +
          element.quantity_of_luggage +
          newLine +
          "Warenbeschreibung: " +
          element.description_of_luagge +
          newLine +
          "Gewicht: " +
          element.weight +
          newLine +
          "Dims: " +
          element.length +
          "x" +
          element.width +
          "x" +
          element.height +
          newLine;
      });
    }

    if (this.orderType[2] === this.type && !!construction) {
      construction.forEach((element, idx) => {
        posDetails =
          posDetails +
          "*******Sendungs Position " +
          idx +
          "*******" +
          newLine +
          "Anzahl: " +
          element.quantity +
          newLine +
          "Beschreibung Bauleistung mit Fhrz.: " +
          element.description +
          newLine +
          "Gewicht: " +
          element.weight +
          newLine;
      });
    }

    details = details + posDetails;
    details = details + "**************" + newLine + "Bemerkungen: " + remarks;

    return details;
  }

  // @ts-ignore
  private next(): void {
    this.step++;
  }

  // @ts-ignore
  private back(): void {
    this.step--;
  }

  // @ts-ignore
  private async submit(): void {
    // @ts-ignore
    this.$refs.formFirst.validate();
    // @ts-ignore
    this.$refs.formSecond.validate();

    let newVal = true;

    if (this.validFormFirst && this.validFormSecond) {
      if (this.type === this.orderType[0]) {
        this.validFormGoods.forEach((value) => {
          newVal = newVal && value;
        });
        if (newVal) {
          try {
            await this.persistOrder(this.currentOrder);
          } catch {
            this.titleDialogOrder = "Fehler";
            this.textDialogOrder = "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen und kontrolliere, dass alle Felder korrekt ausgefüllt sind. Ansonsten versuche es bitte später erneut und melde den Fehler mit einem Screenshot via Slack #20_log_21_trp_requests.";            this.dialogWarnOrder = true;
          }
        } else {
          this.titleDialogOrder = "Fehlerhafte Eingaben";
          this.textDialogOrder =
            "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
          this.dialogWarnOrder = true;
        }
      }

      newVal = true;

      if (this.type === this.orderType[1]) {
        this.validFormPeople.forEach((value) => {
          newVal = newVal && value;
        });
        if (newVal) {
          try {
            await this.persistOrder(this.currentOrder);
          } catch {
            this.titleDialogOrder = "Fehler";
            this.textDialogOrder = "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen und kontrolliere, dass alle Felder korrekt ausgefüllt sind. Ansonsten versuche es bitte später erneut und melde den Fehler mit einem Screenshot via Slack #20_log_21_trp_requests.";
            this.dialogWarnOrder = true;
          }
        } else {
          this.titleDialogOrder = "Fehlerhafte Eingaben";
          this.textDialogOrder =
            "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
          this.dialogWarnOrder = true;
        }
      }

      newVal = true;

      if (this.type === this.orderType[2]) {
        this.validFormConst.forEach((value) => {
          newVal = newVal && value;
        });
        if (newVal) {
          try {
            await this.persistOrder(this.currentOrder);
          } catch {
            this.titleDialogOrder = "Fehler";
            this.textDialogOrder = "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen und kontrolliere, dass alle Felder korrekt ausgefüllt sind. Ansonsten versuche es bitte später erneut und melde den Fehler mit einem Screenshot via Slack #20_log_21_trp_requests.";
            this.dialogWarnOrder = true;
          }
        } else {
          this.titleDialogOrder = "Fehlerhafte Eingaben";
          this.textDialogOrder =
            "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
          this.dialogWarnOrder = true;
        }
      }
    } else {
      this.titleDialogOrder = "Fehlerhafte Eingaben";
      this.textDialogOrder =
        "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
      this.dialogWarnOrder = true;
    }
  }

  private async persistOrder(order: Order) {
    //goods
    if (this.type === this.orderType[0]) {
      const newOrder = await DirectusAPI.directusAPI.createItem("trp_order", {
        remarks: order.remarks,
        state: 1, //means new shipment
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        shipper: order.shipper!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        receiver: order.receiver!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        principal: order.principal!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        delivery_date: format(order.delivery_date!, "YYYY-MM-DD HH:mm:ss"),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pick_up_date: format(order.pick_up_date!, "YYYY-MM-DD HH:mm:ss"),
        anlage: order.anlage,
        raster_lagerplatz: order.rasterLagerplatz,
        delivery_only: order.delivery_only,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let quantity: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let packing_unit: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let goods_description: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let marking: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let length: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let height: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let width: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let gross_weight: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let net_weight: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value_chf: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let dangerous_goods: any[] = [];

      order.goods.forEach((value) => {
        quantity.push(value.quantity);
        goods_description.push(value.goods_description);
        packing_unit.push(this.packagingUntis.get(value.packing_unit));
        marking.push(value.marking);
        length.push(value.length);
        height.push(value.height);
        width.push(value.width);
        gross_weight.push(value.gross_weight);
        net_weight.push(value.net_weight);
        value_chf.push(value.value_chf);
        dangerous_goods.push(value.dangerous_goods);
      });

      for (let i = 0; order.goods.length > i; i++) {
        await DirectusAPI.directusAPI.createItem("trp_order_goods", {
          quantity: quantity[i],
          packing_unit: packing_unit[i],
          goods_description: goods_description[i],
          marking: marking[i],
          length: length[i],
          height: height[i],
          width: width[i],
          gross_weight: gross_weight[i],
          net_weight: net_weight[i],
          value_chf: value_chf[i],
          dangerous_goods: dangerous_goods[i],
          // @ts-ignore
          order: newOrder.data.id,
        });
      }
    }
    
    // people
    if (this.type === this.orderType[1]) {
      const newOrder = await DirectusAPI.directusAPI.createItem("trp_order", {
        remarks: order.remarks,
        state: 1, //means new shipment
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        shipper: order.shipper!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        receiver: order.receiver!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        principal: order.principal!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        delivery_date: format(order.delivery_date!, "YYYY-MM-DD HH:mm:ss"),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pick_up_date: format(order.pick_up_date!, "YYYY-MM-DD HH:mm:ss"),
        anlage: order.anlage,
        raster_lagerplatz: order.rasterLagerplatz,
        delivery_only: order.delivery_only,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let quantityPeople: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let typePeople: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let quantityLuagge: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let descriptionLuagge: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let length: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let height: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let width: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let weight: any[] = [];

      order.people.forEach((value) => {
        quantityPeople.push(value.quantity_of_people);
        typePeople.push(this.typePeople.get(value.type_people));
        quantityLuagge.push(value.quantity_of_luggage);
        descriptionLuagge.push(value.description_of_luagge);
        length.push(value.length);
        height.push(value.height);
        width.push(value.width);
        weight.push(value.weight);
      });

      for (let i = 0; order.people.length > i; i++) {
        await DirectusAPI.directusAPI.createItem("trp_order_people", {
          quantity_of_people: quantityPeople[i],
          type_people: typePeople[i],
          quantity_of_luggage: quantityLuagge[i],
          description_of_luagge: descriptionLuagge[i],
          length: length[i],
          height: height[i],
          width: width[i],
          weight: weight[i],
          // @ts-ignore
          order: newOrder.data.id,
        });
      }
    }

    // construction
    if (this.type === this.orderType[2]) {
      const newOrder = await DirectusAPI.directusAPI.createItem("trp_order", {
        remarks: order.remarks,
        state: 1, //means new shipment
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        shipper: order.shipper!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        receiver: order.receiver!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        principal: order.principal!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        delivery_date: format(order.delivery_date!, "YYYY-MM-DD HH:mm:ss"),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        pick_up_date: format(order.pick_up_date!, "YYYY-MM-DD HH:mm:ss"),
        anlage: order.anlage,
        raster_lagerplatz: order.rasterLagerplatz,
        delivery_only: order.delivery_only,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let quantity: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let weight: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let description: any[] = [];

      order.construction.forEach((value) => {
        quantity.push(value.quantity);
        weight.push(value.weight);
        description.push(value.description);
      });

      for (let i = 0; order.construction.length > i; i++) {
        await DirectusAPI.directusAPI.createItem("trp_order_construction", {
          quantity: quantity[i],
          weight: weight[i],
          description: description[i],
          // @ts-ignore
          order: newOrder.data.id,
        });
      }
    }
    this.titleDialogOrder = "Sendung erfolgreich erfasst";
    this.textDialogOrder =
      "Merci für deinen Auftrag. Eine Auftragsbestätigung folgt sobald wie möglich.";
    this.dialogWarnOrder = true;
    this.step = 1;
    // @ts-ignore
    this.$refs.formFirst.reset();
    // @ts-ignore
    this.$refs.formSecond.reset();


    // @ts-ignore
    this.searchClient = new Client();
    // @ts-ignore
    this.pickupID = null;
    // @ts-ignore
    this.pickupAddress = "";
    // @ts-ignore
    this.deliveryID = null;
    // @ts-ignore
    this.deliveryAddress = "";
    // @ts-ignore
    this.principalID = null;
    // @ts-ignore
    this.anlagenID = null;
    // @ts-ignore
    this.anlagenDescription = "--";
    // @ts-ignore
    this.rasterLagerplatz = "";
    // @ts-ignore
    this.principalAddress = "";
    // @ts-ignore
    this.remarksTrpOrder = "";
    // @ts-ignore
    this.datePickup = new Date().toISOString().substring(0, 10);
    // @ts-ignore
    this.dateDelivery = new Date().toISOString().substring(0, 10);
    // @ts-ignore
    this.pickupTime = "00:00";
    // @ts-ignore
    this.deliveryTime = "00:00";
    // @ts-ignore
    this.onlyDelivery = false;
    this.currentOrder = new Order();
    this.forceReRender();
    this.triggerUpdateDatePickUp();
    this.triggerUpdateDateDelivery();
  }

  private forceReRender(): void {
    this.componentKey += 1;
  }

  // @ts-ignore
  private async searchCustomer(searchOption: string): Promise<void> {
    // @ts-ignore
    this.$refs.formFirst.resetValidation();
    if (searchOption) {
      this.$nextTick(async () => {
        this.$store.commit("changeSearchOption", searchOption);
      });
      this.dialog = true;
    }
  }

  private printAdress(client: Client): string {
    let adress = "";
    adress =
      client.name +
      "\n" +
      client.street +
      "\n" +
      client.zipcode +
      " " +
      client.place +
      "\n" +
      client.phone +
      "\n" +
      client.email;
    return adress;
  }

  // @ts-ignore
  private async updateSearchClients(client: Client) {
    this.searchClient = client;

    switch (this.$store.state.searchOption) {
      case "delivery":
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.deliveryID = this.searchClient.id!;
        this.deliveryAddress = this.printAdress(client);
        this.currentOrder.receiver = client;
        break;
      case "principal":
        if (this.searchClient.type === 1) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.currentOrder.principal = client;
          break;
        } else {
          this.dialogWarn = true;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.currentOrder.principal = client;
          break;
        }
      case "pickup":
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.pickupID = this.searchClient.id!;
        this.pickupAddress = this.printAdress(client);
        this.currentOrder.shipper = client;
        break;
      case "undefined":
        this.deliveryID = 0;
        this.deliveryAddress = "";
        this.pickupID = 0;
        this.pickupAddress = "";
        this.principalID = 0;
        this.principalAddress = "";
        break;
    }
    this.$nextTick(async () => {
      this.$store.commit("changeSearchToEmpty");
      this.searchClient = new Client();
    });
  }

  // @ts-ignore
  private triggerUpdateDatePickUp(): void {
    const upade = this.datePickup + " " + this.pickupTime;
    const upadeDateTime = new Date(upade);
    this.currentOrder.pick_up_date = upadeDateTime;
  }

  // @ts-ignore
  private triggerUpdateDateDelivery(): void {
    const upade = this.dateDelivery + " " + this.deliveryTime;
    const upadeDateTime = new Date(upade);
    this.currentOrder.delivery_date = upadeDateTime;
  }

  // @ts-ignore
  private triggerUpdateRemarks(): void {
    const upade = this.remarksTrpOrder;
    this.currentOrder.remarks = upade;
  }

  // @ts-ignore
  private triggerUpdateRaster(): void {
    const upade = this.rasterLagerplatz;
    this.currentOrder.rasterLagerplatz = upade;
  }

  // @ts-ignore
  private triggerUpdateDeliveryOnly(): void {
    const upade = this.onlyDelivery;
    this.currentOrder.delivery_only = upade;
  }

  // @ts-ignore
  private async triggerUdatePickupID(kindOfUpdate: string): void {
    let resp;

    // @ts-ignore
    this.$refs.formFirst.resetValidation();

    switch (kindOfUpdate) {
      case "delivery":
        try {
          resp = await DirectusAPI.directusAPI.getItems("trp_client", {
            filter: {
              id: {
                eq: this.deliveryID,
              },
            },
          });
        } catch {
          this.deliveryAddress = "Kunden ID nicht vorhanden";
        }

        if (resp?.data[0]) {
          this.searchClient = Object.assign(new Client(), resp.data[0]);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.deliveryID = this.searchClient.id!;
          this.deliveryAddress = this.printAdress(this.searchClient);
          this.currentOrder.receiver = this.searchClient;
        } else {
          this.deliveryAddress = "Kunden ID nicht vorhanden";
        }
        break;

      case "principal":
        try {
          resp = await DirectusAPI.directusAPI.getItems("trp_client", {
            filter: {
              id: {
                eq: this.principalID,
              },
            },
          });
        } catch {
          this.principalAddress = "Kunden ID nicht vorhanden";
        }

        if (resp?.data[0]) {
          this.searchClient = Object.assign(new Client(), resp.data[0]);
          if (this.searchClient.type === 1) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.principalID = this.searchClient.id!;
            this.principalAddress = this.printAdress(this.searchClient);
          } else {
            this.dialogWarn = true;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.principalID = this.searchClient.id!;
            this.principalAddress = this.printAdress(this.searchClient);
          }
          this.currentOrder.principal = this.searchClient;
        } else {
          this.principalAddress = "Kunden ID nicht vorhanden";
        }
        break;

      case "pickup":
        try {
          resp = await DirectusAPI.directusAPI.getItems("trp_client", {
            filter: {
              id: {
                eq: this.pickupID,
              },
            },
          });
        } catch {
          this.pickupAddress = "Kunden ID nicht vorhanden";
        }
        if (resp?.data[0]) {
          this.searchClient = Object.assign(new Client(), resp.data[0]);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.pickupID = this.searchClient.id!;
          this.pickupAddress = this.printAdress(this.searchClient);
          this.currentOrder.shipper = this.searchClient;
        } else {
          this.pickupAddress = "Kunden ID nicht vorhanden";
        }
        break;

      case "anlagen":
        try {
          resp = await DirectusAPI.directusAPI.getItems("anlage", {
            filter: {
              anlagen_id: {
                eq: this.anlagenID,
              },
            },
          });
        } catch {
          this.anlagenDescription = "Analgen ID nicht vorhanden";
          //@ts-ignore
          this.anlagenID = null;
          //@ts-ignore
          this.currentOrder.anlage = null;
        }
        if (resp?.data[0]) {
          //@ts-ignore
          this.anlagenDescription = resp.data[0].anlagenname + ", " + resp.data[0].standort;
          //@ts-ignore
          this.rasterLagerplatz = resp.data[0].standortcode;
          //@ts-ignore
          this.currentOrder.anlage = resp.data[0].id;
          //@ts-ignore
          this.currentOrder.rasterLagerplatz = resp.data[0].standortcode;
        } else {
          this.anlagenDescription = "Analgen ID nicht vorhanden";
          //@ts-ignore
          this.anlagenID = null;
          //@ts-ignore
          this.currentOrder.anlage = null;
        }
        break;
    }
  }

  AddButtonClicked(): void {
    if (this.type === this.orderType[0]) {
      this.orderPositionsGoods.push(NewShipmentGoods);
      this.currentOrder.goods?.push(new PositionGoods());
      this.currentOrder.goods[
        this.currentOrder.goods.length - 1
      ].dangerous_goods = false;
      this.validFormGoods.push(true);
    }
    if (this.type === this.orderType[1]) {
      this.orderPositionsPeople.push(NewShipmentPeople);
      this.currentOrder.people?.push(new PositionPeople());
      this.validFormPeople.push(true);
    }
    if (this.type === this.orderType[2]) {
      this.orderPositionsConstruction.push(NewShipmentConstruction);
      this.currentOrder.construction?.push(new PositionConstruction());
      this.validFormConst.push(true);
    }
  }

  MinusButtonClicked(): void {
    if (this.type === this.orderType[0]) {
      this.orderPositionsGoods.splice(-1, 1);
      this.currentOrder.goods.splice(-1, 1);
      this.validFormGoods.splice(-1, 1);
    }
    if (this.type === this.orderType[1]) {
      this.orderPositionsPeople.splice(-1, 1);
      this.currentOrder.people.splice(-1, 1);
      this.validFormPeople.splice(-1, 1);
    }
    if (this.type === this.orderType[2]) {
      this.orderPositionsConstruction.splice(-1, 1);
      this.currentOrder.construction.splice(-1, 1);
      this.validFormConst.splice(-1, 1);
    }
  }

  get orderDetails(): string {
    return this.genereateDetails();
  }

  set orderDetails(v: string) {
    this.orderDetails = v;
  }

  get overViewAnlage(): string {
    return "Anlagen ID: " + this.anlagenID + "\nRaster Lagerplatz: " + this.rasterLagerplatz;
  }

  set overViewAnlage(v: string) {
    this.overViewAnlage = v;
  }
}
</script>
