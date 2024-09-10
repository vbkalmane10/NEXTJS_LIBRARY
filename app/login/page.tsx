"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PulseLoader } from "react-spinners";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      if (session!.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/books");
      }
    }
  }, [status, session, router]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        router.push("/books");
      } else if (result?.error) {
        switch (result.error) {
          case "CredentialsSignin":
            setErrorMessage("Invalid email or password. Please try again.");
            break;
          default:
            setErrorMessage("Login failed. Please check your credentials.");
            break;
        }
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  const handleOAuthLogin = async (provider: string) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn(provider, { redirect: false });

      if (result?.ok) {
        router.push("/books");
      } else {
        setErrorMessage("OAuth login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("OAuth login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-black">BookSphere</div>
        <nav className="hidden md:flex gap-4">
          {/* <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/books" className="hover:text-blue-500">
            Books
          </Link> */}
          <Link href="/login" className="hover:text-blue-500">
            Login
          </Link>
          <Link href="/register" className="hover:text-blue-500">
            Register
          </Link>
        </nav>
        <button
          className="md:hidden text-blue-500"
          onClick={() => setIsNavOpen(!isNavOpen)}
        ></button>
        {isNavOpen && (
          <nav className="absolute right-6 top-16 bg-white shadow-lg p-4 rounded-md flex flex-col gap-2 md:hidden">
            <Link href="/" className="hover:text-blue-500">
              Home
            </Link>
            <Link href="/books" className="hover:text-blue-500">
              Books
            </Link>
            <Link href="/login" className="hover:text-blue-500">
              Login
            </Link>
            <Link href="/signup" className="hover:text-blue-500">
              Register
            </Link>
          </nav>
        )}
      </header>
      <main className="flex-1 flex items-center justify-center px-4 md:px-6 bg-gray-100">
        <form className="max-w-md w-full space-y-6 rounded-lg shadow-md p-7 bg-white" onSubmit={handleLogin}>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">
              Enter your email and password to access your account.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:underline"
                  prefetch={false}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <div className="space-y-2">
                <p className="text-red-500 text-sm">{errorMessage}</p>
              </div>
            )}
            {loading ? (
              <div className="flex justify-center mt-4">
                <PulseLoader color="#3498db" />
              </div>
            ) : (
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            )}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Don't have a account ? {""}
            <Link
              href="/signup"
              className="underline hover:text-primary"
              prefetch={false}
            >
              Sign up
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;
