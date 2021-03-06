// ajax without jquery; from: http://stackoverflow.com/a/18078705/447661
var ajax = function(options){
    var options     = options               || {};
    var method      = options.method        || 'GET';
    var sync        = options.sync          || false;
    var url         = options.url           || window.location.pathname;
    var data        = options.data          || null;
    var type        = options.type          || 'json';
    var done        = options.done          || function(){};
    var fail        = options.fail          || function(){};
    var complete    = options.complete      || function(){};
    var beforeSend  = options.beforeSend    || function(){};

    try {
        xhr = new XMLHttpRequest();
    } catch ( e ) {
        return _fail(e);
    }

    function _done(data){
        done(data);
        complete(data,'success');
    }

    function _fail(err){
        fail(data);
        complete(data,'error');
    }

    xhr.open(method, url, sync);
    beforeSend(xhr);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                if(type === 'json' && method === 'GET') {
                    try {
                        _done(JSON.parse(xhr.responseText));
                    } catch (err) {
                        _fail(err);
                    }
                } else {
                    _done(xhr);
                }
            } else {
                _fail('http return code: ' + xhr.status);
            }
        }
    };

    function objectToQueryString(data){
        var query = '';
        for (var key in data) {
            query += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }
        return query;
    }

    if (type === 'json') {
//        data = JSON.stringify(data);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    } else if (type === 'uri') {
        if (method === 'POST') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        data = objectToQueryString(data);
    } else {
        return _fail('Type not supported: ' + type);
    }

    try {
        var _data = method === 'GET' ? null : data;
        xhr.send(_data);
    } catch(err) {
        return _fail('Send error: ' + err);
    }
}

// http://stackoverflow.com/a/16938481/447661
function get_browser(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return 'IE '+(tem[1]||'');
    }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return 'Opera '+tem[1];}
    }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return M[0];
}

function get_browser_version(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];                                                                                                                         
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1]||'');
    }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return 'Opera '+tem[1];}
    }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return M[1];
}

function getBrowserInfo(){
    return {
        browserName: get_browser(),
        browserVersion: get_browser_version(),
        userAgent: navigator.userAgent
    }
}

// http://stackoverflow.com/a/11744120/447661
function getViewportInfo() {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    viewportWidth = w.innerWidth || e.clientWidth || g.clientWidth,
    viewportHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return {
        width: viewportWidth,
        height: viewportHeight
    }
}

function getOSInfo() {
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

    return { name: OSName };
}


/* config
 *  url: where to submit form
 *  headers: headers to be added to the Ajax request
 *  elHtml: element html (default: '<a href="#" id="buggerReport">Report an issue</a>'
 *  done: callback for finished successfully
 *  error: callback for error
 */
function jbugger(config) {

    var config = typeof config !== "undefined" ? config: {};
    var url = typeof config.url !== "undefined" ? config.url: '/';
    var headers = typeof config.headers !== "undefined" ? config.headers: {};

    // make form
    var form = document.createElement('form');
    form.id = typeof config.formId !== "undefined" ? config.formId : 'jbugger-form';
    form.style.cssText = typeof config.elCss !== "undefined" ? config.elCss: 'position: fixed; bottom: 15px; right: 0px; margin: 10px; display: none;';
    if(typeof config.addCss !== "undefined") form.style.cssText += config.addCss;

    // textarea
    var textArea = document.createElement('textarea');
    textArea.id = 'jbugger-textarea';
    textArea.setAttribute('rows','3');
    textArea.setAttribute('cols','50');
    textArea.setAttribute('name','description');
    textArea.style.cssText = 'width: 100%;';
    textArea.value = 'Please describe the issue.';
    textArea.onfocus = function() { // from: http://stackoverflow.com/a/5797700/447661
        textArea.select();

        // Work around Chrome's little problem
        textArea.onmouseup = function() {
            // Prevent further mouseup intervention
            textArea.onmouseup = null;
            return false;
        };
    };
    form.appendChild(textArea);

    // 'Send' button
    var sendButton = document.createElement('button');
    sendButton.id = 'jbugger-send';
    sendButton.innerHTML = 'Send';
    sendButton.onclick = function(e){
        e ? e.preventDefault() : window.event.returnValue = false;
        var self = this;
        this.disabled = true;

        // gather information to be sent
        var info = getBrowserInfo();
        info.osName = getOSInfo().name;
        if(typeof config.customInfo !== 'undefined'){
            var customInfo = config.customInfo();
            for(var customInfoItem in customInfo){
                info[customInfoItem] = customInfo[customInfoItem];
            }
        }
        info.url = document.URL;
        info.description = document.getElementById('jbugger-textarea').value;

        var viewportInfo = getViewportInfo();
        info.viewportWidth = viewportInfo.width;
        info.viewportHeight = viewportInfo.height;

        var data = JSON.stringify(info, null, 2);
        
        // post data
        ajax({
            url: url,
            type: 'json',
            method: 'POST',
            data: data,
            done: function(xhr){
                alert('Report sent.');
            },
            fail: function(err){
                alert('Could not send report: ' + err);
            },
            complete: function(){
                self.disabled = false;
                return false;
            }
        });

        form.style.display = 'none';
    };
    form.appendChild(sendButton);

    // 'Cancel' button
    var cancelButton = document.createElement('button');
    cancelButton.id = 'jbugger-cancel';
    cancelButton.innerHTML = 'Cancel';
    cancelButton.onclick = function(e){
        e ? e.preventDefault() : window.event.returnValue = false;
        form.style.display = 'none';
    };
    form.appendChild(cancelButton);

    document.body.appendChild(form); 

    // make 'report' button
    var elem = document.createElement('div');
    elem.id = typeof config.elemId !== "undefined" ? config.elemId : 'jbugger';
    elem.innerHTML = typeof config.elHtml !== "undefined" ? config.elHtml: '<a href="#" id="buggerReport">Report an issue</a>';
    elem.style.cssText = typeof config.elCss !== "undefined" ? config.elCss: 'position: fixed; bottom: 0px; right: 0px; margin: 10px;';
    document.body.appendChild(elem); 

    // click - show form
    elem.onclick = function(e){
        var args = Array.prototype.slice.call(arguments);
        e ? e.preventDefault() : window.event.returnValue = false;
        form.style.display = 'block';
        sendButton.disabled = false;
    }
}

window.onload = function(){
    if(typeof window.jbuggerConfig !== 'undefined'){
        jbugger(jbuggerConfig);
    } else {
        jbugger();
    }
}
