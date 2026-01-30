"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage (in production, use httpOnly cookies)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden relative">
      {/* Enhanced animated background elements with more glass morphism */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Additional floating elements for depth */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-bounce delay-300"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-pink-400/15 rounded-full blur-md animate-ping delay-1000"></div>
      </div>

      {/* Glass morphism overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 backdrop-blur-[1px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
          scale: { duration: 0.6, delay: 0.1 }
        }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 mb-8 shadow-2xl shadow-purple-500/30 relative"
          >
            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            <Sparkles className="w-12 h-12 text-white animate-pulse relative z-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg"
          >
            Create your account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-200 text-xl font-medium leading-relaxed"
          >
            Join YourAgencyName and manage your social media
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="p-10 backdrop-blur-2xl bg-white/15 border-white/30 shadow-2xl relative overflow-hidden" gradientBorder>
            {/* Inner glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl"></div>
            <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-2xl"></div>

            <form onSubmit={handleSignUp} className="space-y-7 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Input
                  type="text"
                  label="Full name"
                  placeholder="Enter your full name"
                  iconLeft={<User className="w-5 h-5" />}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="bg-white/10 border-white/30 rounded-2xl focus:border-purple-400/80 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-gray-300 backdrop-blur-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Input
                  type="email"
                  label="Email address"
                  placeholder="Enter your email"
                  iconLeft={<Mail className="w-5 h-5" />}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="bg-white/10 border-white/30 rounded-2xl focus:border-purple-400/80 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-gray-300 backdrop-blur-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="relative"
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Create a password"
                  iconLeft={<Lock className="w-5 h-5" />}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className="bg-white/10 border-white/30 rounded-2xl focus:border-purple-400/80 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-gray-300 backdrop-blur-sm pr-12"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="relative"
              >
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm password"
                  placeholder="Confirm your password"
                  iconLeft={<Lock className="w-5 h-5" />}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  className="bg-white/10 border-white/30 rounded-2xl focus:border-purple-400/80 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-gray-300 backdrop-blur-sm pr-12"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded-lg border-gray-400 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 w-4 h-4 backdrop-blur-sm"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-200 leading-relaxed font-medium">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-300 hover:text-purple-200 transition-colors underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-300 hover:text-purple-200 transition-colors underline">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 shadow-xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-white/20"
                >
                  {/* Button inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 rounded-2xl"></div>
                  {isLoading ? (
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span className="font-semibold">Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="font-semibold">Create account</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="mt-10 text-center relative z-10"
            >
              <p className="text-sm text-gray-200 font-medium">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="text-purple-300 hover:text-purple-200 transition-colors font-bold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-10 relative z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 py-2 bg-white/10 text-gray-200 rounded-full border border-white/20 backdrop-blur-xl font-medium">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full rounded-2xl bg-white/10 border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg hover:shadow-white/10"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-semibold">Google</span>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full rounded-2xl bg-white/10 border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg hover:shadow-white/10"
                  >
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    <span className="font-semibold">Twitter</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}