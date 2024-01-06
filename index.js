const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const Person = require("./modules/person");

app.use(express.json());

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("postData", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.send("Hello JS");
});

app.get("/api/persons", async (request, response) => {
  const persons = await Person.getAllPersons();
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  const requestTime = new Date();

  const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime}</p>
    `;

  response.send(info);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const person = persons.find((person) => person.id === id);
  console.log(person);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", async (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "Name or number is missing",
    });
  }

  await Person.addPerson(name, number);
  response.json({ name, number });

  try {
    const addedPerson = await Person.addPerson(name, number);
    response.json(addedPerson);
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
