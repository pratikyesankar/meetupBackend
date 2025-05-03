const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ["Online Event", "Offline Event"],
    required: true,
  },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true },
  topic: { type: String, required: true },
  sessionTimings: [String],
  speaker1: { type: String, required: false },
  speaker2: { type: String, required: false },
  designation1: { type: String, required: false },
  designation2: { type: String, required: false },
  pricing: { type: Number, default: 0 },
  venue: String,
  address: String,
  additionalInfo: String,
  tags: [String],
  host: { type: String, required: true },
  dressCode: { type: String, required: true },
  ageRestrictions: { type: String, required: true },
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event
