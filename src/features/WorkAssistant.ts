// Create a context menu entry to add a temporary bookmark
chrome.contextMenus.create({
    id: 'tempBookmarkMenu',
    title: 'Create Temporary Bookmark',
    contexts: ['all'],
});

chrome.contextMenus.onClicked.addListener(
    (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
        // Add ability to specify bookmark name and duration
        // Time display should be "{hours}h", or "{minutes}m" if less than one hour remains
        chrome.bookmarks.create({
            title: 'Temp Bookmark (72h)',
            url: info.pageUrl,
        });
    }
);
