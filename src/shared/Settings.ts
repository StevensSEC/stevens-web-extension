// Initialize default configuration
function resetSettings() {
    chrome.storage.local.clear();
    chrome.storage.local.set({
        // Name of temporary bookmark folder
        tempBookmarkFolder: 'Temporary',
        // Reset temporary bookmark timers
        tempBookmarkTimes: {},
    });
}

export default {
    resetSettings: resetSettings,
};
