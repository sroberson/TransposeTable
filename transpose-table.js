;(function (window, document, $) {
    var switched = false;
    var tableSwapTriggerWidth = 1030;

    updateTables();

    $(window).resize(function () {
        updateTables();
    });


    function updateTables() {
        if (($(window).width() < tableSwapTriggerWidth) && !switched) {
            switched = true;
            $("table.ResponsiveTable").each(function (i, table) {
                reorganizeTable($(table));
            });
            return true;
        }
        else if (switched && ($(window).width() > tableSwapTriggerWidth)) {
            switched = false;
            $("table.ResponsiveTable").each(function (i, table) {
                removeReorganizedTable($(table));
            });
        }
    }


    function reorganizeTable(original) {

        // TODO: update to handle more than a single data row

        var $table = $('<table class="small"/>'),
            rowTemplate = '<tr><td class="heading">{{0}}</td><td>{{1}}</td></tr>',
            header = [],
            row = [];

        // get first row (header); grab each cell; append to new table
        original.find("tr").eq(0).find("td,th").each(function () {
            header.push($(this).clone().html());
        });

        // get data row; get each cell; append to new table
        original.find("tr").eq(1).find("td").each(function () {
            row.push($(this).clone().html());
        });

        $.each(header, function (id) {
            $table.append(doTemplate(rowTemplate, [header[id], row[id]]));
        });

        original.after($table);
    }

    function removeReorganizedTable(original) {
        original
            .parent()
            .find(".small")
            .remove();
    }

    /*
     simple HTML templating function
     array example:
     demo.markup("<div>{{1}}, {{0}}</div>", ["John", "Doe"]);
     object example:
     demo.markup("<div>{{last}}, {{first}}</div>", {first:"John", last:"Doe"});
     */
    function doTemplate(html, data) {
        var m;
        var i = 0;
        var match = html.match(data instanceof Array ? /{{\d+}}/g : /{{\w+}}/g) || [];

        while (m = match[i++]) {
            html = html.replace(m, data[m.substr(2, m.length - 4)]);
        }
        return html;
    }

}(this, document, jQuery));
