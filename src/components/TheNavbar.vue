<template>
    <div>
        <b-navbar :fixed-top="true" type="is-light">
            <template slot="brand">
                <b-navbar-item href="#">Calendar Sync</b-navbar-item>
            </template>

            <template slot="end">
                <b-navbar-item tag="div">
                    <div class="buttons">
                        <a class="button is-info" @click.prevent="signInOrOut">
                            <strong>{{ signingLabel }}</strong>
                        </a>

                        <b-dropdown aria-role="list" position="is-bottom-left">
                            <button class="button is-light" slot="trigger">
                                <span>{{ $i18n.locale | uppercase }}</span>
                                <b-icon icon="menu-down"></b-icon>
                            </button>

                            <b-dropdown-item aria-role="listitem" @click="$i18n.locale = 'pl'">Polski - PL</b-dropdown-item>
                            <b-dropdown-item aria-role="listitem" @click="$i18n.locale = 'en'">English - EN</b-dropdown-item>
                        </b-dropdown>

                        <b-dropdown aria-role="list" position="is-bottom-left" v-if="signedIn">
                            <button class="button is-light" slot="trigger">
                                <span>{{ $store.state.userProfile.ig }}</span>
                                <b-icon icon="menu-down"></b-icon>
                            </button>

                            <b-dropdown-item aria-role="listitem" @click="isSettingsModalActive = true">{{ $t("settings") }}</b-dropdown-item>
                        </b-dropdown>
                    </div>
                </b-navbar-item>
            </template>
        </b-navbar>
        <b-modal :active.sync="isSettingsModalActive" has-modal-card>
            <user-settings></user-settings>
        </b-modal>
    </div>
</template>

<script>
    import TheSettings from "./TheSettings";

    export default {
        name: "TheNavbar",
        data() {
            return {
                isSettingsModalActive: false,
                // selectedCalendars: []
            }
        },
        computed: {
            signedIn() {
                return this.$store.state.userProfile != null;
            },
            signingLabel() {
                return this.signedIn ? this.$t("signOut") : this.$t("signIn");
            },
            selectedCalendars() {
                return this.$store.state.subscribedCalendars;
            }
        },
        methods: {
            signInOrOut() {
                if (this.signedIn) {
                    this.$store.dispatch("signOut");
                } else {
                    this.$store.dispatch("signIn");
                }
            },
        },
        filters: {
            uppercase(value) {
                return value.toString().toUpperCase();
            }
        },
        components: {
            userSettings: TheSettings
        }
    }
</script>

<style scoped>
</style>
