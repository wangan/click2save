function save(key, value) {
    chrome.storage.sync.set({ "MMMMMMM": value }, function () {
        console.log("Over");
    });
}

//$(function () { });

(function () {
    console.log("OK");
    save("MMMMMMM", { "a": 1, "b": 2 });

    chrome.storage.sync.get(["MMMMMMM"], function (data) {
        console.log(data);
    });
})(window)