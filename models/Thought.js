const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const dateFormat = require("../utils/dateFormat");

// Define the Thought schema
const thoughtSchema = new Schema(
  {
    // Define the thoughtText field
    thoughtText: {
      type: String, // Data type is String
      required: [true, "Thought text is required"],
      minlength: [1, "Thought text must be at least 1 character long"],
      maxlength: [280, "Thought text cannot exceed 280 characters"],
    },
    // Define the createdAt field
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    // Define the username field
    username: {
      type: String, // Data type is String
      required: [true, "Username is required"],
    },
    // Define the reactions field as an array of reactionSchema
    reactions: [reactionSchema],
  },
  {
    // Options for the schema
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

// Define a virtual property 'reactionCount' to get the number of reactions
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
