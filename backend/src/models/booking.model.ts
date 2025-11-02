import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: Date;
  travelers: number;
  specialRequests?: string;
  packageName?: string;
  totalAmount?: number;
  status: "booked" | "cancelled";
}

const BookingSchema: Schema = new Schema(
  {
    userId: { 
      type: String, 
      required: true,
      index: true 
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    travelers: { type: Number, required: true },
    specialRequests: { type: String },
    packageName: { type: String, default: "Coastal Heritage Trail" },
    totalAmount: { type: Number, default: 14299 },
    status: { 
      type: String, 
      enum: ["booked", "cancelled"],
      default: "booked" 
    },
  },
  { timestamps: true }
);

BookingSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);