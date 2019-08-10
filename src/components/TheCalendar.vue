<template>
    <div class="container">
        <vue-cal class="vuecal--green-theme" style="height: 650px"
                 show-all-day-events="short"
                 events-on-month-view="short"
                 today-button
                 :events="events" :locale="$i18n.locale">
        </vue-cal>
    </div>
</template>

<script>
    import VueCal from "vue-cal";
    import "vue-cal/dist/vuecal.css";
    import 'vue-cal/dist/i18n/pl.js'

    export default {
        name: "TheCalendar",
        computed: {
            events() {
                return this.$store.state.calendarEvents;
            }
        },
        components: { VueCal }
    };
</script>

<style>
    .vuecal__event.primary {
        background-color: rgba(253,156,66,.85);
        border: 1px solid #e9882e;
        color: #fff;
    }
</style>
