<template>
  <!-- search transport-->
  <v-container>
    <v-row class="my-2" dense>
      <h2>
        <v-icon class="mb-1" color="black">
          mdi-feature-search
        </v-icon>
        Transport suchen
      </h2>
    </v-row>
    <SearchShipmentTextfieldInit :search.sync="searchChild" :search-category.sync="searchCategoryChild"
      @AddButtonClicked="add()" @MinusButtonClicked="remove()" />
    <div v-for="(textField, indx) in textFields" :key="indx">
      <component :is="textField" :search.sync="searchChildAdd[indx]"
        :search-category.sync="searchCategoryChildAdd[indx]" />
    </div>
    <v-row class="pb-5 mt-n5">
      <v-col cols="12" class="text-center">
        <v-btn color="blue" dark class="px-10" @click="search()">
          Suchen
        </v-btn>
      </v-col>
    </v-row>
    <v-alert v-if="errorMessage.length > 0" type="error">
      {{ errorMessage }}
    </v-alert>
    <v-row>
      <v-col class="text-left" cols="6">
        <h3 class="mt-0">
          Ergebnisse
        </h3>
      </v-col>
      <v-col class="text-right">
        {{ "Begrenzen: " }}
      </v-col>
      <v-col class="text-right">
        <v-select v-model="limit" label="Limit" :items="limitTypes" dense class="mt-0"
          hint="!*-1 means without limit*!" />
      </v-col>
      <v-col class="text-right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue" dark @click="exportOrders()" x-small rounded v-bind="attrs" v-on="on">
              CSV-Export
              <v-icon right dark>
                mdi-table-arrow-right
              </v-icon>
            </v-btn>
          </template>
          <span>Alle Suchergebnisse exportieren</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <!-- table results-->
    <v-data-table dense v-model="selected1" :headers="headers" :items="orders" item-key="id" class="elevation-1 mt-5"
      sort-by="id" show-select multi-sort>
      <template #[`item.actions`]="{ item }">
        <v-icon small class="text-center" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small class="text-center" @click="printItem(item)">
          mdi-printer
        </v-icon>
        <v-icon small class="text-center" @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-row>
      <v-col class="text-left pt-5">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue" dark @click="changeStatus()" v-bind="attrs" v-on="on">
              Status ändern
              <v-icon right dark>
                mdi-list-status
              </v-icon>
            </v-btn>
          </template>
          <span>Mehrere Status für ausgewählte Aufträge ändern</span>
        </v-tooltip>
      </v-col>
      <v-col class="text-right pt-5">
        <v-btn color="blue" dark @click="printItems()">
          Auswahl drucken
          <v-icon right dark>
            mdi-printer
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-right pt-0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="blue" dark @click="printLabels()" v-bind="attrs" v-on="on">
              Label drucken
              <v-icon right dark>
                mdi-label-multiple
              </v-icon>
            </v-btn>
          </template>
          <span>Label(s) für ausgewählte(n) Aufträg(e) drucken</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <!-- edit order dialog huge..-->
    <v-dialog v-model="dialog" persistent max-width="1100px">
      <v-card class="px-6 py-4">
        <v-card-title class="pt-2 pl-0">
          <span class="headline">Transport bearbeiten ID: {{ editedOrder.id }}</span>
        </v-card-title>
        <v-divider />
        <!-- order address -->
        <v-form ref="formFirst" v-model="validFormFirst" eager-validation>
          <v-row class="mt-0">
            <v-col :lg="4" :md="4" :sm="6">
              <v-select v-model="state" label="Sendungsstatus*" :items="stateTypeArray" :rules="orderTypeRules" dense
                outlined class="mt-3" required @change="triggerUpdateState()" />
            </v-col>
          </v-row>
          <v-divider />
          <v-row>
            <v-col :lg="8" :md="8" :sm="11">
              <v-card flat max-width="600px">
                <h3 class="mt-3">
                  Ladeadresse*
                </h3>
                <v-row class="mt-0">
                  <v-col :lg="6" :md="6" :sm="6" :xs="6">
                    <v-text-field v-model="pickupID" :rules="idRules" label="Kunden ID" outlined required
                      @change="triggerUdatePickupID('pickup')" />
                  </v-col>
                  <v-col class="text-left">
                    <v-btn :class="marginButtons()" rounded dark color="blue" @click="searchCustomer('pickup')">
                      Suchmenü
                      <v-icon right dark>
                        mdi-account-search
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mt-n7">
                  <v-col>
                    <v-textarea v-model="pickupAddress" label="Ladeadresse" filled auto-grow readonly
                      :rules="idRulesText" />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mt-n4">
            <v-col :lg="3" :md="3" :xs="3" :sm="3">
              <v-text-field v-model="anlagenIdPickUp" label="Anlagen ID" outlined hint="Falls vorhanden" persistent-hint
                @change="triggerUdatePickupID('anlagenPickUp')" />
              <v-text-field v-model="rasterLagerplatzPickUp" label="Raster Lagerplatz" hint="Falls vorhanden Bsp. 54H"
                :rules="notRequiredPickUP ? rasterLagerplatzRulesPickUp : []" :required="!notRequiredPickUP"
                persistent-hint outlined @change="triggerUpdateRasterPickUp()" />
            </v-col>
            <v-col>
              <v-subheader class="ml-n3">
                {{ anlagenDescriptionPickUp }}
              </v-subheader>
              <v-spacer class="mt-13" />
              <a href="https://bula21.sharepoint.com/:f:/g/EqVc5B0NQUVJpOB4kHgj6UYBhcennFmyHEstYhyTEkYbcA?e=HE4Yc2"
                target="_blank">Raster Lagerplatz</a>
            </v-col>
          </v-row>
          <v-col :lg="8" :md="8" :sm="11">
            <v-divider />
          </v-col>
          <v-row>
            <v-col :lg="8" :md="8" :sm="11">
              <v-card flat max-width="600px">
                <h3 class="mt-3">
                  Auftraggeber*
                </h3>
                <v-row class="mt-0">
                  <v-col :lg="6" :md="6" :sm="6" :xs="6">
                    <v-text-field v-model="principalID" :rules="idRules" label="Kunden ID" outlined required
                      @change="triggerUdatePickupID('principal')" />
                  </v-col>
                  <v-col class="text-left">
                    <v-btn :class="marginButtons()" rounded dark color="blue" @click="searchCustomer('principal')">
                      Suchmenü
                      <v-icon right dark>
                        mdi-account-search
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mt-n7">
                  <v-col>
                    <v-textarea v-model="principalAddress" label="Auftraggeber" filled auto-grow readonly
                      :rules="idRulesText" />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col :lg="8" :md="8" :sm="11">
              <v-divider />
            </v-col>
          </v-row>
          <v-row>
            <v-col :lg="8" :md="8" :sm="11">
              <v-card flat max-width="600px">
                <h3 class="mt-5">
                  Lieferadresse*
                </h3>
                <v-row class="mt-0">
                  <v-col :lg="6" :md="6" :sm="6">
                    <v-text-field v-model="deliveryID" :rules="idRules" label="Kunden ID" outlined required
                      @change="triggerUdatePickupID('delivery')" />
                  </v-col>
                  <v-col class="text-left">
                    <v-btn class="mt-2" rounded dark color="blue" @click="searchCustomer('delivery')">
                      Suchmenü
                      <v-icon right dark>
                        mdi-account-search
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row class="mt-n7">
                  <v-col>
                    <v-textarea v-model="deliveryAddress" label="Lieferadresse" filled auto-grow readonly
                      :rules="idRulesText" />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mt-n4">
            <v-col :lg="3" :md="3" :xs="3" :sm="3">
              <v-text-field v-model="anlagenID" label="Anlagen ID" outlined hint="Falls vorhanden" persistent-hint
                @change="triggerUdatePickupID('anlagen')" />
              <v-text-field v-model="rasterLagerplatz" label="Raster Lagerplatz" hint="Falls vorhanden Bsp. 54H"
                :rules="notRequired ? rasterLagerplatzRules : []" :required="!notRequired" persistent-hint outlined
                @change="triggerUpdateRaster()" />
            </v-col>
            <v-col>
              <v-subheader class="ml-n3">
                {{ anlagenDescription }}
              </v-subheader>
              <v-spacer class="mt-13" />
              <a href="https://bula21.sharepoint.com/:f:/g/EqVc5B0NQUVJpOB4kHgj6UYBhcennFmyHEstYhyTEkYbcA?e=HE4Yc2"
                target="_blank">Raster Lagerplatz</a>
            </v-col>
          </v-row>
          <v-row>
            <v-col :lg="8" :md="8" :sm="11">
              <v-divider />
            </v-col>
          </v-row>
        </v-form>
        <!-- order dates-->
        <v-form ref="formSecond" v-model="validFormSecond" eager-validation>
          <v-row class="mt-n3">
            <v-col :lg="2" :md="2" :sm="3" :xs="2">
              <v-menu ref="menuDatePickup" v-model="menuDatePickup" :close-on-content-click="false"
                :return-value.sync="datePickup" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ on, attrs }">
                  <v-text-field v-model="datePickup" label="Abholbereit ab*" prepend-icon="mdi-calendar" v-bind="attrs"
                    readonly v-on="on" />
                </template>
                <v-date-picker v-model="datePickup" no-title scrollable>
                  <v-spacer />
                  <v-btn text color="primary" @click="menuDatePickup = false">
                    Cancel
                  </v-btn>
                  <!--  @ts-ingore -->
                  <v-btn text color="primary" @click="datePicker(datePickup)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col :lg="2" :md="2" :sm="3" :xs="2">
              <v-text-field v-model="pickupTime" :rules="timeRules" label="Bereit ab Uhrzeit*"
                prepend-icon="mdi-clock-time-four-outline" hint="Falls egal 00:00 einragen"
                @change="triggerUpdateDatePickUp()" />
            </v-col>
          </v-row>
          <v-row class="mt-n7">
            <v-col :lg="2" :md="2" :sm="3" :xs="2">
              <v-menu ref="menuDateDelivery" v-model="menuDateDelivery" :close-on-content-click="false"
                :return-value.sync="dateDelivery" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ on, attrs }">
                  <v-text-field v-model="dateDelivery" label="Zustellung bis*" prepend-icon="mdi-calendar" readonly
                    v-bind="attrs" v-on="on" />
                </template>
                <v-date-picker v-model="dateDelivery" no-title scrollable>
                  <v-spacer />
                  <v-btn text color="primary" @click="menuDateDelivery = false">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="datePickerDelivery(dateDelivery)">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col :lg="2" :md="2" :sm="3" :xs="2">
              <v-text-field v-model="deliveryTime" label="Zustellen bis Uhrzeit*" :rules="timeRules"
                prepend-icon="mdi-clock-time-four-outline" hint="Falls egal 00:00 einragen"
                @change="triggerUpdateDateDelivery()" />
            </v-col>
          </v-row>
          <!-- order positions-->
          <v-row class="mt-n3">
            <v-col :lg="4" :md="4" :sm="6">
              <v-select v-model="type" label="Sendungsart*" :items="orderType" :rules="orderTypeRules" dense outlined
                class="mt-3" required />
            </v-col>
            <v-col :lg="4" :md="4" :sm="5">
              <v-btn class="mt-2 mr-1" fab dark color="blue" small @click="AddButtonClicked()">
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
              <v-btn class="mt-2" fab dark color="orange" small @click="MinusButtonClicked()">
                <v-icon dark>
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col cols="12" :sm="11" class="ml-5">
            <div v-if="type === orderType[0]">
              <div v-for="(posGoods, indxGoods) in orderPositionsGoods" :key="indxGoods">
                <div v-if="editedOrder.goods">
                  <component :is="posGoods" :currenpos="editedOrder.goods[indxGoods]"
                    :quantity.sync="editedOrder.goods[indxGoods].quantity"
                    :brutto-weight.sync="editedOrder.goods[indxGoods].grossWeight"
                    :netto-weight.sync="editedOrder.goods[indxGoods].netWeight"
                    :goods-descripttion.sync="editedOrder.goods[indxGoods].goodsDescription"
                    :length.sync="editedOrder.goods[indxGoods].length" :width.sync="editedOrder.goods[indxGoods].width"
                    :height.sync="editedOrder.goods[indxGoods].height"
                    :marking.sync="editedOrder.goods[indxGoods].marking"
                    :value-c-h-f.sync="editedOrder.goods[indxGoods].valueChf"
                    :dangerous-goods.sync="editedOrder.goods[indxGoods].dangerousGoods"
                    :packing-unit-selected.sync="editedOrder.goods[indxGoods].packingUnit"
                    :stapelbar.sync="editedOrder.goods[indxGoods].stapelbar"
                    :kommission.sync="editedOrder.goods[indxGoods].kommissionieren"
                    :valid-form-goods.sync="validFormGoods[indxGoods]" />
                </div>
              </div>
            </div>
            <div v-else-if="type === orderType[1]">
              <div v-for="(posPeople, indxPeople) in orderPositionsPeople" :key="indxPeople">
                <div v-if="editedOrder.people">
                  <component :is="posPeople" :currenpos="editedOrder.people[indxPeople]"
                    :quantity.sync="editedOrder.people[indxPeople].quantityOfPeople"
                    :brutto-weight.sync="editedOrder.people[indxPeople].weight"
                    :quantity-of-luagge.sync="editedOrder.people[indxPeople].quantityOfLuggage"
                    :goods-descripttion.sync="editedOrder.people[indxPeople].descriptionOfLuagge"
                    :length.sync="editedOrder.people[indxPeople].length"
                    :width.sync="editedOrder.people[indxPeople].width"
                    :height.sync="editedOrder.people[indxPeople].height"
                    :selected-type-of-people.sync="editedOrder.people[indxPeople].typePeople"
                    :valid-form-people.sync="validFormPeople[indxPeople]" />
                </div>
              </div>
            </div>
            <div v-else-if="type === orderType[2]">
              <div v-for="(posCons, indexCons) in orderPositionsConstruction" :key="indexCons">
                <div v-if="editedOrder.construction">
                  <component :is="posCons" :currenpos="editedOrder.construction[indexCons]"
                    :quantity.sync="editedOrder.construction[indexCons].quantity"
                    :brutto-weight.sync="editedOrder.construction[indexCons].weight"
                    :goods-descripttion.sync="editedOrder.construction[indexCons].description"
                    :valid-form-const.sync="validFormConst[indexCons]" />
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-divider class="mt-4" />
        <!-- remarks order-->
        <v-row class="mt-n2">
          <v-col :lg="8" :md="8" :sm="11">
            <v-col cols="12">
              <v-textarea v-model="remarksTrpOrder" rows="4"
                label="Bemerkungen (z.B. Details Gefahrgut, Fixtermine, sonstige Infos etc.)" row-height="7"
                hint="Abhol-/Liefertermin gilt als frühster/spätester Abhol-/Liefertermin. Fixtermine bitte explizit erwähnen (gelten erst als definitiv, sobald bestätigt)."
                persistent-hint @change="triggerUpdateRemarks()" />
            </v-col>
          </v-col>
        </v-row>
        <v-row class="mt-n7">
          <v-col :lg="4" :md="4" :sm="6">
            <v-file-input label="Lade eine Datei zur Sendung hoch" hint="max. 2 MB" v-model="file" :show-size="1000"
              @change="deleteDocumentTrpOrder()"></v-file-input>
          </v-col>
          <v-col :lg="2" :md="2" :sm="4" class="mt-3">
            <v-btn rounded color="blue" dark @click="sendDownloadFile()">
              download datei
              <v-icon right dark>
                mdi-download
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mt-n10">
          <v-col class="ml-2 ">
            <v-checkbox v-model="onlyDelivery" label="Nur Anlieferung (kein Transport durch BuLa)" color="red"
              hide-details @change="triggerUpdateDeliveryOnly()" />
          </v-col>
          <v-col v-if="onlyDelivery === true">
            <v-text-field v-model="costTrpExternal" :rules="valueCHFRules" label="Kosten für Transport extern (CHF)"
              @change="triggerUpdateCostTrpExternal()" />
          </v-col>
        </v-row>
        <v-divider class="mt-4" />
        <!-- actions order-->
        <v-card-actions class="mt-1">
          <v-spacer />
          <v-btn color="orange" text @click="close()">
            Abbrechen
          </v-btn>
          <v-btn color="blue darken-2" text @click="save()">
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Search Client -->
    <v-dialog v-model="dialogSearchClient" persistent>
      <v-card>
        <SearchCustomer @clientUpdate="updateSearchClients" @closeSearch="dialogSearchClient = false" />
      </v-card>
    </v-dialog>
    <!-- Dialog Warn not mova client -->
    <v-dialog v-model="dialogNotMova" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">
          Dies ist kein mova Kunde
        </v-card-title>
        <v-card-text>Bitte Kunde überprüfen! <br> Normalerweise sind nur mova Adressen unsere Kunden.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialogNotMova = false">
            Ok, verstanden!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Warn Order not complete or error-->
    <v-dialog v-model="dialogWarnOrder" max-width="400">
      <v-card>
        <v-card-title class="headline">
          {{ titleDialogOrder }}
        </v-card-title>
        <v-card-text> {{ textDialogOrder }} </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialogWarnOrder = false">
            Ok, verstanden!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Warn Permissions-->
    <DialogPermissions :dialog-warn-permissions="warnPermissions" @closePermissions="closePermissions()" />
    <!-- Dialog Warn Delete-->
    <DialogDeleteWarn :dialog-warn-delete="dialogWarnDelete" @closeDeleteWarn="closeWarnDelete()"
      @deletConfirmed="deleteTrpOrder()" />
    <!-- Dialog Print -->
    <v-dialog v-model="dialogPrint" persistent max-width="1000px">
      <v-card>
        <PrintTransportOrder :key="componentKey" :order="printOrder" @closePrint="closePrint()" />
      </v-card>
    </v-dialog>
    <!-- Dialog Print Multiple-->
    <v-dialog v-model="dialogPrintMultiple" persistent max-width="1000px">
      <v-card>
        <PrintMultipleTransportOrder :key="componentKeyMultiple" :orders="printMultipleOrder"
          @closePrintMultiple="closeMultiplePrint()" />
      </v-card>
    </v-dialog>
    <!-- Dialog Print Multiple Labels-->
    <v-dialog v-model="dialogPrintLabels" persistent max-width="1000px">
      <v-card>
        <PrintLables :key="componentKeyMultipleLabels" :orders="printMultipleOrderLabels"
          @closePrintMultipleLabels="closeMultipleLabels()" />
      </v-card>
    </v-dialog>
    <!-- Dialog Change Status -->
    <v-dialog v-model="dialogChangeStatus" persistent max-width="550px">
      <v-card>
        <v-card-title class="headline">
          Status ändern
        </v-card-title>
        <v-card-text>
          Wähle den neuen Status für die mit der Checkbox ausgewählten Sendungen
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col>
              <v-select v-model="stateChange" label="Sendungsstatus*" :items="stateTypeArray" :rules="orderTypeRules"
                dense outlined class="mt-3" required />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange darken-1" text @click="closeChangeStatus()">
            Abbrechen!
          </v-btn>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="submitChangeStatus()">
            Ok, Status ändern!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { format } from "fecha";
import CloneDeep from "lodash/cloneDeep";
import SearchShipmentTextfieldInit from "@/components/subComponents/SearchShipmentTextfieldInit.vue";
import SearchShipmentTextfieldAdd from "@/components/subComponents/SearchShipmentTextfieldAdd.vue";
import NewShipmentGoods from "@/components/subComponents/NewShipmentGoods.vue";
import NewShipmentPeople from "@/components/subComponents/NewShipmentPeople.vue";
import NewShipmentConstruction from "@/components/subComponents/NewShipmentConstruction.vue";
import PrintTransportOrder from "@/components/subComponents/PrintTransportOrder.vue";
import PrintMultipleTransportOrder from "@/components/subComponents/PrintMultipleTransportOrder.vue";
import PrintLables from "@/components/subComponents/PrintLabels.vue";
import Order from "@/model/Order";
import DirectusAPI from "@/services/DirectusAPI";
import ExportCSV from "@/services/ExportCSV";
import PositionGoods from "@/model/PositionGoods";
import PositionPeople from "@/model/PositionPeople";
import PositionConstruction from "@/model/PositionConstruction";
import Client from "@/model/Client";
import SearchCustomer from "@/components/subComponents/SearchCustomer.vue";
import DialogPermissions from "@/components/subComponents/DialogPermissions.vue";
import DialogDeleteWarn from "@/components/subComponents/DialogWarnDelete.vue";
import { DIRECTUS_ROLES, ORDER_TYPE, TRP_TYP_CLIENT } from "./Const";
import { Anlage, TrpOrder } from "@/services/TrpOrder";
import OrderDisplay from "@/model/OrderDisplay";
import AnlageClass from "@/model/Anlage";
import ClassState from "@/model/State";

@Component({
  components: {
    SearchShipmentTextfieldInit,
    SearchShipmentTextfieldAdd,
    NewShipmentGoods,
    NewShipmentPeople,
    NewShipmentConstruction,
    SearchCustomer,
    PrintTransportOrder,
    PrintMultipleTransportOrder,
    PrintLables,
    DialogPermissions,
    DialogDeleteWarn,
  },
})
export default class SearchShipment extends Vue {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  /* eslint-disable no-shadow */
  /* eslint-disable no-param-reassign */
  public textFields = [SearchShipmentTextfieldAdd];
  public searchChild = "";
  public searchCategoryChild = "";
  public searchChildAdd = [];
  public searchCategoryChildAdd = [];
  public componentKey = 0;
  public componentKeyMultiple = 0;
  public componentKeyMultipleLabels = 0;
  public limit = 100;
  public limitTypes = [-1, 5, 50, 100, 200];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public orders: any = [{
  }];

  public file: File | null = null;
  public fileOld: File | null = null;
  public printOrder = new Order();
  public printMultipleOrder: Order[] = [];
  public printMultipleOrderLabels: Order[] = [];
  public editedOrder: TrpOrder = new Order();
  private orderTable: TrpOrder[] = [];
  public selected1: OrderDisplay[] = [];
  private orderToDelete = new OrderDisplay();
  public errorMessage = "";
  public dialog = false;
  public dialogNotMova = false;
  public dialogPrint = false;
  public dialogPrintMultiple = false;
  public dialogPrintLabels = false;
  public dialogSearchClient = false;
  public dialogWarnOrder = false;
  public warnPermissions = false;
  public dialogWarnDelete = false;
  public dialogChangeStatus = false;
  public titleDialogOrder = "";
  public textDialogOrder = "";
  // formFirst
  public validFormFirst = true;
  // formSecond
  public validFormSecond = true;
  public validFormGoods = [true];
  public validFormPeople = [true];
  public validFormConst = [true];
  public orderPositionsGoods = [NewShipmentGoods];
  public orderPositionsPeople = [NewShipmentPeople];
  public orderPositionsConstruction = [NewShipmentConstruction];
  public orderType: string[] = [];
  private stateTypeFromIdToState = new Map();
  private stateTypeFromStateToId = new Map();
  private packagingUntisFromIdToDes = new Map();
  private typePeopleFromDesToId = new Map();
  private typePeopleFromIdToDes = new Map();
  public stateTypeArray: string[] = [];
  public onlyDelivery = false;
  public state = "";
  public stateChange = "";
  public type = "";
  private searchClient = new Client();
  public pickupID = 0;
  public pickupAddress = "";
  public deliveryID = 0;
  public deliveryAddress = "";
  public principalID = 0;
  public principalAddress = "";
  public deliveryPhone = "";
  public anlagenID = 0;
  public anlagenIdPickUp = 0;
  public anlagenDescription = "--";
  public anlagenDescriptionPickUp = "--";
  public rasterLagerplatz = "";
  public rasterLagerplatzPickUp = "";
  public menuDatePickup = false;
  public menuDateDelivery = false;
  public costTrpExternal = 0;
  public datePickup = new Date().toISOString().substring(0, 10);
  public dateDelivery = new Date().toISOString().substring(0, 10);
  public pickupTime = "00:00";
  public deliveryTime = "00:00";
  public remarksTrpOrder = "";
  public idRules = [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  public orderTypeRules = [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  public timeRules = [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    (v: any) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v)
      || "Wert ungültig (Format hh:mm)",
  ];

  public idRulesText = [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    (v: string) => !/^Kunden ID nicht vorhanden$/.test(v) || "ID ungültig",
  ];

  public notRequired = true;
  public rasterLagerplatzRules = [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    (v: any) => {
      if (this.editedOrder.receiver?.type?.id === TRP_TYP_CLIENT.mova) {
        this.notRequired = false;
        return !!v || "Wert ist erforderlich";
      }
      this.notRequired = true;
      return true;
    },
  ];

  public notRequiredPickUP = true;
  public rasterLagerplatzRulesPickUp = [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    (v: any) => {
      if (this.editedOrder.shipper?.type === TRP_TYP_CLIENT.mova) {
        this.notRequired = false;
        return !!v || "Wert ist erforderlich";
      }
      this.notRequired = true;
      return true;
    },
  ];

  public valueCHFRules = [
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    (v: any) => {
      if (v) {
        return /^[0-9]{1,11}(?:\.[0-9]{1,2})?$/.test(v) || "Nur Zahlen mit max. 2 Kommastelle";
      }
      return true;
    },
  ];

  private forceRerenderPrint(): void {
    this.componentKey += 1;
  }

  private forceRerenderPrintMultiple(): void {
    this.componentKeyMultiple += 1;
  }

  private forceRenderPrintMultipleLabel(): void {
    this.componentKeyMultipleLabels += 1;
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
      this.packagingUntisFromIdToDes.set(value.id, value.abbreviation);
    });

    const typPeopleResp = await DirectusAPI.fetchTrpTypePeople();

    typPeopleResp.forEach((value) => {
      this.typePeopleFromDesToId.set(value.description, value.id);
      this.typePeopleFromIdToDes.set(value.id, value.description);
    });

    this.orderType.push(
      ORDER_TYPE.Warentransport,
      ORDER_TYPE.Personentransport,
      ORDER_TYPE["Spezialleistung mit Fahrzeug"],
    );
  }

  destroyed(): void {
    window.removeEventListener("keyup", this.handleEnter);
  }

  public headers = [
    {
      text: "Actions", value: "actions", sortable: false,
    },
    {
      text: "Order ID",
      align: "start",
      value: "id",
    },
    {
      text: "Status", value: "state",
    },
    {
      text: "delivery_date", value: "delivery_date",
    },
    {
      text: "pick_up_date", value: "pick_up_date",
    },
    {
      text: "Auftraggeber Name", value: "principal",
    },
    {
      text: "Auftraggeber ID", value: "principal_id",
    },
    {
      text: "Auftraggeber Email", value: "principal_email",
    },
    {
      text: "Ladeadresse Name", value: "shipper",
    },
    {
      text: "Ladeadresse Ort", value: "shipper_place",
    },
    {
      text: "Ladeadresse PLZ", value: "shipper_zip",
    },
    {
      text: "Lieferadresse Name", value: "receiver",
    },
    {
      text: "Lieferadresse Ort", value: "receiver_place",
    },
    {
      text: "Lieferadresse PLZ", value: "receiver_zip",
    },
    {
      text: "Gewicht kg", value: "weight",
    },
    {
      text: "M^3", value: "cbm",
    },
    {
      text: "Positionen", value: "pos",
    },
    {
      text: "Beschreibung Pos.", value: "posDescription",
    },
  ];

  private handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.search();
    }
  }

  public marginButtons(): string {
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
          pos += 1;
          posDescription = `${posDescription
            + this.typePeopleFromIdToDes.get(value.typePeople)}\n`;
        });
      } else if (value.goods!.length > 0) {
        value.goods!.forEach((value) => {
          pos += 1;
          posDescription = `${posDescription + value.goodsDescription}\n`;
        });
      } else if (value.construction!.length > 0) {
        value.construction!.forEach((value) => {
          pos += 1;
          posDescription = `${posDescription + value.description}\n`;
        });
      }

      this.orders.push({
        id: value.id,
        state: value.state?.state,
        delivery_date: format(
          new Date(value.deliveryDate!),
          "YYYY-MM-DD HH:mm",
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
        weight,
        cbm,
        pos,
        posDescription,
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
        if (this.searchCategoryChildAdd[y] === "Auftraggeber ID") {
          filteredDataKey.unshift(this.searchCategoryChildAdd[y]);
          filteredDataValue.unshift(this.searchChildAdd[y]);
        } else {
          filteredDataKey.push(this.searchCategoryChildAdd[y]);
          filteredDataValue.push(this.searchChildAdd[y]);
        }
      }
    }

    const filter: Record<string, unknown> = {
    };

    const orderId: number[] = [];
    const states: number[] = [];
    let principals: number[] = [];
    let receivers: number[] = [];
    let shippers: number[] = [];
    let theTruth = true;

    if (filteredDataKey.length > 0) {
      for (let i = 0; filteredDataKey.length > i; i++) {
        if (filteredDataKey[i] === "Order ID") {
          orderId.push(filteredDataValue[i]);
          filter.id = {
            in: orderId,
          };
        }
        if (filteredDataKey[i] === "Status") {
          const actualState = this.stateTypeFromStateToId.get(
            filteredDataValue[i].toLowerCase().trim(),
          );

          if (actualState) {
            states.push(actualState);
            filter.state = {
              in: states,
            };
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
                "YYYY-MM-DD HH:mm",
              );
              const dateConvPlusFormat = format(
                dateConvPlus,
                "YYYY-MM-DD HH:mm",
              );

              filter.delivery_date = {
                between: [dateConvMinusFormat, dateConvPlusFormat],
              };
            } catch {
              this.errorMessage = "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          } else {
            try {
              const dateConv = format(
                new Date(filteredDataValue[i].trim()),
                "YYYY-MM-DD",
              );

              filter.delivery_date = {
                between: [`${dateConv} 00:00`, `${dateConv} 23:59`],
              };
            } catch {
              this.errorMessage = "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
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
                "YYYY-MM-DD HH:mm",
              );
              const dateConvPlusFormat = format(
                dateConvPlus,
                "YYYY-MM-DD HH:mm",
              );

              filter.pick_up_date = {
                between: [dateConvMinusFormat, dateConvPlusFormat],
              };
            } catch {
              this.errorMessage = "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          } else {
            try {
              const dateConv = format(
                new Date(filteredDataValue[i].trim()),
                "YYYY-MM-DD",
              );

              filter.pick_up_date = {
                between: [`${dateConv} 00:00`, `${dateConv} 23:59`],
              };
            } catch {
              this.errorMessage = "Falsches Datum/Uhrzeit Format (YYYY-MM-DD HH:mm oder YYYY-MM-DD für nur Tag)";
              break;
            }
          }
        }
        if (filteredDataKey[i] === "Auftraggeber Firma/Name") {
          // eslint-disable-next-line no-await-in-loop
          const fetchPrincipals = await DirectusAPI.getTrpClients(
            {
              name: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayPricipalsId: number[] = [];

          for (let j = 0; fetchPrincipals.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayPricipalsId.push(fetchPrincipals[j].id!);
          }

          if (arrayPricipalsId.length > 0) {
            principals = principals.concat(arrayPricipalsId);
            filter.principal = {
              in: principals,
            };
          }
        }
        if (filteredDataKey[i] === "Auftraggeber ID") {
          let valueToPush: number;
          try {
            valueToPush = Number(filteredDataValue[i].trim());
          } catch {
            return order;
          }

          if (valueToPush) {
            principals.push(valueToPush);
            filter.principal = {
              in: principals,
            };
          } else {
            return order;
          }
        }
        if (filteredDataKey[i] === "Auftraggeber Email") {
          // eslint-disable-next-line no-await-in-loop
          const fetchPrincipals = await DirectusAPI.getTrpClients(
            {
              email: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayPricipalsId: number[] = [];

          for (let j = 0; fetchPrincipals.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayPricipalsId.push(fetchPrincipals[j].id!);
          }

          if (arrayPricipalsId.length > 0) {
            principals = principals.concat(arrayPricipalsId);
            filter.principal = {
              in: principals,
            };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse Name") {
          // eslint-disable-next-line no-await-in-loop
          const fetchReciever = await DirectusAPI.getTrpClients(
            {
              name: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRecieverId.push(fetchReciever[j].id!);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter.receiver = {
              in: receivers,
            };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse Name") {
          // eslint-disable-next-line no-await-in-loop
          const fetchShipper = await DirectusAPI.getTrpClients(
            {
              name: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayShipperId.push(fetchShipper[j].id!);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter.shipper = {
              in: shippers,
            };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse Ort") {
          // eslint-disable-next-line no-await-in-loop
          const fetchReciever = await DirectusAPI.getTrpClients(
            {
              place: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRecieverId.push(fetchReciever[j].id!);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter.receiver = {
              in: receivers,
            };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse Ort") {
          // eslint-disable-next-line no-await-in-loop
          const fetchShipper = await DirectusAPI.getTrpClients(
            {
              place: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.length > j; j++) {
            arrayShipperId.push(fetchShipper[j].id!);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter.shipper = {
              in: shippers,
            };
          }
        }
        if (filteredDataKey[i] === "Ladeadresse PLZ") {
          // eslint-disable-next-line no-await-in-loop
          const fetchShipper = await DirectusAPI.getTrpClients(
            {
              zipcode: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayShipperId: number[] = [];

          for (let j = 0; fetchShipper.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayShipperId.push(fetchShipper[j].id!);
          }

          if (arrayShipperId.length > 0) {
            shippers = shippers.concat(arrayShipperId);
            filter.shipper = {
              in: shippers,
            };
          }
        }
        if (filteredDataKey[i] === "Lieferadresse PLZ") {
          // eslint-disable-next-line no-await-in-loop
          const fetchReciever = await DirectusAPI.getTrpClients(
            {
              zipcode: {
                like: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayRecieverId: number[] = [];

          for (let j = 0; fetchReciever.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRecieverId.push(fetchReciever[j].id!);
          }

          if (arrayRecieverId.length > 0) {
            receivers = receivers.concat(arrayRecieverId);
            filter.receiver = {
              in: receivers,
            };
          }
        }

        if (filteredDataKey[i] === "Bereich") {
          // eslint-disable-next-line no-await-in-loop
          const fetchBereich = await DirectusAPI.getDepartments(
            {
              department: {
                in: filteredDataValue[i].trim(),
              },
            },
            5,
          );
          const arrayBereich: number[] = [];

          for (let j = 0; fetchBereich.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayBereich.push(fetchBereich[j].id!);
          }

          // eslint-disable-next-line no-await-in-loop
          const fetchPrincipalsBereich = await DirectusAPI.getTrpClients(
            {
              ressort_department: {
                in: arrayBereich,
              },
            },
            5,
          );

          const arrayBereichPrinci: number[] = [];

          for (let j = 0; fetchPrincipalsBereich.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayBereichPrinci.push(fetchPrincipalsBereich[j].id!);
          }

          if (arrayBereichPrinci.length > 0) {
            if (principals.length > 0) {
              if ((principals.filter((value) => arrayBereichPrinci.includes(value)))?.length) {
                principals = principals.filter((value) => arrayBereichPrinci.includes(value));
              } else {
                return order;
              }
            } else {
              principals = principals.concat(arrayBereichPrinci);
            }
            filter.principal = {
              in: principals,
            };
          }
        }

        if (filteredDataKey[i] === "Ressort") {
          // eslint-disable-next-line no-await-in-loop
          const fetchRessort = await DirectusAPI.getRessorts(-1);
          const idRessort = fetchRessort.find((value) => value.ressort === filteredDataValue[i].trim());
          // eslint-disable-next-line no-await-in-loop
          const fetchBereichForRessort = await DirectusAPI.getDepartments(
            {
              trp_ressort_mm: {
                in: [idRessort?.id],
              },
            },
            5,
          );
          const arrayRessortDep: number[] = [];
          for (let j = 0; fetchBereichForRessort.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRessortDep.push(fetchBereichForRessort[j].id!);
          }

          // eslint-disable-next-line no-await-in-loop
          const fetchPrincipalsRessort = await DirectusAPI.getTrpClients(
            {
              ressort_department: {
                in: arrayRessortDep,
              },
            },
            5,
          );

          const arrayRessortPrinci: number[] = [];

          for (let j = 0; fetchPrincipalsRessort.length > j; j++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            arrayRessortPrinci.push(fetchPrincipalsRessort[j].id!);
          }

          if (arrayRessortPrinci.length > 0) {
            if (principals.length > 0) {
              if ((principals.filter((value) => arrayRessortPrinci.includes(value)))?.length) {
                principals = principals.filter((value) => arrayRessortPrinci.includes(value));
              } else {
                return order;
              }
            } else {
              principals = principals.concat(arrayRessortPrinci);
            }
            filter.principal = {
              in: principals,
            };
          }
        }
        if (filteredDataKey[i] === "Senungsart") {
          if (filteredDataValue[i].trim() === "Spezialleistung mit Fahrzeug") {
            filter["construction.id"] = {
              nnull: "",
            };
          }
          if (filteredDataValue[i].trim() === "Warentransport") {
            filter["goods.id"] = {
              nnull: "",
            };
          }
          if (filteredDataValue[i].trim() === "Personentransport") {
            filter["people.id"] = {
              nnull: "",
            };
          }
        }
        if (filteredDataKey[i] === "Anlieferung Wahr/Falsch") {
          if (filteredDataValue[i].trim().toLowerCase() === "wahr") {
            theTruth = true && theTruth;
          }
          if (filteredDataValue[i].trim().toLowerCase() === "true") {
            theTruth = true && theTruth;
          }
          if (filteredDataValue[i].trim().toLowerCase() === "falsch") {
            theTruth = false && theTruth;
          }
          if (filteredDataValue[i].trim().toLowerCase() === "false") {
            theTruth = false && theTruth;
          }
          if (theTruth) {
            filter.delivery_only = {
              eq: 1,
            };
          } else {
            filter.delivery_only = {
              eq: 0,
            };
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

  public async deleteItem(item: OrderDisplay): Promise<void> {
    if (
      this.$store.state.authorisation === DIRECTUS_ROLES.Public
      || this.$store.state.authorisation === DIRECTUS_ROLES.Lagerbauten
      || this.$store.state.authorisation === DIRECTUS_ROLES["Dienstleiter/in"]
      || this.$store.state.authorisation === DIRECTUS_ROLES["Besteller/in"]
      || this.$store.state.authorisation === DIRECTUS_ROLES.Ressortleitung
      || this.$store.state.authorisation === DIRECTUS_ROLES["Bereichsleitung Infra"]
      || this.$store.state.authorisation === DIRECTUS_ROLES.Programmmaterial
      || this.$store.state.authorisation === DIRECTUS_ROLES.Lagerplatz
    ) {
      this.warnPermissions = true;
    } else {
      this.dialogWarnDelete = true;
      this.orderToDelete = item;
    }
  }

  public async deleteTrpOrder(): Promise<void> {
    if (this.orderToDelete.id) {
      const idxOfChange = this.orders.findIndex((value: OrderDisplay) => value.id === this.orderToDelete.id);
      await DirectusAPI.deleteTrpOrder(this.orderToDelete.id);
      if (idxOfChange !== -1) {
        this.orders.splice(idxOfChange, 1);
      }
      this.orderToDelete = new OrderDisplay();
      const idxOfChangeRealOrdersDelete = this.orderTable.findIndex((value: Order) => value.id === this.orderToDelete.id);
      if (idxOfChangeRealOrdersDelete !== -1) {
        this.orderTable.splice(idxOfChangeRealOrdersDelete, 1);
      }
      this.dialogWarnDelete = false;
    }
  }

  public printItem(item: OrderDisplay): void {
    this.forceRerenderPrint();
    let editedItems: TrpOrder[] = [];
    this.printOrder = new Order();
    this.editedOrder = new Order();

    if (item.id) {
      editedItems = this.orderTable.filter((value) => value.id === item.id);
      // check if found item is not null
      if (editedItems[0]) {
        this.editedOrder = CloneDeep(editedItems[0]);
        this.printOrder = CloneDeep(editedItems[0]);

        this.$nextTick(() => {
          // still needed? --> probably not
          this.printOrder = this.editedOrder;
          this.dialogPrint = true;
        });
      }
    }
  }

  public printItems(): void {
    if (!(this.selected1.length > 0)) {
      return;
    }
    if (!(this.orderTable.length > 0)) {
      return;
    }

    this.forceRerenderPrintMultiple();
    this.printMultipleOrder = [];

    const trpIdToUpdate: number[] = [];

    this.selected1.forEach((value) => {
      trpIdToUpdate.push(value.id!);
    });

    const toPrintOrders = this.orderTable.filter((value) => trpIdToUpdate.includes(value.id!));

    if (!(toPrintOrders.length > 0)) {
      return;
    }

    this.printMultipleOrder = CloneDeep(toPrintOrders);
    this.dialogPrintMultiple = true;
  }

  public printLabels(): void {
    if (!(this.selected1.length > 0)) {
      return;
    }
    if (!(this.orderTable.length > 0)) {
      return;
    }

    this.forceRenderPrintMultipleLabel();
    this.printMultipleOrderLabels = [];

    const trpIdToUpdateLabel: number[] = [];

    this.selected1.forEach((value) => {
      trpIdToUpdateLabel.push(value.id!);
    });

    const toPrintOrdersLabels = this.orderTable.filter((value) => trpIdToUpdateLabel.includes(value.id!));

    if (!(toPrintOrdersLabels.length > 0)) {
      return;
    }

    this.printMultipleOrderLabels = CloneDeep(toPrintOrdersLabels);
    this.dialogPrintLabels = true;
  }

  public async editItem(item: OrderDisplay): Promise<void> {
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
      this.downloadDocument(item.id);

      editedItems = this.orderTable.filter((value) => value.id === item.id);
      // check if found item is not null
      if (editedItems[0]) {
        this.editedOrder = CloneDeep(editedItems[0]);
        this.printOrder = CloneDeep(editedItems[0]);
        try {
          this.anlagenID = Number(this.editedOrder.anlage!.anlagenId);
        } catch {
          this.anlagenID = 0;
          this.editedOrder.anlage = new AnlageClass();
          this.editedOrder.anlage!.id = undefined;
        }
        try {
          this.anlagenIdPickUp = Number(this.editedOrder.anlagePickUp!.anlagenId);
        } catch {
          this.anlagenIdPickUp = 0;
          this.editedOrder.anlagePickUp = new AnlageClass();
        }
        try {
          this.rasterLagerplatz = this.editedOrder.rasterLagerplatz!;
        } catch {
          this.rasterLagerplatz = "";
        }
        try {
          this.rasterLagerplatzPickUp = this.editedOrder.rasterLagerplatzPickUp!;
        } catch {
          this.rasterLagerplatzPickUp = "";
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
          "YYYY-MM-DD",
        );
        this.pickupTime = format(this.editedOrder.pickUpDate!, "HH:mm");
        this.deliveryTime = format(this.editedOrder.deliveryDate!, "HH:mm");
        this.remarksTrpOrder = this.editedOrder.remarks!;
        this.onlyDelivery = this.editedOrder.deliveryOnly!;
        this.state = this.stateTypeFromIdToState.get(this.editedOrder.state?.id);
        this.costTrpExternal = this.editedOrder.costTrpExternal!;

        if (this.editedOrder.goods) {
          if (this.editedOrder.goods.length > 0) {
            this.editedOrder.goods.forEach((value, idx) => {
              this.orderPositionsGoods.push(NewShipmentGoods);
              // fix since NewSHipmentGoods does otherwise not reconise it is an Object of PositionGoods()
              this.editedOrder.goods![idx] = Object.assign(new PositionGoods(), value);
            });
            this.type = this.orderType[0];
          }
        }

        if (this.editedOrder.people) {
          if (this.editedOrder.people.length > 0) {
            this.editedOrder.people.forEach((value, idx) => {
              this.orderPositionsPeople.push(NewShipmentPeople);
              this.editedOrder.people![idx] = Object.assign(new PositionPeople(), value);
            });
            this.type = this.orderType[1];
          }
        }

        if (this.editedOrder.construction) {
          if (this.editedOrder.construction.length > 0) {
            this.editedOrder.construction.forEach((value, idx) => {
              this.orderPositionsConstruction.push(NewShipmentConstruction);
              this.editedOrder.construction![idx] = Object.assign(new PositionConstruction(), value);
            });
            this.type = this.orderType[2];
          }
        }

        this.dialog = true;
        if (
          this.$store.state.authorisation === DIRECTUS_ROLES.Public
          || this.$store.state.authorisation === DIRECTUS_ROLES.Lagerbauten
          || this.$store.state.authorisation
          === DIRECTUS_ROLES["Dienstleiter/in"]
          || this.$store.state.authorisation === DIRECTUS_ROLES["Besteller/in"]
          || this.$store.state.authorisation === DIRECTUS_ROLES.Ressortleitung
          || this.$store.state.authorisation
          === DIRECTUS_ROLES["Bereichsleitung Infra"]
          || this.$store.state.authorisation === DIRECTUS_ROLES.Programmmaterial
          || this.$store.state.authorisation === DIRECTUS_ROLES.Lagerplatz
        ) {
          if (this.state === "scheduled" || this.state === "checked") {
            this.warnPermissions = true;
          }
        }
      }
    }
  }

  public closePrint(): void {
    this.printOrder = new Order();
    this.dialogPrint = false;
  }

  public closeMultiplePrint(): void {
    this.selected1 = [];
    this.printMultipleOrder = [];
    this.dialogPrintMultiple = false;
  }

  public closeMultipleLabels(): void {
    this.selected1 = [];
    this.printMultipleOrderLabels = [];
    this.dialogPrintLabels = false;
  }

  public closePermissions(): void {
    this.warnPermissions = false;
  }

  public closeWarnDelete(): void {
    this.dialogWarnDelete = false;
  }

  public async close(): Promise<void> {
    (this.$refs.formFirst as Vue & { reset: () => boolean; }).reset();
    (this.$refs.formSecond as Vue & { reset: () => boolean; }).reset();
    this.dialog = false;
  }

  public async save(): Promise<void> {
    (this.$refs.formFirst as Vue & { validate: () => boolean; }).validate();
    (this.$refs.formSecond as Vue & { validate: () => boolean; }).validate();

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
            this.textDialogOrder = "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen. Ansonsten versuche es bitte später erneut und melde den Fehler via Slack #20_log_21_trp_requests.";
            this.dialogWarnOrder = true;
          }
        } else {
          this.titleDialogOrder = "Fehlerhafte Eingaben";
          this.textDialogOrder = "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
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
            this.textDialogOrder = "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen. Ansonsten versuche es bitte später erneut und melde den Fehler via Slack #20_log_21_trp_requests.";
            this.dialogWarnOrder = true;
          }
        } else {
          this.titleDialogOrder = "Fehlerhafte Eingaben";
          this.textDialogOrder = "Bitte Formular überprüfen! Hinweise und Pflichtfelder beachten.";
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
            this.textDialogOrder = "Prüfe zuerst, ob du die Berechtigungen hast, diese Aktion vorzunehmen. Ansonsten versuche es bitte später erneut und melde den Fehler via Slack #20_log_21_trp_requests.";
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
    if (
      this.type === this.orderType[0]
      && order.goods!.length > 0
      && !(order.people!.length > 0)
      && !(order.construction!.length > 0)
    ) {
      order.statusdirectus = this.stateTypeFromIdToState.get(order.state?.id);
      const updateOrder = await DirectusAPI.updateTrpOrder(order);

      for (let i = 0; order.goods!.length > i; i++) {
        order.goods![i].statusdirectus = this.stateTypeFromIdToState.get(
          order.state,
        );
        if (order.goods![i].id!) {
          // eslint-disable-next-line no-await-in-loop
          await DirectusAPI.updateGoodsPos(
            order.goods![i],
            order.goods![i].id!,
            updateOrder,
          );
        } else {
          // eslint-disable-next-line no-await-in-loop
          await DirectusAPI.createGoodsPosWithState(
            order.goods![i],
            updateOrder,
          );
        }
      }
      // people
    } else if (
      this.type === this.orderType[1]
      && order.people!.length > 0
      && !(order.goods!.length > 0)
      && !(order.construction!.length > 0)
    ) {
      order.statusdirectus = this.stateTypeFromIdToState.get(order.state?.id);
      const updateOrder = await DirectusAPI.updateTrpOrder(order);

      for (let i = 0; order.people!.length > i; i++) {
        order.people![i].statusdirectus = this.stateTypeFromIdToState.get(
          order.state,
        );
        if (order.people![i].id!) {
          // eslint-disable-next-line no-await-in-loop
          await DirectusAPI.updatePeoplePos(
            order.people![i],
            order.people![i].id!,
            updateOrder,
          );
        } else {
          // eslint-disable-next-line no-await-in-loop
          await DirectusAPI.createPeoplePosWithState(
            order.people![i],
            updateOrder,
          );
        }
      }
      // construction
    } else if (
      this.type === this.orderType[2]
      && order.construction!.length > 0
      && !(order.goods!.length > 0)
      && !(order.people!.length > 0)
    ) {
      order.statusdirectus = this.stateTypeFromIdToState.get(order.state?.id);
      const updateOrder = await DirectusAPI.updateTrpOrder(order);

      for (let i = 0; order.construction!.length > i; i++) {
        order.construction![i].statusdirectus = this.stateTypeFromIdToState.get(
          order.state,
        );
        if (order.construction![i].id!) {
          // eslint-disable-next-line no-await-in-loop
          await DirectusAPI.updateConstruePos(
            order.construction![i],
            order.construction![i].id!,
            updateOrder,
          );
        } else {
          // eslint-disable-next-line no-await-in-loop
          await DirectusAPI.createConstruPosWithState(
            order.construction![i],
            updateOrder,
          );
        }
      }
    } else {
      this.titleDialogOrder = "Fehlerhafte Eingaben";
      this.textDialogOrder = "Bitte Formular überprüfen! Sendungsarten dürfen nicht vermischt werden!";
      this.dialogWarnOrder = true;
      return;
    }

    if (this.file) {
      if (this.fileOld?.size !== this.file.size && this.fileOld?.type !== this.file.type) {
        const formData = new FormData();
        formData.append("file", this.file!);
        DirectusAPI.uploadFileTrpOrder(order.id!, formData).then((resp: boolean) => {
          if (resp) {
            console.log(`upload done of file ${this.file?.name}`);
            this.fileOld = this.file;
          } else {
            this.titleDialogOrder = "Fehler";
            this.textDialogOrder = "Upload fehlgeschlagen! Beachte die maximale File Grösse von 2 MB. Ansonsten versuche es bitte später erneut und melde den Fehler mit einem Screenshot via Slack #20_log_21_trp_requests.";
            this.dialogWarnOrder = true;
          }
        });
      }
    }

    // update real trp of search table results
    const idxOfChangeRealOrders = this.orderTable.findIndex((value: Order) => value.id === order.id);
    this.orderTable[idxOfChangeRealOrders] = order;

    // update table --> maybe extract this part...
    const idxOfChange = this.orders.findIndex((value: OrderDisplay) => value.id === order.id);

    let weight = 0;
    let pos = 0;
    let posDescription = "";
    let cbm = 0;

    weight = order.calcWeight();
    cbm = order.calcCBM();

    if (order.people!.length > 0) {
      order.people!.forEach((value) => {
        pos += 1;
        posDescription = `${posDescription
          + this.typePeopleFromIdToDes.get(value.typePeople)}\n`;
      });
    } else if (order.goods!.length > 0) {
      order.goods!.forEach((value) => {
        pos += 1;
        posDescription = `${posDescription + value.goodsDescription}\n`;
      });
    } else if (order.construction!.length > 0) {
      order.construction!.forEach((value) => {
        pos += 1;
        posDescription = `${posDescription + value.description}\n`;
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
      weight,
      cbm,
      pos,
      posDescription,
    };

    this.orders.push({
    });

    this.orders.pop();

    this.dialog = false;
    (this.$refs.formFirst as Vue & { reset: () => boolean; }).reset();
    (this.$refs.formSecond as Vue & { reset: () => boolean; }).reset();
  }

  AddButtonClicked(): void {
    if (this.type === this.orderType[0]) {
      this.orderPositionsGoods.push(NewShipmentGoods);
      // eslint-disable-next-line no-unused-expressions
      this.editedOrder.goods?.push(new PositionGoods());
      this.editedOrder.goods![this.editedOrder.goods!.length - 1].dangerousGoods = false;
      this.editedOrder.goods![this.editedOrder.goods!.length - 1].stapelbar = true;
      this.editedOrder.goods![this.editedOrder.goods!.length - 1].kommissionieren = false;
      this.validFormGoods.push(true);
    }
    if (this.type === this.orderType[1]) {
      this.orderPositionsPeople.push(NewShipmentPeople);
      // eslint-disable-next-line no-unused-expressions
      this.editedOrder.people?.push(new PositionPeople());
      this.validFormPeople.push(true);
    }
    if (this.type === this.orderType[2]) {
      this.orderPositionsConstruction.push(NewShipmentConstruction);
      // eslint-disable-next-line no-unused-expressions
      this.editedOrder.construction?.push(new PositionConstruction());
      this.validFormConst.push(true);
    }
  }

  MinusButtonClicked(): void {
    if (this.type === this.orderType[0]) {
      const deletedPos = this.editedOrder.goods!.pop();
      try {
        DirectusAPI.deleteGoodsPos(deletedPos!.id!);
      } catch {
        console.log(`Pos with ${deletedPos!.id!} could not be deleted`);
      } finally {
        this.orderPositionsGoods.splice(-1, 1);
        this.validFormGoods.splice(-1, 1);
      }
    }

    if (this.type === this.orderType[1]) {
      const deletedPos = this.editedOrder.people!.pop();
      try {
        DirectusAPI.deletePeoplePos(deletedPos!.id!);
      } catch {
        console.log(`Pos with ${deletedPos!.id!} could not be deleted`);
      } finally {
        this.orderPositionsPeople.splice(-1, 1);
        this.validFormPeople.splice(-1, 1);
      }
    }
    if (this.type === this.orderType[2]) {
      const deletedPos = this.editedOrder.construction!.pop();
      try {
        DirectusAPI.deleteConstPos(deletedPos!.id!);
      } catch {
        console.log(`Pos with ${deletedPos!.id!} could not be deleted`);
      } finally {
        this.orderPositionsConstruction.splice(-1, 1);
        this.validFormConst.splice(-1, 1);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public printAdress(client: Client): string {
    let adress = "";
    adress = `${client.name}\n${client.street}\n${client.zipcode}${client.place}\n${client.phone}\n${client.email}`;
    return adress;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async updateSearchClients(client: Client) {
    this.searchClient = client;

    switch (this.$store.state.searchOption) {
      case "delivery":
        this.deliveryID = this.searchClient.id!;
        this.deliveryAddress = this.printAdress(client);
        this.editedOrder.receiver = client;
        break;
      case "principal":
        if (this.searchClient.type?.id === TRP_TYP_CLIENT.mova) {
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.editedOrder.principal = client;
          break;
        } else {
          this.dialogNotMova = true;
          this.principalID = this.searchClient.id!;
          this.principalAddress = this.printAdress(client);
          this.editedOrder.principal = client;
          break;
        }
      case "pickup":
        this.pickupID = this.searchClient.id!;
        this.pickupAddress = this.printAdress(client);
        this.editedOrder.shipper = client;
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

  public async triggerUdatePickupID(kindOfUpdate: string): Promise<void> {
    let resp: Client[] = [];
    let resp2: Anlage[] = [];
    let resp3: AnlageClass[] = [];

    (this.$refs.formFirst as Vue & { resetValidation: () => boolean; }).resetValidation();

    // eslint-disable-next-line default-case
    switch (kindOfUpdate) {
      case "delivery":
        try {
          resp = await DirectusAPI.getTrpClients(
            {
              id: {
                eq: this.deliveryID,
              },
            },
            5,
          );
        } catch {
          this.deliveryAddress = "Kunden ID nicht vorhanden";
        }

        if (resp[0].id!) {
          this.searchClient = resp[0];
          this.deliveryID = this.searchClient.id!;
          this.deliveryAddress = this.printAdress(this.searchClient);
          this.editedOrder.receiver = this.searchClient;
        } else {
          this.deliveryAddress = "Kunden ID nicht vorhanden";
        }
        break;

      case "principal":
        try {
          resp = await DirectusAPI.getTrpClients(
            {
              id: {
                eq: this.principalID,
              },
            },
            5,
          );
        } catch {
          this.principalAddress = "Kunden ID nicht vorhanden";
        }

        if (resp[0].id!) {
          this.searchClient = resp[0];
          if (this.searchClient.type?.id === TRP_TYP_CLIENT.mova) {
            this.principalID = this.searchClient.id!;
            this.principalAddress = this.printAdress(this.searchClient);
          } else {
            this.dialogNotMova = true;
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
          resp = await DirectusAPI.getTrpClients({
            id: {
              eq: this.pickupID,
            },
          }, 5);
        } catch {
          this.pickupAddress = "Kunden ID nicht vorhanden";
        }
        if (resp[0].id!) {
          this.searchClient = resp[0];
          this.pickupID = this.searchClient.id!;
          this.pickupAddress = this.printAdress(this.searchClient);
          this.editedOrder.shipper = this.searchClient;
        } else {
          this.pickupAddress = "Kunden ID nicht vorhanden";
        }
        break;

      case "anlagen":
        try {
          resp2 = await DirectusAPI.getAnlage({
            anlagen_id: {
              eq: this.anlagenID,
            },
          }, 5);
        } catch {
          this.anlagenDescription = "Analgen ID nicht vorhanden";
          this.editedOrder.anlage = new AnlageClass();
          this.editedOrder.anlage.id = 0;
        }
        if (resp2.length > 0) {
          try {
            this.rasterLagerplatz = resp2[0].standortcode!;
            this.editedOrder.rasterLagerplatz = resp2[0].standortcode!;
          } finally {
            this.anlagenDescription = `${resp2[0].anlagenname}, ${resp2[0].standort}`;
            this.editedOrder.anlage = new AnlageClass();
            this.editedOrder.anlage = resp2[0];
          }
        } else {
          this.anlagenDescription = "Analgen ID nicht vorhanden";
          this.editedOrder.anlage = new AnlageClass();
          this.editedOrder.anlage.id = 0;
        }
        break;

      case "anlagenPickUp":
        try {
          resp3 = await DirectusAPI.getAnlage({
            anlagen_id: {
              eq: this.anlagenIdPickUp,
            },
          }, 5);
        } catch {
          this.anlagenDescriptionPickUp = "Analgen ID nicht vorhanden";
          this.editedOrder.anlagePickUp = new AnlageClass();
          this.editedOrder.anlagePickUp.id = 0;
        }
        if (resp3.length > 0) {
          try {
            this.rasterLagerplatzPickUp = resp3[0].standortcode!;
            this.editedOrder.rasterLagerplatzPickUp = resp3[0].standortcode!;
          } finally {
            this.anlagenDescriptionPickUp = `${resp3[0].anlagenname}, ${resp3[0].standort}`;
            this.editedOrder.anlagePickUp = new AnlageClass();
            this.editedOrder.anlagePickUp = resp3[0];
          }
        } else {
          this.anlagenDescriptionPickUp = "Analgen ID nicht vorhanden";
          this.editedOrder.anlagePickUp = new AnlageClass();
          this.editedOrder.anlagePickUp.id = 0;
        }
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public datePicker(datePickup: any) {
    if (this.$refs.menuDatePickup) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$refs.menuDatePickup.save(datePickup);
    }
    this.triggerUpdateDatePickUp();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public datePickerDelivery(dateDelivery: any) {
    if (this.$refs.menuDatePickup) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$refs.menuDateDelivery.save(dateDelivery);
    }
    this.triggerUpdateDateDelivery();
  }


  public async changeStatus(): Promise<void> {
    if (!(this.selected1.length > 0)) {
      return;
    }
    if (!(this.orderTable.length > 0)) {
      return;
    }
    this.dialogChangeStatus = true;
  }

  public closeChangeStatus(): void {
    this.dialogChangeStatus = false;
  }

  public async submitChangeStatus(): Promise<void> {
    const newStateId = this.stateTypeFromStateToId.get(this.stateChange);
    const trpIdToUpdate: number[] = [];

    this.selected1.forEach((value) => {
      trpIdToUpdate.push(value.id!);
    });

    const toChangeOrderStatus = this.orderTable.filter((value) => trpIdToUpdate.includes(value.id!));

    toChangeOrderStatus.forEach((orderToChange) => {
      orderToChange.statusdirectus = this.stateChange;
      orderToChange.state!.id = newStateId;
      orderToChange.state!.state = this.stateChange;
      DirectusAPI.updateStateTrpOrder(orderToChange);
      if (orderToChange.goods) {
        orderToChange.goods!.forEach((posOfOrder) => {
          posOfOrder.statusdirectus = this.stateChange;
          DirectusAPI.updateStateGoodsPos(posOfOrder, posOfOrder.id!);
        });
      }
      if (orderToChange.people) {
        orderToChange.people!.forEach((posOfOrder) => {
          posOfOrder.statusdirectus = this.stateChange;
          DirectusAPI.updateStatePeoplePos(posOfOrder, posOfOrder.id!);
        });
      }
      if (orderToChange.construction) {
        orderToChange.construction!.forEach((posOfOrder) => {
          posOfOrder.statusdirectus = this.stateChange;
          DirectusAPI.updateStateConstruePos(posOfOrder, posOfOrder.id!);
        });
      }
    });

    toChangeOrderStatus.forEach((orderToChangeInTable) => {
      // update table --> maybe extract this part...
      const idxOfChange = this.orders.findIndex((orderTableDisplay: OrderDisplay) => orderTableDisplay.id === orderToChangeInTable.id);
      this.orders[idxOfChange].state = orderToChangeInTable.state?.state;
    });
    this.orders.push({
    });
    this.orders.pop();
    this.dialogChangeStatus = false;
  }


  public async exportOrders(): Promise<void> {
    if (!(this.orderTable.length > 0)) {
      return;
    }

    const collectionFields1: string[] = Object.keys(this.orderTable[0]);

    const csv = ExportCSV.createCsvOrder(
      collectionFields1,
      this.orderTable,
      this.packagingUntisFromIdToDes,
    );
    ExportCSV.sendCsvDownload("orders.csv", csv);
  }

  public async sendDownloadFile(): Promise<void> {
    if (this.file) {
      const pic = document.createElement("a");
      pic.href = URL.createObjectURL(this.file);
      pic.setAttribute("download", this.file!.name);
      pic.style.display = "none";
      document.body.appendChild(pic);
      pic.click();
      document.body.removeChild(pic);
    }
  }

  private async downloadDocument(trpOrderId: number): Promise<void> {
    const resp = await DirectusAPI.getTrpOrder({
      id: {
        eq: trpOrderId,
      },
    }, 1);
    if (resp[0].document?.id) {
      this.file = await DirectusAPI.downloadFileTrpOrder(resp[0].document?.id);
    }
  }

  public async deleteDocumentTrpOrder(): Promise<void> {
    if (this.file) {
      console.log("file exists");
    } else {
      try {
        DirectusAPI.getTrpOrder({
          id: {
            eq: this.editedOrder.id,
          },
        }, 1).then((orders) => {
          try {
            DirectusAPI.deleteFileTrpOrder(this.editedOrder.id!, orders[0].document!.id!);
          } catch {
            console.log("file does not exist in backend");
          }
        });
      } catch {
        console.log("file does not exist in backend");
      } finally {
        this.fileOld = null;
      }
    }
  }

  public triggerUpdateState(): void {
    const update = this.state;
    this.editedOrder.state = new ClassState();
    this.editedOrder.state.id = this.stateTypeFromStateToId.get(update);
    this.editedOrder.state.state = update;
  }

  public triggerUpdateDatePickUp(): void {
    const upade = `${this.datePickup} ${this.pickupTime}`;
    const upadeDateTime = new Date(upade);
    this.editedOrder.pickUpDate = upadeDateTime;
  }

  public triggerUpdateCostTrpExternal(): void {
    const upade = this.costTrpExternal;
    if (upade) {
      this.editedOrder.costTrpExternal = upade;
    } else {
      this.editedOrder.costTrpExternal = 0;
    }
  }

  public triggerUpdateDateDelivery(): void {
    const upade = `${this.dateDelivery} ${this.deliveryTime}`;
    const upadeDateTime = new Date(upade);
    this.editedOrder.deliveryDate = upadeDateTime;
  }

  public triggerUpdateRemarks(): void {
    const upade = this.remarksTrpOrder;
    this.editedOrder.remarks = upade;
  }

  public triggerUpdateRaster(): void {
    const upade = this.rasterLagerplatz;
    this.editedOrder.rasterLagerplatz = upade;
  }

  public triggerUpdateRasterPickUp(): void {
    const upade = this.rasterLagerplatzPickUp;
    this.editedOrder.rasterLagerplatzPickUp = upade;
  }

  public triggerUpdateDeliveryOnly(): void {
    const upade = this.onlyDelivery;
    this.editedOrder.deliveryOnly = upade;
    if (this.onlyDelivery === false) {
      this.editedOrder.costTrpExternal = 0;
      this.costTrpExternal = 0;
    }
  }

  public async searchCustomer(searchOption: string): Promise<void> {
    (this.$refs.formFirst as Vue & { resetValidation: () => boolean; }).resetValidation();
    if (searchOption) {
      this.$nextTick(async () => {
        this.$store.commit("changeSearchOption", searchOption);
      });
      this.dialogSearchClient = true;
    }
  }
}
</script>
