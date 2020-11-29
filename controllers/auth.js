exports.onlyAuthUser = (req, res, next) => {
  // #note isAuthenticated() is built in function, (also: req.login(), req.logout())
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).send({ errors: { auth: 'Not Authenticated!' } });
};
