import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GigaGrid} from '../src/index';

export default function run() {
    ReactDOM.render(
        <GigaGrid data={data} columnDefs={columnDefs} /> ,
        document.getElementById("basic_example"));
}

const data = [{
    "Location": "Saint-Jean-de-Monts",
    "Beds": "2",
    "Breakfast Included": "N",
    "Distance to Airport": 7.14,
    "Price / Night": "$135.45",
    "Rating": 5,
    "Contact": "33-(233)849-2599",
    "Email": "bprice0@sakura.ne.jp"
}, {
    "Location": "Ibabang Tayuman",
    "Beds": "2",
    "Breakfast Included": "N",
    "Distance to Airport": 4.2,
    "Price / Night": "$148.80",
    "Rating": 4,
    "Contact": "63-(746)178-0000",
    "Email": "dmcdonald1@blinklist.com"
}, {
    "Location": "Strängnäs",
    "Beds": "1",
    "Breakfast Included": "N",
    "Distance to Airport": 0.62,
    "Price / Night": "$135.56",
    "Rating": 5,
    "Contact": "46-(520)478-9108",
    "Email": "kmoore2@comsenz.com"
}, {
    "Location": "Paobulan",
    "Beds": "1",
    "Breakfast Included": "N",
    "Distance to Airport": 0.73,
    "Price / Night": "$138.84",
    "Rating": 3,
    "Contact": "62-(527)909-4559",
    "Email": "wgonzalez3@cpanel.net"
}, {
    "Location": "Faqqū‘ah",
    "Beds": "1",
    "Breakfast Included": "Y",
    "Distance to Airport": 6.84,
    "Price / Night": "$192.15",
    "Rating": 3,
    "Contact": "970-(277)249-5418",
    "Email": "jrodriguez4@newsvine.com"
}, {
    "Location": "Kolmården",
    "Beds": "1",
    "Breakfast Included": "Y",
    "Distance to Airport": 8.43,
    "Price / Night": "$131.23",
    "Rating": 3,
    "Contact": "46-(565)999-5331",
    "Email": "hmatthews5@google.pl"
}, {
    "Location": "Isakly",
    "Beds": "3",
    "Breakfast Included": "N",
    "Distance to Airport": 3.57,
    "Price / Night": "$121.47",
    "Rating": 2,
    "Contact": "7-(923)479-0327",
    "Email": "sjackson6@zimbio.com"
}, {
    "Location": "Paris 15",
    "Beds": "3",
    "Breakfast Included": "Y",
    "Distance to Airport": 5.04,
    "Price / Night": "$137.14",
    "Rating": 1,
    "Contact": "33-(728)609-2334",
    "Email": "jcruz7@blinklist.com"
}, {
    "Location": "Sarimukti Kaler",
    "Beds": "2",
    "Breakfast Included": "Y",
    "Distance to Airport": 1.92,
    "Price / Night": "$112.77",
    "Rating": 4,
    "Contact": "62-(851)628-6574",
    "Email": "bgonzales8@sourceforge.net"
}, {
    "Location": "Médanos",
    "Beds": "3",
    "Breakfast Included": "N",
    "Distance to Airport": 9.1,
    "Price / Night": "$164.31",
    "Rating": 3,
    "Contact": "54-(654)731-5114",
    "Email": "sbarnes9@patch.com"
}, {
    "Location": "Melaka",
    "Beds": "2",
    "Breakfast Included": "N",
    "Distance to Airport": 4.78,
    "Price / Night": "$194.16",
    "Rating": 5,
    "Contact": "60-(252)413-6560",
    "Email": "kmurphya@symantec.com"
}, {
    "Location": "Kanaya",
    "Beds": "1",
    "Breakfast Included": "Y",
    "Distance to Airport": 8.05,
    "Price / Night": "$104.32",
    "Rating": 3,
    "Contact": "81-(742)450-2719",
    "Email": "hgarzab@nps.gov"
}, {
    "Location": "Tuamese",
    "Beds": "1",
    "Breakfast Included": "Y",
    "Distance to Airport": 0.11,
    "Price / Night": "$150.13",
    "Rating": 1,
    "Contact": "62-(238)655-6886",
    "Email": "hwellsc@webs.com"
}, {
    "Location": "Archis",
    "Beds": "3",
    "Breakfast Included": "N",
    "Distance to Airport": 5.85,
    "Price / Night": "$159.45",
    "Rating": 2,
    "Contact": "374-(713)998-5238",
    "Email": "awilsond@fotki.com"
}, {
    "Location": "L-Iklin",
    "Beds": "1",
    "Breakfast Included": "N",
    "Distance to Airport": 7.85,
    "Price / Night": "$167.06",
    "Rating": 2,
    "Contact": "356-(901)237-1071",
    "Email": "dthompsone@guardian.co.uk"
}, {
    "Location": "Santiago de Subrrifana",
    "Beds": "2",
    "Breakfast Included": "N",
    "Distance to Airport": 8.66,
    "Price / Night": "$183.18",
    "Rating": 3,
    "Contact": "351-(258)481-2780",
    "Email": "poliverf@sciencedirect.com"
}, {
    "Location": "Qintong",
    "Beds": "1",
    "Breakfast Included": "Y",
    "Distance to Airport": 5.21,
    "Price / Night": "$198.94",
    "Rating": 5,
    "Contact": "86-(737)543-8338",
    "Email": "dfreemang@tripod.com"
}, {
    "Location": "Rosario",
    "Beds": "2",
    "Breakfast Included": "N",
    "Distance to Airport": 5.24,
    "Price / Night": "$161.54",
    "Rating": 5,
    "Contact": "54-(351)673-1626",
    "Email": "mjamesh@spiegel.de"
}, {
    "Location": "Jati",
    "Beds": "1",
    "Breakfast Included": "N",
    "Distance to Airport": 6.42,
    "Price / Night": "$165.56",
    "Rating": 5,
    "Contact": "62-(988)203-7282",
    "Email": "bcastilloi@narod.ru"
}, {
    "Location": "Gora",
    "Beds": "1",
    "Breakfast Included": "Y",
    "Distance to Airport": 4.94,
    "Price / Night": "$121.80",
    "Rating": 3,
    "Contact": "234-(681)226-3736",
    "Email": "jpattersonj@bandcamp.com"
}];

const columnDefs = [
    {colTag: "Location", title: "Location"},
    {colTag: "Beds", title: "Beds"},
    {colTag: "Breakfast Included", title: "Breakfast Included"},
    {colTag: "Distance to Airport", title: "Distance to Airport"},
    {colTag: "Price / Night", title: "Price / Night"},
    {colTag: "Rating", title: "Rating"},
    {colTag: "Contact", title: "Contact"},
    {colTag: "Email", title: "Email"}
];
