import './basic_example';
import './custom_cell_template';
import './row_selection';

import * as $ from 'jquery';
import * as _ from 'lodash';

declare var hljs;

$('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
});

$("ul.nav.navbar-nav").on('click', (e:JQueryMouseEventObject)=> {
    const href = $(e.target).attr("href");
    _.forEach($("ul.nav.navbar-nav").children("li"), (li)=> {
        if ($(li).find("a").attr("href") === href)
            $(li).addClass("active");
        else
            $(li).removeClass("active");
    });
});
