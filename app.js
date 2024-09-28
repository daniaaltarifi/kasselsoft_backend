const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

const fs = require("fs");
dotenv.config();
const db = require("./config.js");
const HomeRouter = require("./Router/HomeRouter.js");
const AbuteRouter = require("./Router/AbuteRouter.js");
const HomeServicesRouter = require("./Router/HomeServicesRouter.js");
const WhyChooseusRouter = require("./Router/WhyChooseusRouter.js");
const CardHomeRouter = require("./Router/CardHomeRouter.js");
const TitlesHomeRouter = require("./Router/TitlesHomeRouter.js");
const ImgSliderHomeRouter = require("./Router/ImgSliderRouter.js");
const CareersHomeRouter = require("./Router/CareersHomeRouter.js");
const ExperienceHomeRouter = require("./Router/ExperienceHomeRouter.js");
const ServicesRouter = require("./Router/ServicesRouter.js");
const HowWeWorkRouter = require("./Router/HowWeWorkRouter.js");
const IndustrtImgRouter = require("./Router/IndustryImgRouter.js");
const TermsAndConditionsRouter = require("./Router/TermsAndConditionsRouter.js");
const BackgroundPathRouter = require("./Router/BackgroundPathRouter.js");
const FooterRouter = require("./Router/FooterRouter.js");
const ContactFooterRouter = require("./Router/ContactFooterRouter.js");
const PositionRouter = require("./Router/PositionRouter.js");
const CareerFormRouter = require("./Router/CareerFormRouter.js");
const CareersRouter = require("./Router/CareersRouter.js");
const AbuteTeamRouter = require("./Router/AbuteTeamRouter.js");
const aboutServicesRouter = require("./Router/AbuteServicesRouter.js");
const TagsRouter = require("./Router/TagsRouter.js");
const BlogsRouter = require("./Router/BlogsRouter.js");
const JobdescriptionRouter = require("./Router/JobDescriptionRouter.js");
const ContactFormRouter = require("./Router/ContactFormRouter.js");
const LoginRouter = require("./Router/LoginRouter.js");
const app = express();
const PORT = process.env.PORT || 3005;
app.use(express.json());
// const allowedOrigins = [
//   'https://dashboard.kasselsoft.online',
//   'https://kasselsoft.online'
// ];
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000'
];

// CORS options with a dynamic origin check
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials
};

// Use the CORS middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("images"));
app.use("/home", HomeRouter);
app.use("/homeservices", HomeServicesRouter);
app.use("/homewhychooseus", WhyChooseusRouter);
app.use("/cardhome", CardHomeRouter);
app.use("/titleshome", TitlesHomeRouter);
app.use("/imgsliderhome", ImgSliderHomeRouter);
app.use("/careershome", CareersHomeRouter);
app.use("/experiencehome", ExperienceHomeRouter);
app.use("/services", ServicesRouter);
app.use("/howwework", HowWeWorkRouter);
app.use("/industryimg", IndustrtImgRouter);
app.use("/termsandconditions", TermsAndConditionsRouter);
app.use("/backgroundpath", BackgroundPathRouter);
app.use("/footer", FooterRouter);
app.use("/contactfooter", ContactFooterRouter);
app.use("/position", PositionRouter);
app.use("/careerform", CareerFormRouter);
app.use("/careers", CareersRouter);
app.use("/tags", TagsRouter);
app.use("/blogs", BlogsRouter);
app.use("/jobdescription", JobdescriptionRouter);
app.use("/auth", LoginRouter);

app.use("/contactForm", ContactFormRouter);
app.use("/api", AbuteRouter);
app.use("/abuteteam", AbuteTeamRouter);
app.use("/aboutServices", aboutServicesRouter);
app.get("/", (req, res) => {
  res.send("Welcome to kasselsoft! ");
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
