import DirectusSDK from "@directus/sdk-js";
import store from "@/store";
import { Convert, Packaging, TransportState, TrpTypePeople } from "./Quicktype";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment

//https://web.archive.org/web/20201028134719/https://docs.directus.io/guides/js-sdk.html
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
        console.log(typPeopleResp.data);
        const TrpTypePeople: TrpTypePeople[] = Convert.toTrpTypePeople(JSON.stringify(typPeopleResp.data));
        return TrpTypePeople;
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