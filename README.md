# TableScroller
Javascript / JQuery library for creating scrollable table window with pinned rows and columns

Table scroller is a javascript jquery library for turning standard html tables into tables that are scrollable vertically
and horizontally with pinned rows headers and column headers that follow the data while scrolling.

Usage:

Check out Example.html
Include the following in your web page
css/tablescroller.css
js/tablescroller.js
js/tablescroller.jquery.js  - optional

var options = {
    width: 500,
    height: 200,
    pinnedRows: 1,
    pinnedCols: 1,
    container: "#scrollableTable",
    removeOriginal: true
};

var myScrollableTable = new TableScroller(document.getElementById("myTableName"), options);

or

$("myTableName").tablescroller(options);
