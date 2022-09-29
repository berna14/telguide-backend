const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("../models/person");

app.use(express.json());
app.use(cors());

let persons = [
  {
    name: "Ada Lovelace",
    number: "3300999999",
    id: 1,
  },
  {
    name: "Dan Abramov",
    number: "14-66-237705",
    id: 2,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 3,
  },
  {
    name: "Carlitos Zambrano",
    number: "358293923",
    id: 4,
  },
  {
    name: "Franquito Fabra",
    number: "3351343221",
    id: 5,
  },
  {
    name: "Jorge Pajin",
    number: "33-44-7766554",
    id: 6,
  },
];

// GET //

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.get("/info", (request, response) => {
  const fecha = new Date();
  const personas = persons.length;

  // Tuve que revisar como poner en un mismo send dos informaciones. Intente enviar dos 'response.send' con ambas informaciones por separado. Crear variables.

  response.send(
    `La cantidad de personas en la lista es de ${personas} y la fecha actual es ${fecha}`
  );
});

// DELETE //

app.delete("/api/persons/:id", (request, response) => {
  const id = +request.params.id;
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

// POST //

app.post("/api/persons", (request, response) => {
  const body = request.body;

  /* En el caso de esta condicion, si la propiedad "name" y la propiedad "number" no se encuentran a la hora de realizar el
post, se devolverá una respuesta con un status 404 que transmitirá un error y dirá "content missing" */

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: "content missing",
    });

    /* Caso contrario, si intentamos ingresar un nombre ya existente en la lista de personas, la solicitud devolverá un 404 que nos dirá que
el nombre de usuario ya existe */
  } else if (persons.some((person) => person.name === body.name)) {
    return response.status(400).end("username already exists");
  }

  const person = new Person({
    name: body.name,
    tel: body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });

  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
