chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "openAllVideos") {
        var html = $.parseHTML(request.source);
        const base = 'https://skylab.rocketseat.com.br';
        
        $(html).find("aside ul li a").each((ind, el) => {
        //$(html).find(".sc-hMqMXs").each((ind, el) => { // download de lives
            const url = base + $(el).attr('href');
            window.open(`${url}?index=${ind}`);            
        });
    }

    if (request.action == "downloadVideo") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currTab = tabs[0];
            chrome.webNavigation.getAllFrames({tabId: currTab.id},function(frames){
                const frame = frames.find(f => f.url.includes('https://player.vimeo.com'))
                chrome.tabs.executeScript(currTab.id,{
                    frameId: frame.frameId,
                    file: 'forceDownloadVideo.js'
                },function(results){
                    //console.log(results);
                });
            });
        });
    }

    if (request.action == "forceDownloadVideo") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            var currTab = tabs[0];
            const routes = currTab.url.split('/');
            const name = `rocketseat-bootcamp/${routes[routes.length-3]}/${routes[routes.length-1].split('?')[1].split("=")[1]} - ${routes[routes.length-1].split('?')[0]}`;
            //const name = `rocketseat-bootcamp/lives/${routes[routes.length-1].split('?')[1].split("=")[1]} - ${routes[routes.length-1].split('?')[0]}` //name for lives

            let code = request.source.match(/var config = {(.*?)};/g);

            code = code[0].replace("var config = ", "");
            code = code.replace("};", "}");
            code = JSON.parse(code);
            
            const videoURL = code.request.files.progressive.find(v => v.quality == "720p" /* 1080p or 720p */).url;
                
            chrome.downloads.download({
                url: videoURL,
                filename: `${name}.mp4`,
                saveAs: false
            });

        });
    }
});
