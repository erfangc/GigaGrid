var $ = require('jquery');
var _ = require('lodash');
var basic_example_text = require('./basic_example.ts!text');
var custom_cell_template = require('./custom_cell_template.ts!text');
var row_selection = require('./row_selection.ts!text');
var cell_selection = require('./cell_selection.ts!text');
function dropImports(str) {
    return _.chain(str.split("\n"))
        .dropWhile(function (line) { return _.startsWith(line.trim(), "import"); }).join("\n");
}
var examples = [
    { id: "basic_example", title: "Basic Example", code: dropImports(basic_example_text) },
    { id: "custom_cell_template", title: "Custom Cell Template", code: dropImports(custom_cell_template) },
    { id: "row_selection", title: "Row Selection", code: dropImports(row_selection) },
    { id: "cell_selection", title: "Cell Selection", code: dropImports(cell_selection) }
];
var $navbar = $("ul.nav.navbar-nav");
_.forEach(examples, function (example) {
    // inject example into the page
    $("\n<div id=" + (example.id + "_anchor") + ">\n    <h1>" + example.title + "</h1>\n    <hr>\n    <div class=\"example\" id=\"" + example.id + "\"></div>\n    <br>\n    <pre><code>" + example.code + "</code></pre>\n</div>\n<br>").appendTo($("#examples"));
    // add link to navbar
    $("<li><a href=\"#" + (example.id + "_anchor") + "\" class=\"nav-link\">" + example.title + "</a></li>").appendTo($navbar);
});
/**
 * important to have these run after we insert their container into the DOM (above)
 * otherwise React has nothing to mount the components to
 */
require('./basic_example');
require('./custom_cell_template');
require('./row_selection');
require('./cell_selection');
$('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
});
$navbar.find("li a").on('click', function (e) {
    $navbar.find("li").each(function (idx, li) {
        $(li).removeClass("active");
    });
    $(e.target).closest("li").addClass("active");
});
//# sourceMappingURL=examples.js.map