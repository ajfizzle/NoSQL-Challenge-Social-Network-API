const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUser(req, res) {
    User.find({})
      .then((users) => res.json(users))
      .catch((err) =>
        res.status(500).json({ message: "Error retrieving users", error: err })
      );
  },

  // Get a single user by ID
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "User not found with the provided ID" })
          : res.json(user)
      )
      .catch((err) =>
        res.status(500).json({ message: "Error retrieving user", error: err })
      );
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json({ message: "User successfully created", user }))
      .catch((err) => {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Error creating user", error: err });
      });
  },

  // Update a user by ID
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "User not found with the provided ID" })
          : res.json({ message: "User successfully updated", user })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error updating user", error: err })
      );
  },

  // Delete a user by ID
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "User not found with the provided ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() =>
        res.json({ message: "User and user's thoughts successfully deleted" })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error deleting user", error: err })
      );
  },

  // Add a friend to a user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "User not found with the provided ID" })
          : res.json({ message: "Friend successfully added", user })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error adding friend", error: err })
      );
  },

  // Remove a friend from a user's friend list
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "User not found with the provided ID" })
          : res.json({ message: "Friend successfully removed", user })
      )
      .catch((err) =>
        res.status(500).json({ message: "Error removing friend", error: err })
      );
  },
};
