import axios from "axios";
import React from "react";
import Recipes from "./Recipes";
import Chefs from "./Chefs";
import ChefForm from "./ChefForm";
import RecipeForm from "./RecipeForm";
import ChefEdit from "./ChefEdit";
import qs from "qs";

const { useState, useEffect } = React;

const App = () => {
  const [error, setError] = useState("");
  const [chefs, setChefs] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  const { view } = params;

  const updateChef = async (chef) => {
    const updatedChef = (await axios.put(`/api/chefs/${chef.id}`, chef)).data;
    setChefs(
      chefs.map((chef) => (chef.id === updatedChef.id ? updatedChef : chef))
    );
  };

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
      <h1>
        <a href="#">ACME BAKERY</a>
      </h1>
      {view === "chef" && (
        <ChefEdit
          chef={chefs.find((chef) => chef.id === params.id)}
          update={updateChef}
        />
      )}
      {!view && (
        <div>
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
      )}
    </div>
  );
};

export default App;
