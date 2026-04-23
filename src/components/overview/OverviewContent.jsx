import Image from "next/image";
import logo from "@/assets/logo.W.png";
import { IoIosPause } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { Clock3 } from "lucide-react";
import { useTimer } from "@/context/TimerContext";

export default function OverviewContent({ data = [] }) {
  const { isTracking } = useTimer();

  return (
    <div className="min-h-[calc(100vh-250)] rounded-b-lg bg-white shadow-sm border border-r border-b border-gray-200">
      <div className="divide-y divide-gray-200 overflow-hidden bg-white">
        {/* Header */}
        <div className="px-3 py-2 sm:px-5 bg-white shadow-sm border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-800">Overview</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-2 py-4 sm:px-4">
          {/* EMPTY STATE */}
          {data.length === 0 ? (
            <div className="text-center my-8 py-6 px-4 bg-gray-50 rounded-lg border border-gray-100">
              <Clock3 className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <h4 className="text-gray-600 font-medium mb-1">
                No tracking data available
              </h4>
              <p className="text-gray-400 text-sm">
                Tracking information will be displayed here once activity is
                recorded.
              </p>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="p-4 mb-6 relative border-b border-gray-100"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center rounded-lg p-2 -m-2">
                  {/* Avatar */}
                  <div className="relative shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
                    <div className="profile-image-container group relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full p-0.5 bg-linear-to-tr from-red-300 to-red-600 opacity-80">
                        <div className="absolute inset-px rounded-full bg-white"></div>
                      </div>

                      <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={logo}
                          alt="Arena Z"
                          className="h-full w-full cursor-pointer rounded-full object-cover shadow-md transition-all duration-300 group-hover:shadow-lg"
                        />
                        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-5 transition-all duration-300 cursor-pointer"></div>
                      </div>

                      {item.status?.includes("running") && (
                        <>
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-300 opacity-50 animate-ping delay-200"></span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0 w-full md:w-1/2">
                    <h3 className="text-blue-700 font-bold text-lg cursor-pointer hover:text-blue-800 transition-colors truncate max-w-xs">
                      {item.name}
                    </h3>

                    <div className="mt-1 text-sm font-medium flex items-center flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md">
                        <b
                          className={`${
                            item.status?.includes("running")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.status || "Tracking stopped"}
                        </b>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-700">
                        <b>Last sync: </b>
                        <span className="text-gray-600">
                          {item.lastSync || "--"}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Work + Break */}
                  <div className="flex flex-row items-start gap-3 text-sm w-full md:w-1/2">
                    {/* Work Time */}
                    <div className="flex items-center p-3 rounded-md w-1/2">
                      <div className="w-full">
                        <div className="flex items-center mb-1">
                          <Clock3 className="w-5 h-5 mr-2 text-indigo-600" />
                          <div className="text-sm font-medium text-gray-700 uppercase">
                            Work Time
                          </div>
                        </div>

                        <div className="text-blue-600 font-bold text-xl ml-7">
                          {item.workTime || "0h 0m"}
                        </div>
                      </div>
                    </div>

                    {/* Break Time */}
                    <div className="flex items-center p-3 rounded-md w-1/2">
                      <div className="w-full">
                        <div className="flex items-center mb-1">
                          <IoIosPause className="w-5 h-5 mr-2 text-orange-500" />
                          <div className="text-sm font-medium text-gray-700 uppercase">
                            Break Time
                          </div>
                        </div>

                        <div className="text-orange-600 font-bold text-xl ml-7">
                          {item.breakTime || "0h 0m"}
                        </div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <div className="w-[200px] mt-4 flex justify-center">
                      <button
                        className="inline-flex items-center px-3 py-2 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer"
                        title="Manage time"
                      >
                        <FaRegEdit className="w-5 h-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-indigo-600">
                          Edit time
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
