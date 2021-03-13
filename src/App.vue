<template>
  <v-app id="App">
    <router-view />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import router from "./router";
import DirectusAPI from "./services/DirectusAPI";

@Component({
  components: {},
})
export default class App extends Vue {
  constructor() {
    super();
    window.addEventListener("storage", (event) => {
      if (event.key === "LOGOUT") {
        DirectusAPI.directusAPI.config.reset();
        localStorage.clear();
        sessionStorage.clear();
        router.push({ name: "login" });
      }
    });

    window.addEventListener("message", (event) => {

      // Do we trust the sender of this message?  (might be
      // different from what we originally opened, for example).

      if (event.origin === window.location.protocol + "//" + window.location.host) {
        // all good
      } else {
        return;
      }

      const matchToken = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
      let token: string;

      try {
        token = event.data[0];
      } catch {
        token = "";
      }

      if (matchToken.test(token)) {
        DirectusAPI.directusAPI.config.token = token;
        DirectusAPI.directusAPI.config.localExp = event.data[1];
        DirectusAPI.directusAPI.api.auth.refresh(token);
      }
    });
  }
}
</script>
