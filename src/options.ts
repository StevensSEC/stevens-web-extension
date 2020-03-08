let canvasTextbox: HTMLInputElement = document.querySelector(
    'input[name=canvas]'
);

document.addEventListener('DOMContentLoaded', e => {
    let activeFeatures = {};
    document
        .querySelectorAll('#active-features > input[name=features]')
        .forEach((x: HTMLInputElement) => {
            activeFeatures[x.id] = x.checked;
        });
    chrome.storage.local.get('tokens', object => {
        canvasTextbox.value = object.tokens.canvas;
    });
    // log(activeFeatures);
    /* To Do
    - Update the activeFeatures after someone (un)checks a feature
    - Save/retrieve the activeFeatures from chrome local storage
    Here is the first line to get started on the local storage
      chrome.storage.local.get('activeFeatures', result => { ... })
    */
});

canvasTextbox.onfocus = () => {
    canvasTextbox.setAttribute('type', 'text');
};

canvasTextbox.onblur = () => {
    canvasTextbox.setAttribute('type', 'password');
    chrome.storage.local.set({tokens: {canvas: canvasTextbox.value}});
};
