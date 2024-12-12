'use client'
import Loading from "@/components/loading";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <Loading />
  );
}