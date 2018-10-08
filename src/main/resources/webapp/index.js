var xhr = new XMLHttpRequest();
xhr.open('GET', 'contents.json', true);
xhr.onreadystatechange = readyStateChange;
xhr.send();

function readyStateChange() {
    xhr.readyState === 4 && xhr.status === 200 &&
    processContents(JSON.parse(xhr.responseText));
}

function processContents(data) {

    var chapters = d3.select('div.chapters')
        .selectAll('div.chapter')
        .data(data)
        .enter()
        .append('div')
        .classed('chapter', true)
        .on('click', chapterClick);

    chapters.append('div')
        .classed('chapter-name', true)
        .html(function (d) {
            return d.name;
        });

    chapters.selectAll('div.chapter-topic')
        .data(function (d) {
            return d.items;
        })
        .enter()
        .append('div')
        .classed('chapter-topic invisible', true)
        .html(function (d) {
            return d.name;
        });

}

function chapterClick() {
    d3.selectAll('div.chapter')
        .classed('active', false);

    d3.selectAll('div.chapter-topic')
        .classed('invisible', true);

    d3.select(this)
        .classed('active', true)
        .selectAll('div.chapter-topic')
        .classed('invisible', false);
}
