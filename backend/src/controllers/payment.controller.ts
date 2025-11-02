import { Request, Response } from "express";
import Payment from "../models/payment.model";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a new payment
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, paymentMethod, amount } = req.body;

    if (!bookingId || !paymentMethod || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPayment = await Payment.create({
      bookingId,
      paymentMethod,
      amount,
      transactionId: uuidv4(),
      status: "Success",
    });

    res.status(201).json({
      message: "Payment recorded successfully",
      payment: newPayment,
    });
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * Get all payments
 */
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await Payment.find().populate("bookingId");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
};

/**
 * Get single payment by ID
 */
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("bookingId");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });
  }
};

/**
 * Delete a payment
 */
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error });
  }
};
