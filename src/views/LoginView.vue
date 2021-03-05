<template>
  <v-app>
    <!-- Login Module -->
    <v-main style="padding: 0px 0px 0px;">
      <!-- fill-height -->
      <v-container fluid>
        <v-col>
          <div align="center">
            <v-img
              src="../assets/Mova22_Logo-Slogan_black_def_rgb.png"
              max-width="15%"
            />
          </div>
          <v-card
            width="400"
            class="mx-auto mt-2"
            color="grey darken-4"
            dark
          >
            <v-card-title>
              <h1 class="display-1">
                Login TraMat
              </h1>
            </v-card-title>
            <v-alert
              v-if="errorMessage.length > 0"
              type="error"
            >
              {{ errorMessage }}
            </v-alert>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  autocomplete="on"
                  label="vorname.nachname@bula21.ch"
                  prepend-icon="mdi-account-circle"
                />
                <v-text-field
                  v-model="password"
                  autocomplete="on"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                />
              </v-form>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <!-- eslint-disable-next-line vue/no-unused-vars-->
              <v-btn
                color="success"
                @click="dialog = true"
              >
                Hilfe
              </v-btn>
              <v-spacer />
              <v-btn
                color="blue"
                @click="login()"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-container>
      <!-- help PopUp-->
      <div class="text-center">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
            <v-card-title class="headline grey lighten-2">
              Hilfe - Wie bekomme ich ein <br> Passwort für den TraMat?
            </v-card-title>
            <v-card-text>
              <br>
              Leider kannst du dich hier nicht direkt mit dem mova-Login
              einloggen. Aber mit einem kleinen Umweg gehts trotzdem...
              <br>
              Für den Login auf dem TraMat muss zuerst ein Passwort
              erstellt werden:
              <br><br>
              <ol>
                <li>
                  <a
                    href="https://log.bula21.ch/admin/#/login"
                    target="_blank"
                  >Diesen Link</a>
                  öffnen
                </li>
                <li>
                  Unten links auf das kleine runde mova-Logo klicken
                </li>
                <li>
                  Rechts "mova-Crew" auswählen
                </li>
                <li>Mit normaler mova Email und Passwort einloggen</li>
                <li>Ganz unten links auf das User-Icon klicken</li>
                <li>
                  Ein Passwort setzen
                </li>
                <li>Zum Speichern oben rechts auf das Häkchen klicken</li>
              </ol>
              <br>
              Kehre zu dieser Website (tramat.mova.ch) zurück und logge
              dich hier mit der mova-Email und dem gerade gesetzen Passwort
              ein.
              <br>
              Wenn du noch Fragen hast oder Probleme beim Login, melde dich
              einfach via Slack unter
              <a
                href="https://bulacafe21.slack.com/archives/C01Q6N2HL2X"
                target="_blank"
              >
                #20_log_21_trp_tramat_request</a>
              .
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
import DirectusAPI from "../services/DirectusAPI";

@Component
export default class LoginView extends Vue {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private showPassword = false;
  private password = "";
  private username = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private errorMessage = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private dialog = false;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  mounted() {
    window.addEventListener("keyup", this.handleEnter);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  destroyed() {
    window.removeEventListener("keyup", this.handleEnter);
  }

  private handleEnter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.login();
    }
  }

  async login(): Promise<void> {
    if (this.password === "" || this.username === "") {
      this.errorMessage = "Please enter username and password";
    } else {
      try {
        await DirectusAPI.login(this.username, this.password);
        await this.$router.push({ name: "main" });
      } catch (error) {
        this.errorMessage = "Login failed";
      }
    }
  }
}
</script>

<style scoped>
#app {
  background-image: url("../assets/rsz__dsc4062.png");
  background-size: cover;
  overflow: hidden;
}
</style>
