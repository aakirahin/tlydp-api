const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { duckData, userData } = data;
  console.log("In seed");
  return db
    .query("DROP TABLE IF EXISTS ducks")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR(50) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        profile_pic VARCHAR(100) NOT NULL
    );`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE ducks (
            duck_id SERIAL PRIMARY KEY,
            duck_name VARCHAR(50) NOT NULL,
            maker_id INT NOT NULL REFERENCES users(user_id),
            finder_id INT REFERENCES users(user_id),
            location_placed_lat FLOAT NOT NULL,
            location_placed_lng FLOAT NOT NULL,
            location_found_lat FLOAT,
            location_found_lng FLOAT,
            clue TEXT NOT NULL,
            image VARCHAR(100),
            comments TEXT
        );`
      );
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [
          user.user_name,
          user.first_name,
          user.last_name,
          user.password,
          user.email,
          user.profile_pic,
        ];
      });
      const usersQuery = format(
        `INSERT INTO users (user_name, first_name, last_name, password, email, profile_pic)
        VALUES %L RETURNING *;`,
        formattedUsers
      );
      return db.query(usersQuery);
    })
    .then(() => {
      const formattedDucks = duckData.map((duck) => {
        return [
          duck.duck_name,
          duck.maker_id,
          duck.finder_id,
          duck.location_placed_lat,
          duck.location_placed_lng,
          duck.location_found_lat,
          duck.location_found_lng,
          duck.clue,
          duck.image,
          duck.comments,
        ];
      });
      const ducksQuery = format(
        `INSERT INTO ducks 
        (duck_name,
        maker_id,
        finder_id,
        location_placed_lat,
        location_placed_lng,
        location_found_lat,
        location_found_lng,
        clue,
        image,
        comments)
        VALUES %L RETURNING *;`,
        formattedDucks
      );
      return db.query(ducksQuery);
    });
};

module.exports = seed;
