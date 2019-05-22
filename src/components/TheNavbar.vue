<template>
    <b-navbar type="light" variant="light" fixed="top">
        <b-navbar-brand href="#">Calendar Sync</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-form>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">{{ $t("authorize") }}</b-button>
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
    export default {
        name: "TheNavbar"
    }
</script>

<style scoped>
</style>
