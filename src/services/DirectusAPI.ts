import DirectusSDK from "@directus/sdk-js";
import store from "@/store";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BASE_URL = "https://log.bula21.ch/";
const PROJECT = "LOGdb";

//https://web.archive.org/web/20201028134719/https://docs.directus.io/guides/js-sdk.html
class DirectusAPI {

    private directusSDK: DirectusSDK;
    public STORAGE_KEY = "directus-sdk-js";

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
            url: BASE_URL,
            mode: "jwt",
            project: PROJECT,
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
                url: BASE_URL,
                project: PROJECT,
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

    public get directusAPI(): DirectusSDK {
        return this.directusSDK;
    }


}

export default new DirectusAPI();