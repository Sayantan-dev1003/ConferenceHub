import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const resourceSchema = mongoose.Schema({
    name: String,
    type: String,
    availability: { type: String, enum: ["Available", "Unavailable"], default: "Available" }
});

export default mongoose.model("Resource", resourceSchema);