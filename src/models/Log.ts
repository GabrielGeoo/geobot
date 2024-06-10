import mongoose, { InferSchemaType } from "mongoose";

const logSchema = new mongoose.Schema({
  message: { type: String, required: true },
  name: { type: String, required: false },
  stack: { type: String, required: false },
  date: { type: Date, required: true },
});

type Log = InferSchemaType<typeof logSchema>;

export default mongoose.model<Log>("Log", logSchema);