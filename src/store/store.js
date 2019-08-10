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
        subscribedCalendars: [],
        userProfile: null
    },
    mutations: {
        setUserProfile(state, userProfile) {
            state.userProfile = userProfile;
        },
        setCalendarEvents(state, events) {
            state.calendarEvents = events;
        },
        setUserCalendars(state, calendars) {
            state.userCalendars = calendars;
        },
        setSubscribedCalendars(state, calendars) {
            state.subscribedCalendars = calendars;
        }
    },
    actions: {
        async signIn({ commit, dispatch }) {
            let userProfile = await gapi.signIn();
            commit("setUserProfile", userProfile);
            await dispatch("fetchUserCalendars");
            dispatch("fetchCalendarEvents");
        },
        async signOut({ commit }) {
            await gapi.signOut();
            commit("setUserProfile", null);
            commit("setCalendarEvents", []);
        },
        async fetchCalendarEvents({ commit, state }) {
            // let events = await gapi.loadPrimaryCalendarEvents();
            let events = await Promise.all(state.subscribedCalendars.map(calendar => gapi.loadCalendarEvents(calendar)));
            commit("setCalendarEvents", GoogleWrapper.convertEvents(events.flatMap(event => event.result.items)));
        },
        async fetchUserCalendars({ commit, getters }) {
            let calendars = await gapi.loadUserCalendars();
            commit("setUserCalendars", calendars.result.items);

            let primaryCalendar = getters.primaryCalendar;
            commit("setSubscribedCalendars", [primaryCalendar.id]);
        },
        subscribeUserCalendars({ commit, dispatch }, calendars) {
            commit("setSubscribedCalendars", calendars);
            dispatch("fetchCalendarEvents");
        }
    },
    getters: {
        primaryCalendar: state => {
            return state.userCalendars.find(calendar => calendar.primary);
        }
    }
});
