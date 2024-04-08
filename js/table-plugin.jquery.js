(function ($) {

    var methods = {
        init: function (options) {

            return this.each(function () {
                var myContainer = $(this);

                myContainer.data("tablePlugin", { options: options })

                methods.renderHeader(myContainer, options);

                methods.renderBody(myContainer, options);


                myContainer.on("click.tablePlugin", "div.ui-table-plugin-page-cell", { component: myContainer }, methods.handleCellClick);
                myContainer.on("click.tablePlugin", "div.ui-table-plugin-page-cell-sub", { component: myContainer }, methods.handleCellClick);

            });
        },
        renderHeader: function (obj, options) {
            var headerContainer = $("<div/>");
            headerContainer.addClass("ui-table-plugin-header");
            var table = $("<table/>");
            table.addClass("table-plugin table-plugin-header");
            var tr = $("<tr/>");

            for (var i = 0; i < options.columns.length; i++) {
                var column = options.columns[i];
                if (column.show) {
                    var td = $("<td/>");
                    td.text(column.displayName);
                    tr.append(td);
                }
            }
            table.append(tr);
            headerContainer.append(table);
            obj.append(headerContainer);

        },
        renderBody: function (obj, options) {
            var headerContainer = $("<div/>")
            headerContainer.addClass("ui-table-plugin-body")
            var table = $("<table/>");
            table.addClass("table-plugin table-plugin-body");

            for (var i = 0; i < options.data.length; i++) {
                var data = options.data[i];
                var tr = $("<tr/>");
                tr.addClass("ui-table-plugin-body-" + i);
                var celCounter = 0;
                for (var j = 0; j < options.columns.length; j++) {
                    var column = options.columns[j];
                    if (column.show) {
                        var td = $("<td/>");

                        var cellDv = $("<div/>");
                        cellDv.addClass("ui-table-plugin-page-cell")
                        cellDv.attr("id", "table-plugin-cell-counter-" + i + "-" + column.name);
                        var cellHtml = "";
                        if (celCounter == 0) {
                            td.css("text-align", "left")
                            if (data.subData)
                                cellHtml = cellHtml + '<button onclick="openSubElements(\'ui-table-plugin-body-' + i + '\')">+</button>';
                            else
                                cellHtml = cellHtml + '<button>+</button>';
                        }
                        if (column.type === "phone") {
                            cellHtml = cellHtml + "<a data-popup-open='popup-1' href='#'>" + data[column.name] + '</a>';
                        }
                        else {
                            cellHtml = cellHtml + data[column.name]
                        }
                        cellDv.html(cellHtml)
                        td.append(cellDv)
                        tr.append(td)
                        celCounter = celCounter + 1
                    }
                }
                table.append(tr)

                if (data.subData)
                    methods.renderSubElements(table, data.subData, options.columns, "ui-table-plugin-body-", i)
            }
            headerContainer.append(table)
            obj.append(headerContainer);

        },
        renderSubElements: function (table, subItems, columns, className, index) {
            for (var i = 0; i < subItems.length; i++) {
                var data = subItems[i];
                var tr = $("<tr/>");
                tr.addClass(className + index + "-sub");
                tr.css("display", "none");
                var celCounter = 0;
                for (var j = 0; j < columns.length; j++) {
                    var column = columns[j];
                    if (column.show) {
                        var td = $("<td/>");
                        var cellDv = $("<div/>");
                        cellDv.addClass("ui-table-plugin-page-cell-sub")
                        cellDv.attr("id", "table-plugin-cell-sub-counter-" + index + "-" + i + "-" + column.name);
                        var cellHtml = "";

                        if (column.type === "phone") {
                            cellHtml = cellHtml + "<a data-popup-open='popup-1' href='#'>" + data[column.name] + '</a>';
                        }
                        else {
                            cellHtml = cellHtml + data[column.name]
                        }
                        cellDv.html(cellHtml)
                        td.append(cellDv)
                        tr.append(td)
                        celCounter = celCounter + 1
                    }
                }
                table.append(tr)
            }
        },

        handleCellClick: function (aEvent) {
            var myComponent = aEvent.data.component;
            var myData = myComponent.data("tablePlugin");
            var myCell = $(aEvent.currentTarget);
            var ulElem =  $("#table-plugin-detail");
            ulElem.html("");
            var myId = myCell.attr("id");
            if (myId.indexOf("table-plugin-cell-sub-counter-") === 0) {
                var myTableLocation = myId.replace("table-plugin-cell-sub-counter-", "").split("-");
                if (myTableLocation[2] === "phone")
                    $('[data-popup="popup-1"]').fadeIn(350);
                if (myTableLocation[2] === "identify") {
                    $('[data-popup="popup-2"]').fadeIn(350);
                    exData = myData.options.data[myTableLocation[0]].subData[myTableLocation[1]]
                    for (var i = 0; i < myData.options.columns.length; i++) {
                        var column = myData.options.columns[i];
                        console.log(column.displayName);
                        var li = $("<li/>");
                        var lbl = $("<label/>");
                        var b = $("<b/>");
                        b.text(column.displayName);
                        var span = $("<span/>");
                        span.text(" : "+exData[column.name]);

                        lbl.append(b);
                        lbl.append(span);

                        li.append(lbl);

                        ulElem.append(li);

                    }
                }
            } else {
                var myTableLocation = myId.replace("table-plugin-cell-counter-", "").split("-");
                if (myTableLocation[1] === "phone")
                    $('[data-popup="popup-1"]').fadeIn(350);
                if (myTableLocation[1] === "identify") {
                    var exData = myData.options.data[myTableLocation[0]];
                    for (var i = 0; i < myData.options.columns.length; i++) {
                        var column = myData.options.columns[i];
                        console.log(column.displayName);
                        var li = $("<li/>");
                        var lbl = $("<label/>");
                        var b = $("<b/>");
                        b.text(column.displayName);
                        var span = $("<span/>");
                        span.text(" : "+exData[column.name]);

                        lbl.append(b);
                        lbl.append(span);

                        li.append(lbl);

                        ulElem.append(li);

                    }
                    $('[data-popup="popup-2"]').fadeIn(350);
                }
            }

            // alert(JSON.stringify(myData.options.data[myTableLocation[0]]))
            // methods.private_activateEditor(myComponent, myCell, myTableLocation);

            // methods.private_selectRow(myComponent, myCell, myTableLocation);
        },
        getCellValue: function (aRow, aIndex, aColumn) {
            return aRow[(aColumn.field || aIndex)];
        }
    }
    $.fn.tablePlugin = function (options) {
        methods.init.apply(this, arguments)
    };
    $.fn.tablePlugin.defaultOptions = {
        theadBackGround: "red",
        background: "yellow"
    };
})(jQuery);

function openSubElements(className) {
    if ($("." + className + "-sub")[0].style.display == "none")
        $("." + className + "-sub").fadeIn(350)
    else
        $("." + className + "-sub").fadeOut(350)

}