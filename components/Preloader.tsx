import React, { useEffect, useState } from 'react';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState("INITIALIZING");

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                // Random increment for "hacking" feel
                return prev + Math.floor(Math.random() * 5) + 1;
            });
        }, 50);

        const textInterval = setInterval(() => {
            const texts = ["INITIALIZING", "LOADING ASSETS", "DECODING DATA", "INDEXING CONTENT", "THE INDEX"];
            const index = Math.floor(progress / 25);
            if (index < texts.length) {
                setText(texts[index]);
            }
        }, 100);

        return () => {
            clearInterval(interval);
            clearInterval(textInterval);
        };
    }, [onComplete, progress]);

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
                {/* Main Title Animation */}
                <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter mb-8 animate-pulse">
                    {progress < 100 ? (
                        <span className="font-mono text-4xl md:text-6xl">{progress}%</span>
                    ) : (
                        "INDEX"
                    )}
                </h1>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-zinc-800 mb-4 overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Status Text */}
                <div className="flex justify-between w-full font-mono text-xs text-zinc-500 uppercase tracking-widest">
                    <span>{text}</span>
                    <span>SYS.403</span>
                </div>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-zinc-500" />
            <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-zinc-500" />
            <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-zinc-500" />
            <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-zinc-500" />
        </div>
    );
};
