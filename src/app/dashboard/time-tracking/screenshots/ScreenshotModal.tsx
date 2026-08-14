"use client"

import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import ScreenshotDetailsModal from './ScreenshotDetailsModal';


type Props = {
    user: {
        email: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
        screenshots: any[];
    };
    onClose: () => void;
}

export default function ScreenshotModal({
    user,
    onClose,
}: Props) {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hourIndexes, setHourIndexes] = useState<
        Record<string, number>
    >({});

    const rowRefs = useRef<
        Record<string, HTMLDivElement | null>
    >({});

    const sortedScreenshots = [...user.screenshots].sort(
        (a, b) =>
            new Date(b.capturedAt).getTime() -
            new Date(a.capturedAt).getTime()
    );

    const groupedByHour = sortedScreenshots.reduce(
        (acc: any, shot: any) => {
            const hourKey = new Date(
                shot.capturedAt
            ).toLocaleString([], {
                hour: "numeric",
                hour12: true,
            });

            if (!acc[hourKey]) {
                acc[hourKey] = [];
            }

            acc[hourKey].push(shot);

            return acc;
        },
        {}
    );

    const totalScreenshots = sortedScreenshots.length;

    const activeScreenshot =
        sortedScreenshots[currentIndex];

    const scrollToScreenshot = (index: number) => {
        setCurrentIndex(index);
    };

    const [selectedScreenshot, setSelectedScreenshot] = useState<any>(null);

    const getActivityColor = (score: number) => {
        if (score < 40) return "#EF4444";
        if (score < 70) return "#F59E0B";
        return "#22C55E";
    };

    return (
        <>
            <div role='dialog' className='relative z-50'>
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity'></div>
                <div
                    onClick={onClose}
                    className='fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
                    <div
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        className='w-full max-w-7xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all'>
                        <div className='flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200'>
                            <div className='flex items-center'>
                                <div className='flex items-center'>
                                    {user.avatar?.trim() ? (
                                        <img
                                            src={user.avatar}
                                            className="w-8 h-8 rounded-full object-cover shadow-sm mr-2.5"
                                            alt={`${user.firstName} ${user.lastName}`}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold mr-2.5">
                                            {user.firstName?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <h3 className='text-base font-semibold text-gray-800'>{user.email}'s Screenshots </h3>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className='rounded-full p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors' aria-label='close dialog'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <div className='p-5'>
                            <div className='space-y-6 overflow-y-auto max-h-[70vh] pr-2'>
                                <div className='relative'>
                                    <div className='relative mb-5'>
                                        <div className='sticky top-0 bg-white z-10 rounded-t-lg shadow-sm border border-gray-200 overflow-hidden'>
                                            <div className='flex items-center justify-between p-2'>
                                                <div className='flex items-center'>
                                                    <div className='bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md font-medium flex items-center'>
                                                        <span className='text-sm font-semibold'>
                                                            {activeScreenshot
                                                                ? new Date(activeScreenshot.capturedAt).toLocaleTimeString([], {
                                                                    hour: "numeric",
                                                                })
                                                                : "--"}
                                                        </span>

                                                        <span className='text-xs text-indigo-500 ml-1.5'>
                                                            {activeScreenshot
                                                                ? new Date(activeScreenshot.capturedAt).toLocaleDateString([], {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })
                                                                : "--"}
                                                        </span>
                                                    </div>


                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <button
                                                        onClick={() =>
                                                            scrollToScreenshot(
                                                                Math.max(currentIndex - 1, 0)
                                                            )
                                                        }
                                                        disabled={currentIndex === 0}
                                                        className={`flex items-center justify-center h-6 w-6 rounded-full transition-all duration-200 ${currentIndex === 0
                                                            ? "bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                                                            }`}
                                                    >
                                                        <span className='sr-only'>Previous</span>
                                                        <ChevronLeft className='h-3.5 w-3.5' />
                                                    </button>

                                                    <div className='hidden sm:block'>
                                                        <div className='flex items-center space-x-1'>

                                                            {sortedScreenshots.map((_: any, index: number) => (
                                                                <div
                                                                    key={index}
                                                                    onClick={() => {
                                                                        scrollToScreenshot(index)
                                                                    }
                                                                    }
                                                                    className="cursor-pointer transition-all duration-200"
                                                                >
                                                                    <div
                                                                        className={`h-1 rounded-full transition-all duration-200 ${index === currentIndex
                                                                            ? "w-5 bg-indigo-600"
                                                                            : "w-1 bg-gray-300 hover:bg-gray-400"
                                                                            }`}
                                                                    />
                                                                </div>
                                                            ))}

                                                        </div>
                                                    </div>

                                                    <div className='text-xs font-medium text-gray-500 sm:hidden'></div>
                                                    <button
                                                        onClick={() =>
                                                            scrollToScreenshot(
                                                                Math.min(
                                                                    currentIndex + 1,
                                                                    sortedScreenshots.length - 1
                                                                )
                                                            )
                                                        }
                                                        disabled={
                                                            currentIndex ===
                                                            sortedScreenshots.length - 1
                                                        }
                                                        className={`flex items-center justify-center h-6 w-6 rounded-full transition-all duration-200 ${currentIndex ===
                                                            sortedScreenshots.length - 1
                                                            ? "bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                                                            }`}
                                                    >
                                                        <span className='sr-only'>Next</span>
                                                        <ChevronRight className='h-3.5 w-3.5' />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className='h-1 bg-gray-100 w-full'>
                                                <div
                                                    className='h-full bg-indigo-500 transition-all duration-200'
                                                    style={{
                                                        width:
                                                            totalScreenshots > 0
                                                                ? `${((currentIndex + 1) / totalScreenshots) * 100}%`
                                                                : "0%"
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className='border border-t-0 border-gray-200 rounded-b-lg bg-white pt-2 px-2 pb-2 shadow-sm'>
                                            <div className="space-y-8">

                                                {Object.entries(groupedByHour).map(
                                                    ([hour, screenshots]: any) => {

                                                        const currentHourIndex =
                                                            hourIndexes[hour] || 0;

                                                        const totalHourScreenshots =
                                                            screenshots.length;

                                                        return (
                                                            <div key={hour}>
                                                                <div className="flex items-center justify-between mb-3">

                                                                    <span className="text-2xl font-semibold text-indigo-700">
                                                                        {hour}
                                                                    </span>

                                                                    <span className="text-base font-medium text-indigo-400">
                                                                        {new Date(
                                                                            screenshots[0].capturedAt
                                                                        ).toLocaleDateString([], {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                        })}
                                                                    </span>



                                                                    <div className="flex items-center gap-2">

                                                                        <span className="text-sm text-gray-600">
                                                                            {currentHourIndex + 1} / {totalHourScreenshots}
                                                                        </span>

                                                                        <button
                                                                            onClick={() => {
                                                                                const newIndex = Math.max(
                                                                                    currentHourIndex - 1,
                                                                                    0
                                                                                );

                                                                                setHourIndexes(prev => ({
                                                                                    ...prev,
                                                                                    [hour]: newIndex,
                                                                                }));

                                                                                rowRefs.current[hour]?.scrollTo({
                                                                                    left: newIndex * 275,
                                                                                    behavior: "smooth",
                                                                                });
                                                                            }}
                                                                            disabled={currentHourIndex === 0}
                                                                            className="p-1"
                                                                        >
                                                                            <ChevronLeft size={14} />
                                                                        </button>

                                                                        <div className="flex items-center gap-1">

                                                                            {screenshots
                                                                                .slice(0, 5)
                                                                                .map((_: any, index: number) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        onClick={() => {
                                                                                            setHourIndexes(prev => ({
                                                                                                ...prev,
                                                                                                [hour]: index,
                                                                                            }));

                                                                                            rowRefs.current[hour]?.scrollTo({
                                                                                                left: index * 275,
                                                                                                behavior: "smooth",
                                                                                            });
                                                                                        }}
                                                                                        className="cursor-pointer"
                                                                                    >
                                                                                        <div
                                                                                            className={`h-1 rounded-full ${index === currentHourIndex
                                                                                                ? "w-5 bg-indigo-600"
                                                                                                : "w-1 bg-gray-300"
                                                                                                }`}
                                                                                        />
                                                                                    </div>
                                                                                ))}

                                                                            {totalHourScreenshots > 5 && (
                                                                                <span className="text-xs text-gray-500 ml-1">
                                                                                    +{totalHourScreenshots - 5}
                                                                                </span>
                                                                            )}

                                                                        </div>

                                                                        <button
                                                                            onClick={() => {
                                                                                const newIndex = Math.min(
                                                                                    currentHourIndex + 1,
                                                                                    totalHourScreenshots - 1
                                                                                );

                                                                                setHourIndexes(prev => ({
                                                                                    ...prev,
                                                                                    [hour]: newIndex,
                                                                                }));

                                                                                rowRefs.current[hour]?.scrollTo({
                                                                                    left: newIndex * 275,
                                                                                    behavior: "smooth",
                                                                                });
                                                                            }}
                                                                            disabled={
                                                                                currentHourIndex ===
                                                                                totalHourScreenshots - 1
                                                                            }
                                                                            className="p-1"
                                                                        >
                                                                            <ChevronRight size={14} />
                                                                        </button>

                                                                    </div>

                                                                </div>

                                                                <div>
                                                                    <div
                                                                        ref={(el) => {
                                                                            rowRefs.current[hour] = el;
                                                                        }}
                                                                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                                                                    >
                                                                        {screenshots.map(
                                                                            (screenshot: any) => (

                                                                                <div
                                                                                    key={screenshot._id}
                                                                                    className="flex-none w-65"
                                                                                >
                                                                                    <div className="relative">
                                                                                        <div
                                                                                            onClick={() => {
                                                                                                const index =
                                                                                                    sortedScreenshots.findIndex(
                                                                                                        (s) =>
                                                                                                            s._id ===
                                                                                                            screenshot._id
                                                                                                    );

                                                                                                setCurrentIndex(index);
                                                                                                setSelectedScreenshot(
                                                                                                    screenshot
                                                                                                );
                                                                                            }}
                                                                                            className="overflow-hidden rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                                                                        >

                                                                                            <Image
                                                                                                src={screenshot.imageUrl}
                                                                                                alt="Screenshot"
                                                                                                width={260}
                                                                                                height={146}
                                                                                                className="w-full h-auto object-cover aspect-video"
                                                                                                unoptimized
                                                                                            />

                                                                                            <div className="p-2.5 bg-white border-t border-gray-100">

                                                                                                <div className="flex justify-between items-center mb-1">

                                                                                                    <div className="text-xs font-medium text-gray-700">
                                                                                                        {new Date(
                                                                                                            screenshot.capturedAt
                                                                                                        ).toLocaleTimeString(
                                                                                                            [],
                                                                                                            {
                                                                                                                hour:
                                                                                                                    "2-digit",
                                                                                                                minute:
                                                                                                                    "2-digit",
                                                                                                            }
                                                                                                        )}
                                                                                                    </div>

                                                                                                    <div
                                                                                                        className="text-xs font-medium flex items-center gap-1"
                                                                                                        style={{
                                                                                                            color:
                                                                                                                getActivityColor(
                                                                                                                    screenshot.activityScore ||
                                                                                                                    0
                                                                                                                ),
                                                                                                        }}
                                                                                                    >
                                                                                                        <span
                                                                                                            className="h-1.5 w-1.5 rounded-full"
                                                                                                            style={{
                                                                                                                backgroundColor:
                                                                                                                    getActivityColor(
                                                                                                                        screenshot.activityScore ||
                                                                                                                        0
                                                                                                                    ),
                                                                                                            }}
                                                                                                        />

                                                                                                        {screenshot.activityScore ||
                                                                                                            0}
                                                                                                        %
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                                                    <div
                                                                                                        className="h-full rounded-full"
                                                                                                        style={{
                                                                                                            width: `${screenshot.activityScore ||
                                                                                                                0
                                                                                                                }%`,
                                                                                                            backgroundColor:
                                                                                                                getActivityColor(
                                                                                                                    screenshot.activityScore ||
                                                                                                                    0
                                                                                                                ),
                                                                                                        }}
                                                                                                    />
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            )
                                                                        )}
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedScreenshot && (
                            <ScreenshotDetailsModal
                                screenshot={sortedScreenshots[currentIndex]}
                                currentIndex={currentIndex}
                                total={sortedScreenshots.length}
                                onPrevious={() => {
                                    if (currentIndex > 0) {
                                        const newIndex = currentIndex - 1;

                                        setCurrentIndex(newIndex);
                                        setSelectedScreenshot(
                                            sortedScreenshots[newIndex]
                                        );
                                    }
                                }}
                                onNext={() => {
                                    if (
                                        currentIndex <
                                        sortedScreenshots.length - 1
                                    ) {
                                        const newIndex = currentIndex + 1;

                                        setCurrentIndex(newIndex);
                                        setSelectedScreenshot(
                                            sortedScreenshots[newIndex]
                                        );
                                    }
                                }}
                                onClose={() =>
                                    setSelectedScreenshot(null)
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}