Import mongoose from 'mongoose';
const {Schema} = mongoose;

const personSchema = new Schema({
  name: {type: String, required: true],
  age: Number,
  favoriteFoods: [String]
});

export const Person = mongoose.model('Person', personSchema);

export const createPersonEntry = (data) => {
  const person = new Person({name: data.name, age: data.age, favoriteFoods: data.favoriteFoods});
  person.save(data, (err, cbPerson) => {
    if(err) {
      console.err(err);
    }
    else console.log(cbPerson);
  })
};
