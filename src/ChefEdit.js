import React, { useState, useEffect } from "react";

const ChefEdit = ({ update, chef }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  //this useEffect fixes hard reload issue in the chef edit form
  //refer to picture in documents for difference in recipe form
  useEffect(() => {
    if (chef) {
      setName(chef.name);
    }
  }, [chef]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    update({ ...chef, name })
      .then(() => {
        setError("");
        window.location.hash = "#";
      })
      .catch((ex) => {
        setError(ex.response.data.message);
      });
  };
  return (
    <form onSubmit={onSubmit}>
      <h2>Edit Chef</h2>
      <div>{error}</div>
      <input value={name} onChange={(ev) => setName(ev.target.value)} />
      <button disabled={chef && chef.name === name}>Edit</button>
      <a href="#">Cancel</a>
    </form>
  );
};

export default ChefEdit;
