<template>
  <!-- Menu Bar -->
  <v-app>
    <v-main>
      <nav>
        <v-card class="mx-auto overflow-hidden">
          <v-app-bar
            app
            color="grey darken-4"
            dark
          >
            <v-app-bar-nav-icon @click="drawer = true" />

            <v-toolbar-title>TraMat</v-toolbar-title>
            <v-spacer />
            <v-btn
              class="mr-3"
              rounded
              outlined
              text
              color="blue"
              @click="dialog = true"
            >
              Hilfe
              <v-icon
                right
                dark
              >
                mdi-face-agent
              </v-icon>
            </v-btn>
            <v-btn
              class="mr-3"
              rounded
              outlined
              text
              color="blue"
              @click="openTap()"
            >
              Open tap
              <v-icon
                right
                dark
              >
                mdi-plus
              </v-icon>
            </v-btn>
            <v-btn
              rounded
              outlined
              text
              color="blue"
              @click="logOut()"
            >
              Logout
              <v-icon
                right
                dark
              >
                mdi-exit-to-app
              </v-icon>
            </v-btn>
          </v-app-bar>
        </v-card>

        <!-- Navigation -->
        <v-navigation-drawer
          v-model="drawer"
          temporary
          app
        >
          <v-list
            nav
            dense
          >
            <v-list-item-group
              v-model="group"
              active-class="deep-grey--text text--accent-4"
            >
              <v-list-item
                router
                :to="{path:'home'}"
              >
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>

              <v-list-item
                router
                :to="{path:'account'}"
              >
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Account</v-list-item-title>
              </v-list-item>

              <v-list-item
                router
                :to="{path:'customer'}"
              >
                <v-list-item-icon>
                  <v-icon>mdi-account-box-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Kunden</v-list-item-title>
              </v-list-item>

              <v-list-item
                router
                :to="{path:'search'}"
              >
                <v-list-item-icon>
                  <v-icon>mdi-feature-search</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Transport suchen</v-list-item-title>
              </v-list-item>

              <v-list-item
                router
                :to="{path:'new'}"
              >
                <v-list-item-icon>
                  <v-icon>mdi-truck</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Transport erfassen</v-list-item-title>
              </v-list-item>

              <v-list-item
                router
                :to="{path:'scheduling'}"
              >
                <v-list-item-icon>
                  <v-icon>mdi-chart-timeline</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Disposition</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </nav>
      <router-view />
      <!-- help PopUp-->
      <div class="text-center">
        <v-dialog
          v-model="dialog"
          width="600"
        >
          <v-card>
            <v-card-title class="headline grey lighten-2">
              Hilfe / Support TraMat
            </v-card-title>
            <v-card-text>
              <br>
              <b> Wiki & Dokumentation </b>
              <br>
              TraMat, LOGomat & LOGdb - Wiki & FAQ -
              <a
                href="https://avanti.bula21.ch/x/ugrJAQ"
                target="_blank"
              >https://avanti.bula21.ch/x/ugrJAQ</a>
              <br> <br>
              <b> Kontakt </b>
              <br>
              Bitte Fragen an: <a
                href="https://bulacafe21.slack.com/archives/C01Q6N2HL2X"
                target="_blank"
              >
                #20_log_21_trp_tramat_request</a>
              oder löse ein Ticket über den
              <a
                href="https://voila.bula21.ch/servicedesk/customer/portal/8"
                target="_blank"
              >
                Service Desk</a>.
              <br><br>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                text
                @click="dialog = false"
              >
                Thanks, I got it!
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DirectusAPI from "@/services/DirectusAPI";

@Component
export default class NavigationMenu extends Vue {
  private drawer = false;
  private group = null;
  private dialog = false;

  async logOut(): Promise<void> {
    try {
      await DirectusAPI.logout();
    } finally {
      await this.$router.push({
        name: "login",
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async openTap(): Promise<void> {
    const newTap = await window.open(window.location.href);

    setTimeout(async () => {
      await newTap?.postMessage(
        await sessionStorage.getItem(DirectusAPI.STORAGE_KEY),
        `${window.location.protocol}//${window.location.host}`,
      );
    }, 2000);
  }
}
</script>
