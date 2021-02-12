const fetch = require("node-fetch");

const youtube = async (query, limit = 1) => {
    const getQuery = async (url) => {
        return new Promise((resolve, reject) => {
            fetch(url).then(res => res.text()).then(html => resolve(html)).catch(e => reject(e));
        });
    };
    
    const parseVideo = async (data) => {
        if (!data || !data.videoRenderer) return;
      
        return {
            url: `https://www.youtube.com/watch?v=${data.videoRenderer.videoId}`,
            title: data.videoRenderer.title.runs[0].text,
            duration: data.videoRenderer.lengthText ? data.videoRenderer.lengthText.simpleText : 0,
            thumbnail: data.videoRenderer.thumbnail.thumbnails[data.videoRenderer.thumbnail.thumbnails.length - 1].url,
            channel: {
                name: data.videoRenderer.ownerText.runs[0].text || "Unknown",
                iconurl: data.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails[0].url,
            },
            views: data.videoRenderer.viewCountText && data.videoRenderer.viewCountText.simpleText ? data.videoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
        };
    };

    if (!query) throw new Error("No search query found");

    const search = await getQuery(`https://www.youtube.com/results?search_query=${query}`);
    if (!search) throw new Error("No result found");

    let info = [];
    let results = [];
    let checked = false;

    try {
        let data = search.split("ytInitialData = JSON.parse('")[1].split("');</script>")[0];
        console.log(data)
        search = data.replace(/\\x([0-9A-F]{2})/ig, (...items) => {
            return String.fromCharCode(parseInt(items[1], 16));
        });
    } catch(err) { /* do nothing */ };

    try {
        info = JSON.parse(search.split('{"itemSectionRenderer":{"contents":')[search.split('{"itemSectionRenderer":{"contents":').length - 1].split(',"continuations":[{')[0]);
        checked = true;
    } catch(err) { /* do nothing */ };

    if (!checked) {
        try {
          info = JSON.parse(search.split('{"itemSectionRenderer":')[search.split('{"itemSectionRenderer":').length - 1].split('},{"continuationItemRenderer":{')[0]).contents;
          checked = true;
        } catch(err) { /* do nothing */ };;
    };

    if(!checked || info.length < 1) return [];
    let amount = (info.length < limit) ? info.length : 5;

    for (let i = 0; i < amount; i++) {
        let data = info[i];
        let video = await parseVideo(data);
      
        if (video) {
            results.push(video)
        };
    };

    return results;
};

module.exports = youtube;