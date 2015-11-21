(function () {
    'use strict';

    function icon(number) {
        var x = number % 9;
        var y = (number - x) / 9;

        var width = 17;
        var height = 17;

        var offset_x = x * ( width -1) +1;
        var offset_y = (y * height) +1 ;

        return '.icon-number-' + number + ' {' +
                'background: url(\'view/clienticons.gif\') no-repeat -' + offset_x + 'px -' + offset_y + 'px;' +
                'width: '+(width-1)+'px;' +
                'height: '+height+'px;' +
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