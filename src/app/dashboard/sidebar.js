"use client";

import { useState } from "react";
import logo from "@/assets/dashboard workcomposer logo.png";
import {
  HiUsers,
  HiOutlineClipboardDocumentList,
  HiBars3,
} from "react-icons/hi2";
import { Camera, Clock3, Globe, MapPin } from "lucide-react";
import { BsBarChart } from "react-icons/bs";
import Image from "next/image";

const Sidebar = () => {
  const [active, setActive] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);

  const getClass = (name) =>
    `router-link-active router-link-exacxt-active bg-linear-to-r from-indigo-900/70 to-gray-800 shadow-md text-white border-l-3 border-indigo-500 group flex items-center gap-x-3 p-2 text-sm font-semibold -mx-3 px-3 transition-all duration-200 ease-in-out ${
      active !== name ? "bg-none text-gray-400 border-none" : ""
    }`;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-60 lg:hidden p-2 rounded-md text-gray-700 shadow-lg transition-opacity duration-200"
        >
          <HiBars3 className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-45 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
  className={`fixed lg:static inset-y-0 z-50 flex flex-col bg-gray-900 
  w-64 lg:w-64 xl:w-72
  transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0`}
>
        {/* <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-gray-900"> */}
        <div className="flex grow flex-col overflow-y-auto px-3 pb-4">
          <div className="flex h-16 shrink-0 items-center cursor-pointer px-3">
            <div className="flex items-center">
              <Image
                className="h-7 w-auto"
                src={logo}
                alt="WorkComposer"
                priority
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-3 mt-4 px-3">
            <h2 className="text-white font-semibold text-lg">Time Tracking</h2>
          </div>

          <nav className="flex flex-1 flex-col mt-2">
            <div className="space-y-1">
              <div className="relative">
                <a
                  href="overview"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive("overview");
                    setIsOpen(false);
                  }}
                  className={getClass("overview")}
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8">
                    <HiUsers className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-150 text-gray-400" />
                  </div>
                  <span className="text-sm font-bold">Overview</span>
                </a>
              </div>

              <div className="relative">
                <a
                  href="screenshots"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive("screenshots");
                    setIsOpen(false);
                  }}
                  className={getClass("screenshots")}
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8">
                    <Camera className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-150 text-gray-400" />
                  </div>
                  <span className="text-sm font-bold">Screenshots</span>
                </a>
              </div>

              <div className="relative">
                <a
                  href="attendance"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive("attendance");
                    setIsOpen(false);
                  }}
                  className={getClass("attendance")}
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8">
                    <Clock3 className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-150 text-gray-400" />
                  </div>
                  <span className="text-sm font-bold">Attendance</span>
                </a>
              </div>

              <div className="relative">
                <a
                  href="usage"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive("usage");
                    setIsOpen(false);
                  }}
                  className={getClass("usage")}
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8">
                    <Globe className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-150 text-gray-400" />
                  </div>
                  <span className="text-sm font-bold">Web & App Usage</span>
                </a>
              </div>

              <div className="relative">
                <a
                  href="productivity"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive("productivity");
                    setIsOpen(false);
                  }}
                  className={getClass("productivity")}
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8">
                    <BsBarChart className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-150 text-gray-400" />
                  </div>
                  <span className="text-sm font-bold">Productivity</span>
                </a>
              </div>

              <div className="relative">
                <a
                  href="projects"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive("projects");
                    setIsOpen(false);
                  }}
                  className={getClass("projects")}
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8">
                    <HiOutlineClipboardDocumentList className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-150 text-gray-400" />
                  </div>
                  <span className="text-sm font-bold">Project Tracking</span>
                </a>
              </div>

              <div className="relative">
                <a
                  href="location"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive("location");
                    setIsOpen(false);
                  }}
                  className={getClass("location")}
                >
                  <div className="shrink-0 flex items-center justify-center w-8 h-8">
                    <MapPin className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 duration-150 text-gray-400" />
                  </div>
                  <span className="text-sm font-bold">Location</span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
