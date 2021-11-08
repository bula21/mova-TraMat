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
                  :brutto-weight.sync="currentOrder.goods[indxGoods].grossWeight"
                  :netto-weight.sync="currentOrder.goods[indxGoods].netWeight"
                  :goods-descripttion.sync="currentOrder.goods[indxGoods].goodsDescription"
                  :length.sync="currentOrder.goods[indxGoods].length"
                  :width.sync="currentOrder.goods[indxGoods].width"
                  :height.sync="currentOrder.goods[indxGoods].height"
                  :marking.sync="currentOrder.goods[indxGoods].marking"
                  :value-c-h-f.sync="currentOrder.goods[indxGoods].valueChf"
                  :dangerous-goods.sync="currentOrder.goods[indxGoods].dangerousGoods"
                  :packing-unit-selected.sync="currentOrder.goods[indxGoods].packingUnit"
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
                  :quantity.sync="currentOrder.people[indxPeople].quantityOfPeople"
                  :brutto-weight.sync="currentOrder.people[indxPeople].weight"
                  :quantity-of-luagge.sync="currentOrder.people[indxPeople].quantityOfLuggage"
                  :goods-descripttion.sync="currentOrder.people[indxPeople].descriptionOfLuagge"
                  :length.sync="currentOrder.people[indxPeople].length"
                  :width.sync="currentOrder.people[indxPeople].width"
                  :height.sync="currentOrder.people[indxPeople].height"
                  :selected-type-of-people.sync="currentOrder.people[indxPeople].typePeople"
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
import Anlage from "@/model/Anlage";
import DirectusAPI from "@/services/DirectusAPI";
import PositionGoods from "@/model/PositionGoods";
import PositionPeople from "@/model/PositionPeople";
import PositionConstruction from "@/model/PositionConstruction";
import { ORDER_TYPE, TRP_TYP_CLIENT } from "./Const";
import { AnlageClass } from "@/services/TrpOrder";

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
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  private dialog = false;
  private dialogWarn = false;
  private dialogWarnOrder = false;
  private titleDialogOrder = "";
  private textDialogOrder = "";
  private progress = 0.0;
  private step = 1;
  private orderPositionsGoods = [NewShipmentGoods];
  private orderPositionsPeople = [NewShipmentPeople];
  private orderPositionsConstruction = [NewShipmentConstruction];
  private searchClient = new Client();
  private pickupID = 0;
  private pickupAddress = "";
  private deliveryID = 0;
  private deliveryAddress = "";
  private principalID = 0;
  private anlagenID = 0;
  private anlagenDescription = "--";
  private rasterLagerplatz: string | null = "";
  private principalAddress = "";
  private orderType: string[] = [];
  private type = "";
  private menuDatePickup = false;
  private menuDateDelivery = false;
  private datePickup = new Date().toISOString().substring(0, 10);
  private dateDelivery = new Date().toISOString().substring(0, 10);
  private pickupTime = "00:00";
  private deliveryTime = "00:00";
  private onlyDelivery = false;
  private remarksTrpOrder = "";
  private currentOrder = new Order();
  private componentKey = 0;
  // formFirst
  private validFormFirst = true;
  // formSecond
  private validFormSecond = true;
  // formGoods
  private validFormGoods = [true];
  // formPeople
  private validFormPeople = [true];
  // formConst
  private validFormConst = [true];
  private packagingUntis = new Map();
  private typePeople = new Map();
  private idRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  private orderTypeRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  private timeRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v)
      || "Wert ungültig (Format hh:mm)",
  ];

  private notRequired = true;
  private rasterLagerplatzRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      if (this.currentOrder.receiver?.type === TRP_TYP_CLIENT.mova) {
        this.notRequired = false;
        return !!v || "Wert ist erforderlich";
      }
      this.notRequired = true;
      return true;
    },
  ];

  private idRulesText = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: string) => !/^Kunden ID nicht vorhanden$/.test(v) || "ID ungültig",
  ];


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
      default:
        return "mt-n10";
    }
  }

  async mounted(): Promise<void> {
    window.addEventListener("keyup", this.handleEnter);

    const upadePick = `${this.datePickup} ${this.pickupTime}`;
    const upadeDateTimePick = new Date(upadePick);
    this.currentOrder.pickUpDate = upadeDateTimePick;
    const upadeDeli = `${this.dateDelivery} ${this.deliveryTime}`;
    const upadeDateTimeDeli = new Date(upadeDeli);
    this.currentOrder.deliveryDate = upadeDateTimeDeli;
    this.currentOrder.goods = [new PositionGoods()];
    this.currentOrder.goods[0].dangerousGoods = false;
    this.currentOrder.people = [new PositionPeople()];
    this.currentOrder.construction = [new PositionConstruction()];

    const data = await DirectusAPI.fetchPackaging();
    data.forEach((value) => {
      this.packagingUntis.set(
        `${value.abbreviation}=${value.description}`,
        value.id,
      );
    });

    const typPeopleResp = await DirectusAPI.fetchTrpTypePeople();
    typPeopleResp.forEach((value) => {
      this.typePeople.set(value.description, value.id);
    });

    this.orderType.push(ORDER_TYPE.Warentransport, ORDER_TYPE.Personentransport, ORDER_TYPE["Bauleistung mit Fahrzeug"]);
  }

  destroyed(): void {
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

  private genereateDetails(): string {
    let orderDetails = "";

    switch (this.type) {
      case ORDER_TYPE.Warentransport:
        orderDetails = this.printOrderDetails(
          this.currentOrder.deliveryDate,
          this.currentOrder.pickUpDate,
          this.currentOrder.remarks,
          this.currentOrder.goods,
        );
        break;

      case ORDER_TYPE.Personentransport:
        orderDetails = this.printOrderDetails(
          this.currentOrder.deliveryDate,
          this.currentOrder.pickUpDate,
          this.currentOrder.remarks,
          this.currentOrder.goods,
          this.currentOrder.people,
        );
        break;

      case ORDER_TYPE["Bauleistung mit Fahrzeug"]:
        orderDetails = this.printOrderDetails(
          this.currentOrder.deliveryDate,
          this.currentOrder.pickUpDate,
          this.currentOrder.remarks,
          this.currentOrder.goods,
          this.currentOrder.people,
          this.currentOrder.construction,
        );
        break;

      default:
        orderDetails = "";
        break;
    }
    return orderDetails;
  }

  printOrderDetails(
    deliveryDate: Date | undefined,
    pickupDate: Date | undefined,
    remarks: string | null | undefined,
    goods?: PositionGoods[] | undefined,
    people?: PositionPeople[] | undefined,
    construction?: PositionConstruction[] | undefined,
  ): string {
    let details = "";
    const newLine = "\n";

    try {
      details = `Ladetermin: ${pickupDate?.toLocaleString().substring(0, 16)}\n`;

      details = `${details}Liefertermin: ${deliveryDate?.toLocaleString().substring(0, 16)}\n`;

      details = `${details}Sendungstyp: ${this.type}\n`;
    } catch {
      details = "Ladetermin: \n";
      details = `${details}Liefertermin: "\n"`;
      details = `${details}Sendungstyp: "\n"`;
    }

    let posDetails = "";

    if (ORDER_TYPE.Warentransport === this.type && !!goods) {
      goods.forEach((element, idx) => {
        posDetails = `${posDetails}*******Sendungs Position ${idx}*******
        ${newLine}Anzahl: ${element.quantity}${newLine}Verpackungseinheit: ${element.packingUnit}${newLine}
        Brutto Gewicht: ${element.grossWeight}${newLine}Netto Gewicht: ${element.netWeight}${newLine}
        Warenbeschreibung: ${element.goodsDescription}${newLine}Warenwert: ${element.valueChf}${newLine}
        Gefahrgut: ${element.dangerousGoods}${newLine}Markierung: ${element.marking}${newLine}
        Dims: ${element.length}x${element.width}x${element.height}${newLine}`;
      });
    }

    if (ORDER_TYPE.Personentransport === this.type && !!people) {
      people.forEach((element, idx) => {
        posDetails = `${posDetails}*******Sendungs Position ${idx}*******
        ${newLine}Anzahl: ${element.quantityOfPeople}${newLine}Typ Personen: ${element.typePeople}
        ${newLine}Anzahl Gepäck Stk.: ${element.quantityOfLuggage}${newLine}
        Warenbeschreibung: ${element.descriptionOfLuagge}${newLine}Gewicht: ${element.weight}${newLine}
        Dims: ${element.length}x${element.width}x${element.height}${newLine}`;
      });
    }

    if (ORDER_TYPE["Bauleistung mit Fahrzeug"] === this.type && !!construction) {
      construction.forEach((element, idx) => {
        posDetails = `${posDetails}*******Sendungs Position ${idx}*******${newLine}Anzahl: ${element.quantity}
        ${newLine}Beschreibung Bauleistung mit Fhrz.: ${element.description}${newLine}Gewicht: ${element.weight}${newLine}`;
      });
    }

    details += posDetails;
    details = `${details}**************${newLine}Bemerkungen: ${remarks}`;

    return details;
  }


  private next(): void {
    this.step = +1;
  }


  private back(): void {
    this.step = -1;
  }

  private async submit(): Promise<void> {
    (this.$refs.formFirst as Vue & { validate: () => boolean; }).validate();
    (this.$refs.formSecond as Vue & { validate: () => boolean; }).validate();

    let newVal = true;

    if (this.validFormFirst && this.validFormSecond) {
      if (this.type === ORDER_TYPE.Warentransport) {
        this.validFormGoods.forEach((value) => {
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
          this.textDialogOrder = "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
          this.dialogWarnOrder = true;
        }
      }

      newVal = true;

      if (this.type === ORDER_TYPE.Personentransport) {
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
          this.textDialogOrder = "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
          this.dialogWarnOrder = true;
        }
      }

      newVal = true;

      if (this.type === ORDER_TYPE["Bauleistung mit Fahrzeug"]) {
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
          this.textDialogOrder = "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
          this.dialogWarnOrder = true;
        }
      }
    } else {
      this.titleDialogOrder = "Fehlerhafte Eingaben";
      this.textDialogOrder = "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
      this.dialogWarnOrder = true;
    }
  }

  private async persistOrder(order: Order) {
    // goods
    if (this.type === ORDER_TYPE.Warentransport) {
      const newOrder = await DirectusAPI.createTrpOrder(order);

      for (let i = 0; order.goods!.length > i; i++) {
        // eslint-disable-next-line no-await-in-loop
        await DirectusAPI.createGoodsPos(order.goods![i], newOrder.id!);
      }
    }

    // people
    if (this.type === ORDER_TYPE.Personentransport) {
      const newOrder = await DirectusAPI.createTrpOrder(order);

      for (let i = 0; order.people!.length > i; i++) {
        // eslint-disable-next-line no-await-in-loop
        await DirectusAPI.createPeoplePos(order.people![i], newOrder.id!);
      }
    }

    // construction
    if (this.type === ORDER_TYPE["Bauleistung mit Fahrzeug"]) {
      const newOrder = await DirectusAPI.createTrpOrder(order);

      for (let i = 0; order.construction!.length > i; i++) {
        // eslint-disable-next-line no-await-in-loop
        await DirectusAPI.createConstPos(order.construction![i], newOrder.id!);
      }
    }

    this.titleDialogOrder = "Sendung erfolgreich erfasst";
    this.textDialogOrder = "Merci für deinen Auftrag. Eine Auftragsbestätigung folgt sobald wie möglich.";
    this.dialogWarnOrder = true;
    this.step = 1;

    (this.$refs.formFirst as Vue & { reset: () => void; }).reset();
    (this.$refs.formSecond as Vue & { reset: () => void; }).reset();

    this.searchClient = new Client();
    this.pickupID = 0;
    this.pickupAddress = "";
    this.deliveryID = 0;
    this.deliveryAddress = "";
    this.principalID = 0;
    this.anlagenID = 0;
    this.anlagenDescription = "--";
    this.rasterLagerplatz = "";
    this.principalAddress = "";
    this.remarksTrpOrder = "";
    this.datePickup = new Date().toISOString().substring(0, 10);
    this.dateDelivery = new Date().toISOString().substring(0, 10);
    this.pickupTime = "00:00";
    this.deliveryTime = "00:00";
    this.onlyDelivery = false;
    this.currentOrder = new Order();
    this.forceReRender();
    this.triggerUpdateDatePickUp();
    this.triggerUpdateDateDelivery();
  }

  private forceReRender(): void {
    this.componentKey += 1;
  }

  private async searchCustomer(searchOption: string): Promise<void> {
    (this.$refs.formFirst as Vue & { resetValidation: () => void; }).resetValidation();
    if (searchOption) {
      this.$nextTick(async () => {
        this.$store.commit("changeSearchOption", searchOption);
      });
      this.dialog = true;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private printAdress(client: Client): string {
    let adress = "";
    adress = `${client.name}\n${client.street}\n${client.zipcode} ${client.place}\n${client.phone}\n${client.email}`;
    return adress;
  }

  private async updateSearchClients(client: Client) {
    this.searchClient = client;

    switch (this.$store.state.searchOption) {
      case "delivery":
        this.deliveryID = this.searchClient.id!;
        this.deliveryAddress = this.printAdress(client);
        this.currentOrder.receiver = client;
        break;
      case "principal":
        if (this.searchClient.type?.id === TRP_TYP_CLIENT.mova) {
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.currentOrder.principal = client;
          break;
        } else {
          this.dialogWarn = true;
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.currentOrder.principal = client;
          break;
        }
      case "pickup":
        this.pickupID = this.searchClient.id!;
        this.pickupAddress = this.printAdress(client);
        this.currentOrder.shipper = client;
        break;
      default:
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

  private triggerUpdateDatePickUp(): void {
    const upade = `${this.datePickup} ${this.pickupTime}`;
    const upadeDateTime = new Date(upade);
    this.currentOrder.pickUpDate = upadeDateTime;
  }

  private triggerUpdateDateDelivery(): void {
    const upade = `${this.dateDelivery} ${this.deliveryTime}`;
    const upadeDateTime = new Date(upade);
    this.currentOrder.deliveryDate = upadeDateTime;
  }

  private triggerUpdateRemarks(): void {
    const upade = this.remarksTrpOrder;
    this.currentOrder.remarks = upade;
  }

  private triggerUpdateRaster(): void {
    const upade = this.rasterLagerplatz;
    this.currentOrder.rasterLagerplatz = upade;
  }

  private triggerUpdateDeliveryOnly(): void {
    const upade = this.onlyDelivery;
    this.currentOrder.deliveryOnly = upade;
  }

  private async triggerUdatePickupID(kindOfUpdate: string): Promise<void> {
    let resp: Client[] = [];
    let resp2: AnlageClass[] = [];

    (this.$refs.formFirst as Vue & { resetValidation: () => void; }).resetValidation();

    switch (kindOfUpdate) {
      case "delivery":
        try {
          resp = await DirectusAPI.getTrpClients({
            filter: {
              id: {
                eq: this.deliveryID,
              },
            },
          }, 5);
        } catch {
          this.deliveryAddress = "Kunden ID nicht vorhanden";
        }

        if (resp[0].id!) {
          this.searchClient = resp[0];
          this.deliveryID = this.searchClient.id!;
          this.deliveryAddress = this.printAdress(this.searchClient);
          this.currentOrder.receiver = this.searchClient;
        } else {
          this.deliveryAddress = "Kunden ID nicht vorhanden";
        }
        break;

      case "principal":
        try {
          resp = await DirectusAPI.getTrpClients({
            filter: {
              id: {
                eq: this.principalID,
              },
            },
          }, 5);
        } catch {
          this.principalAddress = "Kunden ID nicht vorhanden";
        }

        if (resp[0].id!) {
          this.searchClient = resp[0];
          if (this.searchClient.type === TRP_TYP_CLIENT.mova) {
            this.principalID = this.searchClient.id!;
            this.principalAddress = this.printAdress(this.searchClient);
          } else {
            this.dialogWarn = true;
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
          resp = await DirectusAPI.getTrpClients({
            filter: {
              id: {
                eq: this.pickupID,
              },
            },
          }, 5);
        } catch {
          this.pickupAddress = "Kunden ID nicht vorhanden";
        }
        if (resp[0].id!) {
          this.searchClient = resp[0];
          this.pickupID = this.searchClient.id!;
          this.pickupAddress = this.printAdress(this.searchClient);
          this.currentOrder.shipper = this.searchClient;
        } else {
          this.pickupAddress = "Kunden ID nicht vorhanden";
        }
        break;

      case "anlagen":
        try {
          resp2 = await DirectusAPI.getAnlage({
            filter: {
              anlagen_id: {
                eq: this.anlagenID,
              },
            },
          }, 5);
        } catch {
          this.anlagenDescription = "Analgen ID nicht vorhanden";
          this.anlagenID = 0;
          this.currentOrder.anlage = null;
        }
        if (resp2[0].id!) {
          this.anlagenDescription = `${resp2[0].anlagenname}, ${resp2[0].standort}`;
          this.rasterLagerplatz = resp2[0].standortcode!;
          this.currentOrder.anlage = new Anlage();
          this.currentOrder.anlage = resp2[0];
          this.currentOrder.rasterLagerplatz = resp2[0].standortcode!;
        } else {
          this.anlagenDescription = "Analgen ID nicht vorhanden";
          this.anlagenID = 0;
          this.currentOrder.anlage = null;
        }
        break;

      default:
        this.anlagenDescription = "Analgen ID nicht vorhanden";
        this.anlagenID = 0;
        this.currentOrder.anlage = null;
        this.pickupAddress = "Kunden ID nicht vorhanden";
        this.principalAddress = "Kunden ID nicht vorhanden";
        this.deliveryAddress = "Kunden ID nicht vorhanden";
    }
  }

  AddButtonClicked(): void {
    if (this.type === ORDER_TYPE.Warentransport) {
      this.orderPositionsGoods.push(NewShipmentGoods);
      // eslint-disable-next-line no-unused-expressions
      this.currentOrder.goods?.push(new PositionGoods());
      this.currentOrder.goods![this.currentOrder.goods!.length - 1].dangerousGoods = false;
      this.validFormGoods.push(true);
    }
    if (this.type === ORDER_TYPE.Personentransport) {
      this.orderPositionsPeople.push(NewShipmentPeople);
      // eslint-disable-next-line no-unused-expressions
      this.currentOrder.people?.push(new PositionPeople());
      this.validFormPeople.push(true);
    }
    if (this.type === ORDER_TYPE["Bauleistung mit Fahrzeug"]) {
      this.orderPositionsConstruction.push(NewShipmentConstruction);
      // eslint-disable-next-line no-unused-expressions
      this.currentOrder.construction?.push(new PositionConstruction());
      this.validFormConst.push(true);
    }
  }

  MinusButtonClicked(): void {
    if (this.type === ORDER_TYPE.Warentransport) {
      this.orderPositionsGoods.splice(-1, 1);
      // eslint-disable-next-line no-unused-expressions
      this.currentOrder.goods?.splice(-1, 1);
      this.validFormGoods.splice(-1, 1);
    }
    if (this.type === ORDER_TYPE.Personentransport) {
      this.orderPositionsPeople.splice(-1, 1);
      // eslint-disable-next-line no-unused-expressions
      this.currentOrder.people?.splice(-1, 1);
      this.validFormPeople.splice(-1, 1);
    }
    if (this.type === ORDER_TYPE["Bauleistung mit Fahrzeug"]) {
      this.orderPositionsConstruction.splice(-1, 1);
      // eslint-disable-next-line no-unused-expressions
      this.currentOrder.construction?.splice(-1, 1);
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
    return `Anlagen ID: ${this.anlagenID}\nRaster Lagerplatz: ${this.rasterLagerplatz}`;
  }

  set overViewAnlage(v: string) {
    this.overViewAnlage = v;
  }
}
</script>
