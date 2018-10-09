var mapDotJhm;
var helpTocDotXml;

get('../javahelp/map.jhm', processMapDotJhm);
get('../javahelp/helpTOC.xml', processHelpTocDotXml);

function processHelpTocDotXml(data) {
    helpTocDotXml = xmlStringToJson(data);
    helpTocDotXml && helpTocDotXml.toc && (helpTocDotXml = helpTocDotXml.toc);
    helpTocDotXml && helpTocDotXml.tocitem && (helpTocDotXml = helpTocDotXml.tocitem);
    helpTocDotXml && (helpTocDotXml = collapse(helpTocDotXml).tocitem);
    mapDotJhm && init();
}

function collapse(item) {
    var attrs = item['@attributes'];
    delete item['@attributes'];
    item.text = attrs.text;
    item.image = attrs.image;
    if (Array.isArray(item.tocitem)) {
        item.tocitem = item.tocitem.map(collapse);
    } else if (item.tocitem){
        item.tocitem = collapse(item.tocitem);
    }
    return item;
}

function processMapDotJhm(data) {
    mapDotJhm = xmlStringToJson(data);
    mapDotJhm && mapDotJhm.map && (mapDotJhm = mapDotJhm.map);
    mapDotJhm && (mapDotJhm = mapDotJhm.find(function (el) {
        return el.mapID;
    }).mapID);
    mapDotJhm && (mapDotJhm = mapDotJhm.map(function (el) {
        return el["@attributes"];
    }).reduce(function (acc, el) {
        acc[el.target] = el.url;
        return acc;
    }, {}));
    helpTocDotXml && init();
}

function init() {
    console.log(helpTocDotXml);
    console.log(mapDotJhm);
    createChapters(helpTocDotXml)
}

function createChapters(data) {

    var chapters = d3.select('div.chapters')
        .selectAll('div.chapter')
        .data(data)
        .enter()
        .append('div')
        .classed('chapter', true);

    chapters.append('div')
        .classed('chapter-name', true)
        .on('click', chapterClick)
        .html(function (d) {
            return d.text;
        });

    createChapterTree(chapters)

}


function createChapterTree(chapters) {
    if (!chapters._groups.length)
        return;

    chapters.selectAll('div.chapter-topic')
        .data(function (d) {
            return d.tocitem;
        })
        .enter()
        .append('div')
        .each(function (d) {
            d.tocitem && d3.select(this)
                .classed('chapter-topic-node', true)
        })
        .classed('chapter-topic invisible', true)
        .append('div')
        .classed('sub-chapter-name', true)
        .attr('id', function () {
            return rnd(36);
        })
        .on('click', function (d) {
            console.log(this)

            var act = d3.select(this.parentNode)
                .classed('active')

            d3.selectAll(this.parentNode.childNodes)
               .classed('invisible', act);

            d3.select(this.parentNode)
                .classed('active', !act)
        })
        .html(function (d) {
            return d.text;
        });

    createChapterTree(chapters.selectAll('.chapter-topic-node'))

}

function chapterClick() {
    if (d3.select(this.parentNode).classed('active'))
        return;

    d3.selectAll('div.chapter')
        .classed('active', false);

    d3.selectAll('div.chapter-topic')
        .classed('invisible', true);

    d3.select(this.parentNode)
        .classed('active', true);

    d3.selectAll(this.parentNode.childNodes)
        .classed('invisible', false);
}

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


 function rnd(i) {
    var rnd = '';

    while (rnd.length < i) {
        rnd += Math.random().toString(36).substring(2);
    }

    return rnd.substring(0, i);
}