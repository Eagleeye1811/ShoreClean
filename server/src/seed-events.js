// server/src/seed-events.js
require('dotenv').config({ path: '../.env' }); // Load the correct env
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

const DB_URI = process.env.MONGO_URI || "mongodb+srv://admin:admin@cluster0.sosfhfm.mongodb.net/test?retryWrites=true&w=majority";

const seedEvents = [
  {
    title: "Juhu Beach Mega Cleanup Drive",
    description: "Join us this weekend for one of the largest coastal cleanup drives at Juhu Beach. Our mission is to remove single-use plastics and ghost nets from the shoreline to protect local marine life. We will provide gloves, garbage bags, and sanitizers. Refreshments will be served post-event.",
    location: "Juhu Beach, Mumbai, Maharashtra 400049",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // + 4 hours
    capacity: 200,
    tags: ["marine-life", "plastic-free", "mega-drive"],
    bannerUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80f417e?w=800&q=80",
    status: "published"
  },
  {
    title: "Versova Coastline Restoration",
    description: " Continuing the legacy of the world's largest beach cleanup, we invite all ocean lovers to restore the beauty of Versova beach. This event focuses heavily on segregating microplastics and recycling collected waste efficiently.",
    location: "Versova Beach, Andheri West, Mumbai, Maharashtra 400061",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // + 3 hours
    capacity: 150,
    tags: ["microplastics", "recycling", "community"],
    bannerUrl: "https://images.unsplash.com/photo-1595274457494-dfc525f385c5?w=800&q=80",
    status: "published"
  },
  {
    title: "Marina Beach Community Sweep",
    description: "Marina Beach is one of the longest urban beaches in the world. Help us sweep away the weekend litter to ensure a clean, safe habitat for sea turtles and a beautiful sunrise walk for locals. Great for families and students!",
    location: "Marina Beach, Chennai, Tamil Nadu 600005",
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), 
    capacity: 500,
    tags: ["family-friendly", "turtle-habitat", "urban-beach"],
    bannerUrl: "https://images.unsplash.com/photo-1582239401918-6bb7f2da845b?w=800&q=80",
    status: "published"
  },
  {
    title: "Gokarna Coastal Preservation Initiative",
    description: "Our initiative to protect the pristine beaches of Gokarna. We will be trekking across Om Beach and Half Moon Beach, picking up discarded bottles and wrappers along the shores. Enjoy a beautiful trek while saving the environment.",
    location: "Om Beach, Gokarna, Karnataka 581326",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), 
    capacity: 100,
    tags: ["trekking", "coastal", "clean-india"],
    bannerUrl: "https://images.unsplash.com/photo-1597843812856-55418b704c77?w=800&q=80",
    status: "published"
  },
  {
    title: "Goa Beach Rescue Weekend",
    description: "Post-monsoon cleanup to rescue the beaches of North Goa from tidal debris. Volunteers will work in small groups across Baga, Calangute, and Anjuna. Transport between beaches will be arranged. Let's make Goa beaches safe for everyone.",
    location: "Baga Beach, North Goa, Goa 403516",
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), 
    capacity: 250,
    tags: ["monsoon-cleanup", "teamwork", "goa"],
    bannerUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80",
    status: "published"
  },
  {
    title: "Kochi Harbor Cleanup Drive",
    description: "Join local fishermen and volunteers to pull plastic waste out of the historic Fort Kochi harbor. We will be clearing floating debris and shore waste. Safety gear is mandatory and will be provided on-site.",
    location: "Fort Kochi Beach, Kochi, Kerala 682001",
    startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), 
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), 
    capacity: 120,
    tags: ["harbor", "fishermen", "waterfront"],
    bannerUrl: "https://images.unsplash.com/photo-1537084728514-9989a311dede?w=800&q=80",
    status: "published"
  }
];

const runSeed = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully.");

    const email = "Admin@gmail.com".toLowerCase();
    let orgUser = await User.findOne({ email });

    if (!orgUser) {
      console.log(`User ${email} not found. Creating a new organization user...`);
      orgUser = new User({
        name: "Admin Org",
        email: email,
        password: "Admin@123", // Will be hashed via pre-save hook
        role: "org",
        hasCompletedProfile: true, 
      });
      await orgUser.save();
      console.log("Organization created automatically!");
    } else {
      console.log(`Found existing organization: ${orgUser.name} (${orgUser._id})`);
    }

    console.log("Seeding Events...");
    for (const evt of seedEvents) {
      evt.organizer = orgUser._id;
      const created = await Event.create(evt);
      console.log(`Created Event: ${created.title}`);
    }

    console.log("Successfully seeded all 6 beautiful events!");
    process.exit(0);
  } catch (err) {
    console.error("Error running seed script:", err);
    process.exit(1);
  }
};

runSeed();
