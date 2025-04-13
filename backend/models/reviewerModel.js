import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const reviewerSchema = mongoose.Schema({
    fullname: String,
    email: String,
    phone: Number,
    affiliation: String,
    areaOfInterest: String,
    password: String,
    paperReview: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paper' }]
});

export default mongoose.model("Reviewer", reviewerSchema);