(function () {
    const log = require('loglevel');
    const fs = require('fs');
    const path = require('path');

    const autoComplete = require('./lib/pixabay-autoComplete/auto-complete.js');

    const template = `
    <link href="lib/pixabay-autoComplete/auto-complete.css" rel="stylesheet">
    <form id="searchform">
        <input id="searchfiels" class="form-control" type="text" placeholder="Search an entry"/>
    </form>
    `;

    class SearchBox extends HTMLElement {

        createdCallback() {
            this.innerHTML = template;
            this.input = this.querySelector('input');
            this.form = this.querySelector('form');

            var my_autoComplete = new autoComplete({
                selector: this.input,
                source: (term, suggest) => this.dispatchEvent(
                        new CustomEvent('complete-entries', {detail: {term: term, suggest: suggest}})),
                renderItem: function (entry, search) {
                    search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                    const replaced = entry.String.get('Title').replace(re, "<b>$1</b>");
                    log.debug(`Enter: document.querySelector('.autocomplete-suggestion.selected');`);
                    return `<div class="autocomplete-suggestion" data-UUID="${entry.UUID}"><span class="icon-number-${entry.IconID}"></span><span>${replaced}</span></div>`;
                },
                onSelect: (e, term, item) => {
                    const uuid = item.getAttribute('data-UUID');
                    log.debug(`Selected ${uuid} from drop down`);
                    this.dispatchEvent(
                            new CustomEvent('display-entry', {detail: {entry: uuid}}))
                }
            });

            this.form.addEventListener('submit', event => {
                this.dispatchEvent(new CustomEvent('search-entries', {detail: {term: this.input.value}}));
                event.preventDefault();
            });
        }
    }

    try {
        document.registerElement('halfdane-searchbox', SearchBox);
    } catch (error) {
    }

})();

