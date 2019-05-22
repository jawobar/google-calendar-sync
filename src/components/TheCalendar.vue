<template>
  <div class="container">
    <vue-cal :locale="$i18n.locale" class="vuecal--green-theme" style="height: 450px"></vue-cal>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

export default {
  name: "TheCalendar",
  components: { VueCal }
};
</script>

<style scoped>
</style>
