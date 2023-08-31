/* eslint-disable func-names */
/* eslint-disable quotes */
/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const UnauthorizedError = require("../errors/unauthorized-error");

// eslint-disable-next-line no-undef
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minlength: [2, "Минимальная длинна 2 символа"],
      maxlength: [30, "Максимальная длинна 30 символов"],
    },
    about: {
      type: String,
      default: "Исследователь",
      minlength: [2, "Минимальная длинна 2 символа"],
      maxlength: [30, "Максимальная длинна 30 символов"],
    },
    avatar: {
      type: String,
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (v) => validator.isURL(v),
        message: "Некорректный URL",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: "Некорректный формат email",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new UnauthorizedError("Неправильные почта или пароль"));
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      // проверяем хеши паролей]
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
      }

      return user; // теперь user доступен
    });
  });
};

module.exports = mongoose.model("user", userSchema);
