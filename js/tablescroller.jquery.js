//********************************************************************************************************************************************
//*
//*  tablescroller
//*  creates a horizontal and vertical scrolling table with pinned row and column headers
//*
//*  options:
//*     width - the width of the table
//*     height - the height of the table
//*     pinnedRows - the number of pinned rows
//*     pinnedCols - the number of pinned columns
//*     container - the container id for the scrollable table
//*     removeOriginal - indicator for removing the orignal table
//*
//********************************************************************************************************************************************
$.fn.tablescroller = function (options) {

    var cloneTableSection = function (table, cl, rowStart, rowEnd, colStart, colEnd) {
        
        var cloneTable = $(table)[0].cloneNode();
        var section = $(cloneTable);
        $(section).removeAttr("id");
        $(section).addClass(cl);

        var rows = $("tr", table);
        for(var i = rowStart; (rowEnd == -1 || i < rowEnd) && i < rows.length; i++)
        {
            var row = rows[i];
            var parent = $(row).parent()[0];
            var parentName = parent.nodeName.toLowerCase();
            if(parentName != "table" && $(parentName, section).length == 0)
            {
                parent = $(parent.cloneNode());
                $(section).append(parent);
            }
            else {
                parent = $(parentName, section);
            }
                
            var cloneRow = row.cloneNode();
            var columns = $("th, td", row);
            for (var j = colStart; (colEnd == -1 || j < colEnd) && j < columns.length; j++) {
                $(cloneRow).append($(columns[j]).clone());
            }

            $(parent).append(cloneRow);
        }

        return $(section);
    };

    var table = $("table", this).length > 0 ? $("table", this) : $(this);
    if(table.is("table"))
    {
        var defaults = {
            width: table.width(),
            height: table.height(),
            pinnedRows: 1,
            pinnedCols: 0,
            container: ""
        };

        options = $.extend(true, {}, defaults, options);

        if (options.container == "")
        {
            var id = "tablescroller-1";
            var containerDiv = $("<div id=\"" + id + "\"></div>");
            $(document.body).append(containerDiv);
            options.container = "#" + containerDiv.attr("id");
        }

        var container = $(options.container);
        container.width(options.width);
        container.height(options.height);

        var tableRegions = {
            corner: null,
            cornerTable: null,
            scrollableColumns: null,
            scrollableColumnsTable: null,
            scrollableRows: null,
            scrollableRowsTable: null,
            scrollableWindow: null,
            scrollableWindowTable: null
        }

        // corner section window and table
        if (options.pinnedRows > 0 && options.pinnedCols > 0) {
            tableRegions.corner = $("<div class=\"corner-frame\"></div>");
            tableRegions.cornerTable = cloneTableSection($(this), "corner-table", 0, options.pinnedRows, 0, options.pinnedCols);
            container.append(tableRegions.corner);
            tableRegions.corner.append(tableRegions.cornerTable);
        }

        // scrollable columns window and table
        if (options.pinnedRows > 0) {
            tableRegions.scrollableColumns = $("<div class=\"scrollable-columns-frame\"></div>");
            tableRegions.scrollableColumnsTable = cloneTableSection($(this), "scrollable-columns-table", 0, options.pinnedRows, options.pinnedCols, -1);
            container.append(tableRegions.scrollableColumns);
            tableRegions.scrollableColumns.append(tableRegions.scrollableColumnsTable);
        }

        // scrollable rows window and table
        if (options.pinnedCols > 0) {
            tableRegions.scrollableRows = $("<div class=\"scrollable-rows-frame\"></div>");
            tableRegions.scrollableRowsTable = cloneTableSection($(this), "scrollable-rows-table", options.pinnedRows, -1, 0, options.pinnedCols);
            container.append(tableRegions.scrollableRows);
            tableRegions.scrollableRows.append(tableRegions.scrollableRowsTable);
        }

        tableRegions.scrollableWindow = $("<div class=\"scrollable-data-frame\"></div>");
        tableRegions.scrollableWindowTable = cloneTableSection($(this), "scrollable-data-table", options.pinnedRows, -1, options.pinnedCols, -1);
        container.append(tableRegions.scrollableWindow);
        tableRegions.scrollableWindow.append(tableRegions.scrollableWindowTable);

        // adjust scrollable rows column widths
        if (tableRegions.corner != null) {
            $("tr:first-child > th, tr:first-child > td", tableRegions.cornerTable).each(function (index, element) {
                var width = $(element).width();
                var pinnedColCell = $("tr:first-child > th:eq(" + index + "), tr:first-child > td:eq(" + index + ")", tableRegions.scrollableRowsTable)[0];
                if(width > $(pinnedColCell).width()) $(pinnedColWidth).width(width);
                else $(element).width($(pinnedColCell).width());
            });
        }

        //adjust scrollable columns window width
        var scwWidth = $(tableRegions.scrollableColumnsTable).width()
        if (scwWidth > $(tableRegions.scrollableWindowTable).width()) $(tableRegions.scrollableWindowTable).width(scwWidth);
        else $(tableRegions.scrollableColumnsTable).width($(tableRegions.scrollableWindowTable).width());

        //adjust scrollable columns column widths
        $("tr:first-child > th, tr:first-child > td", tableRegions.scrollableColumnsTable).each(function (index, element) {
            var width = $(element).width();
            var pinnedColCell = $("tr:first-child > th:eq(" + index + "), tr:first-child > td:eq(" + index + ")", tableRegions.scrollableWindowTable)[0];
            if (width > $(pinnedColCell).width()) $(pinnedColCell).width(width);
            else $(element).width($(pinnedColCell).width());
        });

        // adjust width
        var width = tableRegions.scrollableRows != null ? options.width - $(tableRegions.scrollableRows).width() : options.width;
        if (tableRegions.scrollableColumns != null) $(tableRegions.scrollableColumns).width(width - 18);
        $(tableRegions.scrollableWindow).width(width);

        // adjust height
        var height = tableRegions.scrollableColumns != null ? options.height - $(tableRegions.scrollableColumns).height() : options.height;
        if (tableRegions.scrollableRows != null) $(tableRegions.scrollableRows).height(height - 20);
        $(tableRegions.scrollableWindow).height(height);

        // update scrollable column window or scrollable row window as the user scrolls through the scrollable window
        $(tableRegions.scrollableWindow).on("scroll", function (evt) {
            if (options.pinnedRows > 0) $(tableRegions.scrollableColumns).scrollLeft($(tableRegions.scrollableWindow).scrollLeft());
            if (options.pinnedCols > 0) $(tableRegions.scrollableRows).scrollTop($(tableRegions.scrollableWindow).scrollTop());
        });

        var pinnedColsHeight = $(container).height() - $(".corner-frame", container).height();
        if (pinnedColsHeight < $(".scrollable-columns-frame", container).height()) $(".scrollable-columns-frame", container).height(pinnedColsHeight);
    }

    return this;
};
