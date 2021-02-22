/**
 * handles file selection, either through drag & drop or
 * file selector
 */

// file drag hover
function FileDragHover(e) {

	// prevent default event
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "hover" : "");
}

// file selected
// prevent default hover event, and triggers ajax form
function FileSelectedHandler(e) {

	// deactivate default hover event
	FileDragHover(e);

	// fetch files object
	const dt = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
	const files = e.target.files || (dt && dt.files);
	if (files) {

		// submit ajax POST request
		const fd = new FormData();
		const f = files[0];
		fd.append('file', f);
		ajaxform(fd)

		// adjust canvas border
		$("canvas").css("border", 0);
	}
}

// initialize
function Init() {
	var fileinput = $('#fileinput'),
		filedrag = $('#canvas');

	// file input trigger (upload button)
	fileinput.on('change', FileSelectedHandler);

	// is XHR2 available?
	var xhr = new XMLHttpRequest();
	if (xhr.upload) {

		// drag and drop listener
		filedrag.on('dragover', FileDragHover);
		filedrag.on('dragleave', FileDragHover);
		filedrag.on('drop', FileSelectedHandler);
	}

}

// call initialization func
$(document).ready(function() {
	Init();
});
