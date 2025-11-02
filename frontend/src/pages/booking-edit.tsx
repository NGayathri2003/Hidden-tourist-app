import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Phone, Mail, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: Date | undefined;
  travelers: string;
  specialRequests: string;
  packageName: string;
  totalAmount: number;
}

const BookingEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useUser();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: undefined,
    travelers: "",
    specialRequests: "",
    packageName: "",
    totalAmount: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to edit bookings");
      navigate("/auth");
      return;
    }
    if (id && user) {
      fetchBooking();
    }
  }, [id, user, isAuthenticated, navigate]);

  const fetchBooking = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`);
      if (response.ok) {
        const data = await response.json();
        
        // Verify this booking belongs to the current user
        if (data.userId !== user.userId) {
          toast.error("Unauthorized access");
          navigate("/booking-history");
          return;
        }
        
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          date: new Date(data.date),
          travelers: data.travelers.toString(),
          specialRequests: data.specialRequests || "",
          packageName: data.packageName,
          totalAmount: data.totalAmount,
        });
      } else {
        toast.error("Failed to fetch booking details");
        navigate("/booking-history");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Something went wrong!");
      navigate("/booking-history");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date: formData.date ? formData.date.toISOString() : null,
      travelers: parseInt(formData.travelers),
      specialRequests: formData.specialRequests,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success("Booking updated successfully!");
        navigate("/booking-history");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading booking details...</p>
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Edit Booking
              </h1>
              <p className="text-lg text-muted-foreground">
                Update your booking details
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Edit Form */}
              <Card className="lg:col-span-2 border-border/50 shadow-[var(--shadow-elegant)] animate-scale-in">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Update your travel information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Travel Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">
                        Travel Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Preferred Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={formData.date}
                                onSelect={(date) =>
                                  setFormData((prev) => ({ ...prev, date }))
                                }
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="travelers">Number of Travelers *</Label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="travelers"
                              type="number"
                              min="1"
                              max="15"
                              value={formData.travelers}
                              onChange={handleInputChange}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequests">Special Requests</Label>
                        <Textarea
                          id="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => navigate("/booking-history")}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Booking"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <Card className="border-border/50 shadow-[var(--shadow-card)]">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Package</p>
                      <p className="font-semibold text-foreground">{formData.packageName}</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between pt-2">
                        <span className="font-semibold text-foreground">Total Amount</span>
                        <span className="text-xl font-bold text-primary">
                          ₹{formData.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-muted/30">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-foreground">Note</h4>
                    <p className="text-sm text-muted-foreground">
                      Changes to your booking may be subject to availability. Our team will
                      contact you if there are any issues with your updated dates.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingEdit;