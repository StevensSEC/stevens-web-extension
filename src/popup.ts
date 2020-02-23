const UpdateCanvas = require('./features/canvas/CanvasDisplay.pug');
import log from './shared/utility';

document.addEventListener('DOMContentLoaded', () => {
    /* To Do
    - Update the below features to only display/operate if they are enabled */
    // Canvas Integration
    chrome.storage.local.get('upcomingAssignments', res => {
        log('Loading Canvas assignments...');
        if (res.upcomingAssignments) {
            document.querySelector(
                '#canvas-integration'
            ).innerHTML = UpdateCanvas({
                assignments: res.upcomingAssignments,
            });
        }
    });
});
