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
        name VARCHAR(100) NOT NULL,
        CHECK(char_length(name) > 0)
    );

    CREATE TABLE recipes(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(250) NOT NULL,
        "chefId" UUID REFERENCES chefs(id),
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

const createRecipe = async (recipeName, chefId) => {
  const SQL = 'INSERT INTO recipes(name, "chefId") VALUES($1, $2) RETURNING *';
  return (await client.query(SQL, [recipeName, chefId])).rows[0];
};

const readChefs = async () => {
  const SQL = `
    SELECT * FROM chefs;
    `;

  const { rows } = await client.query(SQL);
  return rows;
};

const readRecipes = async () => {
  const SQL = `
    SELECT * FROM recipes;
    `;

  const { rows } = await client.query(SQL);
  return rows;
};

const deleteChefs = async (chefId) => {
  const SQL = `
    DELETE FROM chefs WHERE id = $1 RETURNING *
    `;

  const { rows } = await client.query(SQL, [chefId]);
  return rows[0];
};

const deleteRecipes = async (recipeId) => {
  const SQL = `
    DELETE FROM recipes WHERE id = $1 RETURNING *
    `;

  const { rows } = await client.query(SQL, [recipeId]);
  return rows[0];
};

module.exports = {
  createChef,
  createRecipe,
  readChefs,
  readRecipes,
  deleteChefs,
  deleteRecipes,
  sync,
};
