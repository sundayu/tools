// ==UserScript==
// @name          Get ED2K Link
// @description   get
// @include       http*://www.verycd.com/topics/*
// @include       http*://verycd.com/topics/*
// @namespace     #sundayu
// @version       1.0
// ==/UserScript=
var data = {},
    view = {
        container: $("iptcomED2K"),
        msgId: "ooxx-msg",
        listId: "ooxx-list",
        start: function(){
            if(this.container){
                var div = document.createElement("div");
                div.innerHTML = '<div id=' + view.listId + '></div><div id="' + view.msgId + '">获取中...</div>';
                view.container.appendChild(div);
            }
        },
        complete: function(){
            $(view.msgId).innerHTML = "获取完毕！"
        },
        createItem: function(link, size, source, time){
            var html = new CString();
            var div = document.createElement("div");
            div.className = "ooxx-item";
            html.append('<a style="color:red" href="link">')
                .append(link)
                .append('</a>');
            div.innerHTML = html.toString();
            return div;
        },
        addItem: function(link, size, source, time){
            var item = view.createItem(link);
            $(view.listId).appendChild(item);
        }
    };
function $(a){return document.getElementById(a);}
function CString(){
    this.html = [];
}
CString.prototype = {
    append: function(s){
        var html = this.html;
        html[html.length] = s;
        return this;
    },
    toString: function(){
        return this.html.join("");
    }
}
function iframeTool(url, callback, allCompleteCallback){
    this.urls = url?[url]:url;
    this.callback = callback;
    this.onComplete = allCompleteCallback;
}
iframeTool.prototype = {
    addUrl: function(url){
        this.urls.push(url);
        return this;
    },
    setCallback: function(f){
        this.callback = f?f:function(){return false;};
    },
    setAllCompleteCallback: function(f){
        this.onComplete = f?f:function(){return false;};
    },
    request: function(){
        var iframe, url,
            self = this;
        if( this.urls.length > 0 ){
            url = this.urls.shift();
            iframe = document.createElement("iframe");
            iframe.src = url;
            iframe.style.display = "none";
            iframe.addEventListener("load", function(){
                self.callback(iframe.contentDocument, url);
                setTimeout(function(){
                    iframe.parentNode.removeChild(iframe);
                    iframe = null;
                }, 10);
                self.request();
            }, true);
            document.body.appendChild(iframe);
        } else {
            this.onComplete();
        }
        return this;
    }
}

function getUrlsInSearchResultPage(url){
    var req = new iframeTool(url, function(doc){
            var table = doc.getElementById("main-table"),
                rows = table?table.rows:[],
                row, url;
            for(var i=1,l=rows.length;i<l;i++){
                row = rows[i];
                url = row.cells[1].children[0].href;
                req.addUrl(url);
                req.setCallback( function(doc, url){
                    var link = doc.getElementById("downloadButton").name;
                    view.addItem(link);
                } );
                req.setAllCompleteCallback(function(){
                    view.complete();
                });
                data[url] = {
                    source: "",
                    time: "",
                    fileName: "",
                    size: ""
                }
            }
        });
    req.request();
}
(function(){
    var container = $("iptcomED2K");
    var btnDom = container.getElementsByClassName('button');
    var url;
        if(btnDom){
            url = btnDom[0].href;
            getUrlsInSearchResultPage(url);
            view.start();
        }
})();
