import log from './shared/utility';
import './options.pug';

document.addEventListener('DOMContentLoaded', e => {
    let activeFeatures = {};
    document
        .querySelectorAll('#active-features > input[name=features]')
        .forEach((x: HTMLInputElement) => {
            activeFeatures[x.id] = x.checked;
        });
    log(activeFeatures);
    /* To Do
    - Update the activeFeatures after someone (un)checks a feature
    - Save/retrieve the activeFeatures from chrome local storage
    Here is the first line to get started on the local storage
      chrome.storage.local.get('activeFeatures', result => { ... })
    */
});
