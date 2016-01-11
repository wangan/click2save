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
        if ((objUrl && objUrl.isPicture())) {
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

String.prototype.isPicture = function () {
    var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|";
    if (this.indexOf(".") > -1) {
        var p = this.lastIndexOf(".");
        console.log(p);
        var strPostfix = this.substring(p, this.length) + "|";
        strPostfix = strPostfix.toLowerCase();
        console.log(strPostfix);
        if (strFilter.indexOf(strPostfix) > -1) {
            return true;
        }
    }

    return false;
}
