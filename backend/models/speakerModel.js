import mongoose  from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const speakerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone: Number,
    affiliation: String,
    bio: String,
    areaOfInterest: { type: String },
    password: String,
    conferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conference" }],
    papers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paper" }],
    location: { type: String },
    socialMediaLinks: {
        twitter: { type: String },
        linkedin: { type: String }
    }
});

export default mongoose.model("speaker", speakerSchema);