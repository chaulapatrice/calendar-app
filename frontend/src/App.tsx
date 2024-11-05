import {useGoogleLogin} from "@react-oauth/google";
import {useState, useEffect} from "react";
import axios from "./util/axios.ts";
import useAuthStore from "./store/auth.ts";
import {AxiosResponse} from "axios";
import "./App.scss";
import {BryntumCalendar} from "@bryntum/calendar-react";

interface GoogleEvent {
    id: string;
    summary: string;
    start: {
        dateTime: string;
        timeZone: string;
    };
    end: {
        dateTime: string;
        timeZone: string;
    };
    calendarId: string;
}

interface BryntumEvent {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    resourceId: string;
}

interface BryntumResource {
    id: string;
    name: string;
    eventColor: string;
}

interface GoogleCalendar {
    id: string;
    summary: string;
    backgroundColor: string;
}

function App() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {signIn, signOut, token} = useAuthStore();

    const handleSignIn = useGoogleLogin({
        onSuccess: async (response) => {
            const {code} = response;
            try {
                setIsLoading(true);
                const response = await axios.post<
                    { key: string },
                    AxiosResponse,
                    {
                        code: string;
                    }
                >("/login/", {
                    code: code,
                });

                const {
                    data: {key},
                } = response;
                signIn(key);
            } catch {
                setError("Authentication failure");
            } finally {
                setIsLoading(false);
            }
        },
        flow: "auth-code",
        scope:
            "https://www.googleapis.com/auth/calendar.events.readonly " +
            "https://www.googleapis.com/auth/calendar.readonly " +
            "https://www.googleapis.com/auth/calendar.events.owned",
    });

    function handleSignOut() {
        signOut()
    }

    const [events, setEvents] = useState<Array<BryntumEvent>>([]);
    const [resources, setResources] = useState<Array<BryntumResource>>([]);

    useEffect(() => {
        if (token) {
            (async () => {
                try {
                    setIsLoading(true);
                    const response: AxiosResponse<{
                        events: Array<GoogleEvent>;
                        calendars: Array<GoogleCalendar>;
                    }> = await axios.get("/events/");

                    const {
                        data: {events: fetchedEvents, calendars: fetchedCalendars},
                    } = response;

                    setEvents(
                        fetchedEvents.map((event) => ({
                            id: event.id,
                            name: event.summary,
                            startDate: event.start.dateTime,
                            endDate: event.end.dateTime,
                            resourceId: event.calendarId,
                        })),
                    );

                    setResources(
                        fetchedCalendars.map((calendar) => ({
                            id: calendar.id,
                            name: calendar.summary,
                            eventColor: calendar.backgroundColor,
                        })),
                    );
                } catch {
                    setError("Failed to fetch events");
                } finally {
                    setIsLoading(false);
                }
            })();
        }
    }, [token]);

    const createEvent = async (calendarId: string, payload: object) => {
        try {
            setIsLoading(true);
            const url = `/events/${encodeURIComponent(calendarId)}/create/`;
            await axios.post(url, payload);
        } catch {
            setError("Failed to add event");
        } finally {
            setIsLoading(false);
        }
    };

    const editEvent = async (
        calendarId: string,
        eventId: string,
        payload: object,
    ) => {
        try {
            setIsLoading(true);
            await axios.put(
                `/events/${encodeURIComponent(calendarId)}/${eventId}/edit/`,
                payload,
            );
        } catch {
            setError("Failed to edit event");
        } finally {
            setIsLoading(false);
        }
    };

    const changeEventCalendar = async (
        oldCalendarId: string,
        newCalendarId: string,
        eventId: string,
        payload: object,
    ) => {
        try {
            setIsLoading(true);

            // Caveat: this would cause data inconsistencies. A better approach would be to use
            // some sort of transaction on the backend

            // First delete
            await axios.delete(
                `/events/${encodeURIComponent(oldCalendarId)}/${eventId}/delete/`,
            );

            // Then add on new calendar

            await axios.post(
                `/events/${encodeURIComponent(newCalendarId)}/create/`,
                payload,
            );
        } catch {
            setError("Failed to edit event");
        } finally {
            setIsLoading(false);
        }
    };

    const onAfterEventSave = (event: any) => {
        const {eventRecord, type} = event;
        const {data, originalData} = eventRecord;

        const payload = {
            summary: data.name,
            location: " ",
            start: {
                dateTime: data.startDate,
                timeZone: "Africa/Johannesburg",
            },
            end: {
                dateTime: data.endDate,
                timeZone: "Africa/Johannesburg",
            },
        };

        switch (type) {
            case "aftereventsave":
                if (data.id.includes("_generated")) {
                    createEvent(data.resourceId, payload);
                } else {
                    if (originalData.resourceId === data.resourceId) {
                        editEvent(data.resourceId, data.id, payload);
                    } else {
                        changeEventCalendar(
                            originalData.resourceId,
                            data.resourceId,
                            data.id,
                            payload,
                        );
                    }
                }
                break;
            default:
                break;
        }
    };

    return (
        <div>
            {isLoading && (
                <div id="overlay">
                    <h1>Loading...</h1>
                </div>
            )}
            <div className={"container"}>
                <div className={"auth-ui-container"}>
                    <>
                        {token ? (
                            <button className={"sign-out-btn"} onClick={handleSignOut}>
                                Sign out of my account
                            </button>
                        ) : (
                            <button
                                className={"login-btn"}
                                disabled={isLoading}
                                onClick={handleSignIn}
                            >
                                Sign in with google
                            </button>
                        )}
                    </>
                    <>{error && <p className={"error"}>{error}</p>}</>
                </div>
                <BryntumCalendar
                    onAfterEventSave={onAfterEventSave}
                    date={new Date()}
                    events={events}
                    resources={resources}
                    draggable
                />
            </div>
        </div>
    )
}

export default App;