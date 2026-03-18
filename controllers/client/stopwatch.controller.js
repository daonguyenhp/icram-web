module.exports.index = (req, res) => {
    res.render("client/pages/stopwatch/index", {
        pageTitle: "Stopwatch Page"
    });
}
