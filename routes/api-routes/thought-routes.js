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
    const { userId, ...thoughtData } = req.body;
    const thought = await Thought.create(thoughtData);

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );

    if (!user) {
      await Thought.findByIdAndDelete(thought._id); // Rollback thought creation
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ message: "Thought created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a thought by ID
router.put("/:thoughtId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
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
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
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
