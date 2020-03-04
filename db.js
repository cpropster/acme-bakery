const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme-bakery"
);

client.connect();

const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS recipes;
    DROP TABLE IF EXISTS chefs;

    CREATE TABLE chefs(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) UNIQUE NOT NULL,
        CHECK(char_length(name) > 0)
    );

    CREATE TABLE recipes(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(250) UNIQUE NOT NULL,
        CHECK(char_length(name) > 0)
    );
  `;
  await client.query(SQL);

  createChef("Gaston");
  createRecipe("Scone");
};

const createChef = async (chefName) => {
  const SQL = "INSERT INTO chefs(name) VALUES($1) RETURNING *";
  return (await client.query(SQL, [chefName])).rows[0];
};

const createRecipe = async (recipeName) => {
  const SQL = "INSERT INTO recipes(name) VALUES($1) RETURNING *";
  return (await client.query(SQL, [recipeName])).rows[0];
};

module.exports = {
  createChef,
  createRecipe,
  sync,
};
