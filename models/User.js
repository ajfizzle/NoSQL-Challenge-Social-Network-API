const { Schema, model } = require("mongoose");
const validator = require("validator");
const dateFormat = require("../utils/dateFormat"); // Import the date formatting utility

// Define the User schema
const userSchema = new Schema(
  {
    // Define the username field
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
    },

    // Define the createdAt field <-- For the future development
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    //   get: (timestamp) => dateFormat(timestamp),
    // },

    // Define the email field
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
    },

    // Define the thoughts field as an array of references to Thought model
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],

    // Define the friends field as an array of references to User model
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Options for the schema
    toJSON: {
      virtuals: true,
      getters: true, // Ensure getters are applied during JSON serialization
    },
    id: false,
  }
);

// Define a virtual property 'friendCount' to get the number of friends
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", userSchema);

module.exports = User;
