module.exports = {
  isAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.isAuthenticated());
      return next();
    }
    req.flash("error_msg", "you need to login to acess dashboard");
    res.redirect("/login");
  },

  isNotAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
};
