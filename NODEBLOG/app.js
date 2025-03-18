const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const {generateDate,limit,truncate,paginate} = require("./helpers/hbs");
const connectMongo = require("connect-mongo");
const methodOverride = require('method-override')

const moment = require('moment')
const app = express();
const port = 3000;
const hostname = "127.0.0.1";

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1/nodeblog_db", {});

const mongoStore = connectMongo(expressSession);
  
app.use(
  expressSession({
    secret: "testotesto",
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
  })
);


// Middleware
app.use(express.static("public"));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));


// handlebars helpers




const hbs = engine({
  helpers: {
    generateDate: function (date, format) {
      // Date'i belirtilen formata çevir (moment.js ya da başka bir library kullanabilirsin)
      return moment(date).format(format);
    },
    limit: function (array, limit) {
      if (!Array.isArray(array)) {
        return [];
      }
      return array.slice(0, limit);
    },
    truncate:truncate,
    paginate:paginate
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

// View engine setup
app.engine("handlebars", hbs);
app.set("view engine", "handlebars");

//Display link middleware

app.use((req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    res.locals = {
      displayLink: true,
    };
  } else {
    res.locals = {
      displayLink: false,
    };
  }
  next()
});


//Message
app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});


// Routes
const main = require("./routes/main");
const posts = require("./routes/posts");
const users = require("./routes/users");
const admin = require('./routes/admin/index')
const contact = require('./routes/contact')

app.use("/", main);
app.use("/users", users);
app.use("/posts", posts);
app.use("/admin", admin);
app.use("/contact", contact);

app.listen(port, hostname, () => {
  console.log(`Server çalışıyor,http://${hostname}:${port}`);
});
