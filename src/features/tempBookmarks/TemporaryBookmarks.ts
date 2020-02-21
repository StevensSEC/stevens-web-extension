/* Temporary Bookmarks
 * - Specify name, location, and duration of temporary bookmarks
 * - Automatically gets deleted if time expires
 */
import * as moment from 'moment';
const AddTempBookmark = require('./AddTempBookmark.pug');

// Retrieves the first bookmark folder matching the query
function getBookmarkFolder(title, callback: Function) {
    chrome.bookmarks.search({title: title}, results => {
        results = results.filter(x => x.hasOwnProperty('dateGroupModified'));
        callback(results.length > 0 ? results[0] : undefined);
    });
}

// Gets the temporary bookmark folder according to configuration setting
function getTempBookmarkFolder(handleTempBookmarkFolder) {
    chrome.storage.local.get('tempBookmarkFolder', settings => {
        getBookmarkFolder(
            settings.tempBookmarkFolder,
            (tempBookmarkFolder: chrome.bookmarks.BookmarkTreeNode) => {
                if (tempBookmarkFolder === undefined) {
                    chrome.bookmarks.create(
                        {
                            parentId: '1',
                            title: settings.tempBookmarkFolder,
                        },
                        handleTempBookmarkFolder
                    );
                } else {
                    handleTempBookmarkFolder(tempBookmarkFolder);
                }
            }
        );
    });
}

// Creates the bookmark, with the time included in the name
function createTemporaryBookmark(
    bookmark: chrome.bookmarks.BookmarkCreateArg,
    time: moment.Duration
) {
    chrome.tabs.executeScript({
        /* To Do
        This injection adds an HTML element to the current webpage.
        - Needs to be positioned (absolute) at mouse position when loaded
        - Consistent CSS style (rather than inheriting page styles)
        - Send a message back to the extension with the resulting values
        - Delete the element after submitting
        - Extra: move to content script and add to manifest */
        code: `document.body.insertAdjacentHTML('beforeend', \`${AddTempBookmark()}\`);
        document.addEventListener('click', x => {
            if (x.target && x.target.id == 'folder-submit') {
                console.log(x, chrome, "123!");
            }
        })`,
    });
    // Callback hell is real
    getTempBookmarkFolder(tempBookmarkFolder => {
        chrome.bookmarks.create(
            {
                title: bookmark.title + ` (${getBookmarkTimeDisplay(time)})`,
                url: bookmark.url,
                parentId: tempBookmarkFolder.id,
            },
            result => {
                chrome.storage.local.get('tempBookmarkTimes', settings => {
                    let times = settings.tempBookmarkTimes;
                    chrome.storage.local.set({
                        tempBookmarkTimes: Object.assign(times, {
                            [result.id]: time.asMinutes(),
                        }),
                    });
                });
            }
        );
    });
}

// Updates the display of the bookmark and deletes it if the time expired
function updateBookmarkTime(bookmarkId: string, timeDelta: number) {
    chrome.storage.local.get('tempBookmarkTimes', settings => {
        let times = settings.tempBookmarkTimes;
        let time = moment
            .duration(times[bookmarkId], 'm')
            .subtract({minutes: timeDelta});
        if (time.asMinutes() <= 0) {
            // Time has expired, delete the bookmark
            delete times[bookmarkId];
            chrome.bookmarks.remove(bookmarkId);
        } else {
            // Update the time display by the period (5 mins)
            let hour = time.hours();
            let minute = time.minutes();
            let timeDisplay = hour > 0 ? `${hour}h` : `${minute}m`;
            chrome.bookmarks.get(bookmarkId, bookmarks => {
                chrome.bookmarks.update(bookmarkId, {
                    title: bookmarks[0].title.replace(
                        /\(\d+[hm]\)/,
                        `(${timeDisplay})`
                    ),
                });
            });
            Object.assign(times, {[bookmarkId]: time.asMinutes()});
        }
        chrome.storage.local.set({tempBookmarkTimes: times});
    });
}

// Converts a moment duration to the time displayed in the bookmark
function getBookmarkTimeDisplay(time: moment.Duration) {
    let hour = time.hours();
    let minute = time.minutes();
    return hour > 0 ? `${hour}h` : `${minute}m`;
}

// Create a context menu entry to add a temporary bookmark
chrome.runtime.onInstalled.addListener(details => {
    // Add a new context menu entry to add a temporary bookmark
    chrome.contextMenus.create({
        id: 'tempBookmarkMenu',
        title: 'Create Temporary Bookmark',
        contexts: ['all'],
    });
    // Temporary bookmarks manager (updates every 5 minutes)
    chrome.alarms.create('updateTemporaryBookmarks', {
        periodInMinutes: 5,
    });
    // Handle renaming and deleting of temporary bookmarks
    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === 'updateTemporaryBookmarks') {
            getTempBookmarkFolder(folder => {
                chrome.bookmarks.getChildren(folder.id, children => {
                    children.forEach(bookmark => {
                        updateBookmarkTime(bookmark.id, alarm.periodInMinutes);
                    });
                });
            });
        }
    });
});

// Add a handler for when the context menu entry is clicked
chrome.contextMenus.onClicked.addListener(
    (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
        // Time display should be "{hours}h", or "{minutes}m" if less than one hour remains
        // Changes the extension popup - this should be replaced with content injection
        chrome.browserAction.setPopup({
            popup: 'AddTempBookmark.html',
            tabId: tab.id,
        });
        let time = moment.duration({
            hours: 0,
            minutes: 30,
        });
        createTemporaryBookmark(
            {
                // To-do: update with bookmark name from user
                title: '<Temporary Bookmark>',
                url: info.pageUrl,
            },
            time
        );
    }
);
