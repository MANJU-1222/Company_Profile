import express from 'express';
const app = express();

import pdfRouter from './routes/pdf.routes';

import AppError from './utils/app.error';
// import globalErrorHandler from './controllers/errorController';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
//@ts-ignore
import xssClean from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';

app.use(
  cors({
    origin: true,
    // origin: ["http://", "https://example2.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-With",
      "Accept",
      "x-client-key",
      "x-client-token",
      "x-client-secret",
      "Authorization",
    ],
    credentials: true,
  }),
);

// For Helmet
app.use(helmet()); // In have inbuilts security Headers. that express does't

// For RateLimiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To Many request from this IP, Try After an Hour",
});
app.use("/api", limiter);

// For Bodyparser
app.use(express.json({ limit: "100kb" }));

//For dataSanitiation :
app.use(xssClean()); //It is used to not allow the html for use Input

//For http parameter pollution:
app.use(hpp()); // It will not give the err when we use multiple query string in url instead of to will take last query in url

// app.get("/", (req, res) => {
//   try {
//     console.log("hi");
//     res.status(200).send("hi");
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });


//Routers
app.use("/api/v1/pdf/", pdfRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Page Not found : ${req.originalUrl}`,404));
});

// app.use(globleErrorHandler);
export default app;
