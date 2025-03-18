import mongoose  from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const attendeeSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone: Number,
    affiliation: String,
    areaOfInterest: [String],
    password: String,
    conferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conference" }]
});

export default mongoose.model("attendee", attendeeSchema);