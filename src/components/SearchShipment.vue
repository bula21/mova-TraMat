<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <!-- search transport-->
  <v-container>
    <input @keyup.enter="search()">
    <v-row
      class="my-2"
      dense
    >
      <h2>
        <v-icon
          class="mb-1"
          color="black"
        >
          mdi-feature-search
        </v-icon>
        Transport suchen
      </h2>
    </v-row>
    <SearchShipmentTextfieldInit
      :search.sync="searchChild"
      :search-category.sync="searchCategoryChild"
      @AddButtonClicked="add()"
      @MinusButtonClicked="remove()"
    />
    <div
      v-for="(textField, indx) in textFields"
      :key="indx"
    >
      <component
        :is="textField"
        :search.sync="searchChildAdd[indx]"
        :search-category.sync="searchCategoryChildAdd[indx]"
      />
    </div>
    <v-row class="pb-5 mt-n5">
      <v-col
        cols="12"
        class="text-center"
      >
        <v-btn
          color="blue"
          dark
          class="px-10"
          @click="search()"
        >
          Suchen
        </v-btn>
      </v-col>
    </v-row>
    <v-alert
      v-if="errorMessage.length > 0"
      type="error"
    >
      {{ errorMessage }}
    </v-alert>
    <v-row>
      <v-col cols="6">
        <h3 class="mb-5 mt-0">
          Ergebnisse
        </h3>
      </v-col>
      <v-col
        cols="3"
        class="text-right"
      >
        {{ "Begrenzen: " }}
      </v-col>
      <v-col
        cols="3"
        class="text-right"
      >
        <v-select
          v-model="limit"
          label="Limit"
          :items="limitTypes"
          dense
          class="mt-0"
          hint="!*-1 means without limit*!"
        />
      </v-col>
    </v-row>
    <!-- table results-->
    <v-data-table
      dense
      :headers="headers"
      :items="orders"
      item-key="idO"
      class="elevation-1"
      sort-by="id"
      multi-sort
    >
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="text-center"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="text-center"
          @click="printItem(item)"
        >
          mdi-printer
        </v-icon>
      </template>
    </v-data-table>
    <div class="text-right pt-2">
      <v-btn
        color="blue"
        dark
        @click="exportOrders()"
      >
        CSV-Export
        <v-icon
          right
          dark
        >
          mdi-table-arrow-right
        </v-icon>
      </v-btn>
    </div>
    <!-- edit order dialog huge..-->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="1100px"
    >
      <v-card class="px-6 py-4">
        <v-card-title class="pt-2 pl-0">
          <span class="headline">Transport bearbeiten</span>
        </v-card-title>
        <v-divider />
        <!-- order address -->
        <v-form
          ref="formFirst"
          v-model="validFormFirst"
          eager-validation
        >
          <v-row class="mt-0">
            <v-col
              :lg="4"
              :md="4"
              :sm="6"
            >
              <v-select
                v-model="state"
                label="Sendungsstatus*"
                :items="stateTypeArray"
                :rules="orderTypeRules"
                dense
                outlined
                class="mt-3"
                required
                @change="triggerUpdateState()"
              />
            </v-col>
          </v-row>
          <v-divider />
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
                max-width="600px"
              >
                <h3 class="mt-5">
                  Lieferadresse*
                </h3>
                <v-row class="mt-0">
                  <v-col
                    :lg="6"
                    :md="6"
                    :sm="6"
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
                  <v-col>
                    <v-textarea
                      v-model="deliveryAddress"
                      label="Lieferadresse"
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
          <v-row class="mt-n4">
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
                href="https://bula21.sharepoint.com/:b:/g/ET8U9pIWlRZBr8TBRva8LoMBt6yWOMfQcqZbztSiLokZ-g?e=bSO2KO"
                target="_blank"
              >Raster Lagerplatz</a>
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
        </v-form>
        <!-- order dates-->
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
          <!-- order positions-->
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
            cols="12"
            :sm="11"
            class="ml-5"
          >
            <div v-if="type === orderType[0]">
              <div
                v-for="(posGoods, indxGoods) in orderPositionsGoods"
                :key="indxGoods"
              >
                <component
                  :is="posGoods"
                  :currenpos="editedOrder.goods[indxGoods]"
                  :quantity.sync="editedOrder.goods[indxGoods].quantity"
                  :brutto-weight.sync="editedOrder.goods[indxGoods].grossWeight"
                  :netto-weight.sync="editedOrder.goods[indxGoods].netWeight"
                  :goods-descripttion.sync="editedOrder.goods[indxGoods].goodsDescription"
                  :length.sync="editedOrder.goods[indxGoods].length"
                  :width.sync="editedOrder.goods[indxGoods].width"
                  :height.sync="editedOrder.goods[indxGoods].height"
                  :marking.sync="editedOrder.goods[indxGoods].marking"
                  :value-c-h-f.sync="editedOrder.goods[indxGoods].valueChf"
                  :dangerous-goods.sync="editedOrder.goods[indxGoods].dangerousGoods"
                  :packing-unit-selected.sync="editedOrder.goods[indxGoods].packingUnit"
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
                  :currenpos="editedOrder.people[indxPeople]"
                  :quantity.sync="editedOrder.people[indxPeople].quantityOfPeople"
                  :brutto-weight.sync="editedOrder.people[indxPeople].weight"
                  :quantity-of-luagge.sync="editedOrder.people[indxPeople].quantityOfLuggage"
                  :goods-descripttion.sync="editedOrder.people[indxPeople].descriptionOfLuagge"
                  :length.sync="editedOrder.people[indxPeople].length"
                  :width.sync="editedOrder.people[indxPeople].width"
                  :height.sync="editedOrder.people[indxPeople].height"
                  :selected-type-of-people.sync="editedOrder.people[indxPeople].typePeople"
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
                  :currenpos="editedOrder.construction[indexCons]"
                  :quantity.sync="editedOrder.construction[indexCons].quantity"
                  :brutto-weight.sync="editedOrder.construction[indexCons].weight"
                  :goods-descripttion.sync="editedOrder.construction[indexCons].description"
                  :valid-form-const.sync="validFormConst[indexCons]"
                />
              </div>
            </div>
          </v-col>
        </v-row>
        <v-divider class="mt-4" />
        <!-- remarks order-->
        <v-row class="mt-n2">
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
        <v-row class="mt-n10">
          <v-col class="ml-2 ">
            <v-checkbox
              v-model="onlyDelivery"
              label="Nur Anlieferung (kein Transport durch BuLa)"
              color="red"
              hide-details
              @change="triggerUpdateDeliveryOnly()"
            />
          </v-col>
        </v-row>
        <v-divider class="mt-4" />
        <!-- actions order-->
        <v-card-actions class="mt-1">
          <v-spacer />
          <v-btn
            color="orange"
            text
            @click="close()"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="blue darken-2"
            text
            @click="save()"
          >
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Search Client -->
    <v-dialog
      v-model="dialogSearchClient"
      persistent
    >
      <v-card>
        <SearchCustomer
          @clientUpdate="updateSearchClients"
          @closeSearch="dialogSearchClient=false"
        />
      </v-card>
    </v-dialog>
    <!-- Dialog Warn not mova client -->
    <v-dialog
      v-model="dialogNotMova"
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
            @click="dialogNotMova = false"
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
    <!-- Dialog Warn Permissions-->
    <DialogPermissions
      :dialog-warn-permissions="warnPermissions"
      @closePermissions="closePermissions()"
    />
    <!-- Dialog Print -->
    <v-dialog
      v-model="dialogPrint"
      persistent
      max-width="1000px"
    >
      <v-card>
        <PrintTransportOrder
          :key="componentKey"
          :order="printOrder"
          @closePrint="closePrint()"
        />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SearchShipmentTextfieldInit from "@/components/subComponents/SearchShipmentTextfieldInit.vue";
import SearchShipmentTextfieldAdd from "@/components/subComponents/SearchShipmentTextfieldAdd.vue";
import NewShipmentGoods from "@/components/subComponents/NewShipmentGoods.vue";
import NewShipmentPeople from "@/components/subComponents/NewShipmentPeople.vue";
import NewShipmentConstruction from "@/components/subComponents/NewShipmentConstruction.vue";
import PrintTransportOrder from "@/components/subComponents/PrintTransportOrder.vue";
import Order from "@/model/Order";
import DirectusAPI from "@/services/DirectusAPI";
import ExportCSV from "@/services/ExportCSV";
import { format } from "fecha";
import PositionGoods from "@/model/PositionGoods";
import PositionPeople from "@/model/PositionPeople";
import PositionConstruction from "@/model/PositionConstruction";
import Client from "@/model/Client";
import SearchCustomer from "@/components/subComponents/SearchCustomer.vue";
import DialogPermissions from "@/components/subComponents/DialogPermissions.vue";
import { DIRECTUS_ROLES, ORDER_TYPE, TRP_TYP_CLIENT } from "./Const";
import { TrpOrder } from "@/services/TrpOrder";
import OrderDisplay from "@/model/OrderDisplay";

@Component({
  components: {
    SearchShipmentTextfieldInit,
    SearchShipmentTextfieldAdd,
    NewShipmentGoods,
    NewShipmentPeople,
    NewShipmentConstruction,
    SearchCustomer,
    PrintTransportOrder,
    DialogPermissions,
  },
})
export default class SearchShipment extends Vue {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  private textFields = [SearchShipmentTextfieldAdd];
  private searchChild = "";
  private searchCategoryChild = "";
  private searchChildAdd = [];
  private searchCategoryChildAdd = [];
  private componentKey = 0;
  private limit = 100;
  private limitTypes = [-1, 5, 50, 100, 200];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private orders: any = [{}];
  private printOrder = new Order();
  private editedOrder: TrpOrder = new Order();
  private orderTable: TrpOrder[] = [];
  private errorMessage = "";
  private dialog = false;
  private dialogNotMova = false;
  private dialogPrint = false;
  private dialogSearchClient = false;
  private dialogWarnOrder = false;
  private warnPermissions = false;
  private titleDialogOrder = "";
  private textDialogOrder = "";
  // formFirst
  private validFormFirst = true;
  // formSecond
  private validFormSecond = true;
  private validFormGoods = [true];
  private validFormPeople = [true];
  private validFormConst = [true];
  private orderPositionsGoods = [NewShipmentGoods];
  private orderPositionsPeople = [NewShipmentPeople];
  private orderPositionsConstruction = [NewShipmentConstruction];
  private orderType: string[] = [];
  private stateTypeFromIdToState = new Map();
  private stateTypeFromStateToId = new Map();
  private packagingUntisFromDesToId = new Map();
  private typePeopleFromDesToId = new Map();
  private typePeopleFromIdToDes = new Map();
  private stateTypeArray: string[] = [];
  private onlyDelivery = false;
  private state = "";
  private type = "";
  private searchClient = new Client();
  private pickupID = 0;
  private pickupAddress = "";
  private deliveryID = 0;
  private deliveryAddress = "";
  private principalID = 0;
  private principalAddress = "";
  private deliveryPhone = "";
  private anlagenID = 0;
  private anlagenDescription = "--";
  private rasterLagerplatz = "";
  private menuDatePickup = false;
  private menuDateDelivery = false;
  private datePickup = new Date().toISOString().substring(0, 10);
  private dateDelivery = new Date().toISOString().substring(0, 10);
  private pickupTime = "00:00";
  private deliveryTime = "00:00";
  private remarksTrpOrder = "";
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
    (v: any) =>
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v) ||
      "Wert ungültig (Format hh:mm)",
  ];

  private idRulesText = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: string) => {
      return !/^Kunden ID nicht vorhanden$/.test(v) || "ID ungültig";
    },
  ];

  private notRequired = true;

  private rasterLagerplatzRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      if (this.editedOrder.receiver?.type?.id === TRP_TYP_CLIENT.mova) {
        this.notRequired = false;
        return !!v || "Wert ist erforderlich";
      } else {
        this.notRequired = true;
        return true;
      }
    },
  ];

  private forceRerenderPrint(): void {
    this.componentKey += 1;
  }

  async mounted(): Promise<void> {
    window.addEventListener("keyup", this.handleEnter);

    const fetchStates = await DirectusAPI.fetchTrpState();

    fetchStates.forEach((value) => {
      this.stateTypeFromIdToState.set(value.id, value.state);
      this.stateTypeFromStateToId.set(value.state, value.id);
      this.stateTypeArray.push(value.state);
    });

    const featchPackaging = await DirectusAPI.fetchPackaging();

    featchPackaging.forEach((value) => {
      this.packagingUntisFromDesToId.set(
        value.abbreviation + "=" + value.description,
        value.id
      );
    });

    const typPeopleResp = await DirectusAPI.fetchTrpTypePeople();

    typPeopleResp.forEach((value) => {
      this.typePeopleFromDesToId.set(value.description, value.id);
      this.typePeopleFromIdToDes.set(value.id, value.description);
    });

    this.orderType.push(
      ORDER_TYPE.Warentransport,
      ORDER_TYPE.Personentransport,
      ORDER_TYPE["Bauleistung mit Fahrzeug"]
    );
  }

  destroyed(): void {
    window.removeEventListener("keyup", this.handleEnter);
  }

  private headers = [
    { text: "Actions", value: "actions", sortable: false },
    {
      text: "Order ID",
      align: "start",
      value: "id",
    },
    { text: "Status", value: "state" },
    { text: "delivery_date", value: "delivery_date" },
    { text: "pick_up_date", value: "pick_up_date" },
    { text: "Auftraggeber Name", value: "principal" },
    { text: "Auftraggeber ID", value: "principal_id" },
    { text: "Auftraggeber Email", value: "principal_email" },
    { text: "Ladeadresse Name", value: "shipper" },
    { text: "Ladeadresse Ort", value: "shipper_place" },
    { text: "Ladeadresse PLZ", value: "shipper_zip" },
    { text: "Lieferadresse Name", value: "receiver" },
    { text: "Lieferadresse Ort", value: "receiver_place" },
    { text: "Lieferadresse PLZ", value: "receiver_zip" },
    { text: "Gewicht kg", value: "weight" },
    { text: "M^3", value: "cbm" },
    { text: "Positionen", value: "pos" },
    { text: "Beschreibung Pos.", value: "posDescription" },
  ];

  private handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.search();
    }
  }

  private marginButtons(): string {
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

  add(): void {
    this.textFields.push(SearchShipmentTextfieldAdd);
    this.searchChildAdd.push();
    this.searchCategoryChildAdd.push();
  }

  remove(): void {
    this.textFields.splice(-1, 1);
    this.searchChildAdd.splice(-1, 1);
    this.searchCategoryChildAdd.splice(-1, 1);
  }

  async search(): Promise<void> {
    this.errorMessage = "";
    this.orderTable = [];
    this.orders = [];
    this.orderTable = await this.fetchSearchOrder();

    if (!(this.orderTable.length > 0)) {
      return;
    }

    this.orderTable.forEach((value: TrpOrder) => {
      let weight = 0;
      let pos = 0;
      let posDescription = "";
      let cbm = 0;

      weight = value.calcWeight();
      cbm = value.calcCBM();

      if (value.people!.length > 0) {
        value.people!.forEach((value) => {
          pos++;
          posDescription =
            posDescription +
            this.typePeopleFromIdToDes.get(value.typePeople) +
            "\n";
        });
      } else if (value.goods!.length > 0) {
        value.goods!.forEach((value) => {
          pos++;
          posDescription = posDescription + value.goodsDescription + "\n";
        });
      } else if (value.construction!.length > 0) {
        value.construction!.forEach((value) => {
          pos++;
          posDescription = posDescription + value.description + "\n";
        });
      }

      this.orders.push({
        id: value.id,
        state: value.state?.state,
        delivery_date: format(
          new Date(value.deliveryDate!),
          "YYYY-MM-DD HH:mm"
        ),
        pick_up_date: format(new Date(value.pickUpDate!), "YYYY-MM-DD HH:mm"),
        principal: value.principal?.name,
        principal_id: value.principal?.id,
        principal_email: value.principal?.email,
        shipper: value.shipper?.name,
        receiver: value.receiver?.name,
        shipper_place: value.shipper?.place,
        receiver_place: value.receiver?.place,
        shipper_zip: value.shipper?.zipcode,
        receiver_zip: value.receiver?.zipcode,
        weight: weight,
        cbm: cbm,
        pos: pos,
        posDescription: posDescription,
      });
    });
  }

  private async fetchSearchOrder(): Promise<TrpOrder[]> {
    let order: TrpOrder[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredDataValue: any[] = [];
    const filteredDataKey: string[] = [];

    if (this.searchChild && this.searchCategoryChild) {
      filteredDataKey.push(this.searchCategoryChild);
      filteredDataValue.push(this.searchChild);
    }

    for (let y = 0; this.searchCategoryChildAdd.length > y; y++) {
      if (this.searchCategoryChildAdd[y] && this.searchChildAdd[y]) {
        filteredDataKey.push(this.searchCategoryChildAdd[y]);
        filteredDataValue.push(this.searchChildAdd[y]);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    const orderId: number[] = [];
    const states: number[] = [];
    let principals: number[] = [];
    let receivers: number[] = [];
    let shippers: number[] = [];

    if (filteredDataKey.length > 0) {
      for (let i = 0; filteredDataKey.length > i; i++) {
        if (filteredDataKey[i] === "Order ID") {
          orderId.push(filteredDataValue[i]);
          filter.id = { in: orderId };
        }
        if (filteredDataKey[i] === "Status") {
          const actualState = this.stateTypeFromStateToId.get(
            filteredDataValue[i].toLowerCase().trim()
          );

          if (actualState) {
            states.push(actualState);
            filter.state = { in: states };
          }
        }
        if (filteredDataKey[i] === "Liefertermin") {
          if (filteredDataValue[i].length > 10) {
            try {
              const dateConvMinus = new Date(filteredDataValue[i].trim());
              dateConvMinus.setTime(dateConvMinus.getTime() - 1000 * 60);
              const dateConvPlus = new Date(filteredDataValue[i].trim());
              dateConvPlus.setTime(dateConvPlus.getTime() + 1000 * 60);

              const dateConvMinusFormat = format(
                dateConvMinus,
                "YYYY-MM-DD HH:mm"
              );
              const dateConvPlusFormat = format(
                dateConvPlus,
                "YYYY-MM-DD HH:mm"
              );

              filter.delivery_date = {
                between: [dateConvMinusFormat, dateConvPlusFormat],
              };
            } catch {
              this.errorMessage =
                "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          } else {
            try {
              const dateConv = format(
                new Date(filteredDataValue[i].trim()),
                "YYYY-MM-DD"
              );

              filter.delivery_date = {
                between: [dateConv + " 00:00", dateConv + " 23:59"],
              };
            } catch {
              this.errorMessage =
                "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          }
        }
        if (filteredDataKey[i] === "Ladetermin") {
          if (filteredDataValue[i].length > 10) {
            try {
              const dateConvMinus = new Date(filteredDataValue[i].trim());
              dateConvMinus.setTime(dateConvMinus.getTime() - 1000 * 60);
              const dateConvPlus = new Date(filteredDataValue[i].trim());
              dateConvPlus.setTime(dateConvPlus.getTime() + 1000 * 60);

              const dateConvMinusFormat = format(
                dateConvMinus,
                "YYYY-MM-DD HH:mm"
              );
              const dateConvPlusFormat = format(
                dateConvPlus,
                "YYYY-MM-DD HH:mm"
              );

              filter.pick_up_date = {
                between: [dateConvMinusFormat, dateConvPlusFormat],
              };
            } catch {
              this.errorMessage =
                "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          } else {
            try {
              const dateConv = format(
                new Date(filteredDataValue[i].trim()),
                "YYYY-MM-DD"
              );

              filter.pick_up_date = {
                between: [dateConv + " 00:00", dateConv + " 23:59"],
              };
            } catch {
              this.errorMessage =
                "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          }
        }
        if (filteredDataKey[i] === "Auftraggeber Firma/Name") {
          const fetchPrincipals = await DirectusAPI.getTrpClients(
            {
              filter: { name: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayPricipalsId: number[] = [];

          for (let j = 0; fetchPrincipals.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayPricipalsId.push(fetchPrincipals[j].id!);
          }

          if (arrayPricipalsId.length > 0) {
            principals = principals.concat(arrayPricipalsId);
            filter.principal = { in: principals };
          }
        }
        if (filteredDataKey[i] === "Auftraggeber ID") {
          principals.push(filteredDataValue[i].trim());
          filter.principal = { in: principals };
        }
        if (filteredDataKey[i] === "Auftraggeber Email") {
          const fetchPrincipals = await DirectusAPI.getTrpClients(
            {
              filter: { email: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayPricipalsId: number[] = [];

          for (let j = 0; fetchPrincipals.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayPricipalsId.push(fetchPrincipals[j].id!);
          }

          if (arrayPricipalsId.length > 0) {
            principals = principals.concat(arrayPricipalsId);
            filter.principal = { in: principals };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse Name") {
          const fetchReciever = await DirectusAPI.getTrpClients(
            {
              filter: { name: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRecieverId.push(fetchReciever[j].id!);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter.receiver = { in: receivers };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse Name") {
          const fetchShipper = await DirectusAPI.getTrpClients(
            {
              filter: { name: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayShipperId.push(fetchShipper[j].id!);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter.shipper = { in: shippers };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse Ort") {
          const fetchReciever = await DirectusAPI.getTrpClients(
            {
              filter: { place: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRecieverId.push(fetchReciever[j].id!);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter.receiver = { in: receivers };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse Ort") {
          const fetchShipper = await DirectusAPI.getTrpClients(
            {
              filter: { place: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.length > j; j++) {
            arrayShipperId.push(fetchShipper[j].id!);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter.shipper = { in: shippers };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse PLZ") {
          const fetchShipper = await DirectusAPI.getTrpClients(
            {
              filter: { zipcode: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayShipperId.push(fetchShipper[j].id!);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter.shipper = { in: shippers };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse PLZ") {
          const fetchReciever = await DirectusAPI.getTrpClients(
            {
              filter: { zipcode: { like: filteredDataValue[i].trim() } },
            },
            5
          );
          const arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRecieverId.push(fetchReciever[j].id!);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter.receiver = { in: receivers };
          }
        }
      }

      // Check if filter is empty
      if (Object.keys(filter).length === 0 && filter.constructor === Object) {
        return order;
      }

      order = await DirectusAPI.getTrpOrder(filter, this.limit);

      return order;
    }
    return order;
  }

  private printItem(item: OrderDisplay): void {
    if (
      this.$store.state.authorisation === DIRECTUS_ROLES.Public ||
      this.$store.state.authorisation === DIRECTUS_ROLES.Lagerbauten ||
      this.$store.state.authorisation === DIRECTUS_ROLES["Dienstleiter/in"] ||
      this.$store.state.authorisation === DIRECTUS_ROLES["Besteller/in"] ||
      this.$store.state.authorisation === DIRECTUS_ROLES.Ressortleitung ||
      this.$store.state.authorisation ===
        DIRECTUS_ROLES["Bereichsleitung Infra"] ||
      this.$store.state.authorisation === DIRECTUS_ROLES.Programmmaterial ||
      this.$store.state.authorisation === DIRECTUS_ROLES.Lagerplatz
    ) {
      this.warnPermissions = true;
      return;
    }

    this.forceRerenderPrint();
    let editedItems: TrpOrder[] = [];
    this.printOrder = new Order();
    this.editedOrder = new Order();

    if (item.id) {
      editedItems = this.orderTable.filter((value) => {
        return value.id === item.id;
      });
      // check if found item is not null
      if (editedItems[0]) {
        this.editedOrder = editedItems[0];
        this.printOrder = editedItems[0];

        this.$nextTick(() => {
          // still needed? --> probably not
          this.printOrder = this.editedOrder;
          this.dialogPrint = true;
        });
      }
    }
  }

  private editItem(item: Order): void {
    this.printOrder = new Order();
    this.editedOrder = new Order();
    let editedItems: TrpOrder[] = [];

    this.validFormGoods = [true];
    this.validFormPeople = [true];
    this.validFormConst = [true];
    this.orderPositionsGoods = [];
    this.orderPositionsPeople = [];
    this.orderPositionsConstruction = [];

    if (item.id) {
      editedItems = this.orderTable.filter((value) => {
        return value.id === item.id;
      });
      // check if found item is not null
      if (editedItems[0]) {
        this.editedOrder = editedItems[0];
        this.printOrder = editedItems[0];
        try {
          this.anlagenID = this.editedOrder.anlage!.id!;
        } catch {
          this.anlagenID = 0;
          this.editedOrder.anlage!.id = undefined;
        }
        try {
          this.rasterLagerplatz = this.editedOrder.rasterLagerplatz!;
        } catch {
          this.rasterLagerplatz = "";
        }

        this.pickupID = this.editedOrder.shipper!.id!;
        this.pickupAddress = this.printAdress(this.editedOrder.shipper!);
        this.deliveryID = this.editedOrder.receiver!.id!;
        this.deliveryAddress = this.printAdress(this.editedOrder.receiver!);
        this.principalID = this.editedOrder.principal!.id!;
        this.principalAddress = this.printAdress(this.editedOrder.principal!);
        this.datePickup = format(this.editedOrder.pickUpDate!, "YYYY-MM-DD");
        this.dateDelivery = format(
          this.editedOrder.deliveryDate!,
          "YYYY-MM-DD"
        );
        this.pickupTime = format(this.editedOrder.pickUpDate!, "HH:mm");
        this.deliveryTime = format(this.editedOrder.deliveryDate!, "HH:mm");
        this.remarksTrpOrder = this.editedOrder.remarks!;
        this.onlyDelivery = this.editedOrder.deliveryOnly!;
        this.state = this.stateTypeFromIdToState.get(this.editedOrder.state);

        if (this.editedOrder.goods) {
          if (this.editedOrder.goods.length > 0) {
            this.editedOrder.goods.forEach(() => {
              this.orderPositionsGoods.push(NewShipmentGoods);
            });
            this.type = this.orderType[0];
          }
        } else if (this.editedOrder.people) {
          if (this.editedOrder.people.length > 0) {
            this.editedOrder.people.forEach(() => {
              this.orderPositionsPeople.push(NewShipmentPeople);
            });
            this.type = this.orderType[1];
          }
        } else if (this.editedOrder.construction) {
          if (this.editedOrder.construction.length > 0) {
            this.editedOrder.construction.forEach(() => {
              this.orderPositionsConstruction.push(NewShipmentConstruction);
            });
            this.type = this.orderType[2];
          }
        }
        this.dialog = true;
        if (
          this.$store.state.authorisation === DIRECTUS_ROLES.Public ||
          this.$store.state.authorisation === DIRECTUS_ROLES.Lagerbauten ||
          this.$store.state.authorisation ===
            DIRECTUS_ROLES["Dienstleiter/in"] ||
          this.$store.state.authorisation === DIRECTUS_ROLES["Besteller/in"] ||
          this.$store.state.authorisation === DIRECTUS_ROLES.Ressortleitung ||
          this.$store.state.authorisation ===
            DIRECTUS_ROLES["Bereichsleitung Infra"] ||
          this.$store.state.authorisation === DIRECTUS_ROLES.Programmmaterial ||
          this.$store.state.authorisation === DIRECTUS_ROLES.Lagerplatz
        ) {
          if (this.state === "scheduled" || this.state === "checked") {
            this.warnPermissions = true;
          }
        }
      }
    }
  }

  private closePrint(): void {
    this.printOrder = new Order();
    this.dialogPrint = false;
  }

  private closePermissions(): void {
    this.warnPermissions = false;
  }

  private async close(): Promise<void> {
    (this.$refs.formFirst as Vue & { reset: () => boolean }).reset();
    (this.$refs.formSecond as Vue & { reset: () => boolean }).reset();
    await this.search();
    this.dialog = false;
  }

  private async save(): Promise<void> {
    (this.$refs.formFirst as Vue & { validate: () => boolean }).validate();
    (this.$refs.formSecond as Vue & { validate: () => boolean }).validate();

    let newVal = true;

    if (this.validFormFirst && this.validFormSecond) {
      if (this.type === this.orderType[0]) {
        this.validFormGoods.forEach((value) => {
          newVal = newVal && value;
        });
        if (newVal) {
          try {
            await this.persistOrder(this.editedOrder);
          } catch {
            this.titleDialogOrder = "Fehler";
            this.textDialogOrder =
              "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen. Ansonsten versuche es bitte später erneut und melde den Fehler via Slack #20_log_21_trp_requests.";
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

      if (this.type === this.orderType[1]) {
        this.validFormPeople.forEach((value) => {
          newVal = newVal && value;
        });
        if (newVal) {
          try {
            await this.persistOrder(this.editedOrder);
          } catch {
            this.titleDialogOrder = "Fehler";
            this.textDialogOrder =
              "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen. Ansonsten versuche es bitte später erneut und melde den Fehler via Slack #20_log_21_trp_requests.";
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
            await this.persistOrder(this.editedOrder);
          } catch {
            this.titleDialogOrder = "Fehler";
            this.textDialogOrder =
              "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen. Ansonsten versuche es bitte später erneut und melde den Fehler via Slack #20_log_21_trp_requests.";
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
    // goods
    if (
      this.type === this.orderType[0] &&
      order.goods!.length > 0 &&
      !(order.people!.length > 0) &&
      !(order.construction!.length > 0)
    ) {
      order.statusdirectus = this.stateTypeFromIdToState.get(order.state);
      const updateOrder = await DirectusAPI.updateTrpOrder(order);

      for (let i = 0; order.goods!.length > i; i++) {
        order.goods![i].statusdirectus = this.stateTypeFromIdToState.get(
          order.state
        );
        if (order.goods![i].id!) {
          await DirectusAPI.updateGoodsPos(
            order.goods![i],
            order.goods![i].id!,
            updateOrder.id!
          );
        } else {
          await DirectusAPI.createGoodsPosWithState(
            order.goods![i],
            updateOrder.id!
          );
        }
      }
      // people
    } else if (
      this.type === this.orderType[1] &&
      order.people!.length > 0 &&
      !(order.goods!.length > 0) &&
      !(order.construction!.length > 0)
    ) {
      order.statusdirectus = this.stateTypeFromIdToState.get(order.state);
      const updateOrder = await DirectusAPI.updateTrpOrder(order);

      for (let i = 0; order.people!.length > i; i++) {
        order.people![i].statusdirectus = this.stateTypeFromIdToState.get(
          order.state
        );
        if (order.people![i].id!) {
          await DirectusAPI.updatePeoplePos(
            order.people![i],
            order.people![i].id!,
            updateOrder.id!
          );
        } else {
          await DirectusAPI.createPeoplePosWithState(
            order.people![i],
            updateOrder.id!
          );
        }
      }
      // construction
    } else if (
      this.type === this.orderType[2] &&
      order.construction!.length > 0 &&
      !(order.goods!.length > 0) &&
      !(order.people!.length > 0)
    ) {
      order.statusdirectus = this.stateTypeFromIdToState.get(order.state);
      const updateOrder = await DirectusAPI.updateTrpOrder(order);

      for (let i = 0; order.construction!.length > i; i++) {
        order.construction![i].statusdirectus = this.stateTypeFromIdToState.get(
          order.state
        );
        if (order.construction![i].id!) {
          await DirectusAPI.updateConstruePos(
            order.construction![i],
            order.construction![i].id!,
            updateOrder.id!
          );
        } else {
          await DirectusAPI.createConstruPosWithState(
            order.construction![i],
            updateOrder.id!
          );
        }
      }
    } else {
      this.titleDialogOrder = "Fehlerhafte Eingaben";
      this.textDialogOrder =
        "Bitte Formular überprüfen! Sendungsarten dürfen nicht vermischt werden!";
      this.dialogWarnOrder = true;
      return;
    }

    // update table --> maybe extract this part...
    const idxOfChange = this.orders.indexOf((value: OrderDisplay) => {
      return value.id === order.id;
    });

    let weight = 0;
    let pos = 0;
    let posDescription = "";
    let cbm = 0;

    weight = order.calcWeight();
    cbm = order.calcCBM();

    if (order.people!.length > 0) {
      order.people!.forEach((value) => {
        pos++;
        posDescription =
          posDescription +
          this.typePeopleFromIdToDes.get(value.typePeople) +
          "\n";
      });
    } else if (order.goods!.length > 0) {
      order.goods!.forEach((value) => {
        pos++;
        posDescription = posDescription + value.goodsDescription + "\n";
      });
    } else if (order.construction!.length > 0) {
      order.construction!.forEach((value) => {
        pos++;
        posDescription = posDescription + value.description + "\n";
      });
    }

    this.orders[idxOfChange] = {
      id: order.id,
      state: order.state?.state,
      delivery_date: format(new Date(order.deliveryDate!), "YYYY-MM-DD HH:mm"),
      pick_up_date: format(new Date(order.pickUpDate!), "YYYY-MM-DD HH:mm"),
      principal: order.principal?.name,
      principal_id: order.principal?.id,
      principal_email: order.principal?.email,
      shipper: order.shipper?.name,
      receiver: order.receiver?.name,
      shipper_place: order.shipper?.place,
      receiver_place: order.receiver?.place,
      shipper_zip: order.shipper?.zipcode,
      receiver_zip: order.receiver?.zipcode,
      weight: weight,
      cbm: cbm,
      pos: pos,
      posDescription: posDescription,
    };

    this.dialog = false;
    (this.$refs.formFirst as Vue & { reset: () => boolean }).reset();
    (this.$refs.formSecond as Vue & { reset: () => boolean }).reset();
  }

  // ----------------- TODO -------------------------- //

  AddButtonClicked(): void {
    if (this.type === this.orderType[0]) {
      this.orderPositionsGoods.push(NewShipmentGoods);
      this.editedOrder.goods?.push(new PositionGoods());
      this.editedOrder.goods![
        this.editedOrder.goods!.length - 1
      ].dangerousGoods = false;
      this.validFormGoods.push(true);
    }
    if (this.type === this.orderType[1]) {
      this.orderPositionsPeople.push(NewShipmentPeople);
      this.editedOrder.people?.push(new PositionPeople());
      this.validFormPeople.push(true);
    }
    if (this.type === this.orderType[2]) {
      this.orderPositionsConstruction.push(NewShipmentConstruction);
      this.editedOrder.construction?.push(new PositionConstruction());
      this.validFormConst.push(true);
    }
  }

  MinusButtonClicked(): void {
    if (this.type === this.orderType[0]) {
      const deletedPos = this.editedOrder.goods!.pop();
      DirectusAPI.deleteOrderPos(deletedPos!.id!);
      this.orderPositionsGoods.splice(-1, 1);
      this.validFormGoods.splice(-1, 1);
    }

    // ----------------- TODO -------------------------- //

    if (this.type === this.orderType[1]) {
      DirectusAPI.directusAPI.deleteItem(
        "trp_order_people",

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.editedOrder.people.pop().id!
      );
      this.orderPositionsPeople.splice(-1, 1);
      // this.editedOrder.people.splice(-1, 1);
      this.validFormPeople.splice(-1, 1);
    }
    if (this.type === this.orderType[2]) {
      DirectusAPI.directusAPI.deleteItem(
        "trp_order_construction",

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.editedOrder.construction.pop().id!
      );
      this.orderPositionsConstruction.splice(-1, 1);
      // this.editedOrder.construction.splice(-1, 1);
      this.validFormConst.splice(-1, 1);
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

  private async updateSearchClients(client: Client) {
    this.searchClient = client;

    switch (this.$store.state.searchOption) {
      case "delivery":
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.deliveryID = this.searchClient.id!;
        this.deliveryAddress = this.printAdress(client);
        this.editedOrder.receiver = client;
        break;
      case "principal":
        if (this.searchClient.type === 1) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.editedOrder.principal = client;
          break;
        } else {
          this.dialogNotMova = true;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.editedOrder.principal = client;
          break;
        }
      case "pickup":
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.pickupID = this.searchClient.id!;
        this.pickupAddress = this.printAdress(client);
        this.editedOrder.shipper = client;
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

  private async triggerUdatePickupID(kindOfUpdate: string): void {
    let resp;

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
          this.editedOrder.receiver = this.searchClient;
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
            this.dialogNotMova = true;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.principalID = this.searchClient.id!;
            this.principalAddress = this.printAdress(this.searchClient);
          }
          this.editedOrder.principal = this.searchClient;
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
          this.editedOrder.shipper = this.searchClient;
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

          this.anlagenID = null;

          this.editedOrder.anlage = null;
        }
        if (resp?.data[0]) {
          this.anlagenDescription =
            resp.data[0].anlagenname + ", " + resp.data[0].standort;

          this.rasterLagerplatz = resp.data[0].standortcode;

          this.editedOrder.anlage = resp.data[0].id;

          this.editedOrder.rasterLagerplatz = resp.data[0].standortcode;
        } else {
          this.anlagenDescription = "Analgen ID nicht vorhanden";

          this.anlagenID = null;

          this.editedOrder.anlage = null;
        }
        break;
    }
  }

  private async exportOrders(): Promise<void> {
    if (!(this.orderTable.length > 0)) {
      return;
    }

    const collectionFields = await DirectusAPI.directusAPI.getFields(
      "trp_order",
      {
        fields: ["*.*.*"],
      }
    );

    const csv = ExportCSV.createCsvOrder(
      collectionFields.data,
      this.orderTable
    );
    ExportCSV.sendCsvDownload("orders.csv", csv);
    await this.search();
  }

  private triggerUpdateState(): void {
    const update = this.state;
    this.editedOrder.state = this.stateTypeFromStateToId.get(update);
  }

  private triggerUpdateDatePickUp(): void {
    const upade = this.datePickup + " " + this.pickupTime;
    const upadeDateTime = new Date(upade);
    this.editedOrder.pick_up_date = upadeDateTime;
  }

  private triggerUpdateDateDelivery(): void {
    const upade = this.dateDelivery + " " + this.deliveryTime;
    const upadeDateTime = new Date(upade);
    this.editedOrder.delivery_date = upadeDateTime;
  }

  private triggerUpdateRemarks(): void {
    const upade = this.remarksTrpOrder;
    this.editedOrder.remarks = upade;
  }

  private triggerUpdateRaster(): void {
    const upade = this.rasterLagerplatz;
    this.editedOrder.rasterLagerplatz = upade;
  }

  private triggerUpdateDeliveryOnly(): void {
    const upade = this.onlyDelivery;
    this.editedOrder.delivery_only = upade;
  }

  private async searchCustomer(searchOption: string): Promise<void> {
    this.$refs.formFirst.resetValidation();
    if (searchOption) {
      this.$nextTick(async () => {
        this.$store.commit("changeSearchOption", searchOption);
      });
      this.dialogSearchClient = true;
    }
  }
}
</script>
