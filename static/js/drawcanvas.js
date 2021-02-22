/**
 * Draw audio waveform with canvas.js
 * @param  {[array]}    y           vector of y samples
 * @param  {[array]}    x           vector of x samples
 * @param  {[int]}      framesize   optional: size of one rms frame
 */
function drawCanvas(y, x,framesize = null) {
    var canvas = $( '#canvas' );
    var options = {
        // bundled list for canvas.js options
        type: 'bar',
        data: {
            labels: x,
            datasets: [{
                label: 'RMS with framesize ' + framesize,
                data: y,
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
                        reverse: false,

                        // adjust tick format: round up to 2 decimal points
                        callback: function(value, index, values) {
                            return Math.round(value * 100) / 100;
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = Math.round(tooltipItem.yLabel * 100) / 100;
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