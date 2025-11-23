import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="bg-white border border-zinc-200 shadow-2xl rounded-lg p-4 pr-12 min-w-[300px] max-w-md relative">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-900">{message}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
