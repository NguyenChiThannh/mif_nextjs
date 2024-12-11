import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                {/* Logo */}
                <div
                    className="flex justify-center items-center h-20 w-20"
                    style={{
                        animation: "bounce 1s infinite ease-in-out",
                        animationDelay: "0.2s",
                    }}
                >
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={80}
                        height={80}
                    />
                </div>

                {/* Loading Letters */}
                <div className="flex space-x-4 text-4xl font-bold">
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
            </div>
        </div>
    );
};
