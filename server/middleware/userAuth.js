import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    return res.sendStatus(401);
  }

  try {
    const userToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.user = {
      userId: userToken.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export { userAuth };
