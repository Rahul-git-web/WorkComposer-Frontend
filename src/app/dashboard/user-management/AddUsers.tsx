"use client"

import { useState, useEffect } from 'react';
import API from "@/api";
import { AxiosError } from 'axios';
import { X, Check, Plus } from 'lucide-react';
import { TbSelector } from "react-icons/tb";
import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import BulkInvites from './BulkInvites';

const AddUsers = ({ setShowAddModal, setUsers }: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "User",
    team: "Default team",
    sendInvite: true,
  });
  const [teamOpen, setTeamOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [showBulkInvite, setShowBulkInvite] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);


  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email)) {
        alert("Please enter valid email");
        return;
      }

      await API.post("/users/invite", {
        email: formData.email.trim(),
        role: formData.role.toLowerCase(),
        team: formData.team,
      });

      const updatedUsers = await API.get("/users/all-users");

      setUsers(updatedUsers.data);

      alert("Invite sent successfully");
      setTimeout(() => {
        setShowAddModal(false);
      }, 500);

      setFormData({
        email: "",
        role: "User",
        team: "Default team",
        sendInvite: true,
      });


    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      alert(error?.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown")) {
        setRoleOpen(false);
        setTeamOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAddModal(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {

      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    }
  }, [setShowAddModal])

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data || []);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);



  return (
    <>
      <div role="dialog" className="relative z-50" aria-modal='true'>
        <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"></div>
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full w-full max-w-5xl p-8">

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900"> Add users to track their productivity </h2>
                <button onClick={() =>
                  setShowAddModal(false)}
                  type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" title="Close">
                  <X className='h-6 w-6' />

                </button>
              </div>

              <div className='border-t border-gray-200 my-5'></div>
              <form onSubmit={handleInviteUser}
                className='space-y-4'>
                <div className='p-4 rounded-lg bg-gray-50 border border-gray-100 mb-4 transition-all duration-200 hover:shadow-md'>

                  <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>

                    <div className='md:col-span-2'>
                      <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                      <input id='email' required type='email'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                        className='block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm' placeholder='Email'>
                      </input>
                    </div>

                    <div className='md:col-span-2 relative dropdown'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Team</label>
                      <button onClick={() => {
                        setTeamOpen(!teamOpen);
                        setRoleOpen(false);
                      }}
                        type='button' aria-haspopup='listbox' aria-expanded={teamOpen} className='relative w-full cursor-default rounded-md border-0 py-2 px-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'>
                        <span className='block truncate'>{formData.team}</span>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                          <TbSelector className='h-4 w-4 text-gray-400' />
                        </span>
                      </button>

                      {teamOpen && (
                        <ul
                          aria-orientation='vertical'
                          role='listbox'
                          className='absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 sm:text-sm'
                        >
                          {["Default team", ...teams.map((t) => t.name)].map((team) => (
                            <li
                              key={team}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  team,
                                });

                                setTeamOpen(false);
                              }}
                              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${formData.team === team
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                              <span
                                className={`block truncate ${formData.team === team
                                  ? "font-medium"
                                  : "font-normal"
                                  }`}
                              >
                                {team}
                              </span>

                              {formData.team === team && (
                                <span className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <Check className='h-5 w-5' />
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Role</label>
                    <div className='relative w-full dropdown'>
                      <button onClick={() => {
                        setRoleOpen(!roleOpen);
                        setTeamOpen(false);
                      }}
                        type='button' aria-haspopup='listbox' aria-expanded={roleOpen} className='relative w-full cursor-default rounded-md border-0 py-2 px-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'>
                        <span className='block truncate'>{formData.role}</span>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                          <TbSelector className='h-4 w-4 text-gray-400' />
                        </span>
                      </button>

                      {roleOpen && (
                        <ul
                          aria-orientation='vertical'
                          role='listbox'
                          className='absolute z-10 mt-1 w-full rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 sm:text-sm'
                        >

                          {["User", "Manager", "Admin"].map((role) => (
                            <li
                              key={role}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  role,
                                });

                                setRoleOpen(false);
                              }}
                              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 ${formData.role === role
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                              <span
                                className={`block truncate ${formData.role === role
                                  ? "font-medium"
                                  : "font-normal"
                                  }`}
                              >
                                {role}
                              </span>

                              {formData.role === role && (
                                <span className='absolute inset-y-0 right-0 flex items-center pr-4'>
                                  <Check className='h-5 w-5' />
                                </span>
                              )}
                            </li>
                          ))}

                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100'>
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div className='flex items-center gap-3'>
                      <div className='relative flex items-start'>
                        <div className='flex h-6 items-center'>
                          <input id='send-invite-email' name='send-invite-email' type='checkbox'
                            checked={formData.sendInvite}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sendInvite: e.target.checked,
                              })
                            }
                            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600' />
                        </div>
                        <div className='ml-3 text-sm leading-6'>
                          <label htmlFor='send-invite-email' className='font-medium text-gray-900'>
                            Send invite email to users
                          </label>
                        </div>
                      </div>
                    </div>

                    <button type='button' className='inline-flex items-center justify-center rounded-md bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                      <Plus className='h-5 w-5 mr-1' />
                      Add Another User
                    </button>
                  </div>
                </div>

                <div className='mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-y-0 gap-4'>
                  <button
                    type='button'
                    onClick={() =>
                      setShowBulkInvite(true)
                    }
                    className='inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-medium text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-300 hover:bg-indigo-50'>
                    <HiMiniDocumentDuplicate className='h-5 w-5 mr-2' />
                    Bulk Invite Users
                  </button>

                  <div className='flex flex-col-reverse sm:flex-row gap-3'>
                    <button
                      type='button'
                      onClick={() => setShowAddModal(false)}
                      className='rounded-md bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'>Cancel</button>
                    <button
                      type='submit'
                      disabled={loading}
                      className={`rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors duration-200 ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"}`}>{loading ? "Sending..." : "Send Invitations"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div >
      </div >

      {showBulkInvite && (
        <BulkInvites
          setShowBulkInvite={setShowBulkInvite}
          setUsers={setUsers}
        />
      )}
    </>
  )
}

export default AddUsers;