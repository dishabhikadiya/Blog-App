const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  let authorization = req.header("Authorization");

  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      "EFREGDFBY65TGHJU7765GBHNMKUFDVGT5H67JNYTYN5YN65"
    );
    console.log("dec", decoded);
    req.user = decoded;
    console.log("req", req.user);

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
module.exports = jwtMiddleware;
