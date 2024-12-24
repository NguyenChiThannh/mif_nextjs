'use client';
import HeaderAdmin from "@/components/header-admin";
import { navDashboardMenuConfig } from "@/lib/navigationConfig";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
    const pathname = usePathname();

    const t = useTranslations('Dashboard.Navbar');

    return (
        <main>
            <HeaderAdmin />
            <div className="xl:px-36 lg:px-2 md:px-2 px-1 pt-24">
                <div className="grid grid-cols-5 gap-4">
                    <SidebarMenu t={t} pathname={pathname} />
                    <div className="col-span-4">{children}</div>
                </div>
            </div>
        </main>
    );
}

function SidebarMenu({ t, pathname }) {
    return (
        <div className="col-span-1">
            <div className="space-y-4 text-sm font-medium">
                {navDashboardMenuConfig(t).map((item, index) => {
                    const { href, icon: Icon, title, active } = item;
                    return (
                        <Link
                            key={index}
                            href={href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-all duration-300 ease-in-out 
                                ${active(pathname) ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Icon className="h-5 w-5" />
                            {title}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}