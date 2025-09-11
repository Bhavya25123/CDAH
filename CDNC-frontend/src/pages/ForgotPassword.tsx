import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/lib/auth";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      toast({
        title: "Password reset",
        description: "If that email exists, a reset link has been sent.",
      });
      setEmail("");
    } catch {
      toast({
        title: "Request failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageLayout>
      <section className="bg-purple-50 py-16 px-8">
        <div className="max-w-screen-sm mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-900">Reset Password</h1>
          <p className="text-lg text-gray-600 mb-8">Enter your email to receive a reset link.</p>
          <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Send Reset Link
              </Button>
            </form>
            <p className="text-sm text-center mt-4">
              Remembered?{' '}
              <Link to="/sign-in" className="text-purple-600 font-medium">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ForgotPassword;
