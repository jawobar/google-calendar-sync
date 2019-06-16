import Vue from "vue";
import Vuex from "vuex";
import GoogleWrapper from "@/services/GoogleWrapper";

const gapi = new GoogleWrapper({
    apiKey: '',
    clientId: '',
    scope: '',
    discoveryDocs: [ 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest' ]
});

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        calendarEvents: [],
        userCalendars: [],
        userProfile: null
    },
    mutations: {
        setUserProfile: (state, userProfile) => {
            state.userProfile = userProfile;
        },
        setCalendarEvents: (state, events) => {
            state.calendarEvents = events;
        },
        setUserCalendars(state, calendars) {
            state.userCalendars = calendars;
        }
    },
    actions: {
        async signIn({ commit, dispatch }) {
            let userProfile = await gapi.signIn();
            commit("setUserProfile", userProfile);
            dispatch("fetchUserCalendars");
            dispatch("fetchCalendarEvents");
        },
        async signOut({ commit }) {
            await gapi.signOut();
            commit("setUserProfile", null);
            commit("setCalendarEvents", []);
        },
        async fetchCalendarEvents({ commit }) {
            let events = await gapi.loadPrimaryCalendarEvents();
            commit("setCalendarEvents", GoogleWrapper.convertEvents(events.result.items));
        },
        async fetchUserCalendars({ commit }) {
            let calendars = await gapi.loadUserCalendars();
            commit("setUserCalendars", calendars.result.items);
        }
    }
});
