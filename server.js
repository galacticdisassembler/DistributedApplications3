"use strict";

const express = require("express");
const mongoose = require("mongoose")
// Constants
const PORT = 8080;
const HOST = "0.0.0.0";
const MONGO_URI = process.env.MONGO_URI

// App
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/auth', require('./server/routes/auth.routes'))
app.use('/api/posts', require('./server/routes/post.routes'))

async function runApplciation(){
  try {
    
    await mongoose.connect(MONGO_URI, {

    })

    app.listen(PORT, HOST);
    console.log(`Running on http://${HOST}:${PORT}`);

  } catch (error) {
    console.log(error.message)
    process.exit(-1)
  }
}

runApplciation()
