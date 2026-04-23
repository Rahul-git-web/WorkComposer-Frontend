"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/api";
import Image from "next/image";
import { Mail, Lock, Eye, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Microsoft from "@/assets/microsoft.svg";
import logo from "@/assets/logo.W.png";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      router.push("/dashboard/overview");
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  return (
    <>
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-100"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end"></div>
      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center py-8 sm:py-10 px-2 sm:px-4 lg:px-6 bg-linear-to-b from-gray-50 to-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center space-x-4">
            <Image src={logo} alt="WorkComposer" width={120} />
            <div className="flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900">
                Welcome back
              </h2>
              <p className="text-base text-gray-600 mt-0.5">
                Sign in to your account to continue
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-120">
          <div className="bg-white px-6 py-8 sm:py-10 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600"></div>

            {verified && (
              <p className="text-green-600 text-center mb-4">
                Email verified successfully ✅
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    placeholder="your.email@example.com"
                    required
                    aria-describedby="email-description"
                    tabIndex={1}
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-2 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                  />
                  <div id="email-description" className="sr-only">
                    Enter your email address to sign in
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <button
                      onClick={() =>
                        router.push("/authenticate/forgot-password")
                      }
                      className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                    aria-describedby="password-description"
                    tabIndex={2}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-2 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Toggle password visibility"
                    tabIndex={3}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <div id="password-description" className="sr-only">
                    Enter your password to sign in
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 disabled:opacity-70"
                  aria-live="polite"
                  tabIndex={10}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Sign in</span>
                  </span>
                </button>
              </div>
            </form>

            <div className="relative mt-8">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200"></div>
              </div>

              <div className="relative flex justify-center text-sm font-medium">
                <span className="bg-white px-6 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => router.push("/authenticate/signup")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-800 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:bg-gray-100 transition-all duration-200 shadow-sm"
                tabIndex={11}
              >
                <FcGoogle className="w-5 h-5" aria-hidden="true" />
                <span>Google</span>
              </button>

              <button
                onClick={() => router.push("/authenticate/signup")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-800 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:bg-gray-100 transition-all duration-200 shadow-sm"
                tabIndex={12}
              >
                <Image src={Microsoft} alt="Microsoft" width={20} />
                <span>Microsoft</span>
              </button>

              <button
                onClick={() => router.push("/authenticate/signup")}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-800 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:bg-gray-100 transition-all duration-200 shadow-sm"
                tabIndex={13}
              >
                <FaApple className="w-5 h-5" aria-hidden="true" />
                <span>Apple</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center animate-fadeIn">
          <p className="text-sm text-gray-600">
            Not a member yet?{" "}
            <button
              onClick={() => router.push("/authenticate/signup")}
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200 inline-flex items-center group"
            >
              {" "}
              Start a 7 day trial
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {" "}
            © 2026 WorkComposer. All rights reserved.{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
