<template>
  <div id="app">
    <navbar @eventsLoaded="calendarEvents = $event"></navbar>
    <calendar :events="calendarEvents"></calendar>
  </div>
</template>

<script>
import TheNavbar from "./components/TheNavbar";
import TheCalendar from "./components/TheCalendar";

export default {
  name: 'app',
  data: () => ({
    calendarEvents: []
  }),
  components: {
    navbar: TheNavbar,
    calendar: TheCalendar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
