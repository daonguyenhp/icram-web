module.exports = () => {
    let objectSearch = {
        keyword: "",
    }

    if(req.query.keyword) {
        objectSearch.keyword = req.query.keyword;

        const regex = new RegExp(keyword, "i");
        objectSearch.regex = regex;
    }

    return objectSearch;
}