/**
 * Print message to log textarea
 * @param  {string}   msg   Log Message
 */
function printLog(msg) {

    const box = $( '#logbox' );
    box.val(box.val() + msg + '\n');

}