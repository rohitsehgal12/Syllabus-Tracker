const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get the token from the request header
  const token = req.header('x-auth-token');

  // Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user payload from the token to the request object
    req.user = decoded.user;
    
    // Call the next function in the chain (the route handler)
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};