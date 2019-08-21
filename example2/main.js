$(document).ready(function () {
    $(".interpl-graph[csv]").each(function () {
        Papa.parse($(this).attr("csv"), {
            download: true,
            complete: loadInterpl.bind(this),
            error: console.error,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transform: value => value.replace(",", ".")
        });
    });
});

function getValues(row) {
    return [row.sens448, row.sens449, row.sens450, row.sens451, row.sens452];
}

function calcValues(xAxis, spline) {
    return xAxis.map(x => spline(x));
}

function loadInterpl(results, file) {

    let layout = {
        title: file,
        xaxis: {
            text: "dist",
            range: [-6, 6],
            autorange: false
        },
        yaxis: {
            text: "temp",
            range: [0, 200],
            autorange: false
        }
    };

    let xAxis = [6];
    while (xAxis[0] >= -6) { xAxis.unshift(xAxis[0] - .1) };
    let args = [-5, -2.5, 0, 2.5, 5];
    let values = [0, 0, 0, 0, 0];
    let origSpline = Spline(args, values, [0, 0]);

    let index = 0;
    let loop = setInterval(() => {
        if (index == results.data.length) {
            clearInterval(loop);
            return;
        }

        let row = results.data[index++];
        let values = getValues(row);
        let nextSpline = origSpline.update(values);

        Plotly.react(this, [
            {
                name: "sensors",
                mode: "markers",
                x: args,
                y: values
            },
            {
                name: "interpl",
                mode: "lines",
                x: xAxis,
                y: calcValues(xAxis, nextSpline)
            }, {
                name: "reftemp",
                mode: "lines",
                x: [-6, 6],
                y: [row.reftemp, row.reftemp]
            }
        ], layout);
    }, 1);

    Plotly.newPlot(
        this, [{
            name: "sensors",
            mode: "markers",
            x: args,
            y: values
        }, {
            name: "interpl",
            mode: "lines",
            x: xAxis,
            y: calcValues(xAxis, origSpline)
        }], layout, {
            displayModeBar: false
        }
    );

}