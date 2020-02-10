/* Temporary Bookmarks
 * - Specify name, location, and duration of temporary bookmarks
 * - Automatically gets deleted if time expires
 */

// Required template files (Pug renders into HTML)
import './AddTempBookmark.pug';

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
        delayInMinutes: 5,
        periodInMinutes: 5,
    });
    // Handle renaming and deleting of temporary bookmarks
    chrome.alarms.onAlarm.addListener(alarm => {
        if (alarm.name === 'updateTemporaryBookmarks') {
            // Loop through temporary bookmarks and subtract time difference
            // let t = alarm.periodInMinutes;
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
        // Creates the bookmark, with the time included in the name
        function createBookmark(id: string) {
            chrome.bookmarks.create({
                title: 'Temp Bookmark (72h)',
                parentId: id,
                url: info.pageUrl,
            });
        }
        // Create bookmarks folder if it does not exist
        chrome.bookmarks.search({title: 'Temporary'}, results => {
            results = results.filter(x => 'dateGroupModified' in x);
            if (results.length === 0) {
                chrome.bookmarks.create(
                    {
                        parentId: '1',
                        title: 'Temporary',
                    },
                    r => createBookmark(r.id)
                );
            } else {
                createBookmark(results[0].id);
            }
        });
    }
);
