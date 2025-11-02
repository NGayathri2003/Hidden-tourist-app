import { Request, Response } from "express";
import Booking from "../models/booking.model";
import { User } from "../models/user.model";
// Create Booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, ...bookingData } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Verify user exists
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = await Booking.create({ userId, ...bookingData });
    res.status(201).json({ 
      message: "Booking created successfully", 
      booking 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error creating booking", 
      error: error.message 
    });
  }
};

// Get All Bookings
export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error fetching bookings", 
      error: error.message 
    });
  }
};

// Get Bookings by User ID
export const getBookingsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error fetching bookings", 
      error: error.message 
    });
  }
};

// Get Single Booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error fetching booking", 
      error: error.message 
    });
  }
};

// Update Booking
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ 
      message: "Booking updated successfully", 
      booking 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error updating booking", 
      error: error.message 
    });
  }
};

// Cancel Booking (Update Status)
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ 
      message: "Booking cancelled successfully", 
      booking 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error cancelling booking", 
      error: error.message 
    });
  }
};

// Delete Booking
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ 
      message: "Error deleting booking", 
      error: error.message 
    });
  }
};