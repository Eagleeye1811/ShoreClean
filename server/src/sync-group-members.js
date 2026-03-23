// server/src/sync-group-members.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Group = require('./models/Group');
const Registration = require('./models/Registration');

const DB_URI = process.env.MONGO_URI || "mongodb+srv://admin:admin@cluster0.sosfhfm.mongodb.net/test?retryWrites=true&w=majority";

const syncMembers = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected.");

    const registrations = await Registration.find({ status: { $in: ['registered', 'checked-in', 'checked-out'] } });
    let addedCount = 0;

    for (const reg of registrations) {
      const eventGroup = await Group.findOne({ eventId: reg.event, type: "event" });
      if (eventGroup) {
        const alreadyMember = eventGroup.members.some(
          (m) => m.userId.toString() === reg.user.toString()
        );
        if (!alreadyMember) {
          eventGroup.members.push({ userId: reg.user, role: "member", joinedAt: new Date() });
          await eventGroup.save();
          console.log(`Added user ${reg.user} to group for event ${reg.event}`);
          addedCount++;
        }
      }
    }

    console.log(`Done! Added ${addedCount} missing members to their respective groups.`);
    process.exit(0);
  } catch (err) {
    console.error("Error syncing members:", err);
    process.exit(1);
  }
};

syncMembers();
