import log from './shared/utility';
import './options.pug';

document.addEventListener('DOMContentLoaded', e => {
    let options: Element = document.querySelector('#active-features');
    log(options);
});
