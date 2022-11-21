const webpush = require("web-push");
// VAPID keys should only be generated only once.
const vapidKeys = {
  publicKey:
    "BCmmuz9x4KoRSTShd-lPYPgdsVVX8TjhisjAet0pib9oUqkxuTSyHqohS194qCm6tAviZtMePTAMyRj36mePDHI",
  privateKey: "7MIyqDwAcmMGMqMnrcMfbyMAUXsnxb2R24Y1QmwreVc",
};

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const express = require("express");
var multer = require("multer");
var upload = multer();
const Joi = require("joi"); //used for validation
const app = express();
app.use(express.json());

const books = [
  { title: "Harry Potter", id: 1 },
  { title: "Twilight", id: 2 },
  { title: "Lorien Legacies", id: 3 },
];

// for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

//READ Request Handlers
app.get("/", (req, res) => {
  res.send("Welcome to Edurekas REST API with Node.js Tutorial!!");
});

app.post("/api/sendNotification/:client", (req, res) => {
  const obj = { msg: req.body.msg, body: req.body.body };
  var axios = require("axios");

  var url =
    "https://seatvnetwork.com/api/getSubscriptions?client=" + req.params.client;

  var config = {
    method: "get",
    url: url,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      const result = response.data.result;

      // console.log(result);
      const myJSON = JSON.stringify(obj);
      const promises = [];
      result.forEach((row) => {
        const pushSubscription = JSON.parse(row);

        promises.push(
          webpush.sendNotification(pushSubscription, String(myJSON))
        );
      });
      Promise.all(promises)
        .then((results) => res.send(results))
        .catch((e) => {
          console.log(e);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((c) => c.id === parseInt(req.params.id));

  if (!book)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  res.send(book);
});

//CREATE Request Handler
app.post("/api/books", (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const book = {
    id: books.length + 1,
    title: req.body.title,
  };
  books.push(book);
  res.send(book);
});

//UPDATE Request Handler
app.put("/api/books/:id", (req, res) => {
  const book = books.find((c) => c.id === parseInt(req.params.id));
  if (!book)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Not Found!! </h2>'
      );

  const { error } = validateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  book.title = req.body.title;
  res.send(book);
});

//DELETE Request Handler
app.delete("/api/books/:id", (req, res) => {
  const book = books.find((c) => c.id === parseInt(req.params.id));
  if (!book)
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;"> Not Found!! </h2>'
      );

  const index = books.indexOf(book);
  books.splice(index, 1);

  res.send(book);
});

function validateBook(book) {
  const schema = {
    title: Joi.string().min(3).required(),
  };
  return Joi.validate(book, schema);
}

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on port ${port}..`));
