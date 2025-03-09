import mongoose  from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const speakerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone: Number,
    affiliation: String,
    bio: String,
    password: String,
});

export default mongoose.model("speaker", speakerSchema);