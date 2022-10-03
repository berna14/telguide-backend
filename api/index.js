const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("../models/person");

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

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

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// POST //

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  // if (body.name === undefined || body.number === undefined) {
  //   return response.status(400).json({
  //     error: "content missing",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson.toJSON());
    })
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson);
    })
    .catch((error) => next(error));
});

// PUT //

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
