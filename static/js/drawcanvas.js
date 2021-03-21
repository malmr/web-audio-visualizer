/**
 * Draw audio waveform with canvas.js
 * @param  {[array]}    y           vector of y samples
 * @param  {[array]}    x           vector of x samples
 * @param  {[int]}      framesize   optional: size of one rms frame
 */
function drawCanvas(y, x, framesize = null) {
    var canvas = $( '#canvas' );
    var inverted = [].slice.call(y),
    min = Math.min.apply(Math, inverted);
    // round to next 10 (for nice y axis ticks)
    minRnd = Math.ceil((min + 1)/10) * 10;
    offset = minRnd - 20; 
    inverted.forEach(function(val, idx) {
        inverted[idx] = Math.abs(offset - val);
    });
    var options = {
        // bundled list for canvas.js options
        type: 'bar',

        data: {
            labels: x,
            datasets: [{
                label: 'RMS with framesize ' + framesize,
                data: inverted,
                pointRadius: 1.1,
                backgroundColor: 'rgba(101, 129, 165, 0.8)',
                }]
        },
        options: {

            // keep drag and drop canvas size
            maintainAspectRatio: false,
            scales: {
                xAxes: [{

                    // no space between bars
                    barPercentage: 1,
                    categoryPercentage: 1,

                    // set maximum size of x-ticks
                    ticks: {
                        maxTicksLimit: 21.1,

                        // adjust tick format: round up to 2 decimal points
                        callback: function(value, index, values) {
                            return Math.round(value * 100) / 100 + ' s';
                        }
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'dBFS'
                    },

                    ticks: {
                        beginAtZero: true,
                        reverse: false,
                        // adjust tick format: round up to 2 decimal points
                        callback: function(value, index, values) {
                            return value + offset;

                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        value = tooltipItem.yLabel + offset;
                        var label = Math.round(value * 100) / 100;
                        label += ' dBFS'
                        return label;
                    }
                }
            }
        }
    }

    // draw on canvas
    new Chart(canvas, options)
}