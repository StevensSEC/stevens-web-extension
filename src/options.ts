import {browser} from 'webextension-polyfill-ts';
import $ from 'cash-dom';
// import {log} from './shared/utility';

document.addEventListener('DOMContentLoaded', e => {
    let canvasTextbox = $('input[name=canvas]');
    let canvasCheckbox = $('#canvas-integration');

    let activeFeatures = {};
    document
        .querySelectorAll('#active-features > input[name=features]')
        .forEach((x: HTMLInputElement) => {
            activeFeatures[x.id] = x.checked;
        });
    browser.storage.local.get('tokens').then(({tokens}) => {
        if (tokens) {
            canvasTextbox.val(tokens.canvas);
        }
    });
    // log(activeFeatures);
    /* To Do
    - Update the activeFeatures after someone (un)checks a feature
    - Save/retrieve the activeFeatures from chrome local storage
    Here is the first line to get started on the local storage
      chrome.storage.local.get('activeFeatures', result => { ... })
    */
    $('#stevens-username').on('change', e => {
        let value = $(e.target).val();
        browser.storage.local.set({'stevens-username': value});
    });
    $('#stevens-password').on('change', e => {
        let value = $(e.target).val();
        browser.storage.local.set({'stevens-password': value});
    });

    canvasTextbox.on('focus', e => {
        canvasTextbox.attr('type', 'text');
    });
    canvasTextbox.on('blur', e => {
        canvasTextbox.attr('type', 'password');
        browser.storage.local.set({tokens: {canvas: canvasTextbox.val()}});
    });
    // Disable canvas API token text box when Canvas Integration
    // is not desired
    canvasTextbox.on('change', e => {
        if (canvasCheckbox.prop('checked') === 'checked') {
            canvasTextbox.prop('readonly', false);
            canvasTextbox.css('backgroundColor', '#ffffff');
            canvasTextbox.css('color', '#000000');
        } else {
            canvasTextbox.prop('readonly', true);
            canvasTextbox.css('backgroundColor', '#e3e3e3');
            canvasTextbox.css('color', '#404040');
        }
    });
});
