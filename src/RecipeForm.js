import React, { useState } from "react";

const RecipeForm = ({ createRecipe, chefs }) => {
  const [title, setTitle] = useState("");
  const [chefId, setChefId] = useState("");
  const onSubmit = (ev) => {
    ev.preventDefault();
    createRecipe({ title, chefId });
    setTitle("");
    setChefId("");
  };

  return (
    <section>
      <form onSubmit={onSubmit}>
        <h2>Create Recipe</h2>
        {/* <div>{error}</div> */}
        <input value={title} onChange={(ev) => setTitle(ev.target.value)} />
        <select value={chefId} onChange={(ev) => setChefId(ev.target.value)}>
          <option value="">~~choose chef~~</option>
          {chefs.map((chef) => {
            return (
              <option value={chef.id} key={chef.id}>
                {chef.name}
              </option>
            );
          })}
        </select>
        <button disabled={!chefId}>Create Chef</button>
      </form>
    </section>
  );
};

export default RecipeForm;
