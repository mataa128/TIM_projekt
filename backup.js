const mongoose = require(`mongoose`);

mongoose
  .connect(`mongodb://localhost/data`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connection to database succeeded`))
  .catch(err => console.error(`Connection to database failed`, err));

const schema = new mongoose.Schema({
  dishName: { type: String, required: true, minLength: 5, maxLength: 255 },
  category: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    dishType: [
      "carrot",
      "broccoli",
      "asparagus",
      "cauliflower",
      "corn",
      "cucumber",
      "green pepper",
      "lettuce",
      "mushrooms",
      "onion",
      "potato",
      "pumpkin",
      "red pepper",
      "tomato",
      "beetroot",
      "brussel sprouts",
      "peas",
      "zucchini",
      "radish",
      "sweet potato",
      "artichoke",
      "leek",
      "cabbage",
      "celery",
      "chili",
      "garlic",
      "basil",
      "coriander",
      "parsley",
      "dill",
      "rosemary",
      "oregano",
      "cinnamon",
      "saffron",
      "green bean",
      "bean",
      "chickpea",
      "lentil",
      "apple",
      "apricot",
      "avocado",
      "banana",
      "blackberry",
      "blackcurrant",
      "blueberry",
      "boysenberry",
      "cherry",
      "coconut",
      "fig",
      "grape",
      "grapefruit",
      "kiwifruit",
      "lemon",
      "lime",
      "lychee",
      "mandarin",
      "mango",
      "melon",
      "nectarine",
      "orange",
      "papaya",
      "passion fruit",
      "peach",
      "pear",
      "pineapple",
      "plum",
      "pomegranate",
      "quince",
      "raspberry",
      "strawberry",
      "watermelon",
      "salad",
      "pizza",
      "pasta",
      "popcorn",
      "lobster",
      "steak",
      "bbq",
      "pudding",
      "hamburger",
      "pie",
      "cake",
      "sausage",
      "Tacos",
      "Kebab",
      "poutine",
      "seafood",
      "chips",
      "fries",
      "masala",
      "paella",
      "som tam",
      "chicken",
      "toast",
      "marzipan",
      "tofu",
      "Ketchup",
      "hummus",
      "chili",
      "maple syrup",
      "parma ham",
      "fajitas",
      "champ",
      "lasagna",
      "poke",
      "chocolate",
      "croissant",
      "arepas",
      "bunny chow",
      "pierogi",
      "donuts",
      "rendang",
      "sushi",
      "ice cream",
      "duck",
      "curry",
      "beef",
      "goat",
      "lamb",
      "turkey",
      "pork",
      "fish",
      "crab",
      "bacon",
      "ham",
      "pepperoni",
      "salami",
      "ribs",
      "other",
    ],
  },
  author: String,
  ingredients: [
    {
      quantity: Number,
      unit: String,
      description: String,
    },
  ],
  cookingTime: { type: Number, required: true },
  source_url: String,
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
  },
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: `A course should have at least one tag.`,
    },
  },
});

const Course = mongoose.model(`Course`, schema);

async function createCourse() {
  const course = new Course({
    dishName: `Pizza Crust (with BBQ Chicken Pizza)`,
    category: "Pizza",
    author: `Closet Cooking`,
    ingredients: [
      {
        quantity: 1,
        unit: "",
        description: "medium head cauliflower cut into florets",
      },
      { quantity: 1, unit: "", description: "egg" },
      { quantity: 0.5, unit: "cup", description: "mozzarella shredded" },
      {
        quantity: 1,
        unit: "tsp",
        description: "oregano or italian seasoning blend",
      },
      { quantity: null, unit: "", description: "Salt and pepper to taste" },
      {
        quantity: 1,
        unit: "cup",
        description: "chicken cooked and shredded",
      },
      {
        quantity: 0.5,
        unit: "cup",
        description: "barbecue sauce",
      },
      {
        quantity: 0.75,
        unit: "cup",
        description: "mozzarella shredded",
      },
      {
        quantity: null,
        unit: "",
        description: "Red onion to taste thinly sliced",
      },
      { quantity: null, unit: "", description: "Fresh cilantro to taste" },
    ],
    cookingTime: 60,
    sourceUrl:
      "http://www.closetcooking.com/2013/02/cauliflower-pizza-crust-with-bbq.html",
    isPublished: true,
    price: 29.99,
    tags: [`pizza`],
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (err) {
    for (field in err.errors) {
      console.log(
        `Field: ${err.errors[field].path}\nError: ${err.errors[field].message}`
      );
    }
  }
}

async function getCourses() {
  const pageNumber = 1;
  const pageSize = 10;
  // /api/dishes?pageNumber=2&pageSize=10

  const courses = await Course.find({})
    //   .skip((pageNumber - 1)*pageSize)
    .limit(pageSize)
    .sort({ dishName: 1 })
    .select({ dishName: 1, isPublished: 1 });
  console.log(courses);
}

async function updateCourse(id) {
  const result = await Course.updateOne(
    {
      //mongodb update operators
      _id: id,
    },
    {
      $set: {
        author: `Closet Cooking`,
        isPublished: true,
      },
    }
  );
  //   console.log(result);
}

async function removeCourse(id) {
  const result = await Course.deleteOne({
    //mongodb update operators
    _id: id,
  });
  console.log(result);
}

createCourse();
// updateCourse("60a439ae76833472b4431325");
// removeCourse("60a439ae76833472b4431325");
// getCourses();
