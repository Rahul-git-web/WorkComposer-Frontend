"use client";

import Image from 'next/image';
import { Download, Camera } from 'lucide-react';
import ScreenshotModal from './ScreenshotModal';
import { useEffect, useState } from 'react';
import API from '@/api';
import ScreenshotDetailsModal from './ScreenshotDetailsModal';

type Props = {
  screenshots: any[];
  selectedUsers: any[];
  sortBy: string;
  order: string;
};

export default function ScreenshotsCard({
  screenshots,
  selectedUsers,
  sortBy,
  order,
}: Props) {

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedShot, setSelectedShot] = useState<any>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);


  const [search, setSearch] = useState("");

  const [view, setView] = useState("gallery")

  const [captureFilter, setCaptureFilter] = useState<"captured" | "uncaptured">("captured")

  const groupedScreenshots = screenshots.reduce(
    (acc: any, shot: any) => {
      const email = shot.user?.email || "Unknown User";

      if (!acc[email]) {
        acc[email] = [];
      }

      acc[email].push(shot);

      return acc;
    },
    {}
  );


  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesTeam =
      selectedTeams.length === 0 ||
      selectedTeams.includes(
        user.team || "Default team"
      );

    const matchesSelectedUsers =
      selectedUsers.length === 0 ||
      selectedUsers.some(
        (u) => u.email === user.email
      );

    return matchesSearch && matchesTeam && matchesSelectedUsers;
  });

  const usersWithScreenshots = filteredUsers.map(
    (user: any) => ({
      ...user,
      screenshots: groupedScreenshots[user.email] || [],
    })
  )


  const sortedUsers = [...usersWithScreenshots].sort(
    (a: any, b: any) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      }

      if (sortBy === "team") {
        comparison = (a.team || "").localeCompare(
          b.team || ""
        );
      }

      return order === "asc"
        ? comparison
        : -comparison;
    }
  );

  const finalUsers = sortedUsers.filter(
    (user: any) => {
      if (captureFilter === "captured") {
        return user.screenshots.length > 0;
      }

      return user.screenshots.length === 0;
    }
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");

      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const teams = [
    ...new Set(
      users.map(
        (user: any) =>
          user.team || "Default team"
      )
    ),
  ];

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/screenshots/export-zip",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "screenshots.zip";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const getActivityColor = (score: number) => {
    if (score < 40) return "#EF4444";
    if (score < 70) return "#F59E0B";
    return "#22C55E";
  };


  return (
    <div className="bg-white border border-gray-200 border-t-0 rounded-b-md">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* Left */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search users..."
              className="w-[260px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                title='Gallery view'
                onClick={() => setView("gallery")}
                className={`px-4 py-2 text-sm ${view === "gallery"
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-gray-50"
                  }`}
              >
                Gallery View
              </button>

              <button
                title='Timeline view'
                onClick={() => setView("timeline")}
                className={`px-4 py-2 text-sm ${view === "timeline"
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-gray-50"
                  }`}
              >
                Timeline View
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">
                Showing Screenshots:
              </span>

              <button
                title='Captured'
                onClick={() => setCaptureFilter("captured")}
                className={`px-3 py-1 rounded-full text-xs font-medium ${captureFilter === "captured"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
                  }`}
              >
                Captured
              </button>

              <button
                title='Uncaptured'
                onClick={() => setCaptureFilter("uncaptured")}
                className={`px-3 py-1 rounded-full text-xs font-medium ${captureFilter === "uncaptured"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
                  }`}
              >
                Uncaptured
              </button>
            </div>

            <div className="text-sm font-medium text-gray-600">
              Users: {finalUsers.length}
            </div>

            <button
              title='Export'
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
              <Download className="w-4 h-4" />
              Export
            </button>

          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4 pl-5 mb-1 mt-1">
        <h2 className="text-xl font-bold text-gray-800">
          Screenshots
        </h2>
      </div>

      {/* Cards */}
      {view === "gallery" ? (
        <div className="p-6">
          {finalUsers.length === 0 ? (
            <div className="min-h-[260px] flex flex-col items-center justify-center text-gray-400">
              <svg
                width="80"
                height="80"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 opacity-50"
              >
                <rect
                  x="8"
                  y="14"
                  width="48"
                  height="36"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <path
                  d="M20 14L24 9H40L44 14"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx="32"
                  cy="31"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <circle
                  cx="32"
                  cy="31"
                  r="3"
                  fill="currentColor"
                />

                <path
                  d="M20 50H44"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <p className="text-sm font-medium text-gray-500">
                {captureFilter === "captured"
                  ? "No screenshots captured"
                  : "All users have captured screenshots"}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {captureFilter === "captured"
                  ? "No users have captured screenshots for this day."
                  : "There are no uncaptured users for this day."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {finalUsers.map((user: any) => {
                const email = user.email;
                const userShots = user.screenshots;


                const latestShot =
                  userShots.length > 0
                    ? [...userShots].sort(
                      (a, b) =>
                        new Date(b.capturedAt).getTime() -
                        new Date(a.capturedAt).getTime()
                    )[0]
                    : null;

                return (
                  <div
                    key={email}
                    className="min-h-[330px] bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden"
                  >
                    {/* User Header */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                      {user.avatar?.trim() ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                          {user.firstName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}

                      <h3 className="text-[17px] font-bold text-indigo-700 truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                    </div>

                    {/* Screenshot Area */}
                    <div className="h-[140px] bg-gray-100 overflow-hidden relative">
                      {latestShot?.imageUrl ? (
                        <Image
                          src={latestShot.imageUrl}
                          alt="Screenshot"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                          <Camera className="w-6 h-6 opacity-40" />
                          <span className="text-xs">No Screenshot</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-3 py-3">
                      <div className="flex items-center justify-between text-[15px] mb-2">
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <span>🕒</span>

                          <span>
                            {latestShot
                              ? new Date(latestShot.capturedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "--"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {latestShot && (
                            <div className="flex gap-[2px]">
                              {[1, 2, 3, 4, 5, 6, 7].map((dot) => (
                                <div
                                  key={dot}
                                  className="w-1 h-1.5 rounded-full"
                                  style={{
                                    backgroundColor: getActivityColor(
                                      latestShot?.activityScore || 0
                                    ),
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          <span
                            className="font-medium"
                            style={{
                              color: getActivityColor(
                                latestShot?.activityScore || 0
                              ),
                            }}
                          >
                            {latestShot
                              ? `${latestShot.activityScore || 0}%`
                              : "--"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-semibold">
                          {userShots.length > 0
                            ? `${userShots.length} Screenshot${userShots.length > 1 ? "s" : ""}`
                            : "No Screenshots"}
                        </span>

                        <button
                          title='See all'
                          disabled={!userShots.length}
                          onClick={() => {
                            setSelectedUser({
                              email,
                              firstName: user.firstName,
                              lastName: user.lastName,
                              avatar: user.avatar,
                              screenshots: userShots,
                            });
                            setShowModal(true);
                          }}
                          className={`text-xs px-2 py-1 rounded-md ${userShots.length
                            ? "bg-blue-200 text-indigo-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          See all
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6">
          <div className="space-y-6">
            {finalUsers.map((user: any) => {
              const userShots = [...user.screenshots].sort(
                (a, b) =>
                  new Date(b.capturedAt).getTime() -
                  new Date(a.capturedAt).getTime()
              );

              if (
                captureFilter === "uncaptured" &&
                userShots.length === 0
              ) {
                return (
                  <div key={user.email}>
                    <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                      {user.firstName} {user.lastName}
                    </h3>

                    <div className="border rounded-lg p-4 bg-gray-50 text-gray-500">
                      No screenshots captured
                    </div>
                  </div>
                );
              }

              return (
                <div key={user.email}>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                    {user.firstName} {user.lastName}
                  </h3>

                  <div className="space-y-2">
                    {userShots.map((shot: any) => (
                      <div
                        key={shot._id}
                        onClick={() => {
                          setSelectedShot(shot);
                        }}
                        className="flex items-center justify-between px-4 py-3 border rounded-lg bg-gray-50 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 relative rounded overflow-hidden bg-gray-200">
                            {shot.imageUrl && (
                              <Image
                                src={shot.imageUrl}
                                alt="Screenshot"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )}
                          </div>

                          <div>
                            <p className="font-medium">
                              {shot.appName || "Unknown App"}
                            </p>

                            <p className="text-xs text-gray-500">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>

                        <span className="text-sm text-gray-600">
                          {new Date(
                            shot.capturedAt
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )
      }

      {
        showModal && selectedUser && (
          <ScreenshotModal
            user={selectedUser}
            onClose={() =>
              setShowModal(false)
            }
          />
        )
      }

      {selectedShot && (
        <ScreenshotDetailsModal
          screenshot={selectedShot}
          currentIndex={0}
          total={1}
          onPrevious={() => { }}
          onNext={() => { }}
          onClose={() =>
            setSelectedShot(null)
          }
        />
      )}
    </div >
  );
}