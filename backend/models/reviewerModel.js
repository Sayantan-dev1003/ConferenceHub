import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const reviewerSchema = mongoose.Schema({
    name: String,
    affiliation: String,
    email: String,
    phone: Number,
    areasOfExpertise: [String]
});

export default mongoose.model("Reviewer", reviewerSchema);