"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import API from "@/api";
import { User } from "lucide-react";
import { Mail } from "lucide-react";
import { Lock } from "lucide-react";
import { Eye, CircleCheck, ArrowRight } from "lucide-react";
import { GoOrganization } from "react-icons/go";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Microsoft from "@/assets/microsoft.svg";
import logoW from "@/assets/logo.W.png";

const FreeTrialForm = () => {
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        organization: formData.organization,
        password: formData.password,
      });

      setSuccess(res.data.message);

      const email = formData.email;

      setFormData({
        firstName: "",
        lastName: "",
        organization: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      router.push(`/authenticate/verify-mail?email=${email}`);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
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

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>
      )}

      <div className="flex min-h-full flex-1 flex-col justify-center py-6 sm:py-8 px-2 sm:px-4 lg:px-6 bg-linear-to-b from-gray-50 to-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex items-center justify-center space-x-4">
            <Image src={logoW} alt="WorkComposer" className="h-10 w-auto" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold leading-6 text-gray-900">
                Sign up for a FREE trial
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Create your account to get started
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-145">
          <div className="bg-white px-6 py-6 sm:py-8 shadow-lg sm:rounded-2xl sm:px-12 border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600"></div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>

                    <input
                      id="firstName"
                      type="text"
                      required
                      maxLength={100}
                      name="firstName"
                      placeholder="Enter your first name"
                      tabIndex={1}
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 py-1.5 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>

                    <input
                      id="lastName"
                      type="text"
                      required
                      maxLength={100}
                      name="lastName"
                      placeholder="Enter your last name"
                      tabIndex={2}
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 py-1.5 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

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
                    id="email"
                    type="email"
                    required
                    maxLength={100}
                    name="email"
                    placeholder="your.email@example.com"
                    tabIndex={3}
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-1.5 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Organization name
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <GoOrganization className="w-5 h-5 text-gray-400" />
                  </div>

                  <input
                    id="organization"
                    type="text"
                    required
                    maxLength={100}
                    name="organization"
                    placeholder="your organization name"
                    tabIndex={4}
                    value={formData.organization}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-1.5 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      tabIndex={5}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 py-1.5 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      aria-label="Toggle password visibility"
                      tabIndex={6}
                    >
                      <Eye className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password2"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm password
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CircleCheck className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="password2"
                      type="password"
                      required
                      minLength={8}
                      tabIndex={7}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 py-1.5 pl-12 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      aria-label="Toggle password visibility"
                      tabIndex={8}
                    >
                      <Eye className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                By clicking <strong>Start the free Trial </strong>, you agree to
                our{" "}
                <a
                  href="#"
                  target="_blank"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Terms and Conditions{" "}
                </a>
                and{" "}
                <a
                  href="#"
                  target="_blank"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Privacy Policy
                </a>
                .
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 disabled:opacity-70"
                  aria-live="polite"
                  tabIndex={9}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>Start the Free Trial</span>
                  </span>
                </button>
              </div>

              <div className="text-center text-xs text-gray-500">
                This site is protected by reCAPTCHA and the Google{" "}
                <a href="#" className="underline hover:text-gray-700">
                  Privacy Policy{" "}
                </a>
                and{" "}
                <a href="#" className="underline hover:text-gray-700">
                  Terms of Service{" "}
                </a>
                apply.
              </div>
            </form>

            <div className="relative mt-6">
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
              <a
                href="#"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-800 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:bg-gray-100 transition-all duration-200 shadow-sm"
                tabIndex={10}
              >
                <FcGoogle className="w-5 h-5" aria-hidden="true" />
                <span>Google</span>
              </a>

              <a
                href="#"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-800 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:bg-gray-100 transition-all duration-200 shadow-sm"
                tabIndex={11}
              >
                <Image src={Microsoft} alt="Microsoft" width={20} height={20} />
                <span>Microsoft</span>
              </a>

              <a
                href="#"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-800 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:bg-gray-100 transition-all duration-200 shadow-sm"
                tabIndex={12}
              >
                <FaApple className="w-5 h-5" aria-hidden="true" />
                <span>Apple</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center animate-fadeIn">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/authenticate/login")}
              className="font-semibold text-indigo-600 hover:text-indigo-500 inline-flex items-center group"
            >
              Sign in
              <ArrowRight className="w-3 h-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {" "}
            © 2026 WorkComposer. All rights reserved.{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default FreeTrialForm;
