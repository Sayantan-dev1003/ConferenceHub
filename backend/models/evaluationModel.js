import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/ConferenceHub");

const evaluationSchema = mongoose.Schema({
    paperId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paper' }],
    reviewerId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reviewer' }],
    verdict: String,
    score: Number,
    comments: String,
    timeStamp: { type: Date, default: Date.now },
});

export default mongoose.model("Evaluation", evaluationSchema);