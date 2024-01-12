/* eslint-disable no-undef */
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
const name = process.argv[3];
const number = process.argv[4];

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phonebookSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  try {
    Person.find({}).then((persons) => {
      console.log("phonebook:");
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    });
  } finally {
    mongoose.connection.close();
  }
}
