"use client"

import API from "@/api";
import { Search, ChevronDown, Plus } from 'lucide-react';
import { TbSelector } from "react-icons/tb";
import { IoCheckmark } from "react-icons/io5";
import { useEffect, useMemo, useState } from 'react';
import Image from "next/image";
import logo from "@/assets/dashboard workcomposer logo.png";
import NewTask from './NewTask';
import TaskDetails from './TaskDetails';


const TaskManagement = () => {

    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All statuses");
    const [selectedType, setSelectedType] = useState("All");

    const [statusOpen, setStatusOpen] = useState(false);
    const [assigneeOpen, setAssigneeOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [tasks, setTasks] = useState<any[]>([]);

    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const [selectedTask, setSelectedTask] = useState<any>(null);

    const [viewMode, setViewMode] = useState("table");

    const fetchTasks = async () => {
        try {
            const res = await API.get("/tasks");

            const formattedTasks = res.data.map((task: any) => ({
                id: task._id,

                title: task.title,
                description: task.description,

                dueDate: task.dueDate,

                createdAt: task.createdAt,
                updatedAt: task.updatedAt,

                project: task.project,

                assignedTo: task.assignedTo,

                priority:
                    task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1),

                status:
                    task.status === "todo"
                        ? "Todo"
                        : task.status === "in-progress"
                            ? "In progress"
                            : "Done",

                assignees: task.assignedTo
                    ? [task.assignedTo.email]
                    : [],

                type: "Internal Tasks",
            }));

            setTasks(formattedTasks);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [])

    const statuses = ["Todo", "In progress", "Done"];

    const assignees = [
        "Not assigned",
        "Arena z",
        "email@test.com",
    ];

    const taskTypes = [
        "All",
        "Internal Tasks",
        "Jira Tasks",
        "Asana Tasks"
    ];

    // FILTER LOGIC
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()
            );

            const matchesStatus = selectedStatus === "All statuses"
                ? true
                : task.status === selectedStatus;

            const matchesAssignee = selectedAssignees.length === 0
                ? true
                : task.assignees.some((assignee) =>
                    selectedAssignees.includes(assignee)
                );

            const matchesType = selectedType === "All"
                ? true
                : task.type === selectedType;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesAssignee &&
                matchesType
            );
        });
    }, [
        tasks, search, selectedStatus, selectedAssignees, selectedType
    ]);

    const toggleAssignee = (assignee: string) => {
        setSelectedAssignees((prev) =>
            prev.includes(assignee)
                ? prev.filter((item) => item !== assignee)
                : [...prev, assignee]
        );
    };


    const totalTasks = tasks.length;

    const todoTasks = tasks.filter(
        (task) => task.status === "Todo"
    ).length;

    const inProgressTasks = tasks.filter(
        (task) => task.status === "In progress"
    ).length;

    const doneTasks = tasks.filter(
        (task) => task.status === "Done"
    ).length;

    const overdueTasks = tasks.filter(
        (task) =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status !== "Done"
    ).length;


    return (
        <>
            <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center gap-3 bg-gray-50 px-4 py-3 border border-gray-200 sm:px-6 lg:px-8 rounded-md">
                    <div className="w-full sm:w-64">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tasks"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6">
                            </input>
                            <Search className='absolute right-3 top-2 h-5 w-5 text-gray-400 pointer-events-none' />
                        </div>
                    </div>

                    <div className='w-full sm:w-48'>
                        <div className='relative'>
                            <button
                                onClick={() =>
                                    setStatusOpen(!statusOpen)
                                }
                                type='button'
                                className='grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <span className='col-start-1 row-start-1 truncate pr-6'>{selectedStatus}</span>
                                <TbSelector className='col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4' />
                            </button>

                            {statusOpen && (
                                <ul className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm'>
                                    {statuses.map((status) =>
                                    (
                                        <li
                                            key={status}
                                            onClick={() => {
                                                setSelectedStatus(status);
                                                setStatusOpen(false);
                                            }}
                                            className='flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer'
                                        >
                                            <span
                                                className={`block truncate ${selectedStatus === status
                                                    ? "font-semibold text-gray-900"
                                                    : "font-normal text-gray-500"
                                                    }`}
                                            >
                                                {status}
                                            </span>

                                            {selectedStatus === status && (
                                                <IoCheckmark className='w-4 h-4 text-indigo-600' />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>


                    {/* ASSIGNEE */}

                    <div className='w-full sm:w-48'>
                        <div className='relative'>
                            <button
                                onClick={() =>
                                    setAssigneeOpen(!assigneeOpen)
                                }
                                type='button'
                                className='grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <span className='col-start-1 row-start-1 truncate pr-6'>
                                    {selectedAssignees.length === 0
                                        ? "All assignees"
                                        : selectedAssignees.length === 1
                                            ? selectedAssignees[0]
                                            : `${selectedAssignees.length} assignees`}</span>
                                <TbSelector className='col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4' />
                            </button>

                            {assigneeOpen && (
                                <ul className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm'>

                                    {assignees.map((assignee) => (
                                        <li
                                            key={assignee}
                                            onClick={() => toggleAssignee(assignee)}
                                            className='flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer'
                                        >
                                            <span className={
                                                selectedAssignees.includes(assignee)
                                                    ? "font-semibold text-gray-900"
                                                    : "text-gray-500"
                                            }>{assignee}</span>

                                            {selectedAssignees.includes(assignee) && (
                                                <IoCheckmark className='w-4 h-4 text-indigo-600' />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* TASK TYPE */}

                    <div className='w-full sm:w-48'>
                        <div className='relative'>
                            <button
                                onClick={() =>
                                    setTypeOpen(!typeOpen)
                                }
                                type='button'
                                className='grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm/6'>
                                <span className='col-start-1 row-start-1 truncate pr-6'>{selectedType}</span>
                                <TbSelector className='col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4' />
                            </button>

                            {typeOpen && (
                                <ul className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm'>

                                    {taskTypes.map((type) => (
                                        <li
                                            key={type}
                                            onClick={() => {
                                                setSelectedType(type)
                                                setTypeOpen(false);
                                            }}
                                            className='text-gray-900 relative cursor-pointer select-none py-2 pr-9 pl-3'>
                                            <span
                                                className={`font-semibold block truncate ${selectedType === type
                                                    ? "font-semibold"
                                                    : "font-normal"
                                                    }`}
                                            >{type}</span>

                                            {selectedType === type && (
                                                <span className='text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4'>
                                                    <IoCheckmark className='size-5' />
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>


                    {/* MORE */}

                    <div className='ml-auto'>
                        <div className='relative'>
                            <button
                                onClick={() =>
                                    setMoreOpen(!moreOpen)
                                }
                                type='button'
                                className='inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100'>
                                More
                                <ChevronDown className='h-4 w-4' />
                            </button>

                            {moreOpen && (
                                <div role='menu' className='absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg z-20'>
                                    <button className='w-full text-left px-3 py-2 text-sm font-semibold text-gray-700' role='menuitem'> Recently Deleted </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* TASK AREA */}

                <div className='sm:px-6 lg:px-8 my-2 pt-5 min-h-[calc(100vh-230px)] max-h-[calc(100vh-180px)] overflow-y-auto rounded-lg bg-white shadow px-6 py-8'>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6'>

                        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                            <p className='text-sm text-gray-500'>
                                Total Tasks
                            </p>

                            <h3 className='mt-2 text-2xl font-bold text-gray-900'>
                                {totalTasks}
                            </h3>
                        </div>

                        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                            <p className='text-sm text-gray-500'>
                                Todo
                            </p>

                            <h3 className='mt-2 text-2xl font-bold text-gray-700'>
                                {todoTasks}
                            </h3>
                        </div>

                        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                            <p className='text-sm text-gray-500'>
                                In Progress
                            </p>

                            <h3 className='mt-2 text-2xl font-bold text-blue-600'>
                                {inProgressTasks}
                            </h3>
                        </div>

                        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                            <p className='text-sm text-gray-500'>
                                Done
                            </p>

                            <h3 className='mt-2 text-2xl font-bold text-green-600'>
                                {doneTasks}
                            </h3>
                        </div>

                        <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                            <p className='text-sm text-gray-500'>
                                Overdue
                            </p>

                            <h3 className='mt-2 text-2xl font-bold text-red-600'>
                                {overdueTasks}
                            </h3>
                        </div>

                    </div>

                    <div className='flex items-center justify-between mt-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>Project: Default Project</h3>
                        <button
                            onClick={() =>
                                setShowNewTaskModal(true)
                            }
                            className='inline-flex items-center gap-2 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 text-sm font-medium'>
                            <Plus className='w-4 h-4' />
                            New Task
                        </button>
                    </div>

                    {/* TASK LIST */}

                    <div className='sm:px-6 lg:px-8'>
                        <div className='mt-8 flow-root overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 inline-block min-w-full py-2 align-middle'>
                            <table className='min-w-full divide-y divide-gray-300'>
                                <thead className='sr-only'>
                                    <tr>
                                        <th>Select + Title</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Due Date</th>
                                        <th>Assignee</th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-gray-200'>
                                    <tr>
                                        <td colSpan={5} className='px-3 py-4'>
                                            <div className='flex items-center'>
                                                <div className='group grid size-4 grid-cols-1'>
                                                    <input
                                                        id='select-all'
                                                        type='checkbox'
                                                        checked={
                                                            filteredTasks.length > 0 &&
                                                            filteredTasks.every((task) =>
                                                                selectedTasks.includes(task.id)
                                                            )
                                                        }
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedTasks(filteredTasks.map((task) => task.id));
                                                            } else {
                                                                setSelectedTasks([]);
                                                            }
                                                        }}
                                                        className='col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 void-colors:appearance-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'></input>
                                                    <svg className='pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25' viewBox='0 0 14 14' fill='none'>
                                                        <path className='opacity-0 group-has-checked:opacity-100' d='M3 8L6 11L11 3.5' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'></path>
                                                        <path className='opacity-0 group-has-indeterminate:opacity-100' d='M3 7H11' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'></path>
                                                    </svg>
                                                </div>

                                                <label htmlFor='select-all' className='ml-2 text-sm font-medium text-gray-900'>Select all</label>

                                                {selectedTasks.length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setTasks((prev) =>
                                                                prev.filter((task) => !selectedTasks.includes(task.id)
                                                                )
                                                            );
                                                            setSelectedTasks([]);
                                                        }}
                                                        className='cursor-pointer ml-2 rounded-sm bg-red-50 px-2 py-1 text-sm font-semibold text-red-600 shadow-xs hover:bg-red-100'>Delete Selected</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* TASKS */}

                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((task) => (
                                            <tr
                                                key={task.id}
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setShowTaskModal(true);
                                                }}
                                                className={`hover:bg-gray-50 cursor-pointer ${task.dueDate &&
                                                    new Date(task.dueDate) < new Date() &&
                                                    task.status !== "Done"
                                                    ? "bg-red-50"
                                                    : ""
                                                    }`}>

                                                {/* TITLE */}
                                                <td className='px-3 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center'>
                                                        <div className='group grid size-4 grid-cols-1'>
                                                            <input
                                                                type='checkbox'
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                                checked={selectedTasks.includes(task.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedTasks((prev) => [
                                                                            ...prev,
                                                                            task.id,
                                                                        ]);
                                                                    } else {
                                                                        setSelectedTasks((prev) =>
                                                                            prev.filter(
                                                                                (id) => id !== task.id
                                                                            )
                                                                        )
                                                                    }
                                                                }}
                                                                className='col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 void-colors:appearance-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'></input>
                                                            <svg className='pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25' viewBox='0 0 14 14' fill='none'>
                                                                <path className='opacity-0 group-has-checked:opacity-100' d='M3 8L6 11L11 3.5' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'></path>
                                                                <path className='opacity-0 group-has-indeterminate:opacity-100' d='M3 7H11' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'></path>
                                                            </svg>
                                                        </div>

                                                        <span className='ml-2 text-sm font-medium text-gray-900'>{task.title}</span>
                                                    </div>
                                                </td>

                                                {/* PRIORITY */}

                                                <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                    <span className={`px-2 py-0.5 rounded-full ${task.priority === "Low"
                                                        ? "bg-gray-200 text-gray-700"
                                                        : task.priority === "Medium"
                                                            ? "bg-blue-200 text-blue-700"
                                                            : "bg-red-200 text-red-700"
                                                        }`}>{task.priority}</span>
                                                </td>

                                                {/* STATUS */}

                                                <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                    <span className='text-gray-600'>{task.status}</span>
                                                </td>

                                                {/* DUE DATE */}

                                                <td className={`px-3 py-4 whitespace-nowrap text-sm ${task.dueDate &&
                                                    new Date(task.dueDate) < new Date() &&
                                                    task.status !== "Done"
                                                    ? "text-red-600 font-semibold"
                                                    : "text-gray-500"
                                                    }`}>
                                                    {task.dueDate
                                                        ? new Date(task.dueDate)
                                                            .toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                {/* ASSIGNEE */}

                                                <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
                                                    {task.assignees.length === 0 ? (
                                                        <div className='text-gray-400'>
                                                            Not assigned
                                                        </div>
                                                    ) : (
                                                        <div className='flex items-center -space-x-2'>
                                                            {task.assignees.map((assignee, index) => (
                                                                <div
                                                                    key={index}
                                                                    className='flex items-center'
                                                                >
                                                                    <Image
                                                                        className='h-7 w-7 rounded-full border-2 border-white'
                                                                        src={logo}
                                                                        alt='Avatar'
                                                                    />
                                                                    <span className='ml-2 mr-3 text-sm text-gray-700'
                                                                    >
                                                                        {assignee}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5}
                                                className='py-10 text-center text-gray-500'
                                            >No tasks found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showNewTaskModal && (
                <NewTask

                    setShowNewTaskModal={setShowNewTaskModal}
                    fetchTasks={fetchTasks}
                />
            )}

            {showTaskModal && (
                <TaskDetails

                    setShowTaskModal={setShowTaskModal}
                    selectedTask={selectedTask}
                    fetchTasks={fetchTasks}
                />
            )}
        </>
    )
}

export default TaskManagement
