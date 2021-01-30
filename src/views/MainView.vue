<template>
  <v-main style="padding: 0px 0px 0px;">
    <NavigationMenu />
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavigationMenu from "@/components/NavigationMenu.vue";

@Component({
  components: {
    NavigationMenu,
  },
})
export default class MainView extends Vue {}
</script>
