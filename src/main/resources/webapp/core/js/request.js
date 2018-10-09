function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function readyStateChange() {
        xhr.readyState === 4 &&
        xhr.status === 200 &&
        callback(xhr.responseText);
    };
    xhr.send();
}