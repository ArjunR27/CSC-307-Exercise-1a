// src/MyApp.jsx
import React, { useState, useEffect } from 'react';
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([])

    useEffect(() => {
      fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
    }, [] );

    function removeOneCharacter(index)
    {
      const idToDelete = characters[index]._id
      fetch(`http://localhost:8000/users/${idToDelete}`, {
        method: "DELETE"
      })
      .then((response) => {
        if(response.status === 204) {
          const updatedCharacters = characters.filter((character, i) => i !== index);
          setCharacters(updatedCharacters);
        }
      })
      .catch((error) => {
        console.error("Error deleting character: ", error); 
      }); 
    }
    

  return (
    <div className="container">
      <Table 
      characterData={characters}
      removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList}/>
    </div>
  );

  function updateList(person) {    
    postUser(person)
    .then((response) => {
      if (response.status === 201)
      {
        response.json()
        .then((updatedPerson) => {
          setCharacters([...characters, updatedPerson])
        })     
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  
}

function fetchUsers() {
  const promise = fetch("http://localhost:8000/users");
  return promise
}

function postUser(person) {
  const promise = fetch("http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(person),
  })
  return promise; 
}



export default MyApp;