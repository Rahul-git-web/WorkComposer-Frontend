"use client";

import API from "@/api";
import { TbSelector } from "react-icons/tb";
import { Check } from 'lucide-react';
import Image from "next/image";
import logo from "@/assets/dashboard workcomposer logo.png";
import { useEffect, useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";

const TaskDetails = ({
    setShowTaskModal,
    selectedTask,
    fetchTasks,
}: {
    setShowTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedTask: any;
    fetchTasks: () => Promise<void>;
}) => {

    const [users, setUsers] = useState<any[]>([]);
    const [showPriority, setShowPriority] = useState(false);
    const [showStatus, setShowStatus] = useState(false);
    const [showAssignee, setShowAssignee] = useState(false);

    const [priority, setPriority] = useState(selectedTask?.priority
        ? selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)
        : "Low"
    );

    const [status, setStatus] = useState(selectedTask?.status === "todo"
        ? "ToDo"
        : selectedTask?.status === "in-progress"
            ? "In Progress"
            : selectedTask?.status === "completed"
                ? "Done"
                : "ToDo"
    );

    const [assignee, setAssignee] = useState(selectedTask?.assignedTo
        ? `${selectedTask.assignedTo.firstName} ${selectedTask.assignedTo.lastName}`
        : ""
    );

    const [title, setTitle] = useState(selectedTask?.title || "");

    const [description, setDescription] = useState(selectedTask?.description || "");

    const [dueDate, setDueDate] = useState(selectedTask?.dueDate
        ? selectedTask.dueDate.split("T")[0]
        : ""
    );

    const [assigneeId, setAssigneeId] = useState(selectedTask?.assignedTo?._id || "");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const resc = await API.get("/users");

                setUsers(resc.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUsers();
    }, []);


    useEffect(() => {
        const handleClickOutside = () => {
            setShowPriority(false);
            setShowStatus(false);
            setShowAssignee(false);
        };

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await API.put(`/tasks/${selectedTask.id}`, {
                title,
                description,
                dueDate,

                priority: priority.toLowerCase(),

                status:
                    status === "ToDo"
                        ? "todo"
                        : status === "In Progress"
                            ? "in-progress"
                            : "completed",

                assignedTo: assigneeId || null,
            });

            await fetchTasks();

            console.log("Task updated");

            setShowTaskModal(false);

        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteTask = async () => {
        try {

            setDeleting(true);

            await API.delete(`/tasks/${selectedTask.id}`);

            await fetchTasks();

            setShowDeleteModal(false);

            setShowTaskModal(false);

        } catch (err) {
            console.log(err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div role='dialog' className='relative z-50'>
                <div className='fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity'></div>
                <div
                    onClick={() =>
                        setShowTaskModal(false)
                    }
                    className='fixed inset-0 z-50 w-screen overflow-y-auto'>
                    <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                        <div
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                            className='relative transform rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl'>

                            <header className='text-lg font-semibold text-gray-900'>Task Details</header>
                            <div className='mt-4'>
                                <div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className='space-y-6'>

                                        <div>
                                            <label htmlFor='title' className='block text-sm/6 font-medium text-gray-900'>Title</label>
                                            <div className='mt-2'>
                                                <input
                                                    id='title'
                                                    type='text'
                                                    value={title}
                                                    onChange={(e) =>
                                                        setTitle(e.target.value)
                                                    }
                                                    placeholder='Enter task title' className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'></input>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='description' className='block text-sm/6 font-medium text-gray-900'>Description</label>
                                            <div className='mt-2'>
                                                <textarea
                                                    id='description'
                                                    value={description}
                                                    onChange={(e) =>
                                                        setDescription(e.target.value)
                                                    }
                                                    rows={4}
                                                    placeholder='Enter task description'
                                                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'></textarea>
                                            </div>
                                        </div>

                                        <div>
                                            <label className='block text-sm/6 font-medium text-gray-900'>
                                                Due Date
                                            </label>

                                            <div className='mt-2'>
                                                <input
                                                    type='date'
                                                    value={dueDate}
                                                    onChange={(e) =>
                                                        setDueDate(e.target.value)
                                                    }
                                                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor='project' className='block text-sm/6 font-medium text-gray-900'>Project</label>
                                            <div className='mt-2'>
                                                <input
                                                    id='project'
                                                    value={selectedTask?.project?.name || "Default Project"}
                                                    readOnly className='block w-full cursor-not-allowed rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-700 sm:text-sm'></input>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                            <div>
                                                <label className='block text-sm/6 font-medium text-gray-900'>Priority</label>
                                                <div className='relative mt-2'>
                                                    <button
                                                        type='button'
                                                        aria-haspopup='listbox'
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            setShowPriority(!showPriority);
                                                            setShowStatus(false);
                                                            setShowAssignee(false);
                                                        }}
                                                        className='grid w-full cursor-pointer grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'>
                                                        <span className='col-start-1 row-start-1 truncate pr-6'>{priority}</span>
                                                        <TbSelector className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                                                    </button>

                                                    {showPriority && (
                                                        <ul
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            aria-orientation="vertical" role="listbox" className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                            <li
                                                                onClick={() => {
                                                                    setPriority("Low");
                                                                    setShowPriority(false);
                                                                }}
                                                                className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50 focus:bg-gray-50" role="option">
                                                                <div className="text-gray-900 absolute inset-0 rounded-md"></div>
                                                                <span className="font-semibold relative block truncate text-gray-900">Low</span>
                                                                {priority === "Low" && (
                                                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                        <Check className="size-5" />
                                                                    </span>
                                                                )}
                                                            </li>

                                                            <li
                                                                onClick={() => {
                                                                    setPriority("Medium");
                                                                    setShowPriority(false);
                                                                }}
                                                                className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50 focus:bg-gray-50">
                                                                <div className="text-gray-900 absolute inset-0 rounded-md"></div>
                                                                <span className="font-normal relative block truncate text-gray-900">Medium</span>
                                                                {priority === "Medium" && (
                                                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                        <Check className="size-5" />
                                                                    </span>
                                                                )}
                                                            </li>

                                                            <li
                                                                onClick={() => {
                                                                    setPriority("High");
                                                                    setShowPriority(false);
                                                                }}
                                                                className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50 focus:bg-gray-50">
                                                                <div className="text-gray-900 absolute inset-0 rounded-md"></div>
                                                                <span className="font-normal relative block truncate text-gray-900">High</span>
                                                                {priority === "High" && (
                                                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                        <Check className="size-5" />
                                                                    </span>
                                                                )}
                                                            </li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm/6 font-medium text-gray-900">Status</label>
                                                <div className="relative mt-2">
                                                    <button
                                                        type="button"
                                                        aria-haspopup='listbox'
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            setShowStatus(!showStatus);
                                                            setShowPriority(false);
                                                            setShowAssignee(false);
                                                        }}
                                                        className="grid w-full cursor-pointer grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                                        <span className="col-start-1 row-start-1 truncate pr-6">{status}</span>
                                                        <TbSelector className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                                                    </button>

                                                    {showStatus && (
                                                        <ul
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            aria-orientation="vertical" role="listbox" className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                            <li
                                                                onClick={() => {
                                                                    setStatus("ToDo");
                                                                    setShowStatus(false);
                                                                }}
                                                                className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50 focus:bg-gray-50">
                                                                <div className="text-gray-900 absolute inset-0 rounded-md"></div>
                                                                <span className="font-semibold relative block truncate text-gray-900">ToDo</span>
                                                                {status === "ToDo" && (
                                                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                        <Check className="size-5" />
                                                                    </span>
                                                                )}
                                                            </li>

                                                            <li
                                                                onClick={() => {
                                                                    setStatus("In Progress");
                                                                    setShowStatus(false);
                                                                }}
                                                                className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50 focus:bg-gray-50">
                                                                <div className="text-gray-900 absolute inset-0 rounded-md"></div>
                                                                <span className="font-normal relative block truncate text-gray-900">In Progress</span>
                                                                {status === "In Progress" && (
                                                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                        <Check className="size-5" />
                                                                    </span>
                                                                )}
                                                            </li>

                                                            <li
                                                                onClick={() => {
                                                                    setStatus("Done");
                                                                    setShowStatus(false);
                                                                }}
                                                                className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50 focus:bg-gray-50">
                                                                <div className="text-gray-900 absolute inset-0 rounded-md"></div>
                                                                <span className="font-normal relative block truncate text-gray-900">Done</span>
                                                                {status === "Done" && (
                                                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                        <Check className="size-5" />
                                                                    </span>
                                                                )}
                                                            </li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm/6 font-medium text-gray-900">Assignee</label>
                                            <div className="relative mt-2">
                                                <input
                                                    value={assignee}
                                                    readOnly
                                                    aria-autocomplete="list"
                                                    role="combobox"
                                                    type="text"
                                                    className="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Select assignee"></input>
                                                <button
                                                    type="button"
                                                    aria-haspopup='listbox'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowAssignee(!showAssignee);
                                                        setShowPriority(false);
                                                        setShowStatus(false);
                                                    }}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <TbSelector className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                                                </button>

                                                {showAssignee && (
                                                    <ul
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        role="listbox"
                                                        className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                                                    >
                                                        <li
                                                            onClick={() => {
                                                                setAssignee("");
                                                                setAssigneeId("");
                                                                setShowAssignee(false);
                                                            }}
                                                            className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50"
                                                        >
                                                            <div className="relative flex items-center">
                                                                <span className="font-semibold ml-3 truncate text-gray-900">
                                                                    - No Assignee -
                                                                </span>
                                                            </div>

                                                            {assignee === "" && (
                                                                <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                    <Check className="size-5" />
                                                                </span>
                                                            )}
                                                        </li>

                                                        {users.map((user) => (
                                                            <li
                                                                key={user._id}
                                                                onClick={() => {
                                                                    setAssignee(
                                                                        `${user.firstName} ${user.lastName}`
                                                                    );

                                                                    setAssigneeId(user._id);

                                                                    setShowAssignee(false);
                                                                }}
                                                                className="relative cursor-pointer py-2 pr-9 pl-3 select-none hover:bg-gray-50"
                                                            >
                                                                <div className="relative flex items-center">
                                                                    <Image
                                                                        className="size-6 shrink-0 rounded-full"
                                                                        src={logo}
                                                                        alt="Avatar"
                                                                    />

                                                                    <span className="font-normal ml-3 truncate text-gray-900">
                                                                        {user.firstName} {user.lastName}
                                                                    </span>
                                                                </div>

                                                                {assigneeId === user._id && (
                                                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                        <Check className="size-5" />
                                                                    </span>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}


                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button type="submit" className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">Save Changes</button>
                                        </div>

                                        <hr className="my-4"></hr>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Created: {
                                                selectedTask?.createdAt
                                                    ? new Date(selectedTask.createdAt).toLocaleString()
                                                    : "-"
                                            }</span>
                                            <span>Updated: {
                                                selectedTask?.updatedAt
                                                    ? new Date(selectedTask.updatedAt).toLocaleString()
                                                    : "-"
                                            }</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowDeleteModal(true)
                                                }
                                                className="underline text-red-600 cursor-pointer">Delete</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <DeleteTaskModal

                    setShowDeleteModal={setShowDeleteModal}

                    handleDeleteTask={handleDeleteTask}
                    deleting={deleting}
                />
            )}
        </>
    )
}

export default TaskDetails
