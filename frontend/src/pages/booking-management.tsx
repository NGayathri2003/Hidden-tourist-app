// File: frontend/src/pages/booking-management.tsx

import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Calendar, Users, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  travelers: number;
  specialRequests?: string;
  packageName: string;
  totalAmount: number;
  createdAt: string;
}

const BookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bookingId: string) => {
    navigate(`/booking/edit/${bookingId}`);
  };

  const handleDeleteClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBookingId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Booking deleted successfully");
        setBookings(bookings.filter((b) => b._id !== selectedBookingId));
      } else {
        toast.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Something went wrong!");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBookingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your travel bookings and reservations
              </p>
            </div>

            {/* Bookings List */}
            {bookings.length === 0 ? (
              <Card className="border-border/50 shadow-[var(--shadow-card)]">
                <CardContent className="py-16 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">No bookings yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start your journey by booking your first adventure
                  </p>
                  <Button onClick={() => navigate("/packages")} variant="hero">
                    Browse Packages
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking, index) => (
                  <Card
                    key={booking._id}
                    className="border-border/50 hover:shadow-[var(--shadow-elegant)] transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl mb-2">
                            {booking.packageName}
                          </CardTitle>
                          <Badge className="bg-primary/10 text-primary">
                            Booking ID: {booking._id.slice(-8)}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(booking._id)}
                            className="hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(booking._id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Travel Date</p>
                            <p className="font-semibold text-foreground">
                              {formatDate(booking.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Travelers</p>
                            <p className="font-semibold text-foreground">
                              {booking.travelers} {booking.travelers === 1 ? "Person" : "People"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-foreground text-sm">
                              {booking.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-semibold text-foreground">{booking.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Guest Name</p>
                          <p className="font-semibold text-foreground">
                            {booking.firstName} {booking.lastName}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-primary">
                            ₹{booking.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                          <p className="text-foreground">{booking.specialRequests}</p>
                        </div>
                      )}

                      <div className="mt-4 text-xs text-muted-foreground">
                        Booked on: {formatDate(booking.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your booking and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingManagement;