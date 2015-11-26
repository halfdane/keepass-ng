(function () {
    'use strict';

    function icon(number) {
        var x = number % 9;
        var y = (number - x) / 9;

        var width = 16;
        var height = 17;

        var offsetX = x * width + 1;
        var offsetY = (y * height) + 1;

        return '.icon-number-' + number + ' {' +
                'margin-bottom: -2px;' +
                'display: inline-block;' +
                'background: url(\'images/clienticons.gif\') no-repeat -' + offsetX + 'px -' + offsetY + 'px;' +
                'width: ' + width + 'px;' +
                'height: ' + (height - 1) + 'px;' +
                '}';

    }

    var css = '',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

    for (var i = 0; i < 54; i++) {
        css += icon(i);
    }

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);

}());