"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Floating dots background component

export const SignInCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const params = useSearchParams();
  const error = params.get("error");

  const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: "/home",
    });
  };

  const onGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative grid w-full max-w-[1100px] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2"
      >
        {/* Left side - Form */}
        <div className="p-8 sm:p-12">
          <div className="mb-12">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              className="mb-8"
            />
            <h1 className="text-3xl font-bold">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-brand-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <TriangleAlert className="h-4 w-4" />
              <p>Invalid email or password</p>
            </div>
          )}

          <form onSubmit={onCredentialSignIn} className="space-y-4">
            <div>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                required
                className="h-12"
              />
            </div>
            <div>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type="password"
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="h-12 w-full text-base">
              Sign in
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={onGoogleSignIn}
            variant="outline"
            className="h-12 w-full text-base"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden lg:block">
          <Image
            src="/images/auth/sign-in.jpeg"
            alt="Sign in"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0" />
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <h2 className="text-3xl font-bold">
              Create your own AI-powered stories
            </h2>
            <p className="mt-4 text-lg">
              Join thousands of creators and start creating amazing stories
              today
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
