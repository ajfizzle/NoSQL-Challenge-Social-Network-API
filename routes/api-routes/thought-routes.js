const router = require("express").Router();
const { User, Thought } = require("../../models");

// GET all thoughts
router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 });
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single thought by ID
router.get("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new thought
router.post("/", async (req, res) => {
  try {
    const { userId, username, ...thoughtData } = req.body;

    // Fetch the user based on userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is active
    if (!user.isActive) {
      return res.status(403).json({ message: "User is not active" });
    }

    // Check if the username matches the user's username
    if (username !== user.username) {
      return res
        .status(400)
        .json({ message: "Username does not match userId" });
    }

    // Create the thought
    const thought = await Thought.create({ ...thoughtData, username });

    // Update the user's thoughts
    await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    res.status(201).json({ message: "Thought created successfully" });
  } catch (err) {
    console.error("Error creating thought:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a thought by ID
router.put("/:thoughtId", async (req, res) => {
  try {
    const { userId, username, thoughtText } = req.body;
    const { thoughtId } = req.params;

    // Fetch the user by userId
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Verify that the username matches the user's username
    if (user.username !== username) {
      console.log("Username does not match for userId:", userId);
      return res
        .status(400)
        .json({ message: "Username does not match userId" });
    }

    // Update the thought by thoughtId
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(updatedThought);
  } catch (err) {
    console.error("Error updating thought:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a thought by ID
router.delete("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    await User.updateMany(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } }
    );

    res.json({ message: "Thought deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD a reaction to a thought
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const { userId, username, ...reactionData } = req.body;

    console.log("Received userId:", userId);
    console.log("Received username:", username);

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for userId:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is active
    if (!user.isActive) {
      console.log("User is not active for userId:", userId);
      return res.status(403).json({ message: "User is not active" });
    }

    // Check if the username matches
    if (user.username !== username) {
      console.log("Username does not match for userId:", userId);
      return res
        .status(400)
        .json({ message: "Username does not match userId" });
    }

    // Add the reaction to the thought
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: { ...reactionData, username } } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (err) {
    console.error("Error adding reaction:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a reaction from a thought by reaction ID
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
