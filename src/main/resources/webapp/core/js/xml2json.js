var domParser = new DOMParser();

function xmlStringToJson(str) {
    var xmlDom = domParser.parseFromString(str, 'text/xml');
    return xmlToJson(xmlDom, true);
}

function xmlToJson(xml, removeEmptyTextNodes) {

    var obj = {};

    if (xml.nodeType === Node.ELEMENT_NODE) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType === Node.TEXT_NODE) {
        obj = xml.nodeValue.trim();
    }

    for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;

        var json = xmlToJson(item, removeEmptyTextNodes);

        if (removeEmptyTextNodes && !json)
            continue;

        if (obj[nodeName]) {
            if (!Array.isArray(obj[nodeName])) {
                var old = obj[nodeName];
                obj[nodeName] = [];
                obj[nodeName].push(old);
            }
            obj[nodeName].push(json);
        } else {
            obj[nodeName] = json;
        }
    }
    return obj;
}