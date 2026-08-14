"use client"

import { CiUser } from "react-icons/ci";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { Clock3 } from 'lucide-react';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { useDesktop } from "@/context/DesktopContext";
import DesktopModuleHeader from "../common/DesktopModuleHeader";
import useDesktopNavigation from "@/hooks/useDesktopNavigation";

type Props = {
    desktop?: boolean;
    activeSetting?: string;
    setActiveSetting?: React.Dispatch<
        React.SetStateAction<string>
    >;
};

const SettingsSidebar = ({
    desktop = false,
    activeSetting,
    setActiveSetting,
}: Props) => {

    const { closeSidebar } = useDesktopNavigation(desktop);

    const pathname = usePathname();
    const { user } = useDashboard();

    const canManageSettings =
        user?.permissions?.includes("manage_settings");

    const linkClass = (
        href: string,
        key?: string,
    ) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition ${desktop
            ? activeSetting === key
                ? "nav-opt2 router-link-active router-link-exact-active font-semibold"
                : "font-medium text-slate-400 hover:text-white hover:bg-white/[0.05]"
            : pathname.startsWith(href)
                ? "nav-opt2 router-link-active router-link-exact-active font-semibold"
                : "font-medium text-slate-400 hover:text-white hover:bg-white/[0.05]"
        }`;

    return (
        <>
            {desktop && (
                <DesktopModuleHeader />
            )}

            <div
                className={`-mx-1 px-1 pt-2 scroll-thin ${desktop
                    ? "flex-1 overflow-y-auto min-h-0 pb-6"
                    : "overflow-y-auto min-h-0"
                    }`}
            >
                <nav aria-label="App sections" className="space-y-0.5">
                    <div data-test="settings-group-0" className="mb-3">
                        <button type="button" className="group w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition text-indigo-300">
                            <CiUser className="h-4 w-4 shrink-0" />
                            <span className="flex-1 text-left">Personal</span>
                        </button>

                        <div className="pl-[26px] space-y-0.5">
                            {desktop ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeSidebar();
                                        setActiveSetting?.("profile");
                                    }}
                                    className={linkClass("", "profile")}
                                >
                                    <span className="lead-dot"></span>
                                    <span className="flex-1 text-left">
                                        Profile
                                    </span>
                                </button>
                            ) : (
                                <Link
                                    href="/dashboard/settings/profile"
                                    className={linkClass("/dashboard/settings/profile")}
                                >
                                    <span className="lead-dot"></span>
                                    <span className="flex-1">
                                        Profile
                                    </span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {canManageSettings && (
                        <>
                            <div data-test="settings-group-1" className="mb-3">
                                <button type="button" className="group w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition text-slate-400 hover:text-slate-300 hover:bg-white/[0.04]">
                                    <HiBuildingOffice2 className="h-4 w-4 shrink-0" />
                                    <span className="flex-1 text-left">Account & Security</span>
                                </button>
                                <div className="pl-[26px] space-y-0.5">
                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("organization-profile");
                                            }}
                                            className={linkClass("", "organization-profile")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">
                                                Organization Profile
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/organization-profile"
                                            className={linkClass("/dashboard/settings/organization-profile")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">
                                                Organization Profile
                                            </span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("security");
                                            }}
                                            className={linkClass("", "security")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">
                                                Security & Compliance
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/account/security"
                                            className={linkClass("/dashboard/settings/account/security")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">
                                                Security & Compliance
                                            </span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("roles-privilages");
                                            }}
                                            className={linkClass("", "roles-privilages")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">
                                                Roles & Privileges
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/account/roles-privilages"
                                            className={linkClass("/dashboard/settings/account/roles-privilages")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">
                                                Roles & Privileges
                                            </span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("integrations");
                                            }}
                                            className={linkClass("", "integrations")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">
                                                Integrations
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/account/integrations"
                                            className={linkClass("/dashboard/settings/account/integrations")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">
                                                Integrations
                                            </span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("api-access");
                                            }}
                                            className={linkClass("", "api-access")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">
                                                API Access
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/account/api-access"
                                            className={linkClass("/dashboard/settings/account/api-access")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">
                                                API Access
                                            </span>
                                        </Link>
                                    )}
                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("billings");
                                            }}
                                            className={linkClass("", "billings")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">
                                                Billing & Usage
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/account/billings"
                                            className={linkClass("/dashboard/settings/account/billings")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">
                                                Billing & Usage
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div data-test="settins-group-2" className="mb-3">
                                <button type="button" className="group w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition text-slate-400 hover:text-slate-300 hover:bg-white/[0.04]">
                                    <Clock3 className="h-4 w-4 shrink-0" />
                                    <span className="flex-1 text-left">Time Tracking</span>
                                </button>
                                <div className="pl-[26px] space-y-0.5">

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("tracking");
                                            }}
                                            className={linkClass("", "tracking")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">Tracking</span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/time-tracking/tracking"
                                            className={linkClass("/dashboard/settings/time-tracking/tracking")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">Tracking</span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("screen-capture");
                                            }}
                                            className={linkClass("", "screen-capture")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">Screen Capture</span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/time-tracking/screen-capture"
                                            className={linkClass("/dashboard/settings/time-tracking/screen-capture")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">Screen Capture</span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("manual-time");
                                            }}
                                            className={linkClass("", "manual-time")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">Manual Time</span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/time-tracking/manual-time"
                                            className={linkClass("/dashboard/settings/time-tracking/manual-time")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">Manual Time</span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("productivity");
                                            }}
                                            className={linkClass("", "productivity")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">Productivity</span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/time-tracking/productivity"
                                            className={linkClass("/dashboard/settings/time-tracking/productivity")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">Productivity</span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("shifts");
                                            }}
                                            className={linkClass("", "shifts")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">Shifts</span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/time-tracking/shifts"
                                            className={linkClass("/dashboard/settings/time-tracking/shifts")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">Shifts</span>
                                        </Link>
                                    )}

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("email-reports");
                                            }}
                                            className={linkClass("", "email-reports")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">Email Reports</span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/time-tracking/email-reports"
                                            className={linkClass("/dashboard/settings/time-tracking/email-reports")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">Email Reports</span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div data-test="settings-group-3" className="mb-3">
                                <button type="button" className="group w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition text-slate-400 hover:text-slate-300 hover:bg-white/[0.04]">
                                    <HiOutlineClipboardDocumentList className="h-4 w-4 shrink-0" />
                                    <span className="flex-1 text-left">Task Management</span>
                                </button>
                                <div className="pl-[26px] space-y-0.5">

                                    {desktop ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                closeSidebar();
                                                setActiveSetting?.("projects");
                                            }}
                                            className={linkClass("", "projects")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1 text-left">
                                                Projects & Tasks
                                            </span>
                                        </button>
                                    ) : (
                                        <Link
                                            href="/dashboard/settings/task-management/projects"
                                            className={linkClass("/dashboard/settings/task-management/projects")}
                                        >
                                            <span className="lead-dot"></span>
                                            <span className="flex-1">
                                                Projects & Tasks
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </>
    )
}

export default SettingsSidebar
