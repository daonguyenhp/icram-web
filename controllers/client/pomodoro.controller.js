module.exports.index = (req, res) => {
    res.render("client/pages/pomodoro/index", {
        pageTitle: "Poromodo Page"
    });
}