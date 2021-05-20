const mongoose = require(`mongoose`);
const courses = require(`./routes/courses`);
const home = require(`./routes/home`);
const users = require(`./routes/users`);
const startupDebugger = require(`debug`)("app:startup");
const express = require(`express`);
const helmet = require(`helmet`);
const morgan = require(`morgan`);
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/courses", courses);
app.use("/api/users", users);
app.use("/", home);

if (app.get("env") === "development") {
  //$env:NODE_ENV="production"
  app.use(morgan(`tiny`));
  startupDebugger(`Morgan enabled...`);
}

//PORT
//$env:PORT=1234
const port = process.env.PORT || 3000;
// console.log(process.env.PORT);
app.listen(port, () =>
  console.log(`Listening on port ${(process.env.PORT, port)}...`)
);

//Initialise database
mongoose
  .connect(`mongodb://localhost/data`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connection to database succeeded`))
  .catch(err => console.error(`Connection to database failed`, err));
