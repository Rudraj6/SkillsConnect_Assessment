
module.exports = (req, res, next) => {
  const ts = new Date().toISOString();
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const user = req.user ? req.user.id : 'anon';
  console.log(`[${ts}] ${req.method} ${req.originalUrl} - IP: ${ip} - User: ${user}`);
  next();
};
