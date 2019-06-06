import moment from "moment";

const _loadScript = Symbol("loadScript");
const _loadLibrary = Symbol("loadLibrary");
const _initLibrary = Symbol("initLibrary");

export default class GoogleWrapper {

    #gapiUrl = "https://apis.google.com/js/api.js";
    #timeout = 5000;

    constructor(config) {
        this.config = config;
    }

    async [_loadScript]() {
        if (window.gapi) {
            return window.gapi;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = this.#gapiUrl;

            let watchdog = setTimeout(() => {
               script.remove();
               reject(new Error(`Loading ${this.#gapiUrl} timed out`));
            }, this.#timeout);

            document.head.appendChild(script);

            script.onload = () => {
                clearTimeout(watchdog);

                if (window.gapi) {
                    resolve(window.gapi);
                } else {
                    reject(new Error(`Cannot load ${this.#gapiUrl}`));
                }
            };
        });
    }

    async [_loadLibrary](lib) {
        let gapi = await this[_loadScript]();

        if (gapi[lib]) {
            return gapi[lib];
        }

        return new Promise((resolve, reject) => {
            gapi.load(lib, {
                timeout: this.#timeout,
                callback: () => resolve(gapi[lib]),
                ontimeout: () => reject(new Error(`Loading ${lib} timed out`)),
                onerror: err => reject(new Error(`Loading ${lib} error: ${err.message}`))
            });
        });
    }

    async [_initLibrary](lib) {
        let library = await this[_loadLibrary](lib);

        try {
            let response = await library.init(this.config);
            return lib === "auth2" ? response : library;
        } catch {
            throw new Error(`Initialization of ${lib} failed`);
        }
    }

    async signIn() {
        let auth = await this[_initLibrary]("auth2");

        if (auth.isSignedIn.get()) {
            return auth.currentUser.get().getBasicProfile();
        } else {
            let user = await auth.signIn();
            return user.getBasicProfile();
        }
    }

    async signOut() {
        let auth = await this[_initLibrary]("auth2");

        if (auth.isSignedIn.get()) {
            auth.disconnect();
        }
    }

    async request(args) {
        let client = await this[_initLibrary]("client");
        return client.request(args);
    }

    loadCalendarEvents(calendar) {
        return this.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${calendar}/events`,
            method: "GET",
            params: {
                "timeMin": (new Date()).toISOString(),
                "showDeleted": false,
                "singleEvents": true,
                "maxResults": 10,
                "orderBy": "startTime"
            }
        });
    }

    loadPrimaryCalendarEvents() {
        return this.loadCalendarEvents("primary");
    }

    static convertEvents(eventsLoaded) {
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
                    event.end = moment(eventsLoaded[i].end.date).subtract(1, "days").format("YYYY-MM-DD");
                } else {
                    event.end = moment(event.end).format("YYYY-MM-DD HH:mm");
                }

                event.title = eventsLoaded[i].summary;
                event.class = 'primary';

                events.push(event);
            }
        }

        return events;
    }
}