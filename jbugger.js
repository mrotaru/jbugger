// ajax without jquery; from: http://stackoverflow.com/a/18078705/447661
var ajax = {};
ajax.x = function() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();  
    }
    var versions = [
        "MSXML2.XmlHttp.5.0",   
        "MSXML2.XmlHttp.4.0",  
        "MSXML2.XmlHttp.3.0",   
        "MSXML2.XmlHttp.2.0",  
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for(var i = 0; i < versions.length; i++) {  
        try {  
            xhr = new ActiveXObject(versions[i]);  
            break;  
        } catch (e) {
        }  
    }
    return xhr;
};

ajax.send = function(url, callback, method, data, sync) {
    var x = ajax.x();
    x.open(method, url, sync);
    x.onreadystatechange = function() {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function(url, data, callback, sync) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + '?' + query.join('&'), callback, 'GET', null, sync)
};

ajax.post = function(url, data, callback, sync) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url, callback, 'POST', query.join('&'), sync)
};

// from: http://stackoverflow.com/a/11219680/447661
function getBrowserInfo() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion); 
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1) 
            fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset+7);
        if ((verOffset=nAgt.indexOf("Version"))!=-1) 
            fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
             (verOffset=nAgt.lastIndexOf('/')) ) 
         {
             browserName = nAgt.substring(nameOffset,verOffset);
             fullVersion = nAgt.substring(verOffset+1);
             if (browserName.toLowerCase()==browserName.toUpperCase()) {
                 browserName = navigator.appName;
             }
         }
         // trim the fullVersion string at semicolon/space if present
         if ((ix=fullVersion.indexOf(";"))!=-1)
         fullVersion=fullVersion.substring(0,ix);
         if ((ix=fullVersion.indexOf(" "))!=-1)
             fullVersion=fullVersion.substring(0,ix);

         majorVersion = parseInt(''+fullVersion,10);
         if (isNaN(majorVersion)) {
             fullVersion  = ''+parseFloat(navigator.appVersion); 
             majorVersion = parseInt(navigator.appVersion,10);
         }

         return {
             name: browserName,
             fullVersion: fullVersion,
             majorVersion: majorVersion,
             appName: navigator.appName,
             userAgent = navigator.userAgent
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

function bugger(config) {

    var config = typeof config !== "undefined" ? config: {};

    // make button
    var elemDiv = document.createElement('div');
    elem.innerHTML = '<a ref="#" id="buggerReport">Report an issue</a>';
    elemDiv.style.cssText = 'position: fixed; bottom: 0px; right: 0px;';
    document.body.appendChild(elemDiv); 

    // click
    elem.onClick = function(){
        var browserInfo = getBrowserInfo();
        var osInfo = getOSInfo();

        // send request to server

    }

    // text box 
}
