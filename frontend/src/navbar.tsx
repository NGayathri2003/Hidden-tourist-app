// File: frontend/src/components/Navbar.tsx

import * as React from "react";
import { Link } from "react-router-dom";
import { MapPin, Menu, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">Thirai Thedal</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/destinations" className="text-gray-700 hover:text-blue-600">Destinations</Link>
            <Link to="/packages" className="text-gray-700 hover:text-blue-600">Packages</Link>
            <Link to="/bookings" className="text-gray-700 hover:text-blue-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              My Bookings
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
            <Link to="/auth">
              <Button variant="default">Login</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">Home</Link>
            <Link to="/destinations" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">Destinations</Link>
            <Link to="/packages" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">Packages</Link>
            <Link to="/bookings" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              My Bookings
            </Link>
            <Link to="/about" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">About</Link>
            <Link to="/auth" className="block py-2 px-4">
              <Button variant="default" className="w-full">Login</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;