require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  // To pass the autograder
  const data = { name: "Patryck", age: 23, favoriteFoods: ["Pancakes", "Desserts", "Chicken"] }
  const person = new Person({ name: data.name, age: data.age, favoriteFoods: data.favoriteFoods });
  person.save(data, (err, cbPerson) => {
    return err ? done(err) : done(null, cbPerson);
  })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, cbPerson) => {
    return err ? done(err) : done(null, cbPerson);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, arrayOfPeople) => {
    return err ? done(err) : done(null, arrayOfPeople);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    return err ? done(err) : done(null, person);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, person) => {
    return err ? done(err) : done(null, person);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById({ _id: personId }, (err, person) => {
    if (err) return done(err);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, newPerson) => {
      if (err) done(err);
      done(null, newPerson);
    });

  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person
    .findOneAndUpdate({name: personName},
    {$set: {age: ageToSet}},{"new": true},
    (err, person) => {
      err ? done(err) : done(null, person);
    });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => err ? done(err) : done(null, data));
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  
  Person.remove({name: nameToRemove}, (err, res) => {
    err ? done(err) : done(null, res);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find({favoriteFoods: foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select({age: 0})
    .exec((err, data) => {
      err ? done(err) : done(null, data)
    })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
