<template>
    <div class="modal-card" style="width: 300px">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ $t("settings") }}</p>
        </header>
        <section class="modal-card-body">
            <div class="block has-text-left">
                <ul>
                    <li v-for="calendar in $store.state.userCalendars" :key="calendar.id">
                        <b-checkbox v-model="selectedCalendars" :native-value="calendar.id" type="is-info">
                            <span class="tag" :style="{ backgroundColor: calendar.backgroundColor, color: calendar.foregroundColor }">
                                <b>{{ calendar.summary }}</b>
                            </span>
                        </b-checkbox>
                    </li>
                </ul>
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">Close</button>
            <button class="button is-info" @click="submitCalendars">Login</button>
        </footer>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedCalendars: this.$store.state.subscribedCalendars
            }
        },
        methods: {
            submitCalendars() {
                this.$store
                    .dispatch("subscribeUserCalendars", this.selectedCalendars)
                    .then(this.$parent.close());
            }
        }
    }
</script>
