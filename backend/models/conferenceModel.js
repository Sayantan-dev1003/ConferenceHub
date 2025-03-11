import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const conferenceSchema = mongoose.Schema({
    name: String,
    startDate: Date,
    endDate: Date,
    location: String
});

export default mongoose.model("Conference", conferenceSchema);