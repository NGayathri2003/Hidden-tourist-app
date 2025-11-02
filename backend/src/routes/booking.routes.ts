import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingsByUserId,
  getBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
} from "../controllers/booking.controller";

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/user/:userId", getBookingsByUserId);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.patch("/:id/cancel", cancelBooking);
router.delete("/:id", deleteBooking);

export default router;