/**
 * Print message to log textarea
 * @param  {string}   msg   Log Message
 */
function printLog(msg) {

    const box = $( '#logBox' );
    box.val(box.val() + msg + '\n');

}