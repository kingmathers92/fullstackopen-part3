const mongoose = require("mongoose");

if (process.argv.length < 4) {
  console.log("Usage: node script.js <password> <name> <number>");
  process.exit(1);
}

const url = process.env.MONGODB_URI;

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
      console.log(persons);
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
    });
  } finally {
    mongoose.connection.close();
  }
}
