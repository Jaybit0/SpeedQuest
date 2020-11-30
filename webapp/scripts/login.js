function init() {
	/* Eventually show error dialog */

	var urlParams = getUrlParam(location.href);
	if('key' in urlParams){ // 400 is not specifically mentioned
		$('#keyInput').attr('value', urlParams.key);
		console.log($('#keyInput'));
	};
	if('error' in urlParams) {
		showErrorDialog('Fehler');
	}

}

function showErrorDialog(text){
	$('#error-div').text(text);
	$('#error-div').show();
}

function getUrlParam(url) {
	var params = {};
	var parser = document.createElement('a');
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
}
