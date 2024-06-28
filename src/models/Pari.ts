import mongoose, { InferSchemaType, Schema } from "mongoose";

const pariSchema = new mongoose.Schema({
  pariName: {type: String, required: true},
  date: {type: Date, required: true},
  bettors: {type: [{
    userId: {type: String, required: true},
    bet: {type: String, required: true},
  }], required: true, default: []},
});

type Pari = InferSchemaType<typeof pariSchema>;

export default mongoose.model<Pari>("Pari", pariSchema);