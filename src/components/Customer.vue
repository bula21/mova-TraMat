<template>
  <v-container>
    <v-row
      class="my-2"
      dense
    >
      <h2>
        <v-icon
          class="mb-1"
          color="black"
        >
          mdi-account-box-multiple
        </v-icon>
        Kunden
      </h2>
    </v-row>
    <v-row class="my-1" />
    <v-form
      ref="form"
      v-model="valid"
      eager-validation
    >
      <h3 class="mt-3">
        Kunde suchen
      </h3>

      <v-dialog
        v-model="dialog"
        max-width="650px"
        persistent
      >
        <v-card>
          <v-card-title class="ml-2 pt-5">
            <span class="headline">{{ formTitle() }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row class="mt-n7">
                <v-col>
                  <v-select
                    v-model="typeNewCustomer"
                    label="Kunden Typ"
                    :items="customerTypesNew"
                    :rules="nameRules"
                    dense
                    outlined
                    class="mt-3"
                    required
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n7">
                <v-col>
                  <v-select
                    v-model="typeNewCustomer"
                    label="Ressort nur mova"
                    :items="customerTypesNew"
                    :rules="nameRules"
                    dense
                    outlined
                    class="mt-3"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n7">
                <v-col>
                  <v-select
                    v-model="typeNewCustomer"
                    label="Bereich nur mova"
                    :items="customerTypesNew"
                    :rules="nameRules"
                    dense
                    outlined
                    class="mt-3"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n9">
                <v-col>
                  <v-text-field
                    v-model="editedItem.name"
                    label="Firma oder Vorname Name / Vulgo"
                    :rules="nameRules"
                    required
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n7">
                <v-col>
                  <v-text-field
                    v-model="editedItem.street"
                    label="Strasse"
                    :rules="nameRules"
                    required
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n7">
                <v-col
                  cols="4"
                  :lg="4"
                  :md="4"
                  :sm="4"
                >
                  <v-text-field
                    v-model="editedItem.zipcode"
                    label="PLZ"
                    :rules="zipRules"
                    required
                  />
                </v-col>
                <v-col
                  cols="8"
                  :lg="8"
                  :md="8"
                  :sm="8"
                >
                  <v-text-field
                    v-model="editedItem.place"
                    label="Ort"
                    :rules="nameRules"
                    required
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n7">
                <v-col>
                  <v-text-field
                    v-model="editedItem.phone"
                    label="Telefon"
                    :rules="phoneRules"
                  />
                </v-col>
              </v-row>
              <v-row class="mt-n7">
                <v-col>
                  <v-text-field
                    v-model="editedItem.email"
                    label="Email"
                    :rules="emailRules"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="mt-n10">
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
      <v-row class="mt-n3">
        <v-col
          :lg="4"
          :md="4"
          :sm="5"
        >
          <v-text-field
            v-model="id"
            label="Kunden ID"
          />
        </v-col>
        <v-col
          :lg="4"
          :md="4"
          :sm="6"
          class="text-center mt-2"
        >
          <v-btn
            color="blue"
            dark
            rounded
            @click="dialog = true"
          >
            Kunde erfassen
            <v-icon
              right
              dark
            >
              mdi-plus
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col
          :lg="4"
          :md="4"
          :sm="5"
        >
          <v-select
            v-model="type"
            label="Kunden Typ"
            :items="customerTypesSearch"
            dense
            outlined
            class="mt-3"
          />
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col
          :lg="8"
          :md="8"
          :sm="11"
        >
          <v-text-field
            v-model="name"
            label="Firma oder Vorname Name / Vulgo"
          />
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col
          :lg="8"
          :md="8"
          :sm="11"
        >
          <v-text-field
            v-model="street"
            label="Strasse"
          />
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col
          :lg="2"
          :md="2"
          :sm="2"
        >
          <v-text-field
            v-model="zip"
            label="PLZ"
          />
        </v-col>
        <v-col
          :lg="6"
          :md="6"
          :sm="9"
        >
          <v-text-field
            v-model="place"
            label="Ort"
          />
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col
          :lg="8"
          :md="8"
          :sm="11"
        >
          <v-text-field
            v-model="phone"
            label="Telefon"
          />
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col
          :lg="8"
          :md="8"
          :sm="11"
        >
          <v-text-field
            v-model="email"
            label="Email"
          />
        </v-col>
      </v-row>
    </v-form>
    <v-row class="pb-5 mt-n5">
      <v-col
        :lg="8"
        :md="8"
        :sm="11"
        class="text-center"
      >
        <v-btn
          color="blue"
          dark
          class="px-10"
          @click="populateTable()"
        >
          Suchen
        </v-btn>
      </v-col>
    </v-row>
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
    <v-data-table
      dense
      :headers="headers"
      :items="clients"
      item-key="idT"
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
      </template>
    </v-data-table>
    <div class="text-right pt-2">
      <v-btn
        color="blue"
        dark
        @click="exportCustomers()"
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
    <!-- Dialog Warn Permissions-->
    <DialogPermissions
      :dialog-warn-permissions="warnPermissions"
      @closePermissions="closePermissions()"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { format } from "fecha";
import DirectusAPI from "@/services/DirectusAPI";
import Client from "../model/Client";
import ClientType from "../model/ClientType";
import ClientDisplay from "../model/ClientDisplay";
import ExportCSV from "@/services/ExportCSV";
import DialogPermissions from "@/components/subComponents/DialogPermissions.vue";
import { TrpTypeClient } from "@/services/Quicktype";
import { DIRECTUS_ROLES } from "@/components/Const";
import { TrpClient } from "@/services/TrpClient";

@Component({
  components: {
    DialogPermissions,
  },
})
export default class NewShipment extends Vue {
  private dialog = false;
  private warnPermissions = false;
  private editing = false;
  private valid = true;
  private name = "";
  private street = "";
  private zip = "";
  private place = "";
  private phone = "";
  private email = "";
  private id = "";
  private type = "";
  private typeNewCustomer = "";
  private customerTypes: TrpTypeClient[] = [];
  private customerTypesNew: string[] = [];
  private customerTypesSearch: string[] = [];
  private editedItem = new Client();
  private clients: ClientDisplay[] = [];
  private limit = 100;
  private limitTypes = [-1, 5, 50, 100, 200];
  private nameRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  private zipRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => /([1-468][0-9]|[57][0-7]|9[0-6])[0-9]{2}/.test(v) || "PLZ ist ungültig",
  ];

  private phoneRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => {
      if (v) {
        if (v.length > 0) {
          return (
            /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
              v,
            ) || "Telefonnummer ist ungültig"
          );
        }
        return true;
      }
      return true;
    },
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  private emailRules = [
    (v: string) => {
      if (v) {
        if (v.length > 0) {
          return /.+@.+\..+/.test(v) || "E-mail ist ungültig";
        }
        return true;
      }
      return true;
    },
    (v: any) => !!v || "Wert ist erforderlich",
  ];

  private headers = [
    {
      text: "Actions", value: "actions", sortable: false,
    },
    {
      text: "Kunden ID",
      align: "start",
      value: "id",
    },
    {
      text: "Typ", value: "type",
    },
    {
      text: "Firma/Name", value: "name",
    },
    {
      text: "Strasse", value: "street",
    },
    {
      text: "PLZ", value: "zipcode",
    },
    {
      text: "Ort", value: "place",
    },
    {
      text: "Telefon", value: "phone",
    },
    {
      text: "Email", value: "email",
    },
    {
      text: "modified_on", value: "modified_on",
    },
    {
      text: "created_on", value: "created_on",
    },
    {
      text: "modified_by", value: "modified_by",
    },
  ];

  async mounted(): Promise<void> {
    window.addEventListener("keyup", this.handleEnter);

    this.customerTypes = await DirectusAPI.fetchTrpTypeClient();
    this.customerTypes.forEach((clientType) => {
      this.customerTypesNew.push(clientType.acronym);
    });
    this.customerTypes.forEach((clientType) => {
      this.customerTypesSearch.push(clientType.acronym);
    });
    this.customerTypesSearch.push("ohne Typ suchen");
  }

  destroyed(): void {
    window.removeEventListener("keyup", this.handleEnter);
  }

  private async handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && this.dialog !== true) {
      await this.populateTable();
    }
    if (event.key === "Enter" && this.dialog === true) {
      await this.save();
    }
    if (event.key === "Escape") {
      this.close();
    }
  }

  private async populateTable(): Promise<void> {
    let clientsTable = [];
    this.clients = [];
    clientsTable = await this.search();

    await clientsTable.forEach((value) => {
      this.clients.push({
        id: value.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        type: value.type!.acronym,
        name: value.name,
        street: value.street,
        place: value.place,
        zipcode: value.zipcode,
        phone: value.phone,
        email: value.email,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        modified_on: format(new Date(value.modifiedOn!), "YYYY-MM-DD HH:mm"),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        created_on: format(new Date(value.createdOn!), "YYYY-MM-DD HH:mm"),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        modified_by: `${value.modifiedBy!.firstName} ${value.modifiedBy!.lastName}`,
      });
    });
  }

  private formTitle(): string {
    let text = "";

    if (this.editing) {
      text = "Kunde bearbeiten";
    } else {
      text = "Kunde erfassen";
    }
    return text;
  }

  private async save(): Promise<void> {
    if ((this.$refs.form as Vue & { validate: () => boolean; }).validate()) {
      this.editedItem.type = new ClientType();
      this.editedItem.type.id = this.customerTypes.find((typeClient) => (
        typeClient.acronym === this.typeNewCustomer
      ))?.id;

      if (this.editing) {
        const idxOfChange = this.clients.findIndex((value: ClientDisplay) => value.id === this.editedItem.id);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.editedItem.createdOn = new Date(this.clients[idxOfChange].created_on!);
        this.editedItem.modifiedOn = new Date();
        this.editedItem.type.acronym = this.typeNewCustomer;
        this.clients[idxOfChange] = {
          id: this.editedItem.id,
          type: this.editedItem.type.acronym,
          name: this.editedItem.name,
          street: this.editedItem.street,
          place: this.editedItem.place,
          zipcode: this.editedItem.zipcode,
          phone: this.editedItem.phone,
          email: this.editedItem.email,
          modified_on: format(new Date(this.editedItem.modifiedOn), "YYYY-MM-DD HH:mm"),
          created_on: format(new Date(this.editedItem.createdOn), "YYYY-MM-DD HH:mm"),
          modified_by: this.$store.state.firstAndLastName,
        };
        this.clients.push({
        });
        this.clients.pop();
      }

      await this.$nextTick(async () => {
        await this.persistClient(this.editedItem);
        this.editedItem.type = new ClientType();
        this.editedItem = new Client();
        this.typeNewCustomer = "";
        (this.$refs.form as Vue & { resetValidation: () => void; }).resetValidation();
        this.dialog = false;
        this.editing = false;
      });
    }
  }

  private close(): void {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = new Client();
      this.typeNewCustomer = "";
      this.editing = false;
      (this.$refs.form as Vue & { resetValidation: () => void; }).resetValidation();
    });
  }

  private editItem(item: ClientDisplay): void {
    if (item.id) {
      this.editedItem.id = item.id;
      this.editedItem.type = new ClientType();
      this.editedItem.type.acronym = item.type;
      this.editedItem.name = item.name;
      this.editedItem.street = item.street;
      this.editedItem.place = item.place;
      this.editedItem.phone = item.phone;
      this.editedItem.zipcode = item.zipcode;
      this.editedItem.email = item.email;

      this.dialog = true;
      this.editing = true;

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
      }
      if (this.editedItem.type.acronym) {
        this.typeNewCustomer = this.editedItem.type.acronym;
      }
    }
  }

  private async persistClient(client: Client): Promise<void> {
    if (this.editing) {
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
        return;
      }
      await DirectusAPI.updateTrpClient(client);
    } else {
      await DirectusAPI.createTrpClient(client);
    }
  }

  private async search(): Promise<TrpClient[]> {
    const client: TrpClient[] = [];

    const data = new Map();
    data.set("id", this.id);
    data.set("name", this.name);
    data.set("street", this.street);
    data.set("zipcode", this.zip);
    data.set("place", this.place);
    data.set("phone", this.phone);
    data.set("email", this.email);
    data.set("type", this.type);

    const filteredData = new Map();

    data.forEach((value, key) => {
      if (value) {
        filteredData.set(key, value);
      }
    });

    const filter: Record<string, unknown> = {
    };

    if (filteredData.size > 0) {
      await filteredData.forEach((value, key) => {
        if (key !== "id" || key !== "type") {
          filter[key] = {
            like: value,
          };
        }
        if (key === "id") {
          filter[key] = value;
        }
        if (key === "type") {
          const type = this.customerTypes.find((typeClient) => (typeClient.acronym === value))?.id;
          if (type) {
            filter[key] = type;
          }
        }
      });
      const resp = await DirectusAPI.getTrpClients(filter, this.limit);
      return resp;
    }
    return client;
  }

  private closePermissions(): void {
    this.warnPermissions = false;
  }

  private exportCustomers(): void {
    if (!(this.clients.length > 0 && this.clients[0].id)) {
      return;
    }

    const collectionFields: string[] = [];

    this.headers.forEach((elemt) => {
      collectionFields.push(elemt.value);
    });

    const csv = ExportCSV.createCsvClients(
      collectionFields,
      this.clients,
    );
    ExportCSV.sendCsvDownload("clients.csv", csv);
  }
}
</script>
