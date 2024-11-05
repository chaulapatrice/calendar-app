# Notes

### How can the application be improved?

#### Ability to delete events
The application currently doesn't support delete events in the UI. We can add a listener 
`onBeforeEventDelete` to delete events.

#### Login bug 
When a user logs in for the first time all the calendars are selected in the side bar. 
If a user logs out and logs in again the calendars are not selected by default. No event will 
be disabled on the grid until a user selects a calendar with events. 

At first I thought the `BryntumCalendar` component is not updating the events the 
second time a user logs in. An easy solution would be to reload the page every a user logs in. 
Another solution I tried was to preselect the calendars using the `sidebar` prop like below.

```typescript jsx
                <BryntumCalendar
                    onAfterEventSave={onAfterEventSave}
                    date={new Date()}
                    events={events}
                    resources={resources}
                    draggable
                    sidebar={
                        {
                            items: {
                                resourceFilter: {
                                    // Initially select resource IDs 2, 3 and 4
                                    selected: [2, 3, 4]
                                }
                            }
                        }
                    }
                />
```

I have tried it but it didn't work. 

#### Improve `get_calendar_events` view loding time 

On the backend we can improve `get_calendar_events` view by loading calendar events in parallel.

This can can be achieved by using `multithreading.Thread` class to create threads that will fetch 
event in parallel. 
