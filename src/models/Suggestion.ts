import mongoose, { InferSchemaType, Schema } from "mongoose";

const suggestionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  suggestion: { type: String, required: true },
});

type Suggestion = InferSchemaType<typeof suggestionSchema>;

export default mongoose.model<Suggestion>("Suggestion", suggestionSchema);