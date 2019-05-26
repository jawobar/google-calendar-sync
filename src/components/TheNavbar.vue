<template>
    <b-navbar type="light" variant="light" fixed="top">
        <b-navbar-brand href="#">Calendar Sync</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-button @click.prevent="signInOrOut" size="sm">{{ signingLabel }}</b-button>
                </b-nav-form>

                <b-nav-item-dropdown text="Lang" right>
                    <b-dropdown-item @click="$i18n.locale = 'pl'">PL</b-dropdown-item>
                    <b-dropdown-item @click="$i18n.locale = 'en'">EN</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right>
                    <!-- Using 'button-content' slot -->
                    <template slot="button-content"><em>User</em></template>
                    <b-dropdown-item href="#">Profile</b-dropdown-item>
                    <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    import moment from "moment";

    export default {
        name: "TheNavbar",
        data: () => ({
            signedIn: false
        }),
        computed: {
            signingLabel() {
                return this.signedIn ? this.$t("signedIn") : this.$t("signedOut");
            }
        },
        methods: {
            signInOrOut() {
                if (this.signedIn) {
                    this.$gapi.signOut()
                        .then(() => {
                            this.signedIn = false;
                        })
                } else {
                    this.$gapi.signIn()
                        .then(() => {
                            //console.log('Signed in as %s', user.name);
                            this.signedIn = true;
                            return this.$gapi.request({
                                path: "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                                method: "GET",
                                params: {
                                    'timeMin': (new Date()).toISOString(),
                                    'showDeleted': false,
                                    'singleEvents': true,
                                    'maxResults': 10,
                                    'orderBy': 'startTime'
                                }
                            });
                        })
                        .then(response => {
                            const eventsLoaded = response.result.items;
                            const events = [];
                            if (eventsLoaded.length > 0) {

                                for (var i = 0; i < eventsLoaded.length; i++) {
                                    const event = {};

                                    event.start = eventsLoaded[i].start.dateTime;
                                    if (!event.start) {
                                        event.start = eventsLoaded[i].start.date;
                                        event.allDay = true;
                                    } else {
                                        event.start = moment(event.start).format("YYYY-MM-DD HH:mm");
                                    }

                                    event.end = eventsLoaded[i].end.dateTime;
                                    if (!event.end) {
                                        event.end = eventsLoaded[i].end.date;
                                    } else {
                                        event.end = moment(event.end).format("YYYY-MM-DD HH:mm");
                                    }

                                    event.title = eventsLoaded[i].summary;

                                    // event.start = "2019-05-29";
                                    // event.end = "2019-05-30";
                                    event.content = '<i class="v-icon material-icons">shopping_cart</i>';
                                    event.class = 'leisure';

                                    events.push(event);

                                }
                            }
                            // console.log(events);
                            this.$emit("eventsLoaded", events);
                        })
                        .catch(err => {
                            console.error('Not signed in: %s', err.error)
                        })
                }
            }
        }
    }
</script>

<style scoped>
</style>
