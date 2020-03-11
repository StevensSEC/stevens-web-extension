import moment from 'moment';
// Initialize Canvas polling
const CANVAS_API = 'https://sit.instructure.com/api/v1/';
function getUpcomingAssignments() {
    chrome.storage.local.get('tokens', ({tokens}) => {
        if (tokens.canvas) {
            const AUTH = '?access_token=' + tokens.canvas;
            fetch(CANVAS_API + 'users/self/upcoming_events' + AUTH)
                .then(
                    res => {
                        return res.json();
                    },
                    rej => {
                        console.error('Failed to access Canvas API', rej);
                    }
                )
                .then(res => {
                    let assignments = res
                        .filter(x => x.type === 'assignment')
                        .map(x => {
                            let dueAt = moment(x.assignment.due_at);
                            return {
                                title: x.title,
                                due: dueAt.format('LLLL'),
                            };
                        });
                    chrome.storage.local.set({
                        upcomingAssignments: assignments,
                    });
                });
        } else {
            console.log('No canvas API token found.');
        }
    });
}
chrome.runtime.onInstalled.addListener(details => {
    getUpcomingAssignments();
    chrome.alarms.create('canvas', {
        periodInMinutes: 15,
    });

    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === 'canvas') {
            getUpcomingAssignments();
        }
    });
});

chrome.storage.onChanged.addListener(changes => {
    for (let key in changes) {
        if (key === 'tokens') {
            getUpcomingAssignments();
        }
    }
});
