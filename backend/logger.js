function logger(req, res, next) {
  const logEntry = {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
  };
  // TODO: Save logs to DB or file (not console)
  next();
}
module.exports = logger;
