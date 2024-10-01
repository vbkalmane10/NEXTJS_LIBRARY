"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PulseLoader } from "react-spinners";
import { createMember } from "@/lib/MemberRepository/actions";
import { Eye, EyeOff } from "lucide-react";

interface FieldError {
  [key: string]: string;
}

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const errors: FieldError = {};

    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!password.trim()) errors.password = "Password is required";
    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!address.trim()) errors.address = "Address is required";

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.password =
        "Password must contain at least one capital letter, one number, and one special character";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      const newMember = await createMember({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
        
      });

      if (newMember !== undefined) {
        setSuccessMessage(newMember.message);
        router.push("/login");
      } else {
        setErrorMessage("Member already exists.");
      }
    } catch (error) {
      setErrorMessage("Failed to register. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-center">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {fieldErrors.firstName && (
                  <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded">
                    {fieldErrors.firstName}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {fieldErrors.lastName && (
                  <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded">
                    {fieldErrors.lastName}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded">
                  {fieldErrors.email}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded">
                  {fieldErrors.password}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {fieldErrors.address && (
                <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded">
                  {fieldErrors.address}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {fieldErrors.phoneNumber && (
                <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 border border-red-200 rounded">
                  {fieldErrors.phoneNumber}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center mt-4">
                <PulseLoader color="#3498db" />
              </div>
            ) : (
              <Button type="submit" className="w-full">
                Register
              </Button>
            )}
          </form>
          {errorMessage && (
            <div className="text-red-500 mt-2 p-2 bg-red-50 border border-red-200 rounded">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 mt-2 p-2 bg-green-50 border border-green-200 rounded">
              {successMessage}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <p className="text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;
