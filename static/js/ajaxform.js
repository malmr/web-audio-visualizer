/**
 * Form submission with ajax
 * Prevent default upload form submission.
 * Receive data on success callback and triggering data draw in canvas.
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