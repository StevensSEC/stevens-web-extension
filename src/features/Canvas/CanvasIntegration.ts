// import moment from 'moment';
// Initialize Canvas polling
const CANVAS_API = 'https://sit.instructure.com/api/v1/';
function getAssignments() {
    chrome.storage.local.get('tokens', ({tokens}) => {
        if (tokens && tokens.canvas) {
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
                            // let due = moment(x.due).format('');
                            return {
                                title: x.title,
                                due: x.assignment.due_at,
                                created: x.created_at,
                            };
                        });
                    chrome.storage.local.set({
                        assignments: assignments,
                    });
                });
        } else {
            console.log('No canvas API token found.');
        }
    });
}
chrome.runtime.onInstalled.addListener(details => {
    getAssignments();
    chrome.alarms.create('canvas', {
        periodInMinutes: 15,
    });

    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === 'canvas') {
            getAssignments();
        }
    });
});

chrome.storage.onChanged.addListener(changes => {
    for (let key in changes) {
        if (key === 'tokens') {
            getAssignments();
        }
    }
});
