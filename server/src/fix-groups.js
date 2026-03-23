// server/src/fix-groups.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Event = require('./models/Event');
const Group = require('./models/Group');

const DB_URI = process.env.MONGO_URI || "mongodb+srv://admin:admin@cluster0.sosfhfm.mongodb.net/test?retryWrites=true&w=majority";

const fixGroups = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected.");

    const events = await Event.find();
    let createdCount = 0;

    for (const event of events) {
      const groupExists = await Group.findOne({ eventId: event._id, type: "event" });
      
      if (!groupExists) {
        console.log(`Missing group for event: ${event.title}. Creating...`);
        const eventGroup = new Group({
          name: `${event.title} — Chat`,
          description: `Event discussion group for ${event.title}`,
          orgId: event.organizer,
          type: "event",
          eventId: event._id,
          icon: "🏖️",
          color: "#10B981",
          createdBy: event.organizer,
          settings: { isPublic: false, allowFileUploads: false, allowMentions: true },
          members: [{ userId: event.organizer, role: "admin", joinedAt: new Date() }],
        });
        await eventGroup.save();
        createdCount++;
      }
    }

    console.log(`Done! Created ${createdCount} missing groups.`);
    process.exit(0);
  } catch (err) {
    console.error("Error running fix script:", err);
    process.exit(1);
  }
};

fixGroups();
