"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const t = useTranslations("Login");
  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/books");
      }
    }
  }, [status, session, router]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const provider = formData.get("provider")?.toString();

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (result?.ok) {
        router.replace("/books");
        window.location.reload();
      } else if (result?.error) {
        switch (result.error) {
          case "CredentialsSignin":
            setErrorMessage(t("invalidCredentials"));
            break;
          default:
            setErrorMessage(t("loginFailed"));
            break;
        }
      }
    } catch (error) {
      setErrorMessage(t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google", { redirect: false });
    } catch (error) {
      setErrorMessage("An error occurred during Google login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
    <main className="flex-1 flex items-center justify-center px-4 md:px-6 bg-gray-100">
      <form
        onSubmit={handleFormSubmit}
        className="max-w-md w-full space-y-6 rounded-lg shadow-md p-7 bg-white"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              name="email"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              {/* <Link
                href="#"
                className="text-sm text-muted-foreground hover:underline"
                prefetch={false}
              >
                Forgot password?
              </Link> */}
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              name="password"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {loading ? (
            <div className="flex justify-center mt-4">
              <PulseLoader color="#3498db" />
            </div>
          ) : (
            <Button type="submit" className="w-full">
              {t("signInButton")}
            </Button>
          )}

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 transform -translate-x-1/2 -top-2 bg-white px-2 text-xs text-gray-500">
              {t("orContinueWith")}
            </span>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center h-12 w-12 mx-auto bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg focus:outline-none"
          >
            <FaGoogle className="text-2xl text-gray-600" />
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/signup"
            className="underline hover:text-primary"
            prefetch={false}
          >
            {t("signUpLink")}
          </Link>
        </p>
      </form>
    </main>
  </div>
  );
};

export default LoginPage;
