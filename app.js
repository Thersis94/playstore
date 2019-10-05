const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("common"));

const applications = require("./app-data.js");

app.get("/apps", (req, res) => {
  const { search = "", sort, genre } = req.query;

  if (sort) {
    if (!["app", "rating"].includes(sort)) {
      return res.status(400).send("Sort must be either rating or app");
    }
  }

  if (genre) {
    if (
      !["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"].includes(
        genre
      )
    ) {
      return res
        .status(400)
        .send(
          "Genre not found, Please select from 'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'."
        );
    }
  }

  let results = applications.filter(application =>
    application.App.toLowerCase().includes(search.toLowerCase())
  );

  if (results.length === 0) {
    return res.status(400).send("No results found.");
  }

  if (sort === "rating") {
    results.sort(function(a, b) {
      return a.Rating - b.Rating;
    });
    results.reverse();
  }

  if (sort === "app") {
    results.sort(function(a, b) {
      if (a.App < b.App) {
        return -1;
      }
      if (a.App > b.App) {
        return 1;
      }
      return 0;
    });
  }

  if (genre) {
    results = results.filter(application =>
      application.Genres.toLocaleLowerCase().includes(genre.toLocaleLowerCase())
    );
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log("server started on port 8000");
});