import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building, Smartphone, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/auth");
      return;
    }

    // Get booking ID from sessionStorage
    const storedBookingId = sessionStorage.getItem("currentBookingId");
    if (!storedBookingId) {
      toast.error("No booking found. Please start booking again.");
      navigate("/booking");
      return;
    }
    setBookingId(storedBookingId);
  }, [isAuthenticated, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingId) {
      toast.error("Booking information missing");
      return;
    }

    setIsProcessing(true);
    setCountdown(10);
  
    const paymentData = {
      bookingId,
      paymentMethod,
      amount: 14299,
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
  
      const result = await response.json();
      console.log("✅ Payment Response:", result);
      
      if (response.ok) {
        // Clear booking ID from sessionStorage
        sessionStorage.removeItem("currentBookingId");
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error("Payment processing failed");
      setIsProcessing(false);
      setCountdown(0);
    }
  };

  useEffect(() => {
    if (isProcessing && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isProcessing && countdown === 0) {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/booking-history");
      }, 3000);
    }
  }, [isProcessing, countdown, navigate]);

  if (!isAuthenticated || !bookingId) {
    return null;
  }

  // Show success overlay
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="w-24 h-24 text-accent animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Your booking has been confirmed
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to booking history...
          </p>
        </div>
      </div>
    );
  }

  // Show processing overlay
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="mb-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20"></div>
              <div className="absolute w-32 h-32 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <span className="absolute text-4xl font-bold text-primary">{countdown}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">Processing Payment</h2>
          <p className="text-muted-foreground">Please wait while we process your payment...</p>
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
            <div className="text-center mb-12 animate-fade-in-up">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Secure Payment
              </h1>
              <p className="text-lg text-muted-foreground">
                Complete your booking with secure payment
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Payment Form */}
              <Card className="lg:col-span-2 border-border/50 shadow-[var(--shadow-elegant)] animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-primary" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>All transactions are secure and encrypted</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="space-y-4">
                      <Label>Select Payment Method</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <span>Credit / Debit Card</span>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Smartphone className="w-5 h-5 text-primary" />
                            <span>UPI</span>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                          <RadioGroupItem value="netbanking" id="netbanking" />
                          <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Building className="w-5 h-5 text-primary" />
                            <span>Net Banking</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Card Payment Form */}
                    {paymentMethod === "card" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName">Cardholder Name *</Label>
                          <Input id="cardName" placeholder="JOHN DOE" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date *</Label>
                            <Input id="expiry" placeholder="MM/YY" maxLength={5} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="123"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Form */}
                    {paymentMethod === "upi" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                          <Label htmlFor="upiId">UPI ID *</Label>
                          <Input id="upiId" placeholder="yourname@upi" required />
                        </div>
                      </div>
                    )}

                    {/* Net Banking Form */}
                    {paymentMethod === "netbanking" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="space-y-2">
                          <Label htmlFor="bank">Select Your Bank *</Label>
                          <select
                            id="bank"
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            required
                          >
                            <option value="">Choose a bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        type="submit"
                        variant="hero"
                        size="lg"
                        className="w-full"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing Payment..." : `Pay ₹14,299`}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <Card className="border-border/50 shadow-[var(--shadow-card)]">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
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
                        <span className="text-2xl font-bold text-primary">₹14,299</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Secure Payment</h4>
                        <p className="text-sm text-muted-foreground">
                          Your payment information is encrypted and secure. We never store your card
                          details.
                        </p>
                      </div>
                    </div>
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

export default Payment;