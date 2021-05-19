const express = require(`express`);
const dishSchema = require(`./schema`);
const router = express.Router();
const Joi = require(`joi`);

const mongoose = require(`mongoose`);

const Course = mongoose.model(`Course`, new mongoose.Schema(dishSchema));

function validateCourse(body) {
  const schema = Joi.object({
    dishName: Joi.string().min(3).required(),
    category: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    ingredients: Joi.required(),
    cookingTime: Joi.number().min(0).required(),
    sourceUrl: Joi.string().required(),
    isPublished: Joi.boolean().required(),
    price: Joi.number().min(0).required(),
    tags: Joi.required(),
    date: Joi.allow(),
  });
  return schema.validate(body);
}

router.get("/", async (req, res) => {
  const courses = await Course.find().sort("dishName");
  res.send(courses);
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return res.status(404).send(`The course with the given ID was not found`);
  res.send(course);
});

router.post("/", async (req, res) => {
  const { error } = validateCourse(req.body);

  if (error)
    //   400 Bad request
    return res.status(400).send(error.details[0].message);

  let course = new Course({
    dishName: req.body.dishName,
    category: req.body.category,
    author: req.body.author,
    ingredients: req.body.ingredients,
    cookingTime: req.body.cookingTime,
    sourceUrl: req.body.sourceUrl,
    isPublished: req.body.isPublished,
    price: req.body.price,
    tags: req.body.tags,
  });

  course = await course.save();
  res.send(course);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error)
    //400 Bad request
    return res.status(400).send(error.details[0].message);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    {
      dishName: req.body.dishName,
      category: req.body.category,
      author: req.body.author,
      ingredients: req.body.ingredients,
      cookingTime: req.body.cookingTime,
      sourceUrl: req.body.sourceUrl,
      isPublished: req.body.isPublished,
      price: req.body.price,
      tags: req.body.tags,
    },
    {
      useFindAndModify: false,
      new: true,
    }
  );

  if (!course)
    return res.status(404).send(`The course with the given ID was not found`);

  res.send(course);
});

router.delete("/:id", async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id, {
    useFindAndModify: false,
  });

  if (!course)
    return res.status(404).send(`The course with the given ID was not found`);

  res.send(course);
});

module.exports = router;
