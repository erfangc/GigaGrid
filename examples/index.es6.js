import $ from 'jquery';
import * as _ from 'lodash';

import basic_example from './basic_example.ts!text';
import custom_cell_template from './custom_cell_template.ts!text';
import row_selection from './row_selection.ts!text';
import cell_selection from './cell_selection.ts!text';
import column_grouping from './column_grouping.ts!text';
import larger_data_set from './larger_data_set.ts!text';
import custom_column_width from './custom_column_width.ts!text';

/*
 setup
 */

function dropImports(str) {
    return _.chain(str.split("\n"))
        .dropWhile((line) => _.startsWith(line.trim(), "import"))
        .join("\n\t");
}

var examples = [
    {id: "basic_example", title: "Basic Example", code: dropImports(basic_example)},
    {id: "custom_cell_template", title: "Custom Cell Template", code: dropImports(custom_cell_template)},
    {id: "row_selection", title: "Row Selection", code: dropImports(row_selection)},
    {id: "cell_selection", title: "Cell Selection", code: dropImports(cell_selection)},
    {id: "column_grouping", title: "Column Grouping", code: dropImports(column_grouping)},
    {id: "larger_data_set", title: "Larger Data Set (1K)", code: dropImports(larger_data_set)},
    {id: "custom_column_width", title: "Custom Column Width", code: dropImports(custom_column_width)}
];

const $navbar = $("ul.nav.navbar-nav");

_.forEach(examples, example => {
    // inject example into the page
    $(`
<div id=${example.id + "_anchor"}>
    <h1>${example.title}</h1>
    <hr>
    <div class="example" id="${example.id}"></div>
    <br>
    <pre><code>
    ${example.code}
    </code></pre>
</div>
<br>`).appendTo($("#examples"));

// add link to navbar
    $(`<li><a href="#${example.id + "_anchor"}" class="nav-link">${example.title}</a></li>`).appendTo($navbar);
});

$('pre code').each((i, block) => hljs.highlightBlock(block));

$navbar.find("li a").on('click', (e)=> {
    $navbar.find("li").each((idx, li)=> {
        $(li).removeClass("active");
    });
    $(e.target).closest("li").addClass("active");
});

/*
 run
 */

System.import('./run_examples.es6');