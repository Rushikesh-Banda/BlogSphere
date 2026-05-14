import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../Middlewares/verifytoken.js";

export const userRoute = exp.Router();

//Register user
userRoute.post("/users", async (req, res, next) => {
  try {
    let userObj = req.body;

    console.log("📝 User Registration Request:");
    console.log("Body:", userObj);

    // Call register with role USER
    console.log("Registering user with role: USER");
    const newUserObj = await register({
      ...userObj,
      role: "USER",
    });

    console.log("✅ User registered successfully:", newUserObj._id);

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    console.error("❌ User registration error:", err.message);
    next(err); // send to your error middleware
  }
});

//Read all articles(protected route)
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  //read articles of all authors which are active
  const articles = await ArticleModel.find({ isArticleActive: true });

  //send res
  res.status(200).json({
    message: "all articles",
    payload: articles,
  });
});

//Add comment to an article(protected route)
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {

  //get comment obj from req
  const { user, articleId, comment } = req.body;

  //check user(req.user)
  console.log(req.user);

  if (user !== req.user.userId) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  //find article by id and update
  let articleWithComment = await ArticleModel.findOneAndUpdate(
    { _id: articleId, isArticleActive: true },
    { $push: { comments: { user, comment } } },
    { new: true, runValidators: true }
  );

  //if article not found
  if (!articleWithComment) {
    return res.status(404).json({
      message: "Article not found",
    });
  }

  //send res
  res.status(200).json({
    message: "comment added successfully",
    payload: articleWithComment,
  });
});

export default userRoute;