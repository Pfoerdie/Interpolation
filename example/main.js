CsvToHtmlTable.init({
    csv_path: "test.csv",
    element: "table-container",
    allow_download: false,
    csv_options: { separator: ";", delimiter: "\"" },
    datatables_options: {
        paging: false,
        initComplete: loadGraph,
        searching: false,
        info: false
    }
});

function loadGraph() {

    try {

        let
            args = [],
            values = [];

        $("#table-container table tbody tr").each(function () {
            let
                cols = $(this).children("td"),
                x = parseFloat($(cols.get(0)).text()),
                y = parseFloat($(cols.get(1)).text());

            if (isNaN(x) || isNaN(y))
                return;

            args.push(x);
            values.push(y);
        });

        console.log("args:", args);
        console.log("values:", values);

        let
            resolution = 1000,
            spline = new Spline(args, values, [0, 0]),
            fineArgs = new Array(resolution).fill((args[args.length - 1] - args[0]) / (resolution - 1)).map((step, index) => args[0] + index * step),
            graphs = [];

        graphs.push({
            name: "Value",
            mode: "markers",
            x: args,
            y: values
        });

        graphs.push({
            name: "Spline",
            mode: "lines",
            x: fineArgs,
            y: fineArgs.map(x => spline(x))
        });

        spline.base.forEach((base, index) => {
            graphs.push({
                name: "B" + index,
                legendgroup: "Base",
                mode: "lines",
                x: fineArgs,
                y: fineArgs.map(x => spline.coeffs[index] * base(x)),
                opacity: 0.2
            });
        });

        Plotly.newPlot("graph-container", graphs, { title: "Spline Interpolation" });

    } catch (err) {
        console.error(err);
    }

} // loadGraph

