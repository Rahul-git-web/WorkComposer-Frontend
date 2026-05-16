"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import API from "@/api";
import logo from "@/assets/dashboard workcomposer logo.png";
import {
  HiUsers,
  HiOutlineClipboardDocumentList,
  HiBars3,
} from "react-icons/hi2";
import {
  Camera,
  Clock3,
  Globe,
  MapPin,
  Plus,
  EllipsisVertical,
  Pencil,
} from "lucide-react";
import { BsBarChart } from "react-icons/bs";
import { HiMiniUsers } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi2";
import Image from "next/image";
import CreateTeamModal from "./user-management/CreateTeamModal";
import DeleteTeamModal from "./user-management/DeleteTeamModal";
import EditTeamModal from "./user-management/EditTeamModal";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openTeamMenu, setOpenTeamMenu] = useState<string | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const searchParams = useSearchParams();

  const activeTeam = searchParams.get("team") || "All Teams";

  console.log(selectedTeam);

  const router = useRouter();

  const isUserManagement = pathname.startsWith("/dashboard/user-management");
  const isTimeTracking =
    pathname.startsWith("/dashboard/time-tracking") ||
    pathname === "/dashboard";
  //  removed active state
  // const [active, setActive] = useState("overview");

  const getClass = (path: string) =>
    `router-link-active router-link-exact-active bg-linear-to-r from-indigo-900/70 to-gray-800 shadow-md text-white border-l-3 border-indigo-500 group flex items-center gap-x-3 p-2 text-sm font-semibold -mx-3 px-3 transition-all duration-200 ease-in-out ${pathname !== path ? "bg-none text-gray-400 border-none" : ""
    }`;

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");

      setTeams(res.data || []);
    } catch (err) {
      console.log(err);

      setTeams([]);
    }
  };

  useEffect(() => {
    if (isUserManagement) {
      fetchTeams();
    }
  }, [isUserManagement]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenTeamMenu(null);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [])

  const handleDeleteTeam = async (id: string) => {
    try {
      await API.delete(`/teams/${id}`);

      fetchTeams();

      setOpenTeamMenu(null);
    } catch (err) {
      console.log(err)
    }
  };

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
        className={`fixed lg:static inset-y-0 z-30 flex flex-col bg-gray-900 
        w-64 lg:w-64 xl:w-72
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
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
            <h2 className="text-white font-semibold text-lg">
              {isUserManagement ? "User Management" : "Time Tracking"}
            </h2>
          </div>

          <nav className="flex flex-1 flex-col mt-2">
            <div className="space-y-1">
              {/* Time Tracking  */}
              {isTimeTracking && (
                <>
                  <a
                    href="/dashboard/time-tracking/overview"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      router.push("/dashboard/time-tracking/overview");
                    }}
                    className={getClass("/dashboard/time-tracking/overview")}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8">
                      <HiUsers className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold">Overview</span>
                  </a>

                  {/* Screenshots */}
                  <a
                    href="/dashboard/time-tracking/screenshots"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      router.push("/dashboard/time-tracking/screenshots");
                    }}
                    className={getClass("/dashboard/time-tracking/screenshots")}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8">
                      <Camera className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold">Screenshots</span>
                  </a>

                  {/* Attendance */}
                  <a
                    href="/dashboard/time-tracking/attendance"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      router.push("/dashboard/time-tracking/attendance");
                    }}
                    className={getClass("/dashboard/time-tracking/attendance")}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8">
                      <Clock3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold">Attendance</span>
                  </a>

                  {/* Usage */}
                  <a
                    href="/dashboard/time-tracking/usage"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      router.push("/dashboard/time-tracking/usage");
                    }}
                    className={getClass("/dashboard/time-tracking/usage")}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold">Web & App Usage</span>
                  </a>

                  {/* Productivity */}
                  <a
                    href="/dashboard/time-tracking/productivity"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      router.push("/dashboard/time-tracking/productivity");
                    }}
                    className={getClass(
                      "/dashboard/time-tracking/productivity",
                    )}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8">
                      <BsBarChart className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold">Productivity</span>
                  </a>

                  {/* Projects */}
                  <a
                    href="/dashboard/time-tracking/projects"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      router.push("/dashboard/time-tracking/projects");
                    }}
                    className={getClass("/dashboard/time-tracking/projects")}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8">
                      <HiOutlineClipboardDocumentList className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold">Project Tracking</span>
                  </a>

                  {/* Location */}
                  <a
                    href="/dashboard/time-tracking/location"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      router.push("/dashboard/time-tracking/location");
                    }}
                    className={getClass("/dashboard/time-tracking/location")}
                  >
                    <div className="shrink-0 flex items-center justify-center w-8 h-8">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold">Location</span>
                  </a>
                </>
              )}

              {/* USER - MANAGEMENT  */}

              {isUserManagement && (
                <>
                  <div className="flex items-center justify-between *:mb-3 mt-2 px-6">
                    <h2 className="text-white font-semibold text-lg">Teams</h2>
                    <button
                      onClick={() => setShowTeamModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create</span>
                    </button>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="shrink-0 border-b border-gray-700">
                      <li
                        onClick={() => {
                          router.push("/dashboard/user-management");
                        }}
                        className={`flex items-center py-2 cursor-pointer transition-all duration-200 ease-in-out px-3 ${activeTeam === "All Teams"
                            ? "bg-gradient-to-r from-indigo-900/70 to-gray-800 text-white border-l-3 border-indigo-500"
                            : "text-gray-300 hover:bg-gray-800/50"
                          }`}>
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                          <HiMiniUsers className="h-5 w-5 shrink-0 text-indigo-300" />
                        </div>
                        <span className="ml-2 truncate text-sm font-semibold">
                          - All Teams -
                        </span>
                      </li>
                    </div>

                    <ul className="divide-y divide-gray-700 ">
                      <li onClick={() => {
                        router.push("/dashboard/user-management?team=Default%20team");
                      }}
                        className={`relative flex items-center justify-between py-2 cursor-pointer transition-all duration-200 ease-in-out px-3 text-gray-300 hover:bg-gray-800/50 ${activeTeam === "Default team"
                          ? "bg-gradient-to-r from-indigo-900/70 to-gray-800 text-white border-l-3 border-indigo-500" : "text-gray-300"
                          }`}>
                        <div className="flex items-center gap-x-2">
                          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                            <HiMiniUsers className="h-5 w-5 shrink-0 text-indigo-300" />
                          </div>
                          <span className="truncate text-sm font-bold">
                            Default team
                          </span>
                        </div>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenTeamMenu(openTeamMenu === "default" ? null : "default")
                            }}
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            className="cursor-pointer p-1 hover:bg-gray-700 rounded-md"
                          >
                            <EllipsisVertical className="h-5 w-5 text-gray-400 hover:text-white" />
                          </button>
                          {openTeamMenu === "default" && (
                            <div
                              role="menu"
                              className="absolute right-0 mt-1 w-32 origin-top-right bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-20"
                            >
                              <button
                                onClick={() => {
                                  setEditingTeam({
                                    _id: "default",
                                    name: "Default team",
                                  });
                                  setShowEditModal(true);
                                  setOpenTeamMenu(null);
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-600 hover:rounded-2xl"
                                role="menuitem"
                              >
                                <Pencil className="h-5 w-5 mr-2" />
                                Edit
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedTeam({
                                    _id: "default",
                                    name: "Default team"
                                  });
                                  setShowDeleteModal(true);
                                  setOpenTeamMenu(null);
                                }
                                }
                                className="flex items-center w-full px-3 py-2 text-sm font-semibold text-red-400 cursor-pointer hover:bg-gray-600 hover:rounded-2xl"
                                role="menuitem"
                              >
                                <HiOutlineTrash className="h-5 w-5 mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </li>

                      {Array.isArray(teams) &&
                        teams.map((team: any) => (
                          <li
                            key={team._id}
                            onClick={() => {
                              router.push(`/dashboard/user-management?team=${encodeURIComponent(team.name)}`);
                            }}
                            className={`relative flex items-center justify-between py-2 cursor-pointer transition-all duration-200 ease-in-out px-3 text-gray-300 hover:bg-gray-800/50 ${activeTeam === team.name ?
                              "bg-gradient-to-r from-indigo-900/70 to-gray-800 text-white border-l-3 border-indigo-500" : "text-gray-300"
                              }`}
                          >
                            <div className="flex items-center gap-x-2">
                              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8">
                                <HiMiniUsers className="h-5 w-5 shrink-0 text-indigo-300" />
                              </div>

                              <span className="truncate text-sm font-bold">
                                {team.name}
                              </span>
                            </div>

                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();

                                  setOpenTeamMenu(
                                    openTeamMenu === team._id ? null : team._id
                                  )
                                }}
                                type="button"
                                className="cursor-pointer p-1 hover:bg-gray-700 rounded-md"
                              >
                                <EllipsisVertical className="h-5 w-5 text-gray-400 hover:text-white" />
                              </button>

                              {openTeamMenu === team._id && (
                                <div
                                  role="menu"
                                  className="absolute right-0 mt-1 w-32 origin-top-right bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-20"
                                >
                                  <button
                                    onClick={() => {
                                      setEditingTeam(team);
                                      setShowEditModal(true);
                                      setOpenTeamMenu(null);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-sm font-semibold text-gray-300 cursor-pointer hover:bg-gray-600 hover:rounded-2xl"
                                    role="menuitem"
                                  >
                                    <Pencil className="h-5 w-5 mr-2" />
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedTeam(team);
                                      setShowDeleteModal(true);
                                      setOpenTeamMenu(null);
                                    }}
                                    className="flex items-center w-full px-3 py-2 text-sm font-semibold text-red-400 cursor-pointer hover:bg-gray-600 hover:rounded-2xl"
                                    role="menuitem"
                                  >
                                    <HiOutlineTrash className="h-5 w-5 mr-2" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}


                    </ul>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {showTeamModal && (
        <CreateTeamModal
          setShowTeamModal={setShowTeamModal}
          fetchTeams={fetchTeams}
          editingTeam={editingTeam}
          setEditingTeam={setEditingTeam}
        />
      )}

      {showDeleteModal && (
        <DeleteTeamModal
          selectedTeam={selectedTeam}

          setShowDeleteModal={setShowDeleteModal}
          fetchTeams={fetchTeams}
        />
      )}

      {showEditModal && (
        <EditTeamModal
          editingTeam={editingTeam}

          setShowEditModal={setShowEditModal}
          fetchTeams={fetchTeams}
        />
      )}
    </>
  );
};

export default Sidebar;
