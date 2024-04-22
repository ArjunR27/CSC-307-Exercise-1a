import express from "express"
import cors from "cors";
import userServices from "./user-services.js";
import bodyParser from "body-parser"


const app = express();
const port = 8000
app.use(bodyParser.json())

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

app.use(cors());
app.use(express.json());



/*const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => (user["name"] === name)
  );
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => (user["name"] === name && user["job"] === job)
  );
};

const findUserById = (id) => 
  users["users_list"].find((user) => user["id"] === id)

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUser = (id) => {
  const indexToDelete = users["users_list"].findIndex(user => user.id === id);
  console.log(indexToDelete)
  if (indexToDelete != -1) {
    users["users_list"].splice(indexToDelete, 1)
    return true;
  } else {
    return false; 
  }
};

const generateID = () => {
  const id = (Math.random() * 1000).toFixed(0)
  return id
} */


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  if (name != undefined & job != undefined) {
    const result = await userServices.findUserByNameAndJob(name, job);
    res.send({ users_list: result });
  }
  else {
    const result = await userServices.getUsers(name, job);
    res.send({ users_list: result})
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"];
  const result = await userServices.findUserById(id);
  if (result === undefined || result === null)
    res.status(404).send("Resource not found.");
  else {
    res.send({ users_list: result });
  }
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id
  console.log(id)
  try {
  const result = await userServices.deleteUser(id);
  if (result) {
    res.status(204).send("User deleted successfully");
  }
  } catch (error) {
    console.error(error);
    res.status(404).send("Resource not found");
  }
  
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});