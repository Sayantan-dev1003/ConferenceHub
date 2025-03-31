import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const attendeeSchema = mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    affiliation: { type: String },
    areaOfInterest: { type: String },
    password: { type: String, required: true },
    conferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conference" }],
    location: { type: String },
    socialMediaLinks: {
        twitter: { type: String },
        linkedin: { type: String }
    }
});

export default mongoose.model("Attendee", attendeeSchema);