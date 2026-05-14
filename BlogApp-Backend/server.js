import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import userApi from "./APIs/UserApi.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminApi.js";
import { authorRoute } from "./APIs/AuthorAPI.js";
import { commonRouter } from "./APIs/CommonApi.js";
import cors from "cors";

config(); // process.env

// Create express application
const app = exp();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://your-frontend-name.onrender.com",
    ],
    credentials: true,
  })
);

// Add body parser middleware
app.use(exp.json());

// Add cookie parser middleware
app.use(cookieParser());

// Connect APIs
app.use("/user-api", userApi);

app.use("/author-api", authorRoute);

app.use("/admin-api", adminRoute);

app.use("/common-api", commonRouter);

// Connect to DB
const connectDB = async () => {

  try {

    await connect(process.env.DB_URL);

    console.log("DB connection success");

    // Server Port
    const PORT = process.env.PORT || 4000;

    // Start HTTP server
    app.listen(PORT, () =>
      console.log(`server started on port ${PORT}`)
    );

  } catch (err) {

    console.error("FULL ERROR:", err);
  }
};

connectDB();

// Invalid path handler
app.use((req, res, next) => {

  console.log(req.url);

  res.status(404).json({
    message: `${req.url} is invalid path`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);

  console.log("Error code:", err.code);

  console.log("Full error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {

    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // Mongoose cast error
  if (err.name === "CastError") {

    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // Duplicate key error
  const errCode =
    err.code ??
    err.cause?.code ??
    err.errorResponse?.code;

  const keyValue =
    err.keyValue ??
    err.cause?.keyValue ??
    err.errorResponse?.keyValue;

  if (errCode === 11000) {

    const field = Object.keys(keyValue)[0];

    const value = keyValue[field];

    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // Custom errors
  if (err.status) {

    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // Default server error
  console.error("UNHANDLED ERROR:", err.stack);

  res.status(500).json({
    message: "error occurred",
    error: err.message || "Server side error",
    details:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
});