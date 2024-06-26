import express from "express"
import cors from "cors";
import userServices from "./user-services.js";


const app = express();
const port = 8000


app.use(cors());
app.use(express.json());

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
  else res.status(500).send();
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