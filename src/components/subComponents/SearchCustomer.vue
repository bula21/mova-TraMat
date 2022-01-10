<template>
  <v-container>
    <v-row class="my-1" />
    <v-form ref="form">
      <h3 class="mt-3 headline">
        Kunde suchen
      </h3>
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
        :lg="4"
        :md="4"
        :sm="5"
        class="text-left"
      >
        <v-btn
          color="orange"
          dark
          @click="close()"
        >
          Schliessen
        </v-btn>
      </v-col>
      <v-col
        :lg="4"
        :md="4"
        :sm="6"
        class="text-right"
      >
        <v-btn
          color="blue"
          dark
          @click="populateTable()"
        >
          Suchen
        </v-btn>
      </v-col>
    </v-row>
    <h3 class="mb-5 mt-0">
      Ergebnisse
    </h3>
    <v-data-table
      dense
      :headers="headers"
      :items="clients"
      item-key="idT"
      class="elevation-1"
      sort-by="id"
    >
      <template #[`item.actions`]="{ item }">
        <v-btn
          small
          rounded
          dark
          color="blue"
          @click="selectItem(item)"
        >
          Auswählen
          <v-icon
            dark
            right
          >
            mdi-check
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CloneDeep from "lodash/cloneDeep";
import DirectusAPI from "@/services/DirectusAPI";
import Client from "@/model/Client";
import { TRP_TYP_CLIENT_STRING } from "../Const";
import ClientType from "@/model/ClientType";

@Component
export default class SearchCustomer extends Vue {
  private name = "";
  private street = "";
  private zip = "";
  private place = "";
  private phone = "";
  private email = "";
  private id = "";
  private type = "";
  private customerTypes: string[] = [];
  private choosenItem = new Client();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private clients: any = [{
  }];

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

    const resp = await DirectusAPI.fetchTrpTypeClient();
    resp.forEach((clientType) => {
      this.customerTypes.push(clientType.acronym);
    });
    this.customerTypes.push("ohne Typ suchen");
  }

  destroyed(): void {
    window.removeEventListener("keyup", this.handleEnter);
  }

  private async handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      await this.populateTable();
    }
    if (event.key === "Escape") {
      await this.close();
    }
  }

  private async populateTable(): Promise<void> {
    let clientsTable = [];
    this.clients = [];
    clientsTable = await this.search();

    clientsTable.forEach((value: Client) => {
      this.clients.push({
        id: value.id,
        type: value.type?.acronym,
        name: value.name,
        street: value.street,
        place: value.place,
        zipcode: value.zipcode,
        phone: value.phone,
        email: value.email,
        modified_on: value.modifiedOn,
        created_on: value.createdOn,
        modified_by:
          `${value.modifiedBy?.firstName} ${value.modifiedBy?.lastName}`,
      });
    });
  }

  private async close(): Promise<void> {
    this.$emit("closeSearch");
    await this.$nextTick(async () => {
      this.choosenItem = new Client();
      await this.$store.commit("changeSearchToEmpty");
    });

    (this.$refs.form as Vue & { reset: () => boolean; }).reset();
  }

  private async selectItem(item: Client): Promise<void> {
    if (item.id) {
      this.choosenItem = CloneDeep(item);

      if (this.choosenItem.type === TRP_TYP_CLIENT_STRING.mova) {
        this.choosenItem.type = new ClientType();
        this.choosenItem.type.id = 1;
      } else if (this.choosenItem.type === TRP_TYP_CLIENT_STRING.external) {
        this.choosenItem.type = new ClientType();
        this.choosenItem.type.id = 2;
      }
      await this.$nextTick(async () => {
        await this.$emit("clientUpdate", this.choosenItem);
        this.choosenItem = new Client();
      });
      this.$emit("closeSearch");

      (this.$refs.form as Vue & { reset: () => boolean; }).reset();
    }
  }

  private async search(): Promise<Client[]> {
    const client: Client[] = [];

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

    if (filteredData.size > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = {
      };

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
      const response = await DirectusAPI.getTrpClients(filter, -1);
      return response;
    }
    return client;
  }
}
</script>
