"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert(data.error || "Password reset failed");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      alert("An error occurred during password reset");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
          className="w-full max-w-md text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 mb-8 shadow-2xl shadow-green-500/30 relative"
          >
            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            <CheckCircle className="w-12 h-12 text-white animate-pulse relative z-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg"
          >
            Check your email
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-200 text-xl font-medium leading-relaxed mb-10"
          >
            We&apos;ve sent a password reset link to {email}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="p-10 backdrop-blur-2xl bg-white/15 border-white/30 shadow-2xl relative overflow-hidden" gradientBorder>
              {/* Inner glass effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl"></div>
              <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-2xl"></div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-sm text-gray-200 mb-8 font-medium leading-relaxed relative z-10"
              >
                Didn&apos;t receive the email? Check your spam folder or try again.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setIsSuccess(false)}
                  className="rounded-2xl bg-white/10 border-white/30 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg hover:shadow-white/10 relative z-10 font-semibold"
                >
                  Try again
                </Button>
              </motion.div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-10"
          >
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
            <Mail className="w-12 h-12 text-white animate-pulse relative z-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg"
          >
            Reset your password
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-200 text-xl font-medium leading-relaxed"
          >
            Enter your email address and we&apos;ll send you a link to reset your password
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

            <form onSubmit={handleResetPassword} className="space-y-7 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Input
                  type="email"
                  label="Email address"
                  placeholder="Enter your email address"
                  iconLeft={<Mail className="w-5 h-5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/30 rounded-2xl focus:border-purple-400/80 focus:bg-white/15 transition-all duration-300 text-white placeholder:text-gray-300 backdrop-blur-sm"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
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
                      <span className="font-semibold">Sending reset link...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="font-semibold">Send reset link</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-10 text-center relative z-10"
            >
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors font-semibold hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}