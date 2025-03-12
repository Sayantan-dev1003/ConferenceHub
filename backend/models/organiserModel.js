import mongoose  from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const organiserSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone: Number,
    organisation: String,
    bio: String,
    password: String,
});

export default mongoose.model("organiser", organiserSchema);