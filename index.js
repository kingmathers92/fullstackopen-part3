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

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.send("Hello JS");
});

app.get("/api/persons", async (request, response) => {
  try {
    const persons = await Person.getAllPersons();
    response.json(persons);
  } catch (error) {
    response.status(500).json({ error: "Iternal Server Error" });
  }
});

app.get("/api/info", (request, response) => {
  const requestTime = new Date();

  const info = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${requestTime}</p>
    `;

  response.send(info);
});

app.get("/api/persons/:id", async (request, response, next) => {
  const id = request.params.id;

  try {
    const person = await Person.findById(id);

    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/persons", async (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: "Name or number is missing",
    });
  }

  try {
    const existingPerson = await Person.findOne({ name });

    if (existingPerson) {
      existingPerson.number = number;
      await existingPerson.save();
      response.json(existingPerson);
    } else {
      const addedPerson = await Person.addPerson(name, number);
      response.json(addedPerson);
    }
  } catch (error) {
    next(error);
  }
});


app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  try {
    await Person.findByIdAndRemove(id)
    response.status(204).end();
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" })
  }

  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
