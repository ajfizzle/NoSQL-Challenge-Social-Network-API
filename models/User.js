const { Schema, model } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", userSchema);

module.exports = User;
