"use client";

import { useState } from "react";
import UserProfileModal from "@/components/UserProfilemodal";
import { mapUserToProfileData } from "@/utils/mapUserToProfileData";

type Props = {
    user: any;
    children: React.ReactNode;
    className?: string;
};

export default function UserProfileTrigger({
    user,
    children,
    className = "",
}: Props) {
    const [open, setOpen] = useState(false);

    if (!user) {
        return <>{children}</>;
    }

    const profileUser = mapUserToProfileData(user);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={className}
                title="View profile"
            >
                {children}
            </button>

            <UserProfileModal
                open={open}
                onClose={() => setOpen(false)}
                user={profileUser}
            />
        </>
    );
}