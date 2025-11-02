import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";  // ✅ ADD THIS IMPORT
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();  // ✅ ADD THIS LINE

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = (document.getElementById("signin-email") as HTMLInputElement).value;
    const password = (document.getElementById("signin-password") as HTMLInputElement).value;

    try {
      const response = await fetch("http://localhost:5000/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Sign-in failed");
      } else {
        const data = await response.json();
        console.log("✅ Sign-in response:", data);
        
        if (!data.user.userId) {
          console.error("❌ userId is missing from response!");
          toast.error("Login error: User data incomplete");
          return;
        }
        
        // ✅ Update UserContext - THIS IS IMPORTANT!
        setUser(data.user);
        
        toast.success("Sign-in successful!");
        
        // ✅ Use navigate instead of window.location.href
        navigate("/");
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const fullName = (document.getElementById('signup-name') as HTMLInputElement).value;
      const email = (document.getElementById('signup-email') as HTMLInputElement).value;
      const password = (document.getElementById('signup-password') as HTMLInputElement).value;
      const confirmPassword = (document.getElementById('signup-confirm') as HTMLInputElement).value;

      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        setIsLoading(false);
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Signup successful! Please sign in.');
        // Switch to signin tab
        (document.querySelector('[value="signin"]') as HTMLElement)?.click();
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Network or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              THIRAI THEDAL
            </span>
          </Link>
          <p className="text-muted-foreground">Discover hidden treasures of Tamil Nadu</p>
        </div>

        <Card className="border-border/50 shadow-[var(--shadow-elegant)] animate-scale-in">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" type="text" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;