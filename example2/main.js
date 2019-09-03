$(document).ready(function () {
    $(".interpl-graph[csv]").each(function () {
        let file = $(this).attr("csv");
        Papa.parse(file, {
            download: true,
            complete: file.startsWith("5Sensor")
                ? load_5Sensor_Interpl.bind(this)
                : file.startsWith("7Sensor")
                    ? load_7Sensor_Interpl.bind(this)
                    : () => null,
            error: console.error,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transform: value => value.replace(",", ".")
        });
    });
});

function load_5Sensor_Interpl(results, file) {

    let avgOf = 4;
    let slowDown = 5;

    let dataArr = new Array(Math.trunc(results.data.length / avgOf));
    for (let i = 0; i < dataArr.length; i++) {
        let newRow = {};
        for (let j = 0; j < avgOf; j++) {
            let row = results.data[i * avgOf + j];
            for (let key in row) {
                newRow[key] = (newRow[key] || 0) + row[key] / avgOf;
            }
        }
        dataArr[i] = newRow;
    }

    function getValues(row) {
        return [row.sens448, row.sens449, row.sens450, row.sens451, row.sens452];
    }

    function calcValues(xAxis, spline) {
        return xAxis.map(x => spline(x));
    }

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
        if (index == dataArr.length) {
            clearInterval(loop);
            return;
        }

        let row = dataArr[index++];
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
    }, 1 * slowDown);

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

function load_7Sensor_Interpl(results, file) {

    let avgOf = 4;
    let slowDown = 5;

    let dataArr = new Array(Math.trunc(results.data.length / avgOf));
    for (let i = 0; i < dataArr.length; i++) {
        let newRow = {};
        for (let j = 0; j < avgOf; j++) {
            let row = results.data[i * avgOf + j];
            for (let key in row) {
                newRow[key] = (newRow[key] || 0) + row[key] / avgOf;
            }
        }
        dataArr[i] = newRow;
    }

    function getValues(row) {
        return [row["sensX-3"], row["sensX-2"], row["sensX-1"], row["sensX0"], row["sensX1"], row["sensX2"], row["sensX3"]];
    }

    function calcValues(xAxis, spline) {
        return xAxis.map(x => spline(x));
    }

    const xMin = -8, xMax = 8;

    let layout = {
        title: file,
        xaxis: {
            text: "dist",
            range: [xMin, xMax],
            autorange: false
        },
        yaxis: {
            text: "temp",
            range: [0, 1200],
            autorange: false
        }
    };

    let xAxis = [xMax];
    while (xAxis[0] >= xMin) { xAxis.unshift(xAxis[0] - .1) };
    let args = [-7.5, -5, -2.5, 0, 2.5, 5, 7.5];
    let values = [0, 0, 0, 0, 0, 0, 0];
    let cubicSpline = Spline(args, values, [0, 0]);
    let betterSpline = Spline(args, values, [0, 0], [0, 0]);

    let index = 0;

    function draw(plot) {
        let row = dataArr[index++];

        let values = getValues(row);
        let cubicSpline_next = cubicSpline.update(values);
        let betterSpline_next = betterSpline.update(values);
        let cubicY = calcValues(xAxis, cubicSpline_next);
        let betterY = calcValues(xAxis, betterSpline_next);

        if (index < dataArr.length) {
            let delay = slowDown * (dataArr[index]["Time"] - row["Time"]);
            setTimeout(draw, delay, plot);
        }

        Plotly.react(plot, [
            {
                name: "sensors",
                mode: "markers",
                x: args,
                y: values
            },
            {
                name: "cubic interpl",
                mode: "lines",
                x: xAxis,
                y: cubicY
            },
            {
                name: "higher interpl",
                mode: "lines",
                x: xAxis,
                y: betterY
            }, {
                name: "reftemp",
                mode: "lines",
                x: [xMin, xMax],
                y: [row["reftemp"], row["reftemp"]]
            }
        ], layout);
    }

    Plotly.newPlot(
        this, [{
            name: "sensors",
            mode: "markers",
            x: args,
            y: values
        }, {
            name: "cubic interpl",
            mode: "lines",
            x: xAxis,
            y: calcValues(xAxis, cubicSpline)
        },
        {
            name: "higher interpl",
            mode: "lines",
            x: xAxis,
            y: calcValues(xAxis, betterSpline)
        }], layout, {
            displayModeBar: false
        }
    );

    draw(this);

}