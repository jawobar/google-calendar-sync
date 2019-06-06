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
        userProfile: null
    },
    mutations: {
        setUserProfile: (state, userProfile) => {
            state.userProfile = userProfile;
        },
        setCalendarEvents: (state, events) => {
            state.calendarEvents = events;
        }
    },
    actions: {
        async signIn({ commit, dispatch }) {
            let userProfile = await gapi.signIn();
            commit("setUserProfile", userProfile);
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
        }
    }
});