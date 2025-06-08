'use client'
import { memo, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { MessageCircle, AlignJustify } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import BadgeIcon from "@/components/badge-icon"
import { MenuProfile } from "@/components/menu-profile"
import { NotificationPopover } from "@/components/popover-notification"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import "@/components/css/header.css"
import useIsLogin from "@/hooks/useIsLogin"
import useUserId from "@/hooks/useUserId"
import SearchHeader from "@/components/search-header"
import { headerMenuConfig } from "@/lib/navigationConfig"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { LanguageToggle } from "@/components/language-toggle"
import { motion, AnimatePresence } from "framer-motion"

const Header = memo(() => {
    const [open, setOpen] = useState(false)
    const t = useTranslations('Header')
    const isLogin = useIsLogin();
    const userId = useUserId()
    const currentPath = usePathname()
    const linksRef = useRef([])
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const paths = ['/home', '/movies', '/actor', '/groups'];
        const matchPath = paths.find(path => currentPath.includes(path));
        if (matchPath) {
            const index = paths.indexOf(matchPath);
            setActiveIndex(index);
        }
        const index = paths.indexOf(matchPath);
        setActiveIndex(index !== -1 ? index : -1);
    }, [currentPath]);

    return (
        <div className="fixed w-full z-[15] drop-shadow-xl">
            <motion.div
                className={`xl:px-40 lg:px-2 md:px-2 px-1 flex items-center justify-between py-3 bg-background/80 backdrop-blur-md border-b transition-all duration-300 }`}
            >
                {/* Mobile Menu */}
                <div className="md:hidden flex items-center z-50">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                                <AlignJustify className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-4 bg-background/95 backdrop-blur-md">
                            <div className="flex flex-col gap-4">
                                {headerMenuConfig(t).map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={`text-sm font-semibold transition-colors duration-200
                                                ${item.active(currentPath) ? 'text-primary' : 'text-foreground hover:text-primary'}
                                            `}
                                        prefetch={false}
                                    >
                                        {item.title}
                                    </Link>

                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Logo */}
                <Link
                    href="/home"
                    className="hidden md:flex items-center gap-2"
                    prefetch={false}
                >
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="transition-transform duration-300"
                    />
                    <motion.span
                        className="text-xl font-bold tracking-[.25em] text-foreground group-hover:text-primary transition-colors duration-200"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        MIF
                    </motion.span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex relative gap-2">
                    <div className="flex items-center gap-6">
                        {headerMenuConfig(t).map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className={`text-sm font-semibold transition-colors duration-200
                                    ${item.active(currentPath) ? 'text-primary' : 'text-foreground hover:text-primary'}
                                `}
                                prefetch={false}
                                ref={el => linksRef.current[index] = el}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    <div
                        className="absolute h-1 bg-red-600 rounded-lg -bottom-2 transition ease-in-out"
                        style={{
                            left: linksRef.current[activeIndex]?.offsetLeft,
                            width: linksRef.current[activeIndex]?.offsetWidth,
                            transition: 'left 0.3s ease, width 0.3s ease'
                        }}
                    />
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {!isLogin ? (
                        <Link href='/sign-in'>
                            <Button className="bg-primary hover:bg-primary/90 transition-colors duration-200">
                                {t("login")}
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <SearchHeader t={t} />
                            <NotificationPopover t={t} />
                            <Link href='/chat'>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-muted transition-colors duration-200"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span className="sr-only">Messages</span>
                                </Button>
                            </Link>
                            <ModeToggle />
                            <LanguageToggle />
                            <MenuProfile id={userId} goToAdmin />
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
})

Header.displayName = "Header";

export default Header;