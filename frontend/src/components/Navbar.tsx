import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Menu, User, LogOut, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/destinations" className="text-gray-700 hover:text-blue-600 transition-colors">
              Destinations
            </Link>
            <Link to="/packages" className="text-gray-700 hover:text-blue-600 transition-colors">
              Packages
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            
            {/* Show Booking History link for authenticated users */}
            {isAuthenticated && (
              <Link 
                to="/booking-history" 
                className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <History className="w-4 h-4" />
                My Bookings
              </Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/booking-history" className="flex items-center cursor-pointer">
                      <History className="w-4 h-4 mr-2" />
                      Booking History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="default">Login</Button>
              </Link>
            )}
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
            <Link 
              to="/" 
              className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/destinations" 
              className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded"
              onClick={() => setIsOpen(false)}
            >
              Destinations
            </Link>
            <Link 
              to="/packages" 
              className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded"
              onClick={() => setIsOpen(false)}
            >
              Packages
            </Link>
            <Link 
              to="/about" 
              className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="py-2 px-4 text-sm text-gray-500">
                  Logged in as: <span className="font-semibold text-gray-700">{user?.fullName}</span>
                </div>
                <Link 
                  to="/booking-history" 
                  className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <History className="w-4 h-4 inline mr-2" />
                  My Bookings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 px-4 text-red-600 hover:bg-red-50 rounded"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="block py-2 px-4" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;