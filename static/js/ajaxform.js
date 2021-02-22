/**
 * Form submission with ajax
 * Sending AJAX request and upload file. Receive data on success callback
 * and triggering data draw in canvas. Prevent default form events.
 *
 * @param  {[FormData]}    y        form data with file object
 */
function ajaxform(formData) {

    // sending ajax request
    $.ajax( {

        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){

            // triggering canvas draw
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
}
