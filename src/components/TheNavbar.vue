<template>
    <div>
        <b-navbar type="light" variant="light" fixed="top">
            <b-navbar-brand href="#">Calendar Sync</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <b-button @click.prevent="signInOrOut" size="sm">{{ signingLabel }}</b-button>
                    </b-nav-form>

                    <b-nav-item-dropdown :text="$i18n.locale | uppercase" right>
                        <b-dropdown-item @click="$i18n.locale = 'pl'">Polski - PL</b-dropdown-item>
                        <b-dropdown-item @click="$i18n.locale = 'en'">English - EN</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown right v-if="signedIn">
                        <!-- Using 'button-content' slot -->
                        <template slot="button-content">{{ $store.state.userProfile.ig }}</template>
                        <b-dropdown-item v-b-modal.my-modal>{{ $t("settings") }}</b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <b-modal id="my-modal">
            <template slot="modal-title">
                {{ $t("settings") }}
            </template>
            <b-form-checkbox-group id="selectedCalendars" v-model="selectedCalendars" name="selectedCalendars" plain>
                <ul>
                    <li v-for="calendar in $store.state.userCalendars" :key="calendar.id">
                        <b-form-checkbox :id="calendar.id" :value="calendar.summary">
                            <b-badge :style="{ backgroundColor: calendar.backgroundColor, color: calendar.foregroundColor }">{{ calendar.summary }}</b-badge>
                        </b-form-checkbox>
                    </li>
                </ul>
            </b-form-checkbox-group>
        </b-modal>
    </div>
</template>

<script>
    export default {
        name: "TheNavbar",
        data() {
            return {
                selectedCalendars: []
            }
        },
        computed: {
            signedIn() {
                return this.$store.state.userProfile != null;
            },
            signingLabel() {
                return this.signedIn ? this.$t("signOut") : this.$t("signIn");
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
        }
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
    }

    div.custom-checkbox {
        /*margin-top: 20px;*/
    }
</style>
