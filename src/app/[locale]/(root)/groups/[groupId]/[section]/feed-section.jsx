'use client'
import CreatePostDialog from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-create-post'
import Post, { PostSkeleton } from '@/components/post'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { groupPostApi } from '@/services/groupPostApi'
import { Clock, Eye, Filter, Lock, SquareLibrary, Star, TrendingUp, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

export default function FeedSection({ group, canCreate }) {

    const t = useTranslations('Groups')

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = groupPostApi.query.useGetPostsByGroupIdInfinite(group.id)

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

    return (
        <div className="grid md:grid-cols-3 gap-4 grid-cols-2">
            <div className="grid gap-4 col-span-2">
                <div className="flex justify-between items-center mt-4">
                    {canCreate && (
                        <div >
                            <CreatePostDialog groupId={group?.id} />
                        </div>

                    )}
                </div>

                <div className="space-y-2">
                    {isLoading && (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    )}
                    {data?.pages?.map((page, index) =>
                        page.content.map((post) => (
                            <Post key={post.id} post={post} />
                        ))
                    )}
                    {isFetchingNextPage && (
                        <PostSkeleton />
                    )}
                    <div ref={observerElem}></div>
                    {!hasNextPage && (
                        <div className="text-center my-4 text-sm text-muted-foreground">{t('no_more_posts')}</div>
                    )}
                </div>
            </div>

            {/* Left content */}
            <LeftContent group={group} t={t} />

        </div>
    )
}

function LeftContent({ group, t }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 hidden md:block"
        >
            <Card className="w-full border-border bg-card">
                <CardHeader className="font-bold text-foreground">
                    {t('introduce')}
                </CardHeader>
                <CardContent className="grid text-sm gap-4">
                    {group.description && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground"
                        >
                            {group.description}
                        </motion.p>
                    )}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                    >
                        {group.isPublic ? (
                            <div className="space-y-1">
                                <p className="flex items-center gap-2 font-bold text-foreground">
                                    <Users className="h-4 w-4 text-primary" />
                                    {t('public_mode')}
                                </p>
                                <p className="text-muted-foreground pl-6">
                                    &middot; {t('public_mode_description')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="flex items-center gap-2 font-bold text-foreground">
                                    <Lock className="h-4 w-4 text-primary" />
                                    {t('private_mode')}
                                </p>
                                <p className="text-muted-foreground pl-6">
                                    &middot; {t('private_mode_description')}
                                </p>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-1"
                    >
                        <p className="flex items-center gap-2 font-bold text-foreground">
                            <Eye className="h-4 w-4 text-primary" />
                            {t('display_mode')}
                        </p>
                        <p className="text-muted-foreground pl-6">
                            &middot; {t('display_mode_description')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-1"
                    >
                        <p className="flex items-center gap-2 font-bold text-foreground">
                            <SquareLibrary className="h-4 w-4 text-primary" />
                            {t('category')}
                        </p>
                        <p className="text-muted-foreground pl-6">
                            &middot; Phim hành động
                        </p>
                    </motion.div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors duration-200"
                        variant="secondary"
                    >
                        <Link
                            href={`/groups/${group?.id}/about`}
                            className="w-full"
                        >
                            {t('more')}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
