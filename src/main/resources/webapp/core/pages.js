let s = window.location.search.substr(1);
get('../javahelp/' + s, function (html) {
    var doc = new DOMParser().parseFromString(html,"text/html");
    document.head.innerHTML += doc.head.innerHTML
        .replace('href\=\"', 'href\=\"../javahelp/' +
            s.substr(0, s.lastIndexOf('/')+1));


    var content = doc.body.innerHTML.split('src\=\"').join('src\=\"../javahelp/' +
        s.substr(0, s.lastIndexOf('/')+1));



    d3.select('div.content').html(content)
});



