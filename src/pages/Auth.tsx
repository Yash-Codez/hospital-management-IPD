import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("nurse");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="flex h-screen items-center justify-center"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
    } else {
      const { error } = await signUp(email, password, fullName, role);
      if (error) toast.error(error.message);
      else toast.success("Account created! Check your email to confirm.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
            <Activity className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">IPD Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Hospital In-Patient Department System</p>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription>{isLogin ? "Enter your credentials to continue" : "Register a new staff account"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Dr. Jane Smith" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="staff@hospital.com" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-primary hover:underline">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
