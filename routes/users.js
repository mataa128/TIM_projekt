const express = require(`express`);
const _ = require(`lodash`);
const { User } = require(`../models/userSchema`);
const router = express.Router();
const Joi = require(`joi`);
const mongoose = require(`mongoose`);

function validateUser(body) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(9).max(12).required(),
    admin: Joi.boolean(),
    premium: Joi.boolean(),
  });
  return schema.validate(body);
}

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send(`User with the given ID was not found`);
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    //   400 Bad request
    return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  });
  if (user) return res.status(400).send(`User already registered`);

  user = new User(
    _.pick(req.body, [`name`, `email`, `password`, `phone`, `admin`, `premium`])
  );

  user = await user.save();

  res.send(_.pick(user, [`_id`, `name`, `email`]));
});

router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    //400 Bad request
    return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, [
      `name`,
      `email`,
      `password`,
      `phone`,
      `admin`,
      `premium`,
    ]),
    {
      useFindAndModify: false,
      new: true,
    }
  );

  if (!user)
    return res.status(404).send(`User with the given ID was not found`);

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id, {
    useFindAndModify: false,
  });

  if (!user)
    return res.status(404).send(`User with the given ID was not found`);

  res.send(user);
});

module.exports = router;
