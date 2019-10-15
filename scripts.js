$("#openAll").click(function() {
    openAllVideos();
});

$("#download").click(function() {
    chrome.runtime.sendMessage({
        action: "downloadVideo",
    });
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        chrome.runtime.sendMessage({
            action: "openAllVideos",
            source: request.source
        });
    }   
});

function openAllVideos() {
    chrome.tabs.executeScript(null, {
      file: "getPagesSource.js"
    }, function() {
        if (chrome.runtime.lastError) {
            console.log('There was an error injecting script : \n' + chrome.runtime.lastError.message);
        }
    });
}