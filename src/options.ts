let canvasTextbox: HTMLInputElement = document.querySelector(
    'input[name=canvas]'
);
let canvasCheckbox: HTMLInputElement = document.querySelector(
    '#canvas-integration'
);

document.addEventListener('DOMContentLoaded', e => {
    let activeFeatures = {};
    document
        .querySelectorAll('#active-features > input[name=features]')
        .forEach((x: HTMLInputElement) => {
            activeFeatures[x.id] = x.checked;
        });
    chrome.storage.local.get('tokens', ({tokens}) => {
        canvasTextbox.value = tokens.canvas;
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

//disable canvas API token text box when Canvas Integration
//is not desired
canvasCheckbox.onchange = () => {
    if (canvasCheckbox.checked) {
        canvasTextbox.readOnly = false;
        canvasTextbox.style.backgroundColor = '#FFFFFF';
        canvasTextbox.style.color = '#000000';
        return;
    }
    canvasTextbox.style.backgroundColor = '#e3e3e3';
    canvasTextbox.style.color = '#404040';
    canvasTextbox.readOnly = true;
};
