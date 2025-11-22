import React from 'react';

export const PostLoader: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500 px-6 md:px-0 mt-12">
            {/* Back Button Skeleton */}
            <div className="h-4 bg-zinc-100 w-24 mb-12 rounded animate-pulse"></div>

            {/* Cover Image Skeleton */}
            <div className="aspect-video md:aspect-[21/9] bg-zinc-100 w-full mb-12 rounded animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
            </div>

            {/* Header Skeleton */}
            <div className="mb-16 border-b border-zinc-50 pb-12">
                <div className="flex gap-3 mb-8">
                    <div className="h-6 w-20 bg-zinc-100 rounded animate-pulse"></div>
                    <div className="h-6 w-24 bg-zinc-100 rounded animate-pulse"></div>
                </div>

                <div className="h-12 md:h-20 bg-zinc-100 w-3/4 mb-6 rounded animate-pulse"></div>
                <div className="h-12 md:h-20 bg-zinc-100 w-1/2 mb-10 rounded animate-pulse"></div>

                <div className="flex gap-12">
                    <div className="space-y-2">
                        <div className="h-3 w-12 bg-zinc-100 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-12 bg-zinc-100 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="space-y-6">
                <div className="h-4 bg-zinc-100 w-full rounded animate-pulse"></div>
                <div className="h-4 bg-zinc-100 w-full rounded animate-pulse"></div>
                <div className="h-4 bg-zinc-100 w-11/12 rounded animate-pulse"></div>
                <div className="h-4 bg-zinc-100 w-full rounded animate-pulse"></div>
                <div className="h-4 bg-zinc-100 w-5/6 rounded animate-pulse"></div>
                <div className="h-4 bg-zinc-100 w-full rounded animate-pulse"></div>
                <div className="h-4 bg-zinc-100 w-4/5 rounded animate-pulse"></div>
            </div>
        </div>
    );
};
