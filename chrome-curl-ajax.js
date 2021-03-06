cmd = 'curl \'http://www.gasbuddy.com/GasPriceMap/Map\' -H \'Origin: http://www.gasbuddy.com\' -H \'Accept-Encoding: gzip, deflate\' -H \'Accept-Language: en-US,en;q=0.8\' -H \'X-Requested-With: XMLHttpRequest\' -H \'Connection: keep-alive\' -H \'Pragma: no-cache\' -H \'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.59 Safari/537.36\' -H \'Content-Type: application/json; charset=UTF-8\' -H \'Accept: */*\' -H \'Cache-Control: no-cache\' -H \'Referer: http://www.gasbuddy.com/GasPriceMap?z=4&lng=-96.5\' --data-binary \'{"minLat":37.6,"maxLat":37.9,"minLng":-122.1,"maxLng":-121.2,"width":1280,"height":600}\' --compressed'

function curlUrl(cmd) {
	if (matches = cmd.match(/curl [\"\']([^\"\']+)[\"\']/)) {
		return matches[1]
	} else {
		console.error('could not find url')
	}
}

function curlHeaders(cmd) {
	if (matches = cmd.match(/ -H [\"\']([^\"\']+)[\"\']/g)) {
		headers = {}
		for (i in matches){
			header = matches[i].match(/ -H [\"\']([^\"\'']+): ([^\"\'']+)[\"\'']/)
			headers[header[1]] = header[2]
		}
		if (headers) {
			return headers
		} else {
			console.error('could not find headers')
		}
	}
}

function curlData(cmd) {
	if (matches = cmd.match(/ --data [\"\']([^\"\']+)[\"\']/)) {
		return matches[1]
	} else if (matches = cmd.match(/ --data-binary [\']([^\']+)[\']/)) {
		return matches[1]
	} else {
		console.error('could not find data')
	}
}

function curlParse(cmd) {
	results = {}
	results.url = curlUrl(cmd)
	results.headers = curlHeaders(cmd)
	results.data = curlData(cmd)
	return results
}

function doxhr(curlvars) {
	xhr = new XMLHttpRequest();
	xhr.open("POST", curlvars.url, false);
	forbiddenheaders = ["Cookie", "Origin", "Accept-Encoding", "User-Agent", "Referer", "Connection"]
	for (i in curlvars.headers) {
		if (forbiddenheaders.indexOf(i) < 0) {
			console.log('setting header', i, curlvars.headers[i]);
			xhr.setRequestHeader(i, curlvars.headers[i]);
		} else {
			console.log('forbidden header', i, curlvars.headers[i]);
		}
	}
	xhr.onreadystatechange = function () {
		if (xhr.readyState == xhr.DONE) {
			console.log('xhr.response', xhr.response)
		} else {
			console.error('xhr error', xhr)
		}
	}
	xhr.send(curlvars.data);
}

curlvars = curlParse(cmd)
doxhr(curlvars)
