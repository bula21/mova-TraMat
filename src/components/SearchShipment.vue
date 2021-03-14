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
                  :brutto-weight.sync="editedOrder.goods[indxGoods].gross_weight"
                  :netto-weight.sync="editedOrder.goods[indxGoods].net_weight"
                  :goods-descripttion.sync="editedOrder.goods[indxGoods].goods_description"
                  :length.sync="editedOrder.goods[indxGoods].length"
                  :width.sync="editedOrder.goods[indxGoods].width"
                  :height.sync="editedOrder.goods[indxGoods].height"
                  :marking.sync="editedOrder.goods[indxGoods].marking"
                  :value-c-h-f.sync="editedOrder.goods[indxGoods].value_chf"
                  :dangerous-goods.sync="editedOrder.goods[indxGoods].dangerous_goods"
                  :packing-unit-selected.sync="editedOrder.goods[indxGoods].packing_unit"
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
                  :quantity.sync="editedOrder.people[indxPeople].quantity_of_people"
                  :brutto-weight.sync="editedOrder.people[indxPeople].weight"
                  :quantity-of-luagge.sync="editedOrder.people[indxPeople].quantity_of_luggage"
                  :goods-descripttion.sync="editedOrder.people[indxPeople].description_of_luagge"
                  :length.sync="editedOrder.people[indxPeople].length"
                  :width.sync="editedOrder.people[indxPeople].width"
                  :height.sync="editedOrder.people[indxPeople].height"
                  :selected-type-of-people.sync="editedOrder.people[indxPeople].type_people"
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
        <v-divider />
        <!-- remarks order-->
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
        <v-divider />
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
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  private textFields = [SearchShipmentTextfieldAdd];
  private searchChild = "";
  private searchCategoryChild = "";
  private searchChildAdd = [];
  private searchCategoryChildAdd = [];
  // @ts-ignore
  private componentKey = 0;
  // @ts-ignore
  private limit = 100;
  // @ts-ignore
  private limitTypes = [-1, 5, 50, 100, 200];
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private orders: any = [{}];
  // @ts-ignore
  private editedItem = new Order();
  // @ts-ignore
  private printOrder = new Order();
  // @ts-ignore
  private editedOrder = new Order();
  private orderTable: Order[] = [];
  // @ts-ignore
  private errorMessage = "";
  // @ts-ignore
  private dialog = false;
  // @ts-ignore
  private dialogNotMova = false;
  // @ts-ignore
  private dialogPrint = false;
  // @ts-ignore
  private dialogSearchClient = false;
  // @ts-ignore
  private dialogWarnOrder = false;
  // @ts-ignore
  private warnPermissions = false;
  // @ts-ignore
  private titleDialogOrder = "";
  // @ts-ignore
  private textDialogOrder = "";
  // @ts-ignore
  //formFirst
  private validFormFirst = true;
  // @ts-ignore
  //formSecond
  private validFormSecond = true;
  private validFormGoods = [true];
  private validFormPeople = [true];
  private validFormConst = [true];
  private orderPositionsGoods = [NewShipmentGoods];
  private orderPositionsPeople = [NewShipmentPeople];
  private orderPositionsConstruction = [NewShipmentConstruction];
  // @ts-ignore
  private orderType = [
    "Warentransport",
    "Personentransport",
    "Bauleistung mit Fahrzeug",
  ];
  private stateTypeFromIdToState = new Map();
  private stateTypeFromStateToId = new Map();
  private packagingUntisFromDesToId = new Map();
  private typePeopleFromDesToId = new Map();
  // @ts-ts-ignore
  private stateTypeArray: string[] = [];
  // @ts-ignore
  private state = "";
  // @ts-ignore
  private type = "";
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
  private principalAddress = "";
  // @ts-ignore
  private deliveryPhone = "";
  // @ts-ignore
  private anlagenID: number = null;
  // @ts-ignore
  private anlagenDescription = "--";
  // @ts-ignore
  private rasterLagerplatz = "";
  // @ts-ignore
  private menuDatePickup = false;
  // @ts-ignore
  private menuDateDelivery = false;
  // @ts-ignore
  private datePickup: Date = new Date();
  // @ts-ignore
  private dateDelivery: Date = new Date();
  // @ts-ignore
  private pickupTime = "00:00";
  // @ts-ignore
  private deliveryTime = "00:00";
  // @ts-ignore
  private remarksTrpOrder = "";
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
  private idRulesText = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: string) => {
      return !/^Kunden ID nicht vorhanden$/.test(v) || "ID ungültig";
    },
  ];
  // @ts-ignore
  private notRequired = true;
  // @ts-ignore
  private rasterLagerplatzRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      if (this.editedOrder.receiver?.type === 1) {
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

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async mounted() {
    window.addEventListener("keyup", this.handleEnter);

    const fetchStates = await DirectusAPI.directusAPI.getItems("trp_state");

    fetchStates.data.forEach((value) => {
      // @ts-ignore
      this.stateTypeFromIdToState.set(value.id, value.state);
      // @ts-ignore
      this.stateTypeFromStateToId.set(value.state, value.id);
      // @ts-ignore
      this.stateTypeArray.push(value.state);
    });

    const featchPackaging = await DirectusAPI.directusAPI.getItems(
      "trp_packing_unit"
    );
    featchPackaging.data.forEach((value) => {
      this.packagingUntisFromDesToId.set(
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
      this.typePeopleFromDesToId.set(value.description, value.id);
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  destroyed() {
    window.removeEventListener("keyup", this.handleEnter);
  }

  // @ts-ignore
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
    this.orderTable.forEach((value: Order) => {
      let weight = 0;
      let pos = 0;
      let posDescription = "";
      let cbm = 0;

      if (value.people.length > 0) {
        value.people.forEach((value) => {
          // @ts-ignore
          weight = value.weight + weight;
          cbm =
            // @ts-ignore
            ((((value.length / 100) * value.height) / 100) * value.width) /
              100 +
            cbm;
          pos++;
          posDescription =
            // @ts-ignore
            posDescription + value.type_people.description + "\n";
        });
        // @ts-ignore
        cbm = cbm.toFixed(3);
      } else if (value.goods.length > 0) {
        value.goods.forEach((value) => {
          // @ts-ignore
          weight = value.gross_weight + weight;

          cbm =
            // @ts-ignore
            ((((value.length / 100) * value.height) / 100) * value.width) /
              100 +
            cbm;
          pos++;
          posDescription =
            // @ts-ignore
            posDescription + value.goods_description + "\n";
        });
        // @ts-ignore
        cbm = cbm.toFixed(3);
      } else if (value.construction.length > 0) {
        value.construction.forEach((value) => {
          // @ts-ignore
          weight = value.weight + weight;
          // @ts-ignore
          cbm = 0;
          pos++;
          posDescription =
            // @ts-ignore
            posDescription + value.description + "\n";
        });
      }

      this.orders.push({
        id: value.id,
        // @ts-ignore
        state: value.state.state,
        delivery_date: format(
          // @ts-ignore
          new Date(value.delivery_date),
          "YYYY-MM-DD HH:mm"
        ),
        // @ts-ignore
        pick_up_date: format(new Date(value.pick_up_date), "YYYY-MM-DD HH:mm"),
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

  // @ts-ignore
  private async fetchSearchOrder(): Promise<Order[]> {
    let order: Order[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let filteredDataValue: any[] = [];
    let filteredDataKey: string[] = [];

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
    let filter: any = {};
    let orderId: number[] = [];
    let states: number[] = [];
    let principals: number[] = [];
    let receivers: number[] = [];
    let shippers: number[] = [];

    if (filteredDataKey.length > 0) {
      for (let i = 0; filteredDataKey.length > i; i++) {
        if (filteredDataKey[i] === "Order ID") {
          orderId.push(filteredDataValue[i]);
          filter["id"] = { in: orderId };
        }
        if (filteredDataKey[i] === "Status") {
          const actualState = this.stateTypeFromStateToId.get(
            filteredDataValue[i].toLowerCase().trim()
          );

          if (actualState) {
            states.push(actualState);
            filter["state"] = { in: states };
          }
        }
        if (filteredDataKey[i] === "Liefertermin") {
          if (filteredDataValue[i].length > 10) {
            try {
              let dateConvMinus = new Date(filteredDataValue[i].trim());
              dateConvMinus.setTime(dateConvMinus.getTime() - 1000 * 60);
              let dateConvPlus = new Date(filteredDataValue[i].trim());
              dateConvPlus.setTime(dateConvPlus.getTime() + 1000 * 60);

              const dateConvMinusFormat = format(
                dateConvMinus,
                "YYYY-MM-DD HH:mm"
              );
              const dateConvPlusFormat = format(
                dateConvPlus,
                "YYYY-MM-DD HH:mm"
              );

              filter["delivery_date"] = {
                between: [dateConvMinusFormat, dateConvPlusFormat],
              };
            } catch {
              this.errorMessage =
                "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          } else {
            try {
              let dateConv;
              dateConv = format(
                new Date(filteredDataValue[i].trim()),
                "YYYY-MM-DD"
              );

              filter["delivery_date"] = {
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
              let dateConvMinus = new Date(filteredDataValue[i].trim());
              dateConvMinus.setTime(dateConvMinus.getTime() - 1000 * 60);
              let dateConvPlus = new Date(filteredDataValue[i].trim());
              dateConvPlus.setTime(dateConvPlus.getTime() + 1000 * 60);

              const dateConvMinusFormat = format(
                dateConvMinus,
                "YYYY-MM-DD HH:mm"
              );
              const dateConvPlusFormat = format(
                dateConvPlus,
                "YYYY-MM-DD HH:mm"
              );

              filter["pick_up_date"] = {
                between: [dateConvMinusFormat, dateConvPlusFormat],
              };
            } catch {
              this.errorMessage =
                "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          } else {
            try {
              let dateConv;
              dateConv = format(
                new Date(filteredDataValue[i].trim()),
                "YYYY-MM-DD"
              );

              filter["pick_up_date"] = {
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
          const fetchPrincipals = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { name: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayPricipalsId: number[] = [];

          for (let j = 0; fetchPrincipals.data.length > j; j++) {
            //@ts-ignore
            arrayPricipalsId.push(fetchPrincipals.data[j].id);
          }

          if (arrayPricipalsId.length > 0) {
            principals = principals.concat(arrayPricipalsId);
            filter["principal"] = { in: principals };
          }
        }
        if (filteredDataKey[i] === "Auftraggeber ID") {
          principals.push(filteredDataValue[i].trim());
          filter["principal"] = { in: principals };
        }
        if (filteredDataKey[i] === "Auftraggeber Email") {
          const fetchPrincipals = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { email: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayPricipalsId: number[] = [];

          for (let j = 0; fetchPrincipals.data.length > j; j++) {
            //@ts-ignore
            arrayPricipalsId.push(fetchPrincipals.data[j].id);
          }

          if (arrayPricipalsId.length > 0) {
            principals = principals.concat(arrayPricipalsId);
            filter["principal"] = { in: principals };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse Name") {
          const fetchReciever = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { name: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.data.length > j; j++) {
            //@ts-ignore
            arrayRecieverId.push(fetchReciever.data[j].id);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter["receiver"] = { in: receivers };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse Name") {
          const fetchShipper = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { name: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.data.length > j; j++) {
            //@ts-ignore
            arrayShipperId.push(fetchShipper.data[j].id);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter["shipper"] = { in: shippers };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse Ort") {
          const fetchReciever = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { place: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.data.length > j; j++) {
            //@ts-ignore
            arrayRecieverId.push(fetchReciever.data[i].id);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter["receiver"] = { in: receivers };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse Ort") {
          const fetchShipper = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { place: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.data.length > j; j++) {
            //@ts-ignore
            arrayShipperId.push(fetchShipper.data[i].id);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter["shipper"] = { in: shippers };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse PLZ") {
          const fetchShipper = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { zipcode: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.data.length > j; j++) {
            //@ts-ignore
            arrayShipperId.push(fetchShipper.data[i].id);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter["shipper"] = { in: shippers };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse PLZ") {
          const fetchReciever = await DirectusAPI.directusAPI.getItems(
            "trp_client",
            {
              filter: { zipcode: { like: filteredDataValue[i].trim() } },
            }
          );
          let arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.data.length > j; j++) {
            //@ts-ignore
            arrayRecieverId.push(fetchReciever.data[i].id);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter["receiver"] = { in: receivers };
          }
        }
      }

      //Check if filter is empty
      if (Object.keys(filter).length === 0 && filter.constructor === Object) {
        return order;
      }

      let response = await DirectusAPI.directusAPI.getItems("trp_order", {
        // @ts-ignore
        filter,
        limit: this.limit,
        fields: ["*.*.*.*"],
      });

      response.data.forEach((value) => {
        let currentClient = Object.assign(new Order(), value);
        order.push(currentClient);
      });
      return order;
    }
    return order;
  }

  //@ts-ignore
  private printItem(item: Order): void {
    if (
      this.$store.state.authorisation === "Public" ||
      this.$store.state.authorisation === "Lagerbauten" ||
      this.$store.state.authorisation === "Dienstleiter/in" ||
      this.$store.state.authorisation === "Besteller/in" ||
      this.$store.state.authorisation === "Ressortleitung" ||
      this.$store.state.authorisation === "Bereichsleitung Infra" ||
      this.$store.state.authorisation === "Lagerplatz"
    ) {
      this.warnPermissions = true;
      return;
    }

    this.forceRerenderPrint();
    this.printOrder = new Order();
    this.editedItem = new Order();
    this.editedOrder = new Order();

    if (item.id) {
      this.editedItem = item;

      //@ts-ignore
      this.editedOrder = this.orderTable.filter((value: unknown) => {
        //@ts-ignore
        return value.id === this.editedItem.id;
      });

      //@ts-ignore
      this.editedOrder = this.editedOrder[0];

      let convertedOrder = new Order();
      convertedOrder.id = this.editedOrder.id;
      //@ts-ignore
      convertedOrder.modified_on = new Date(this.editedOrder.modified_on);
      convertedOrder.receiver = new Client();
      convertedOrder.receiver.id = this.editedOrder.receiver?.id;
      //@ts-ignore
      convertedOrder.receiver.type = this.editedOrder.receiver?.type.id;
      convertedOrder.receiver.name = this.editedOrder.receiver?.name;
      convertedOrder.receiver.street = this.editedOrder.receiver?.street;
      convertedOrder.receiver.place = this.editedOrder.receiver?.place;
      convertedOrder.receiver.zipcode = this.editedOrder.receiver?.zipcode;
      convertedOrder.receiver.phone = this.editedOrder.receiver?.phone;
      convertedOrder.receiver.email = this.editedOrder.receiver?.email;
      convertedOrder.receiver.modified_on = new Date(
        //@ts-ignore
        this.editedOrder.receiver.modified_on
      );
      convertedOrder.receiver.created_on = new Date(
        //@ts-ignore
        this.editedOrder.receiver?.created_on
      );
      //@ts-ignore
      convertedOrder.receiver.modified_by = this.editedOrder.receiver?.modified_by.id;

      try {
        //@ts-ignore
        convertedOrder.anlage = this.editedOrder.anlage.id;
      } catch {
        convertedOrder.anlage = 0;
      }

      try {
        //@ts-ignore
        convertedOrder.rasterLagerplatz = this.editedOrder.anlage.standortcode;
      } catch {
        convertedOrder.rasterLagerplatz = "";
      }

      convertedOrder.principal = new Client();
      convertedOrder.principal.id = this.editedOrder.principal?.id;
      //@ts-ignore
      convertedOrder.principal.type = this.editedOrder.principal?.type.id;
      convertedOrder.principal.name = this.editedOrder.principal?.name;
      convertedOrder.principal.street = this.editedOrder.principal?.street;
      convertedOrder.principal.place = this.editedOrder.principal?.place;
      convertedOrder.principal.zipcode = this.editedOrder.principal?.zipcode;
      convertedOrder.principal.phone = this.editedOrder.principal?.phone;
      convertedOrder.principal.email = this.editedOrder.principal?.email;
      convertedOrder.principal.modified_on = new Date(
        //@ts-ignore
        this.editedOrder.principal?.modified_on
      );
      convertedOrder.principal.created_on = new Date(
        //@ts-ignore
        this.editedOrder.principal?.created_on
      );
      //@ts-ignore
      convertedOrder.principal.modified_by = this.editedOrder.principal?.modified_by.id;
      //@ts-ignore
      convertedOrder.delivery_date = new Date(this.editedOrder.delivery_date);
      //@ts-ignore
      convertedOrder.pick_up_date = new Date(this.editedOrder.pick_up_date);
      convertedOrder.tour = this.editedOrder.tour;
      //@ts-ignore
      convertedOrder.created_on = new Date(this.editedOrder.created_on);
      //@ts-ignore
      convertedOrder.modified_by = this.editedOrder.modified_by.id;
      convertedOrder.remarks = this.editedOrder.remarks;
      convertedOrder.people = [];
      this.editedOrder.people.forEach((element) => {
        convertedOrder.people.push(
          new PositionPeople(
            element.id,
            element.quantity_of_people,
            //@ts-ignore
            element.type_people.id,
            element.quantity_of_luggage,
            element.description_of_luagge,
            element.length,
            element.height,
            element.width,
            element.weight,
            //@ts-ignore
            element.order.id
          )
        );
      });
      convertedOrder.goods = [];
      this.editedOrder.goods.forEach((element) => {
        convertedOrder.goods.push(
          new PositionGoods(
            element.id,
            element.quantity,
            //@ts-ignore
            element.packing_unit.id,
            element.marking,
            element.goods_description,
            element.length,
            element.gross_weight,
            element.width,
            element.net_weight,
            element.value_chf,
            //@ts-ignore
            element.order.id,
            element.height,
            //@ts-ignore
            element.dangerous_goods
          )
        );
      });
      convertedOrder.construction = [];
      this.editedOrder.construction.forEach((element) => {
        convertedOrder.construction.push(
          new PositionConstruction(
            element.id,
            element.quantity,
            element.description,
            element.weight,
            //@ts-ignore
            element.order.id
          )
        );
      });
      //@ts-ignore
      convertedOrder.state = this.editedOrder.state.id;
      convertedOrder.shipper = new Client();
      convertedOrder.shipper.id = this.editedOrder.shipper?.id;
      //@ts-ignore
      convertedOrder.shipper.type = this.editedOrder.shipper?.type.id;
      convertedOrder.shipper.name = this.editedOrder.shipper?.name;
      convertedOrder.shipper.street = this.editedOrder.shipper?.street;
      convertedOrder.shipper.place = this.editedOrder.shipper?.place;
      convertedOrder.shipper.zipcode = this.editedOrder.shipper?.zipcode;
      convertedOrder.shipper.phone = this.editedOrder.shipper?.phone;
      convertedOrder.shipper.email = this.editedOrder.shipper?.email;
      convertedOrder.shipper.modified_on = new Date(
        //@ts-ignore
        this.editedOrder.shipper?.modified_on
      );
      convertedOrder.shipper.created_on = new Date(
        //@ts-ignore
        this.editedOrder.shipper?.created_on
      );
      //@ts-ignore
      convertedOrder.shipper.modified_by = this.editedOrder.shipper?.modified_by.id;

      this.editedOrder = convertedOrder;

      this.$nextTick(() => {
        this.printOrder = this.editedOrder;
        this.dialogPrint = true;
      });
    }
  }

  // @ts-ignore
  private editItem(item: Order): void {
    this.editedItem = new Order();
    this.editedOrder = new Order();

    this.validFormGoods = [true];
    this.validFormPeople = [true];
    this.validFormConst = [true];
    this.orderPositionsGoods = [];
    this.orderPositionsPeople = [];
    this.orderPositionsConstruction = [];

    if (item.id) {
      this.editedItem = item;

      //@ts-ignore
      this.editedOrder = this.orderTable.filter((value: unknown) => {
        //@ts-ignore
        return value.id === this.editedItem.id;
      });

      //@ts-ignore
      this.editedOrder = this.editedOrder[0];

      let convertedOrder = new Order();
      convertedOrder.id = this.editedOrder.id;
      //@ts-ignore
      convertedOrder.modified_on = new Date(this.editedOrder.modified_on);
      convertedOrder.receiver = new Client();
      convertedOrder.receiver.id = this.editedOrder.receiver?.id;
      //@ts-ignore
      convertedOrder.receiver.type = this.editedOrder.receiver?.type.id;
      convertedOrder.receiver.name = this.editedOrder.receiver?.name;
      convertedOrder.receiver.street = this.editedOrder.receiver?.street;
      convertedOrder.receiver.place = this.editedOrder.receiver?.place;
      convertedOrder.receiver.zipcode = this.editedOrder.receiver?.zipcode;
      convertedOrder.receiver.phone = this.editedOrder.receiver?.phone;
      convertedOrder.receiver.email = this.editedOrder.receiver?.email;
      convertedOrder.receiver.modified_on = new Date(
        //@ts-ignore
        this.editedOrder.receiver.modified_on
      );
      convertedOrder.receiver.created_on = new Date(
        //@ts-ignore
        this.editedOrder.receiver?.created_on
      );
      //@ts-ignore
      convertedOrder.receiver.modified_by = this.editedOrder.receiver?.modified_by.id;

      try {
        //@ts-ignore
        convertedOrder.anlage = this.editedOrder.anlage.id;

        DirectusAPI.directusAPI
          .getItems("anlage", {
            filter: {
              id: {
                eq: convertedOrder.anlage,
              },
            },
          })
          .then((resp) => {
            //@ts-ignore
            this.anlagenID = resp.data[0].anlagen_id;
          });
      } catch {
        convertedOrder.anlage = 0;
      }

      try {
        //@ts-ignore
        convertedOrder.rasterLagerplatz = this.editedOrder.anlage.standortcode;
      } catch {
        convertedOrder.rasterLagerplatz = "";
      }

      convertedOrder.principal = new Client();
      convertedOrder.principal.id = this.editedOrder.principal?.id;
      //@ts-ignore
      convertedOrder.principal.type = this.editedOrder.principal?.type.id;
      convertedOrder.principal.name = this.editedOrder.principal?.name;
      convertedOrder.principal.street = this.editedOrder.principal?.street;
      convertedOrder.principal.place = this.editedOrder.principal?.place;
      convertedOrder.principal.zipcode = this.editedOrder.principal?.zipcode;
      convertedOrder.principal.phone = this.editedOrder.principal?.phone;
      convertedOrder.principal.email = this.editedOrder.principal?.email;
      convertedOrder.principal.modified_on = new Date(
        //@ts-ignore
        this.editedOrder.principal?.modified_on
      );
      convertedOrder.principal.created_on = new Date(
        //@ts-ignore
        this.editedOrder.principal?.created_on
      );
      //@ts-ignore
      convertedOrder.principal.modified_by = this.editedOrder.principal?.modified_by.id;
      //@ts-ignore
      convertedOrder.delivery_date = new Date(this.editedOrder.delivery_date);
      //@ts-ignore
      convertedOrder.pick_up_date = new Date(this.editedOrder.pick_up_date);
      convertedOrder.tour = this.editedOrder.tour;
      //@ts-ignore
      convertedOrder.created_on = new Date(this.editedOrder.created_on);
      //@ts-ignore
      convertedOrder.modified_by = this.editedOrder.modified_by.id;
      convertedOrder.remarks = this.editedOrder.remarks;
      convertedOrder.people = [];
      this.editedOrder.people.forEach((element) => {
        convertedOrder.people.push(
          new PositionPeople(
            element.id,
            element.quantity_of_people,
            //@ts-ignore
            element.type_people.id,
            element.quantity_of_luggage,
            element.description_of_luagge,
            element.length,
            element.height,
            element.width,
            element.weight,
            //@ts-ignore
            element.order.id
          )
        );
      });
      convertedOrder.goods = [];
      this.editedOrder.goods.forEach((element) => {
        convertedOrder.goods.push(
          new PositionGoods(
            element.id,
            element.quantity,
            //@ts-ignore
            element.packing_unit.id,
            element.marking,
            element.goods_description,
            element.length,
            element.gross_weight,
            element.width,
            element.net_weight,
            element.value_chf,
            //@ts-ignore
            element.order.id,
            element.height,
            //@ts-ignore
            element.dangerous_goods
          )
        );
      });
      convertedOrder.construction = [];
      this.editedOrder.construction.forEach((element) => {
        convertedOrder.construction.push(
          new PositionConstruction(
            element.id,
            element.quantity,
            element.description,
            element.weight,
            //@ts-ignore
            element.order.id
          )
        );
      });
      //@ts-ignore
      convertedOrder.state = this.editedOrder.state.id;
      convertedOrder.shipper = new Client();
      convertedOrder.shipper.id = this.editedOrder.shipper?.id;
      //@ts-ignore
      convertedOrder.shipper.type = this.editedOrder.shipper?.type.id;
      convertedOrder.shipper.name = this.editedOrder.shipper?.name;
      convertedOrder.shipper.street = this.editedOrder.shipper?.street;
      convertedOrder.shipper.place = this.editedOrder.shipper?.place;
      convertedOrder.shipper.zipcode = this.editedOrder.shipper?.zipcode;
      convertedOrder.shipper.phone = this.editedOrder.shipper?.phone;
      convertedOrder.shipper.email = this.editedOrder.shipper?.email;
      convertedOrder.shipper.modified_on = new Date(
        //@ts-ignore
        this.editedOrder.shipper?.modified_on
      );
      convertedOrder.shipper.created_on = new Date(
        //@ts-ignore
        this.editedOrder.shipper?.created_on
      );
      //@ts-ignore
      convertedOrder.shipper.modified_by = this.editedOrder.shipper?.modified_by.id;

      this.editedOrder = convertedOrder;

      //@ts-ignore
      this.pickupID = this.editedOrder.shipper?.id;
      //@ts-ignore
      this.pickupAddress = this.printAdress(this.editedOrder.shipper);
      //@ts-ignore
      this.deliveryID = this.editedOrder.receiver.id;
      //@ts-ignore
      this.deliveryAddress = this.printAdress(this.editedOrder.receiver);
      //@ts-ignore
      this.rasterLagerplatz = this.editedOrder.rasterLagerplatz;
      //@ts-ignore
      this.principalID = this.editedOrder.principal?.id;
      //@ts-ignore
      this.principalAddress = this.printAdress(this.editedOrder.principal);
      //@ts-ignore
      this.datePickup = format(this.editedOrder.pick_up_date, "YYYY-MM-DD");
      //@ts-ignore
      this.dateDelivery = format(this.editedOrder.delivery_date, "YYYY-MM-DD");
      // @ts-ignore
      this.pickupTime = format(this.editedOrder.pick_up_date, "HH:mm");
      // @ts-ignore
      this.deliveryTime = format(this.editedOrder.delivery_date, "HH:mm");
      // @ts-ignore
      this.remarksTrpOrder = this.editedOrder.remarks;
      this.state = this.stateTypeFromIdToState.get(this.editedOrder.state);

      if (this.editedOrder.goods.length > 0) {
        this.editedOrder.goods.forEach(() => {
          this.orderPositionsGoods.push(NewShipmentGoods);
        });
        this.type = this.orderType[0];
      } else if (this.editedOrder.people.length > 0) {
        this.editedOrder.people.forEach(() => {
          this.orderPositionsPeople.push(NewShipmentPeople);
        });
        this.type = this.orderType[1];
      } else if (this.editedOrder.construction.length > 0) {
        this.editedOrder.construction.forEach(() => {
          this.orderPositionsConstruction.push(NewShipmentConstruction);
        });
        this.type = this.orderType[2];
      }
      this.dialog = true;
      if (
        this.$store.state.authorisation === "Public" ||
        this.$store.state.authorisation === "Lagerbauten" ||
        this.$store.state.authorisation === "Dienstleiter/in" ||
        this.$store.state.authorisation === "Besteller/in" ||
        this.$store.state.authorisation === "Ressortleitung" ||
        this.$store.state.authorisation === "Bereichsleitung Infra" ||
        this.$store.state.authorisation === "Lagerplatz"
      ) {
        this.warnPermissions = true;
      }
    }
  }

  // @ts-ignore
  private closePrint(): void {
    this.printOrder = new Order();
    this.dialogPrint = false;
  }

  // @ts-ignore
  private closePermissions(): void {
    this.warnPermissions = false;
  }

  // @ts-ignore
  private async close(): Promise<void> {
    // @ts-ignore
    this.$refs.formFirst.reset();
    // @ts-ignore
    this.$refs.formSecond.reset();
    await this.search();
    this.dialog = false;
  }

  // @ts-ignore
  private async save(): Promise<void> {
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
            await this.persistOrder(this.editedOrder);
          } catch {
            this.titleDialogOrder = "Unerwarteter Fehler";
            this.textDialogOrder =
              "Bitte versuche es später nocheinmal oder melde den Fehler via Slack #20_log_21_trp_requests.";
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
            this.titleDialogOrder = "Unerwarteter Fehler";
            this.textDialogOrder =
              "Bitte versuche es später nocheinmal oder melde den Fehler via Slack #20_log_21_trp_requests.";
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
            this.titleDialogOrder = "Unerwarteter Fehler";
            this.textDialogOrder =
              "Bitte versuche es später nocheinmal oder melde den Fehler via Slack #20_log_21_trp_requests.";
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
    if (
      this.type === this.orderType[0] &&
      order.goods.length > 0 &&
      !(order.people.length > 0) &&
      !(order.construction.length > 0)
    ) {
      const updateOrder = await DirectusAPI.directusAPI.updateItem(
        "trp_order",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        order.id!,
        {
          remarks: order.remarks,
          state: this.stateTypeFromStateToId.get(order.state),
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
        }
      );

      let idPos: number[] = [];
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
        // @ts-ignore
        if (value.id) {
          idPos.push(value.id);
        } else {
          idPos.push(0);
        }
        quantity.push(value.quantity);
        goods_description.push(value.goods_description);
        packing_unit.push(
          this.packagingUntisFromDesToId.get(value.packing_unit)
        );
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
        if (idPos[i] !== 0) {
          await DirectusAPI.directusAPI.updateItem(
            "trp_order_goods",
            idPos[i],
            {
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
              order: updateOrder.data.id,
            }
          );
        } else {
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
            order: updateOrder.data.id,
          });
        }
      }
      // people
    } else if (
      this.type === this.orderType[1] &&
      order.people.length > 0 &&
      !(order.goods.length > 0) &&
      !(order.construction.length > 0)
    ) {
      const updateOrder = await DirectusAPI.directusAPI.updateItem(
        "trp_order",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        order.id!,
        {
          remarks: order.remarks,
          state: this.stateTypeFromStateToId.get(order.state),
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
        }
      );

      let idPos: number[] = [];
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
        // @ts-ignore
        if (value.id) {
          idPos.push(value.id);
        } else {
          idPos.push(0);
        }
        quantityPeople.push(value.quantity_of_people);
        typePeople.push(this.typePeopleFromDesToId.get(value.type_people));
        quantityLuagge.push(value.quantity_of_luggage);
        descriptionLuagge.push(value.description_of_luagge);
        length.push(value.length);
        height.push(value.height);
        width.push(value.width);
        weight.push(value.weight);
      });

      for (let i = 0; order.people.length > i; i++) {
        if (idPos[i] !== 0) {
          await DirectusAPI.directusAPI.updateItem(
            "trp_order_people",
            idPos[i],
            {
              quantity_of_people: quantityPeople[i],
              type_people: typePeople[i],
              quantity_of_luggage: quantityLuagge[i],
              description_of_luagge: descriptionLuagge[i],
              length: length[i],
              height: height[i],
              width: width[i],
              weight: weight[i],
              // @ts-ignore
              order: updateOrder.data.id,
            }
          );
        } else {
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
            order: updateOrder.data.id,
          });
        }
      }
      // construction
    } else if (
      this.type === this.orderType[2] &&
      order.construction.length > 0 &&
      !(order.goods.length > 0) &&
      !(order.people.length > 0)
    ) {
      const updateOrder = await DirectusAPI.directusAPI.updateItem(
        "trp_order",
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        order.id!,
        {
          remarks: order.remarks,
          state: this.stateTypeFromStateToId.get(order.state),
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
        }
      );

      let idPos: number[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let quantity: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let weight: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let description: any[] = [];

      order.construction.forEach((value) => {
        // @ts-ignore
        if (value.id) {
          idPos.push(value.id);
        } else {
          idPos.push(0);
        }
        quantity.push(value.quantity);
        weight.push(value.weight);
        description.push(value.description);
      });

      for (let i = 0; order.construction.length > i; i++) {
        if (idPos[i] !== 0) {
          await DirectusAPI.directusAPI.updateItem(
            "trp_order_construction",
            idPos[i],
            {
              quantity: quantity[i],
              weight: weight[i],
              description: description[i],
              // @ts-ignore
              order: updateOrder.data.id,
            }
          );
        } else {
          await DirectusAPI.directusAPI.createItem("trp_order_construction", {
            quantity: quantity[i],
            weight: weight[i],
            description: description[i],
            // @ts-ignore
            order: updateOrder.data.id,
          });
        }
      }
    } else {
      this.titleDialogOrder = "Fehlerhafte Eingaben";
      this.textDialogOrder =
        "Bitte Formular überprüfen! Sendungsarten dürfen nicht vermischt werden!";
      this.dialogWarnOrder = true;
      return;
    }
    await this.search();
    this.dialog = false;
    // @ts-ignore
    this.$refs.formFirst.reset();
    // @ts-ignore
    this.$refs.formSecond.reset();
  }

  AddButtonClicked(): void {
    if (this.type === this.orderType[0]) {
      this.orderPositionsGoods.push(NewShipmentGoods);
      this.editedOrder.goods?.push(new PositionGoods());
      this.editedOrder.goods[
        this.editedOrder.goods.length - 1
      ].dangerous_goods = false;
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
      DirectusAPI.directusAPI.deleteItem(
        "trp_order_goods",
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.editedOrder.goods.pop().id!
      );
      this.orderPositionsGoods.splice(-1, 1);
      //this.editedOrder.goods.splice(-1, 1);
      this.validFormGoods.splice(-1, 1);
    }
    if (this.type === this.orderType[1]) {
      DirectusAPI.directusAPI.deleteItem(
        "trp_order_people",
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.editedOrder.people.pop().id!
      );
      this.orderPositionsPeople.splice(-1, 1);
      //this.editedOrder.people.splice(-1, 1);
      this.validFormPeople.splice(-1, 1);
    }
    if (this.type === this.orderType[2]) {
      DirectusAPI.directusAPI.deleteItem(
        "trp_order_construction",
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.editedOrder.construction.pop().id!
      );
      this.orderPositionsConstruction.splice(-1, 1);
      //this.editedOrder.construction.splice(-1, 1);
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

  // @ts-ignore
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
        }
        if (resp?.data[0]) {
          this.anlagenDescription =
            //@ts-ignore
            resp.data[0].anlagenname + ", " + resp.data[0].standort;
          //@ts-ignore
          this.rasterLagerplatz = resp.data[0].standortcode;
          //@ts-ignore
          this.editedOrder.anlage = resp.data[0].id;
          //@ts-ignore
          this.editedOrder.rasterLagerplatz = resp.data[0].standortcode;
        } else {
          this.anlagenDescription = "Analgen ID nicht vorhanden";
        }
        break;
    }
  }

  //@ts-ignore
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

  // @ts-ignore
  private triggerUpdateState(): void {
    const update = this.state;
    this.editedOrder.state = update;
  }

  // @ts-ignore
  private triggerUpdateDatePickUp(): void {
    const upade = this.datePickup + " " + this.pickupTime;
    const upadeDateTime = new Date(upade);
    this.editedOrder.pick_up_date = upadeDateTime;
  }

  // @ts-ignore
  private triggerUpdateDateDelivery(): void {
    const upade = this.dateDelivery + " " + this.deliveryTime;
    const upadeDateTime = new Date(upade);
    this.editedOrder.delivery_date = upadeDateTime;
  }

  // @ts-ignore
  private triggerUpdateRemarks(): void {
    const upade = this.remarksTrpOrder;
    this.editedOrder.remarks = upade;
  }

  // @ts-ignore
  private triggerUpdateRaster(): void {
    const upade = this.rasterLagerplatz;
    this.editedOrder.rasterLagerplatz = upade;
  }

  // @ts-ignore
  private async searchCustomer(searchOption: string): Promise<void> {
    // @ts-ignore
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
