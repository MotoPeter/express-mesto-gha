/* eslint-disable quotes */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
const validator = require("validator");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [30, "Максимальная длинна 30 символов"],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    likes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        default: {},
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("card", cardSchema);
