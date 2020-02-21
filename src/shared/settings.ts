function resetSettings() {
    // Initialize default configuration
    chrome.storage.local.get(items => {
        let settings = {
            tempBookmarkFolder: 'Temporary',
            tempBookmarkItems: {},
            tokens: {
                canvas: '',
            },
        };
        Object.assign(settings, items);
        chrome.storage.local.set(settings, () => {
            console.log('Settings reset!');
        });
    });
}

export default {resetSettings};
