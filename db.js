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
        title VARCHAR(250) NOT NULL,
        "chefId" UUID REFERENCES chefs(id) ON DELETE CASCADE,
        CHECK(char_length(title) > 0)
    );
  `;
  await client.query(SQL);

  //when inserting test data need to await if going to pass one from the other (Gaston.id)
  //this makes sure that your tables aren't reloading on saving otherwise you wont get a return at all / an error
  const gaston = await createChef("Gaston");
  const scone = await createRecipe("Scone", gaston.id);
  const pierre = await createChef("Pierre");
  const cake = await createRecipe("cake", pierre.id);
  const dumpling = await createRecipe("dumpling", pierre.id);
};

const createChef = async (chefName) => {
  const SQL = "INSERT INTO chefs(name) VALUES($1) RETURNING *";
  return (await client.query(SQL, [chefName])).rows[0];
};

const createRecipe = async (recipeTitle, chefId) => {
  const SQL = 'INSERT INTO recipes(title, "chefId") VALUES($1, $2) RETURNING *';
  return (await client.query(SQL, [recipeTitle, chefId])).rows[0];
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

  await client.query(SQL, [chefId]);
};

const deleteRecipes = async (recipeId) => {
  const SQL = `
    DELETE FROM recipes WHERE id = $1 RETURNING *
    `;

  await client.query(SQL, [recipeId]);
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
