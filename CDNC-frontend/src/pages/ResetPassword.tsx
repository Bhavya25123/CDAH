import { PageLayout } from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { resetPassword } from "@/lib/auth";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(token || "", password);
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      setPassword("");
      navigate("/sign-in");
    } catch {
      toast({ title: "Reset failed", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <PageLayout>
      <section className="bg-purple-50 py-16 px-8">
        <div className="max-w-screen-sm mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-900">Set New Password</h1>
          <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ResetPassword;
