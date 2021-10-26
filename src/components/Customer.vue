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
              <v-row class="mt-n9">
                <v-col>
                  <v-text-field
                    v-model="editedItem.name"
                    label="Firma/Name"
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
            :items="customerTypes"
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
            label="Firma/Name"
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
import DirectusAPI from "@/services/DirectusAPI";
import { Component, Vue } from "vue-property-decorator";
import Client from "../model/Client";
import { format } from "fecha";
import ExportCSV from "@/services/ExportCSV";
import DialogPermissions from "@/components/subComponents/DialogPermissions.vue";

@Component({
  components: {
    DialogPermissions,
  },
})
export default class NewShipment extends Vue {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  private dialog = false;
  // @ts-ignore
  private warnPermissions = false;
  private editing = false;
  // @ts-ignore
  private valid = true;
  // @ts-ignore
  private name = "";
  // @ts-ignore
  private street = "";
  // @ts-ignore
  private zip = "";
  // @ts-ignore
  private place = "";
  // @ts-ignore
  private phone = "";
  // @ts-ignore
  private email = "";
  // @ts-ignore
  private id = "";
  // @ts-ignore
  private type = "";
  // @ts-ignore
  private typeNewCustomer = "";
  // @ts-ignore
  private customerTypesNew = ["mova", "extern"];
  // @ts-ignore
  private customerTypes = ["mova", "extern", "ohne Typ suchen"];
  // @ts-ignore
  private editedItem = new Client();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private clients: any = [{}];
  // @ts-ignore
  private limit = 100;
  // @ts-ignore
  private limitTypes = [-1, 5, 50, 100, 200];
  // @ts-ignore
  private nameRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
  ];
  // @ts-ignore
  private zipRules = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => !!v || "Wert ist erforderlich",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) =>
      /([1-468][0-9]|[57][0-7]|9[0-6])[0-9]{2}/.test(v) || "PLZ ist ungültig",
  ];
  // @ts-ignore
  private phoneRules = [
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    (v: string) => {
      if (v) {
        if (v.length > 0) {
          return (
            /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(
              v
            ) || "Telefonnummer ist ungültig"
          );
        }
      } else {
        return true;
      }
    },
  ];

  // @ts-ignore
  private emailRules = [
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    (v: string) => {
      if (v) {
        if (v.length > 0) {
          return /.+@.+\..+/.test(v) || "E-mail ist ungültig";
        }
      } else {
        return true;
      }
    },
  ];

  // @ts-ignore
  private headers = [
    { text: "Actions", value: "actions", sortable: false },
    {
      text: "Kunden ID",
      align: "start",
      value: "id",
    },
    { text: "Typ", value: "type" },
    { text: "Firma/Name", value: "name" },
    { text: "Strasse", value: "street" },
    { text: "PLZ", value: "zipcode" },
    { text: "Ort", value: "place" },
    { text: "Telefon", value: "phone" },
    { text: "Email", value: "email" },
    { text: "modified_on", value: "modified_on" },
    { text: "created_on", value: "created_on" },
    { text: "modified_by", value: "modified_by" },
  ];

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  mounted() {
    window.addEventListener("keyup", this.handleEnter);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  destroyed() {
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

    await clientsTable.forEach((value: Client) => {
      this.clients.push({
        id: value.id,
        // @ts-ignore
        type: value.type.acronym,
        name: value.name,
        street: value.street,
        place: value.place,
        zipcode: value.zipcode,
        phone: value.phone,
        email: value.email,
        // @ts-ignore
        modified_on: format(new Date(value.modified_on), "YYYY-MM-DD HH:mm"),
        // @ts-ignore
        created_on: format(new Date(value.created_on), "YYYY-MM-DD HH:mm"),
        modified_by:
          // @ts-ignore
          value.modified_by.first_name + " " + value.modified_by.last_name,
      });
    });
  }

  // @ts-ignore
  private formTitle(): string {
    let text = "";

    if (this.editing) {
      text = "Kunde bearbeiten";
    } else {
      text = "Kunde erfassen";
    }
    return text;
  }
  // @ts-ignore
  private async save(): Promise<void> {
    // @ts-ignore
    if (this.$refs.form.validate()) {
      switch (this.typeNewCustomer) {
        case "mova":
          this.editedItem.type = 1;
          break;
        case "extern":
          this.editedItem.type = 2;
          break;
        default:
          this.editedItem.type = 2;
          break;
      }

      await this.$nextTick(async () => {
        await this.persistClient(this.editedItem);
        // @ts-ignore
        this.editedItem.type = this.typeNewCustomer;
        this.editedItem = new Client();
        this.typeNewCustomer = "";
        // @ts-ignore
        this.$refs.form.resetValidation();
        this.dialog = false;
        this.editing = false;
      });
    }
  }

  // @ts-ignore
  private close(): void {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = new Client();
      this.typeNewCustomer = "";
      this.editing = false;
      // @ts-ignore
      this.$refs.form.resetValidation();
    });
  }

  // @ts-ignore
  private editItem(item: Client): void {
    if (item.id) {
      this.editedItem = item;
      this.dialog = true;
      this.editing = true;

      if (
        this.$store.state.authorisation === "Public" ||
        this.$store.state.authorisation === "Lagerbauten" ||
        this.$store.state.authorisation === "Dienstleiter/in" ||
        this.$store.state.authorisation === "Besteller/in" ||
        this.$store.state.authorisation === "Ressortleitung" ||
        this.$store.state.authorisation === "Bereichsleitung Infra" ||
        this.$store.state.authorisation === "Programmmaterial" ||
        this.$store.state.authorisation === "Lagerplatz"
      ) {
        this.warnPermissions = true;
      }

      // @ts-ignore
      if (this.editedItem.type === "external") {
        this.typeNewCustomer = "extern";
      } else {
        // @ts-ignore
        this.typeNewCustomer = this.editedItem.type;
      }
    }
  }

  private async persistClient(client: Client): Promise<void> {
    if (this.editing) {
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

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await DirectusAPI.directusAPI.updateItem("trp_client", client.id!, {
        type: client.type,
        name: client.name,
        street: client.street,
        place: client.place,
        zipcode: client.zipcode,
        phone: client.phone,
        email: client.email,
      });
    } else {
      await DirectusAPI.directusAPI.createItem("trp_client", {
        type: client.type,
        name: client.name,
        street: client.street,
        place: client.place,
        zipcode: client.zipcode,
        phone: client.phone,
        email: client.email,
      });
    }
  }

  private async search(): Promise<Client[]> {
    let client: Client[] = [];

    const data = new Map();
    data.set("id", this.id);
    data.set("name", this.name);
    data.set("street", this.street);
    data.set("zipcode", this.zip);
    data.set("place", this.place);
    data.set("phone", this.phone);
    data.set("email", this.email);
    data.set("type", this.type);

    let filteredData = new Map();

    data.forEach((value, key) => {
      if (value) {
        filteredData.set(key, value);
      }
    });

    if (filteredData.size > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let filter: any = {};

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await filteredData.forEach((value, key) => {
        if (key !== "id" || key !== "type") {
          filter[key] = { like: value };
        }
        if (key === "id") {
          filter[key] = value;
        }
        if (key === "type") {
          switch (value) {
            case "mova":
              filter[key] = 1;
              break;
            case "extern":
              filter[key] = 2;
              break;
            case "ohne Typ suchen":
              break;
            default:
              break;
          }
        }
      });

      let response = await DirectusAPI.directusAPI.getItems("trp_client", {
        filter,
        limit: this.limit,
        fields: ["*", "modified_by.*.*", "type.*.*"],
      });

      await response.data.forEach((value) => {
        let currentClient = Object.assign(new Client(), value);
        client?.push(currentClient);
      });
      return client;
    }
    return client;
  }

  // @ts-ignore
  private closePermissions(): void {
    this.warnPermissions = false;
  }

  //@ts-ignore
  private exportCustomers(): void {
    if (!(this.clients.length > 0 && this.clients[0].id)) {
      return;
    }

    //@ts-ignore
    const collectionFields = [];

    this.headers.forEach((elemt) => {
      collectionFields.push(elemt.value);
    });

    const csv = ExportCSV.createCsvClients(
      //@ts-ignore
      collectionFields,
      this.clients
    );
    ExportCSV.sendCsvDownload("clients.csv", csv);
  }
}
</script>
