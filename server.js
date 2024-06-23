const express = require("express");
const db = require("./config/connection");
// routes
const routes = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

console.log(`Environment PORT: ${process.env.PORT}`); // Log the environment variable
console.log(`Using PORT: ${PORT}`); // Log the port being used

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on PORT ${PORT}!`);
  });
});
