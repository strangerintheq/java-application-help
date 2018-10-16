var mapDotJhm;
var helpTocDotXml;

get('http://localhost:9182/javahelp/map.jhm', processMapDotJhm);
get('http://localhost:9182/javahelp/helpTOC.xml', processHelpTocDotXml);

function processHelpTocDotXml(data) {
    helpTocDotXml = xmlStringToJson(data);
    mapDotJhm && init();
}

function processMapDotJhm(data) {
    mapDotJhm = xmlStringToJson(data);
    helpTocDotXml && init();
}

function prepareMapDotJhm() {
    console.log(JSON.stringify(mapDotJhm))
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
}

function prepareHelpDotXml() {
    helpTocDotXml && helpTocDotXml.toc && (helpTocDotXml = helpTocDotXml.toc);
    helpTocDotXml && helpTocDotXml.tocitem && (helpTocDotXml = helpTocDotXml.tocitem);
    helpTocDotXml && (helpTocDotXml = collapse(helpTocDotXml).tocitem);
}

function collapse(item) {
    var attrs = item['@attributes'];
    delete item['@attributes'];
    item.text = attrs.text;
    item.image = mapDotJhm[attrs.image];
    item.target = mapDotJhm[attrs.target];
    if (Array.isArray(item.tocitem)) {
        item.tocitem = item.tocitem.map(collapse);
    } else if (item.tocitem) {
        item.tocitem = collapse(item.tocitem);
    }
    return item;
}

function init() {

    prepareMapDotJhm();
    prepareHelpDotXml();
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
        .html(imgAndText);

    createChapterTree(chapters)
}

function imgAndText(d) {
    return '<img class="inline" ' +
        'style="padding-right: 5px;" ' +
        'src="../javahelp/files/' + d.image + '">' +
        '<div class="inline">' + d.text + '</div>';
}

function createChapterTree(chapters) {
    if (!chapters._groups.length)
        return;

    chapters.selectAll('div.chapter-topic')
        .data(function (d) {
            return Array.isArray(d.tocitem) ? d.tocitem : [d.tocitem];
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
        .on('click', clickOnTopic)
        .html(imgAndText);

    createChapterTree(chapters.selectAll('.chapter-topic-node'))

}

function clickOnTopic(d) {

    if (!d.tocitem) {
        window.location.href = 'pages.html?' + d.target;
        return;
    }

    var act = d3.select(this.parentNode)
        .classed('active');

    d3.selectAll(this.parentNode.childNodes)
        .classed('invisible', act);

    d3.select(this.parentNode)
        .classed('active', !act)
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


