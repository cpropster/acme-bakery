import React from "react";

const Chefs = ({ chefs, deleteChef, recipes, createChef }) => {
  return (
    <section>
      <h2>Chefs ({chefs.length})</h2>
      <ul>
        {chefs.map((chef) => {
          const filteredRecipes = recipes.filter((recipe) => {
            return recipe.chefId === chef.id;
          });
          return (
            <li key={chef.id}>
              <a href={`#view=chef&id=${chef.id}`}>{chef.name}</a>
              <button onClick={() => deleteChef(chef)}>x</button>
              <ul>
                {filteredRecipes.map((recipe) => {
                  return <li key={recipe.id}>{recipe.title}</li>;
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Chefs;
