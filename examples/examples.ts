declare var hljs;

import * as $ from 'jquery';
import * as _ from 'lodash';

import basic_example_text = require('./basic_example.ts!text');
import custom_cell_template = require('./custom_cell_template.ts!text');
import row_selection = require('./row_selection.ts!text');
import cell_selection = require('./cell_selection.ts!text');

function dropImports(str:string) {
    return _.chain<string>(str.split("\n"))
        .dropWhile((line:string)=>_.startsWith(line.trim(), "import")).join("\n");
}

var examples = [
    {id: "basic_example", title: "Basic Example", code: dropImports(basic_example_text)},
    {id: "custom_cell_template", title: "Custom Cell Template", code: dropImports(custom_cell_template)},
    {id: "row_selection", title: "Row Selection", code: dropImports(row_selection)},
    {id: "cell_selection", title: "Cell Selection", code: dropImports(cell_selection)}
];

const $navbar = $("ul.nav.navbar-nav");

_.forEach(examples, (example)=> {

    // inject example into the page
    $(`
<div class="card" id=${example.id + "_anchor"}>
    <h4>${example.title}</h4>
    <div id="${example.id}"></div>
    <br>
    <pre><code>${example.code}</code></pre>
</div>
<br>`).appendTo($("#examples"));

    // add link to navbar
    $(`<li><a href="#${example.id + "_anchor"}" class="nav-link">${example.title}</a></li>`).appendTo($navbar);
});

/**
 * important to have these run after we insert their container into the DOM (above)
 * otherwise React has nothing to mount the components to
 */

import './basic_example';
import './custom_cell_template';
import './row_selection';
import './cell_selection';


$('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
});

$navbar.find("li a").on('click', (e:JQueryMouseEventObject)=> {
    $navbar.find("li").each((idx,li)=> {
        $(li).removeClass("active");
    });
    $(e.target).closest("li").addClass("active");
});
