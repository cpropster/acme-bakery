import axios from "axios";
import React from "react";
import Recipes from "./Recipes";
import Chefs from "./Chefs";

const { useState, useEffect } = React;

const App = () => {
  const [chefs, setChefs] = useState([]);
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    Promise.all([axios.get("api/recipes"), axios.get("api/chefs")]);
  });
  return (
    <div>
      <h1>ACME BAKERY</h1>
      {/* <Recipes />
      <Chefs /> */}
    </div>
  );
};

export default App;
