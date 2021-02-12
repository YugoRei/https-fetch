module.exports = {
    /**
     * @param {String} query The search query
     * @param {Number} limit 
     */
    async youtube(query, limit = 1) {
        return await require("./tools/youtube")(encodeURI(query), limit)
    }
};