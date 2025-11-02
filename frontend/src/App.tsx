import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/index";
import Auth from "./pages/auth";
import Destinations from "./pages/destination";
import Packages from "./pages/packages";
import Booking from "./pages/booking";
import Payment from "./pages/payments";
import About from "./pages/about";
import BookingHistory from "./pages/booking-history";
import BookingEdit from "./pages/booking-edit";
import NotFound from "./pages/Notfound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:id" element={<Destinations />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/package/:id" element={<Packages />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/booking/edit/:id" element={<BookingEdit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;