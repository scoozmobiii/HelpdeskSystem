module.exports = function(roles) {
  return function(req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
    }
    next();
  }
}