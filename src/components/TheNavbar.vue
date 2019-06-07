<template>
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
    export default {
        name: "TheNavbar",
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
            }
        },
        filters: {
            uppercase(value) {
                return value.toString().toUpperCase();
            }
        }
    }
</script>

<style scoped>
</style>
