chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) { 
        chrome.downloads.download({
            url: request.url,
            saveAs: false,
        }, function () {
            console.log("OK");
        })
    })

