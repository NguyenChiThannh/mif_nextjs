
export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center justify-center h-screen">
                {/* Logo */}
                <div className="mb-4 animate-bounce">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                        className="w-16 h-16"
                    >
                        {/* Logo Shape - Replace with your own */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="blue"
                            strokeWidth="4"
                            fill="none"
                        />
                    </svg>
                </div>

                {/* Loading Letters */}
                <div className="flex space-x-4 text-4xl font-bold text-primary">
                    {["M", "I", "F"].map((letter, index) => (
                        <span
                            key={index}
                            className="animate-bounce"
                            style={{
                                animationDelay: `${index * 0.2}s`,
                                animationTimingFunction: "ease-in-out",
                            }}
                        >
                            {letter}
                        </span>
                    ))}
                </div>
            </div >
        </div >
    );
};
