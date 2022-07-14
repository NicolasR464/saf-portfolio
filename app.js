const mongoose = require("mongoose");
const express = require("express");
const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@portfolio.ajdvt.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
