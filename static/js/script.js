/**
 * Form submission with ajax
 * Prevent default upload form submission.
 * Receive data on success callback and draw data in canvas.
 */
$(document).ready(function() {
    // bind ajax submit to upload form
    $( '#uploadForm' ).submit( function( e ) {
        $.ajax( {
            url: '/upload',
            type: 'POST',
            data: new FormData( this ),
            processData: false,
            contentType: false,
            success: function(data){
                printLog('Successfully uploaded and analyzed.');
                printLog('Sample rate: ' + data.fs +
                    ' Hz, RMS framesize: ' + data.framesize);
                // paint waveform
                drawCanvas(data.rms, data.t_rms, data.framesize);
                printLog('Draw data.');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // print error message to log box
                const msg = 'Error ' + jqXHR.status + ': ' +
                    jqXHR.responseText;
                printLog(msg);
            }
        } );
        // suppress default form submission
        e.preventDefault();
    } );
});

/**
 * Draw audio waveform with canvas.js
 * @param  {[array]}    y           vector of y samples
 * @param  {[array]}    x           vector of x samples
 * @param  {[int]}      framesize   optional: size of one rms frame
 */
function drawCanvas(y, x,framesize = null) {
    var ctx = $( '#canvas' );
    var options = {
        type: 'bar',
        data: {
            labels: x,
            datasets: [
                {
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
                        labelString: 'dBFS (positive values)'
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
                        label += ' dBFS (positive)'
                        return label;
                    }
                }
            }
        }
    }
    new Chart(ctx, options)
}

/**
 * Print message to log textarea
 * @param  {string}   msg   Log Message
 */
function printLog(msg) {
    const box = $( '#logBox' );
    box.val(box.val() + msg + '\n');
}