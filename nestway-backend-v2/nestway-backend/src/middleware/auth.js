// ─────────────────────────────────────────────────────────────
//  middleware/auth.js
//  Simple JWT auth for admin routes.
//  Set ADMIN_SECRET in .env — used to sign/verify tokens.
//
//  How to get a token (run once in terminal):
//    node -e "const jwt=require('jsonwebtoken'); console.log(jwt.sign({role:'admin'}, process.env.ADMIN_SECRET || 'nestway-secret', {expiresIn:'30d'}))"
// ─────────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided. Add Authorization: Bearer <token> header.' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_SECRET || 'nestway-secret-change-in-prod');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }
};

module.exports = { adminAuth };
