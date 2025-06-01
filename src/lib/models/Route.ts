import mongoose from 'mongoose';

// Define marker type schema (should match the definition in add-route/page.tsx)
const MarkerType = ['start', 'regular', 'finish', 'feet only'];
const RouteStyle = ['dinamico', 'regleteira', 'no match']; // Keep for reference, but schema uses array

const MarkerSchema = new mongoose.Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  type: { type: String, required: true, enum: MarkerType },
});

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  description: { type: String },
  setterName: { type: String }, // Add setterName field
  style: [{ type: String, enum: RouteStyle }], // Change style to an array of strings with enum
  markers: [MarkerSchema], // Array of MarkerSchema
  image: { type: String, required: true },
  instagram: { type: String }, // Add instagram field
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Check if the model already exists before defining it
const Route = mongoose.models.Route || mongoose.model('Route', RouteSchema);

export default Route; 