function log(message): void {
    chrome.extension.getBackgroundPage().console.log(message);
}

export default log;
