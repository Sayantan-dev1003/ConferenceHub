import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const paperReviewSchema = mongoose.Schema({
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: "Paper" },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Reviewer" },
    comments: String,
    rating: Number,
    reviewDate: { type: Date, default: Date.now }
});

export default mongoose.model("PaperReview", paperReviewSchema);