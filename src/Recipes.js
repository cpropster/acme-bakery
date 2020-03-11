import React from "react";

const Recipes = ({ recipes, chefs, deleteRecipe }) => {
  return (
    <section>
      <h2>Recipes ({recipes.length})</h2>
      <ul>
        {recipes.map((recipe) => {
          const chef = chefs.find((chef) => chef.id === recipe.chefId);
          return (
            <li key={recipe.id}>
              {recipe.title} by {!!chef && chef.name}
              <button onClick={() => deleteRecipe(recipe)}>x</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Recipes;
