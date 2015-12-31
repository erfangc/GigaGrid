import {GigaGrid} from "./components/GigaGrid";
import * as React from "react";
import * as ReactDOM from "react-dom";

/**
 * browser exports
 * note, typescript cannot use interfaces as symbols for some reason, probably because they are not emitted in the compiled output
 * running `jspm bundle-sfx` results in the code here being accessible in <script /> tag
 */

(function (window) {
    window.GigaGrid = GigaGrid;
    window.React = window.React || React;
    window.ReactDOM = window.ReactDOM || ReactDOM;
})(typeof window !== "undefined" ? window : {});
