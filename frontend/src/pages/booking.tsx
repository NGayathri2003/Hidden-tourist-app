import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const Booking = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to book a package");
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔍 Current user object:", user);
    
    if (!user) {
      console.error("❌ userId is missing from user object!");
      toast.error("Session error. Please login again.");
      navigate("/auth");
      return;
    }

    if (!date) {
      toast.error("Please select a travel date");
      return;
    }

    setIsSubmitting(true);
  
    const bookingData = {
      userId: user.userId,
      firstName: (document.getElementById("firstName") as HTMLInputElement).value,
      lastName: (document.getElementById("lastName") as HTMLInputElement).value,
      email: (document.getElementById("email") as HTMLInputElement).value,
      phone: (document.getElementById("phone") as HTMLInputElement).value,
      date: date.toISOString(),
      travelers: parseInt((document.getElementById("travelers") as HTMLInputElement).value),
      specialRequests: (document.getElementById("specialRequests") as HTMLTextAreaElement).value,
      packageName: "Coastal Heritage Trail",
      totalAmount: 14299,
      status: "booked"
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("✅ Booking saved:", result);
        
        // Store booking ID in sessionStorage to use in payment page
        sessionStorage.setItem("currentBookingId", result.booking._id);
        
        toast.success("Booking details saved!");
        navigate("/payment");
      } else {
        const error = await response.json();
        console.error("❌ Failed to save booking:", error);
        toast.error(error.message || "Booking failed. Please try again!");
      }
    } catch (error) {
      console.error("❌ Error while booking:", error);
      toast.error("Something went wrong. Try again later!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Book Your Journey
              </h1>
              <p className="text-lg text-muted-foreground">
                Fill in your details and we'll create the perfect experience for you
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <Card className="lg:col-span-2 border-border/50 shadow-[var(--shadow-elegant)] animate-scale-in">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Please provide your travel information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input id="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" placeholder="Doe" required />
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
                              placeholder="john@example.com"
                              className="pl-10"
                              defaultValue={user?.email}
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
                              placeholder="+91 98765 43210"
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Travel Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Travel Details</h3>
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
                                {date ? format(date, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar 
                                mode="single" 
                                selected={date} 
                                onSelect={setDate}
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
                              placeholder="2"
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
                          placeholder="Any dietary restrictions, accessibility needs, or special preferences..."
                          rows={4}
                        />
                      </div>
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Continue to Payment"}
                    </Button>
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
                      <p className="font-semibold text-foreground">Coastal Heritage Trail</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-semibold text-foreground">5 Days / 4 Nights</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Base Price</span>
                        <span className="font-semibold">₹12,999</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Taxes & Fees</span>
                        <span className="font-semibold">₹1,300</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-xl font-bold text-primary">₹14,299</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-muted/30">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-foreground">Included</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• All accommodations</li>
                      <li>• Local transportation</li>
                      <li>• Professional guide</li>
                      <li>• Entrance fees</li>
                      <li>• Selected meals</li>
                    </ul>
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

export default Booking;