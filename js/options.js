console.log("exec core.js");
window.BB = {};

(function(MM) {
    if (window.define) {
        return
    }
    var module = {
        exports: {}
    };

    function require(name) {
        return MM[name].call(undefined, require, module, module.exports);
    }

    function define(name, func) {
        console.log(name);
        console.log(module);
        MM[name] = func;

        if (name === "Init") {
            require("Init")(window);
        }
    }

    window.define = define;
})(window.MM || {});

/* 模块定义 */

define("Chrome", function(require, module, exports) {
    return chrome;
});

define("Tools", function(require, module, exports) {
    exports.IsPicture = function(objUrl) {
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

define("Storage", function(require, module, exports) {

    var tools = require("Tools");
    var chrome = require("Chrome");

    exports.ReadThis = function(key, callback) {
        chrome.storage.sync.get([key], function(data) {
            callback(data);
        });
    }

    exports.Read = function(a_Keys, callback) {
        chrome.storage.sync.get(a_Keys, function(data) {
            callback(data);
        });
    }

    exports.WriteThis = function(key, value) {
        var data = {};
        data[key] = value;
        chrome.storage.sync.set(data, function() {
            console.log("WriteThis Over");
        });
    }

    exports.Write = function(o_KV) {
        chrome.storage.sync.set(o_KV, function() {
            console.log("Write Over");
        });
    }

    return module.exports;
});


define("Event", function(require, module, exports) {
    var tools = require("Tools");
    var chrome = require("Chrome");
    var storage = require("Storage");
    var actions = require("Action");

    exports.Bind = function() {
        document.addEventListener('click', function(e) {
            console.log(e);
            var curAction = e.srcElement.dataset["action"];
            if (curAction) {
                console.log(curAction);
                actions.Invoke(curAction);
            }
        }, true)
    }

    return module.exports;
});

define("Action", function(require, module, exports) {
    // module.exports = {
    //     Invoke: function(action) {
    //         this.Actions[action]();
    //     },
    //     Actions: {
    //         "search-rules": function() {
    //             console.log("Invoking search-rules");
    //         }
    //     }
    // };

    module.exports.Invoke = function(action) {
        if (this.Actions && this.Actions[action])
            this.Actions[action]();
    };
    module.exports.Actions = {
        "search-rules": function() {
            console.log("Invoking search-rules");
            var templateStr = " <table><thead><tr><th class='data-id'>Id</th><th class='data-url'>链接地址</th><th class='data-domain'>域名</th><th class='data-location'>存放目录</th><th class='data-status'>状态</th><th class='data-op'>操作</th></tr></thead><tbody>";
            window.rules.forEach(function(data, index) {
                templateStr += "<tr><td class='data-id'>" + data.id +
                    "</td><td class='data-url'>" + data.url +
                    "</td><td class='data-domain'>" + data.domain +
                    "</td><td class='data-location'>" + (data.location ? data.location : "--") +
                    "</td><td class='data-status'><input type='checkbox' disabled checked='" + (data.status ? 'true' : 'false') + "'/>" +
                    "</td><th class='data-op'><input name='data-op' type='checkbox' value='"+ data.id+ "'/></th></tr>";
            });

            templateStr += "</tbody></table>";
            console.log(window.rules);
            console.log(templateStr);

            document.getElementById("main").innerHTML = templateStr; //.value();

        },
        "all": function() {
            console.log("Invoking select all");
            var all = document.getElementsByName("data-op");
            console.log(all);
            for (i = 0; i < all.length; i++) {
                console.log(all[i].value);
                if (!all[i].checked) {
                    all[i].checked = true;
                } else {
                    all[i].checked = false;
                }
            }
        }
    };

    return module.exports;
});

define("Init", function(require, module, exports) {

    console.log(module);
    module.exports = function(window) {
        var event = require("Event");
        console.log(event);
        event.Bind();

        /* Test data */
        var storage = require("Storage");
        storage.WriteThis("Rules", [{
            "id": 1,
            "domain": "www.cnblogs.com",
            "url": "http://www.cnblogs.com/",
            "location": "",
            "status": false
        }, {
            "id": 1,
            "domain": "www.cnblogs.com",
            "url": "http://www.cnblogs.com/",
            "location": "",
            "status": false
        }, {
            "id": 1,
            "domain": "www.cnblogs.com",
            "url": "http://www.cnblogs.com/",
            "location": "",
            "status": false
        }]);

        storage.ReadThis("Rules", function(data) {
            window.rules = data.Rules;
            window.domains = {};
            for (i = 0; i < window.rules.length; i++) {
                window.domains[window.rules[i].domain] = i;
            }
        });
    }

    return module.exports;
});