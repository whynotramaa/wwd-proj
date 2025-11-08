// import { Loader2 } from "@";

import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                {/* Spinner */}
                <Loader2 className="h-10 w-10 animate-spin text-gray-700" />

                {/* Text */}
                <p className="text-base text-gray-200 tracking-wide">
                    Preparing your experience…
                </p>
            </div>

            {/* Subtle bottom shimmer */}
            <div className="absolute bottom-10 h-2 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>
    );
}
