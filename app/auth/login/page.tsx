"use client";

import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState("");

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        // Redirect on success
        Cookies.set("token", result.data.token);
        router.push("/dashboard");
      } else {
        setErrorMessage(result.error || "Login failed");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}

      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-4xl text-center font-extrabold">Welcome Back!</h1>
          <p className="mt-4 text-lg text-center pb-3 border-b-2 border-solid border-[#212a35]">
            Please login to access your account and continue where you left off.
          </p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className={`w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className={`w-full ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p>
              Don&apos;t have an account?{" "}
              <a
                href="/auth/register"
                className="text-blue-600 hover:underline"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* SVG Shape at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[80px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#f1f6f9"
            d="M0,224L48,202.7C96,181,192,139,288,149.3C384,160,480,224,576,224C672,224,768,160,864,160C960,160,1056,224,1152,234.7C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
