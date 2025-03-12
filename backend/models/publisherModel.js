import mongoose  from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const publisherSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone: Number,
    affliation: String,
    designation: String,
    password: String,
});

export default mongoose.model("publisher", publisherSchema);