import DirectusSDK from "@directus/sdk-js";
import store from "@/store";
import { Convert, Packaging, TransportState, TrpTypeClient, TrpTypePeople } from "./Quicktype";
import { ConvertTrpClient, TrpClient } from "./TrpClient";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment

// https://web.archive.org/web/20201028134719/https://docs.directus.io/guides/js-sdk.html
class DirectusAPI {
  private directusSDK: DirectusSDK;
  public STORAGE_KEY = "directus-sdk-js";
  public BASE_URL = "https://log.bula21.ch/";
  public PROJECT = "LOGdb";

  constructor() {
    /**
      params
       //IConfigurationOptions
         * The URL of the direcuts CMS
        url: string;
         * The token to authenticate if preferred
        token?: string;
         * Project namespace
        project: string;
        * Default login expiration as number in ms
        localExp?: number;
         * If the token should be persitated or rehydrated
        persist?: boolean;
         * Whether to use cookies or JWTs
        mode: AuthModes;
         * Auto token expiration time
        tokenExpirationTime ?: number;
        *storage
        storage?: IStorageAPI;
      **/
    this.directusSDK = new DirectusSDK({
      url: this.BASE_URL,
      mode: "jwt",
      project: this.PROJECT,
      persist: true,
      // eslint-disable-next-line
      // @ts-ignore
      storage: sessionStorage
    });
  }

  public login = async (email: string, password: string) => {
    store.commit("authRequested");

    try {
      await this.directusSDK.login({
        /**
                  params
                  //ILoginCredentials
                  email: string;
                  password: string;
                  url?: string;
                  project?: string;
                  persist?: boolean;
                  otp?: string;
                  (// ILoginOptions
                  persist: boolean;
                  storage: boolean;
                  mode: AuthModes;)
              **/
        email: email,
        password: password,
        url: this.BASE_URL,
        project: this.PROJECT,
        persist: true
      });
      store.commit("loginSuccess");
    } catch (error) {
      store.commit("loginFailed");
      throw new Error("Login failed");
    }
  };

  public async logout(): Promise<void> {
    try {
      await this.directusSDK.logout();
    } finally {
      this.directusSDK.config.reset();
      store.commit("logout");
    }
  }

  public reset(): void {
    this.directusSDK.config.reset();
  }

  public async fetchAuthorisation(): Promise<string[]> {
    const roles = await this.directusSDK.getRoles();
    let myRole = await this.directusSDK.getMyPermissions();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    myRole = myRole.data[0].role;

    let roleName = "";
    let roleDescri = "";

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roles.data.forEach((element) => {
      if (element.id === myRole) {
        roleName = element.name;
        roleDescri = element.description;
      }
    });
    return [roleName, roleDescri];
  }

  public async fetchNameEmail(): Promise<string[]> {
    const user = await this.directusSDK.getMe();
    return [user.data.first_name, user.data.last_name, user.data.email];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getTrpClients(filter: any, limit: number): Promise<TrpClient[]> {
    const resp = await this.directusSDK.getItems("trp_client", {
      filter,
      limit: limit,
      fields: ["*", "modified_by.*.*", "type.*.*"]
    });
    const clients: TrpClient[] = ConvertTrpClient.toTrpClient(JSON.stringify(resp.data));
    return clients;
  }

  public async fetchTrpState(): Promise<TransportState[]> {
    const fetchStates = await this.directusSDK.getItems("trp_state");
    const transpState: TransportState[] = Convert.toTransportState(JSON.stringify(fetchStates.data));
    return transpState;
  }

  public async fetchPackaging(): Promise<Packaging[]> {
    const featchPackaging = await this.directusSDK.getItems("trp_packing_unit");
    const packaging: Packaging[] = Convert.toPackaging(JSON.stringify(featchPackaging.data));
    return packaging;
  }

  public async fetchTrpTypePeople(): Promise<TrpTypePeople[]> {
    const typPeopleResp = await this.directusSDK.getItems("trp_typ_people");
    const TrpTypePeople: TrpTypePeople[] = Convert.toTrpTypePeople(JSON.stringify(typPeopleResp.data));
    return TrpTypePeople;
  }

  public async fetchTrpTypeClient(): Promise<TrpTypeClient[]> {
    const resp = await this.directusSDK.getItems("trp_typ_client");
    const trpTypeClient: TrpTypeClient[] = Convert.toTrpTypeClient(JSON.stringify(resp.data));
    return trpTypeClient;
  }

  public async updateTrpClient(client: TrpClient): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.directusSDK.updateItem("trp_client", client.id!, {
      type: client.type?.id,
      name: client.name,
      street: client.street,
      place: client.place,
      zipcode: client.zipcode,
      phone: client.phone,
      email: client.email
    });
  }

  public async createTrpClient(client: TrpClient): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.directusSDK.createItem("trp_client", {
      type: client.type?.id,
      name: client.name,
      street: client.street,
      place: client.place,
      zipcode: client.zipcode,
      phone: client.phone,
      email: client.email
    });
  }
  
  public async getTrpOrder(filter: any, limit: number): Promise<TrpClient[]> {
    const resp = await this.directusSDK.getItems("trp_client", {
      filter,
      limit: limit,
      fields: ["*", "modified_by.*.*", "type.*.*"]
    });
    const clients: TrpClient[] = ConvertTrpClient.toTrpClient(JSON.stringify(resp.data));
    return clients;
  }
  
  
  public async createTrpOrder(order: Order): Promise<void> {
    await this.directusSDK.createItem("trp_order", {
      remarks: order.remarks,
      state: 1, // means new shipment
      shipper: order.shipper!.id,
      receiver: order.receiver!.id,
      principal: order.principal!.id,
      delivery_date: format(order.delivery_date!, "YYYY-MM-DD HH:mm:ss"),
      pick_up_date: format(order.pick_up_date!, "YYYY-MM-DD HH:mm:ss"),
      anlage: order.anlage,
      raster_lagerplatz: order.rasterLagerplatz,
      delivery_only: order.delivery_only
    });
  }

  public getToken(): string | undefined {
    return this.directusSDK.config.token;
  }

  public getlocalExp(): number {
    if (this.directusSDK.config.localExp !== undefined) {
      return this.directusSDK.config.localExp;
    } else {
      return 0;
    }
  }
}

export default new DirectusAPI();
