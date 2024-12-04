'use client'
import Background from "@/app/[locale]/(auth)/bg-movie/background";
import { useAppSelector } from "@/redux/store";
import { Film } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }) {
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth.authState);

  useEffect(() => {
    if (authState.isLogin)
      router.push('/home')
  }, [router, authState.isLogin])

  return (
    <main className="relative w-full lg:min-h-screen xl:min-h-screen bg-black h-screen">

      <div className="absolute flex top-2 left-20 z-50 h-fit">
        <Link href="/home" className="flex items-center gap-2">
          <Film className="h-6 w-6" />
          <span className="text-xl font-bold tracking-[.25em]">MIF</span>
        </Link>
      </div>

      {/* Background MovieStrip */}
      <div className="absolute inset-0 z-0 ">
        <Background />
      </div>

      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blu-none z-10 h-screen"></div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center lg:min-h-screen xl:min-h-screen">
        <div className="bg-background border border-border rounded-lg shadow-md mx-auto w-fit max-w-md sm:max-w-lg">
          {children}
        </div>
      </div>
    </main>
  );
}
