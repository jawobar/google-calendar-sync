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
        signIn: ({ commit, dispatch }) => {
            gapi.signIn()
                .then(userProfile => {
                    commit("setUserProfile", userProfile);
                    dispatch("fetchCalendarEvents");
                });
        },
        signOut: ({ commit }) => {
            gapi.signOut()
                .then(() => {
                    commit("setUserProfile", null);
                    commit("setCalendarEvents", []);
                });
        },
        fetchCalendarEvents: ({ commit }) => {
            gapi.loadPrimaryCalendarEvents()
                .then(events => {
                    commit("setCalendarEvents", GoogleWrapper.convertEvents(events.result.items));
                });
        }
    }
});