const express = require("express")
const app = express()
const cors = require("cors")

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

const { initializeDatabase } = require("./db/db.connect")
const Event = require("./models/event.models")

app.use(express.json())

initializeDatabase()

//------------------------------------------------------------------------------------------------------------------------------------
// Post a New Event
async function createEvent(newEvent) {
  try {
    const event = new Event(newEvent)
    const savedEvent = await event.save()
    return savedEvent
  } catch (error) {
    throw error
  }
}

app.post("/events", async (req, res) => {
  // Changed /resorts to /events
  try {
    const savedEvent = await createEvent(req.body)
    res
      .status(201)
      .json({ message: "Event added successfully.", event: savedEvent })
  } catch (error) {
    res.status(500).json({ error: "Failed to add event" })
  }
})

//------------------------------------------------------------------------------------------------------------------------------------
// Get All Events
async function readAllEvents() {
  try {
    const allEvents = await Event.find()
    return allEvents
  } catch (error) {
    console.log(error)
    throw error
  }
}
app.get("/events", async (req, res) => {
  // Changed /resorts to /events
  try {
    const events = await readAllEvents()
    if (events.length != 0) {
      res.json(events)
    } else {
      res.json({ error: "No events found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." })
  }
})

//------------------------------------------------------------------------------------------------------------------------------------
// Delete an Event
async function deleteEvent(eventId) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId)
    return deletedEvent
  } catch (error) {
    console.log(error)
    throw error
  }
}

app.delete("/events/:eventId", async (req, res) => {
  try {
    const deletedEvent = await deleteEvent(req.params.eventId)
    if (deletedEvent) {
      res.status(200).json({ message: "Event deleted successfully." })
    } else {
      res.status(404).json({ error: "Event not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event." })
  }
})

//------------------------------------------------------------------------------------------------------------------------------------
// Get Event by Name
async function readEventByName(eventName) {
  try {
    const event = await Event.findOne({ title: eventName })
    return event
  } catch (error) {
    throw error
  }
}

app.get("/events/:title", async (req, res) => {
  try {
    const event = await readEventByName(req.params.title)
    if (event) {
      res.status(200).json(event)
    } else {
      res.status(404).json({ error: "Event not found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event." })
  }
})

//------------------------------------------------------------------------------------------------------------------------------------
// Update Event details
async function updateEvent(eventId, dataToUpdate) {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, dataToUpdate, {
      new: true,
    })
    return updatedEvent
  } catch (error) {
    console.log("Error in updating Event details", error)
    throw error
  }
}

app.post("/events/:id", async (req, res) => {
  try {
    const updatedEvent = await updateEvent(req.params.id, req.body)
    if (updatedEvent) {
      res.status(200).json({
        message: "Event updated successfully.",
        updatedEvent: updatedEvent,
      })
    } else {
      res.status(404).json({ error: "Event not found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update event." })
  }
})

//----------------------------------------------------------------------------------------
// Get Event by ID
async function readEventById(id) {
  try {
    const event = await Event.findById(id)
    return event
  } catch (error) {
    throw error
  }
}

app.get("/events/:id", async (req, res) => {
  try {
    const event = await readEventById(req.params.id)
    if (event) {
      res.status(200).json(event)
    } else {
      res.status(404).json({ error: "Event not found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event." })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
