const router = require("express").Router();
const { User, Thought } = require("../../models");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-__v");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-__v")
      .populate("friends")
      .populate("thoughts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a user by ID
router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a user by ID
router.delete("/:userId", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    res.status(200).json({ message: "User and associated thoughts deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD a friend to a user
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the friend user exists
    const friendUser = await User.findById(friendId);
    if (!friendUser) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Add friendId to the user's friends array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }, // to avoid duplicates
      { new: true }
    );

    res.status(200).json({ message: "Friend added successfully" });
  } catch (err) {
    console.error("Error adding friend:", err);
    res.status(500).json({ error: err.message });
  }
});
// DELETE a friend from a user by friend ID
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
