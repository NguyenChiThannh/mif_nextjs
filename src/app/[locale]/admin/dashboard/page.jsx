'use client'
import Loading from "@/components/loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeDashboard() {
  const router = useRouter();
  useEffect(() => {
    router.push('/admin/dashboard/home');
  }, [router]);

  return (
    <Loading />
  );
}
