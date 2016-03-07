console.log("exec core.js");

(function (MM) {
    if (window.define) {
        return
    }
    var module = { exports: {} };

    function require(name) {
        return MM[name].call(undefined, require, module, module.exports);
    }

    function define(name, func) {
        console.log(name);
        MM[name] = func;

        if (name === "Init") {
            require("Init")();
        }
    }

    window.define = define;
})(window.MM || {});

/* 模块定义 */

define("Chrome", function (require, module, exports) {
    return chrome;
});

define("Tools", function (require, module, exports) {
    exports.IsPicture = function (objUrl) {
        var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|";
        if (objUrl.indexOf(".") > -1) {
            var p = objUrl.lastIndexOf(".");
            console.log(p);
            var strPostfix = objUrl.substring(p, objUrl.length) + "|";
            strPostfix = strPostfix.toLowerCase();
            console.log(strPostfix);
            if (strFilter.indexOf(strPostfix) > -1) {
                return true;
            }
        }

        return false;
    }

    return module.exports;
});

define("Storage", function (require, module, exports) {

    var tools = require("Tools");
    var chrome = require("Chrome");

    exports.ReadThis = function (key) {
        chrome.storage.sync.get([key], function (data) {
            console.log(data);

            return data;
        });
    }

    exports.Read = function (a_Keys) {
        chrome.storage.sync.get(a_Keys, function (data) {
            console.log(data);

            return data;
        });
    }

    exports.WriteThis = function (key, value) {
        var data = {};
        data[key] = value;
        console.log(data);
        chrome.storage.sync.set(data, function () {
            console.log("Over");
        });

        chrome.storage.sync.get([key], function (data) {
            console.log(data);
        });
    }

    exports.Write = function (o_KV) {
        chrome.storage.sync.set(o_KV, function () {
            console.log("Over");
        });
    }

    return module.exports;
});



define("Event", function (require, module, exports) {
    var tools = require("Tools");
    var chrome = require("Chrome");

    exports.Bind = function () {
        document.addEventListener('click', function (e) {
            console.log(e);
            console.log(e.srcElement.tagName);
            console.log(e.srcElement.style);
            console.log(e.srcElement.style.backgroundImage);
            if (e.altKey === true && e.ctrlKey === true) {
                var objUrl;
                switch (e.srcElement.tagName) {
                    case "IMG":
                    case "INPUT":
                        objUrl = e.srcElement.src;
                        break;
                    default:
                        if (e.srcElement.style && e.srcElement.style.backgroundImage) {
                            if (mRes = e.srcElement.style.backgroundImage.match(/url\(["|']?([^)].*?)["|']?\)/i)) {
                                if (mRes) {
                                    objUrl = mRes[1];
                                }
                            }
                        }
                        break;
                }

                console.log(objUrl);
                console.log(typeof (objUrl));
                if ((objUrl && tools.IsPicture(objUrl))) {
                    chrome.extension.sendRequest(
                        {
                            url: objUrl,
                            baseUrl: window.location,
                            tagName: e.srcElement.tagName
                        },
                        function (response) {
                            console.log(response);
                        });

                    e.returnValue = false;
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        }, true)
    }

    return module.exports;
});

define("Init", function (require, module, exports) {
    module.exports = function (param) {
        var event = require("Event");
        event.Bind();

        var storage = require("Storage");
        storage.WriteThis("M", "1");

        console.log(storage.ReadThis("M"));
    }

    return module.exports;
});


