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

    [_loadScript]() {
        if (window.gapi) {
            return Promise.resolve(window.gapi);
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

    [_loadLibrary](lib) {
        return this[_loadScript]()
            .then(gapi => {
                if (gapi[lib]) {
                    return Promise.resolve(gapi[lib]);
                }
                return new Promise((resolve, reject) => {
                    gapi.load(lib, {
                        timeout: this.#timeout,
                        callback: () => resolve(gapi[lib]),
                        ontimeout: () => reject(new Error(`Loading ${lib} timed out`)),
                        onerror: err => reject(new Error(`Loading ${lib} error: ${err.message}`))
                    });
                });
            })
    }

    [_initLibrary](lib) {
        return this[_loadLibrary](lib)
            .then(library => {
                return library.init(this.config)
                    .then(response => {
                        return Promise.resolve(lib === "auth2" ? response : library);
                    }, () => {
                        return Promise.reject(new Error(`Initialization of ${lib} failed`));
                    })
            })
    }

    signIn() {
        return this[_initLibrary]("auth2")
            .then(auth => {
                if (auth.isSignedIn.get()) {
                    return Promise.resolve(auth.currentUser.get().getBasicProfile());
                } else {
                    return auth.signIn()
                        .then(user => {
                            return Promise.resolve(user.getBasicProfile());
                        });
                }
            });
    }

    signOut() {
        return this[_initLibrary]("auth2")
            .then(auth => {
                if (auth.isSignedIn.get()) {
                    auth.disconnect()
                }
                return Promise.resolve();
            });
    }

    request(args) {
        return this[_initLibrary]("client")
            .then(client => client.request(args));
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

        console.log(eventsLoaded);
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