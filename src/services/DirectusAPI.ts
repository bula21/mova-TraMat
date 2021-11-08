import DirectusSDK from "@directus/sdk-js";
import fecha from "fecha";
import store from "@/store";
import { Convert, Packaging, TransportState, TrpTypeClient, TrpTypePeople } from "./Quicktype";
import { ConvertTrpClient, TrpClient } from "./TrpClient";
import { AnlageClass, Construction, ConvertTrpOrder, Good, Person, TrpOrder } from "./TrpOrder";

// https://web.archive.org/web/20201028134719/https://docs.directus.io/guides/js-sdk.html
// https://web.archive.org/web/20200811211652/https://docs.directus.io/api/authentication.html#tokens
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
      * */
    this.directusSDK = new DirectusSDK({
      url: this.BASE_URL,
      mode: "jwt",
      project: this.PROJECT,
      persist: true,
      // eslint-disable-next-line
      // @ts-ignore
      storage: sessionStorage,
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
              * */
        email,
        password,
        url: this.BASE_URL,
        project: this.PROJECT,
        persist: true,
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
    const trpTypePeople: TrpTypePeople[] = Convert.toTrpTypePeople(JSON.stringify(typPeopleResp.data));
    return trpTypePeople;
  }

  public async fetchTrpTypeClient(): Promise<TrpTypeClient[]> {
    const resp = await this.directusSDK.getItems("trp_typ_client");
    const trpTypeClient: TrpTypeClient[] = Convert.toTrpTypeClient(JSON.stringify(resp.data));
    return trpTypeClient;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getAnlage(filter: any, limit: number): Promise<AnlageClass[]> {
    const resp = await this.directusSDK.getItems("anlage", {
      filter,
      limit,
    });
    const anlage: AnlageClass[] = ConvertTrpOrder.toAnlage(JSON.stringify(resp.data));
    return anlage;
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getTrpClients(filter: any, limit: number): Promise<TrpClient[]> {
    const resp = await this.directusSDK.getItems("trp_client", {
      filter,
      limit,
      fields: ["*", "modified_by.first_name", "modified_by.last_name", "modified_by.email", "type.*.*"],
    });
    const clients: TrpClient[] = ConvertTrpClient.toTrpClient(JSON.stringify(resp.data));
    return clients;
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
      email: client.email,
    });
  }

  public async createTrpClient(client: TrpClient): Promise<void> {
    await this.directusSDK.createItem("trp_client", {
      type: client.type?.id,
      name: client.name,
      street: client.street,
      place: client.place,
      zipcode: client.zipcode,
      phone: client.phone,
      email: client.email,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getTrpOrder(filter: any, limit: number): Promise<TrpOrder[]> {
    const resp = await this.directusSDK.getItems("trp_order", {
      filter,
      limit,
      fields: ["*.*.*", "modified_by.id", "modified_by.first_name", "modified_by.last_name", "modified_by.email", "state.*", "shipper.*", "shipper.type.*", "receiver.*", "receiver.type.*", "principal.*", "principal.type.*", "owner.id", "owner.first_name", "owner.last_name", "owner.email", "goods.*", "people.*", "construction.*", "anlage.*"],
    });
    const orders: TrpOrder[] = ConvertTrpOrder.toTrpOrder(JSON.stringify(resp.data));
    return orders;
  }

  public async createTrpOrder(order: TrpOrder): Promise<TrpOrder> {
    const resp = await this.directusSDK.createItem("trp_order", {
      remarks: order.remarks,
      state: 1, // means new shipment
      shipper: order.shipper?.id,
      receiver: order.receiver?.id,
      principal: order.principal?.id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      delivery_date: fecha.format(order.deliveryDate!, "YYYY-MM-DD HH:mm:ss"),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      pick_up_date: fecha.format(order.pickUpDate!, "YYYY-MM-DD HH:mm:ss"),
      anlage: order.anlage?.id,
      raster_lagerplatz: order.rasterLagerplatz,
      delivery_only: order.deliveryOnly,
    });
    const newOrder: TrpOrder[] = ConvertTrpOrder.toTrpOrder(JSON.stringify(resp.data));
    return newOrder[0];
  }

  public async updateTrpOrder(order: TrpOrder): Promise<TrpOrder> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const resp = await this.directusSDK.updateItem("trp_order", order.id!, {
      remarks: order.remarks,
      state: order.state,
      shipper: order.shipper?.id,
      receiver: order.receiver?.id,
      principal: order.principal?.id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      delivery_date: fecha.format(order.deliveryDate!, "YYYY-MM-DD HH:mm:ss"),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      pick_up_date: fecha.format(order.pickUpDate!, "YYYY-MM-DD HH:mm:ss"),
      anlage: order.anlage,
      raster_lagerplatz: order.rasterLagerplatz,
      delivery_only: order.deliveryOnly,
      statusdirectus: order.statusdirectus,
    });
    const updateTrpOrder: TrpOrder[] = ConvertTrpOrder.toTrpOrder(JSON.stringify(resp.data));
    return updateTrpOrder[0];
  }

  public deleteGoodsPos(id: number): void {
    this.directusSDK.deleteItem("trp_order_goods", id);
  }

  public async createGoodsPos(goods: Good, orderId: number): Promise<Good> {
    const resp = await this.directusSDK.createItem("trp_order_goods", {
      quantity: goods.quantity,
      packing_unit: goods.packingUnit,
      goods_description: goods.goodsDescription,
      marking: goods.marking,
      length: goods.length,
      height: goods.height,
      width: goods.width,
      gross_weight: goods.grossWeight,
      net_weight: goods.netWeight,
      value_chf: goods.valueChf,
      dangerous_goods: goods.dangerousGoods,
      order: orderId,
    });
    const newPos: Good = ConvertTrpOrder.toTrpGood(JSON.stringify(resp.data));
    return newPos;
  }

  public async createGoodsPosWithState(goods: Good, orderId: number): Promise<Good> {
    const resp = await this.directusSDK.createItem("trp_order_goods", {
      quantity: goods.quantity,
      packing_unit: goods.packingUnit,
      goods_description: goods.goodsDescription,
      marking: goods.marking,
      length: goods.length,
      height: goods.height,
      width: goods.width,
      gross_weight: goods.grossWeight,
      net_weight: goods.netWeight,
      value_chf: goods.valueChf,
      dangerous_goods: goods.dangerousGoods,
      order: orderId,
      statusdirectus: goods.statusdirectus,
    });
    const newPos: Good = ConvertTrpOrder.toTrpGood(JSON.stringify(resp.data));
    return newPos;
  }

  public async updateGoodsPos(goods: Good, posId: number, orderId: number): Promise<Good> {
    const resp = await this.directusSDK.updateItem("trp_order_goods", posId, {
      quantity: goods.quantity,
      packing_unit: goods.packingUnit,
      goods_description: goods.goodsDescription,
      marking: goods.marking,
      length: goods.length,
      height: goods.height,
      width: goods.width,
      gross_weight: goods.grossWeight,
      net_weight: goods.netWeight,
      value_chf: goods.valueChf,
      dangerous_goods: goods.dangerousGoods,
      order: orderId,
      statusdirectus: goods.statusdirectus,
    });
    const newPos: Good = ConvertTrpOrder.toTrpGood(JSON.stringify(resp.data));
    return newPos;
  }

  public deletePeoplePos(id: number): void {
    this.directusSDK.deleteItem("trp_order_people", id);
  }

  public async createPeoplePos(people: Person, orderId: number): Promise<Person> {
    const resp = await this.directusSDK.createItem("trp_order_people", {
      quantity_of_people: people.quantityOfPeople,
      type_people: people.typePeople,
      quantity_of_luggage: people.quantityOfLuggage,
      description_of_luagge: people.descriptionOfLuagge,
      length: people.length,
      height: people.height,
      width: people.width,
      weight: people.weight,
      order: orderId,
    });
    const newPos: Person = ConvertTrpOrder.toTrpPerson(JSON.stringify(resp.data));
    return newPos;
  }

  public async createPeoplePosWithState(people: Person, orderId: number): Promise<Person> {
    const resp = await this.directusSDK.createItem("trp_order_people", {
      quantity_of_people: people.quantityOfPeople,
      type_people: people.typePeople,
      quantity_of_luggage: people.quantityOfLuggage,
      description_of_luagge: people.descriptionOfLuagge,
      length: people.length,
      height: people.height,
      width: people.width,
      weight: people.weight,
      order: orderId,
      statusdirectus: people.statusdirectus,
    });
    const newPos: Person = ConvertTrpOrder.toTrpPerson(JSON.stringify(resp.data));
    return newPos;
  }

  public async updatePeoplePos(people: Person, posId: number, orderId: number): Promise<Person> {
    const resp = await this.directusSDK.updateItem("trp_order_people", posId, {
      quantity_of_people: people.quantityOfPeople,
      type_people: people.typePeople,
      quantity_of_luggage: people.quantityOfLuggage,
      description_of_luagge: people.descriptionOfLuagge,
      length: people.length,
      height: people.height,
      width: people.width,
      weight: people.weight,
      order: orderId,
      statusdirectus: people.statusdirectus,
    });
    const newPos: Person = ConvertTrpOrder.toTrpPerson(JSON.stringify(resp.data));
    return newPos;
  }

  public deleteConstPos(id: number): void {
    this.directusSDK.deleteItem("trp_order_construction", id);
  }

  public async createConstPos(constru: Construction, orderId: number): Promise<Construction> {
    const resp = await this.directusSDK.createItem("trp_order_construction", {
      quantity: constru.quantity,
      weight: constru.weight,
      description: constru.description,
      order: orderId,
    });
    const newPos: Construction = ConvertTrpOrder.toTrpConst(JSON.stringify(resp.data));
    return newPos;
  }

  public async createConstruPosWithState(constru: Construction, orderId: number): Promise<Construction> {
    const resp = await this.directusSDK.createItem("trp_order_construction", {
      quantity: constru.quantity,
      weight: constru.weight,
      description: constru.description,
      order: orderId,
      statusdirectus: constru.statusdirectus,
    });
    const newPos: Construction = ConvertTrpOrder.toTrpConst(JSON.stringify(resp.data));
    return newPos;
  }

  public async updateConstruePos(constru: Construction, posId: number, orderId: number): Promise<Construction> {
    const resp = await this.directusSDK.updateItem("trp_order_construction", posId, {
      quantity: constru.quantity,
      weight: constru.weight,
      description: constru.description,
      order: orderId,
      statusdirectus: constru.statusdirectus,
    });
    const newPos: Construction = ConvertTrpOrder.toTrpConst(JSON.stringify(resp.data));
    return newPos;
  }

  public getToken(): string | undefined {
    return this.directusSDK.config.token;
  }

  public getlocalExp(): number {
    if (this.directusSDK.config.localExp !== undefined) {
      return this.directusSDK.config.localExp;
    }
    return 0;
  }
}

export default new DirectusAPI();
