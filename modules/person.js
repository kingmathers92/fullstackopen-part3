const mongoose = require("mongoose");

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phonebookSchema);

const getAllPersons = () => {
  return Person.find({});
};

const addPerson = (name, number) => {
  const person = new Person({
    name,
    number,
  });
  return person.save();
};

module.exports = {
  getAllPersons,
  addPerson,
};
