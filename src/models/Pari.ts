import mongoose, { InferSchemaType, Schema } from "mongoose";

const bettorSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  bet: {type: String, required: true},
});

const pariSchema = new mongoose.Schema({
  pariName: {type: String, required: true},
  date: {type: Date, required: true},
  bettors: {type: [bettorSchema], required: false, default: []},
});

type Pari = InferSchemaType<typeof pariSchema>;

export default mongoose.model<Pari>("Pari", pariSchema);