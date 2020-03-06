import axios from "axios";
import React from "react";
import Recipes from "./Recipes";
import Chefs from "./Chefs";
import ChefForm from "./ChefForm";
import RecipeForm from "./RecipeForm";

const { useState, useEffect } = React;

const App = () => {
  const [error, setError] = useState("");
  const [chefs, setChefs] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const deleteChef = async (chefToDelete) => {
    try {
      await axios.delete(`/api/chefs/${chefToDelete.id}`);
      setChefs(chefs.filter((chef) => chef.id !== chefToDelete.id));
      setRecipes(recipes.filter((recipe) => recipe.chefId !== chefToDelete.id));
      setError("");
    } catch (ex) {
      setError(ex.response.data.message);
    }
  };

  const deleteRecipe = async (recipeToDelete) => {
    try {
      await axios.delete(`/api/recipes/${recipeToDelete.id}`);
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeToDelete.id));
      setError("");
    } catch (ex) {
      setError(ex.response.data.message);
    }
  };

  const createChef = async (chef) => {
    try {
      const createdChef = (await axios.post("/api/chefs", chef)).data;
      setChefs([...chefs, createdChef]);
      setError("");
    } catch (ex) {
      setError(ex.response.data.message);
    }
  };

  const createRecipe = async (recipe) => {
    try {
      const createdRecipe = (await axios.post("/api/recipes", recipe)).data;
      setRecipes([...recipes, createdRecipe]);
      setError("");
    } catch (ex) {
      setError(ex.response.data.message);
    }
  };

  useEffect(() => {
    Promise.all([axios.get("api/recipes"), axios.get("api/chefs")])
      .then((responses) => responses.map((response) => response.data))
      .then((results) => {
        setRecipes(results[0]);
        setChefs(results[1]);
        setError("");
      })
      .catch((ex) => setError(ex.response.data.message));
  }, []);

  return (
    <div>
      <h1>ACME BAKERY</h1>
      <RecipeForm createRecipe={createRecipe} chefs={chefs} />
      <Recipes
        recipes={recipes}
        chefs={chefs}
        deleteRecipe={deleteRecipe}
        createRecipe={createRecipe}
      />
      <ChefForm createChef={createChef} />
      <Chefs
        chefs={chefs}
        recipes={recipes}
        deleteChef={deleteChef}
        createChef={createChef}
      />
    </div>
  );
};

export default App;
