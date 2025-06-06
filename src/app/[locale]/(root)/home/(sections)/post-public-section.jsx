'use client'
import Post, { PostSkeleton } from '@/components/post';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { groupPostApi } from '@/services/groupPostApi';
import { useTranslations } from 'next-intl';
import React from 'react';
import { motion } from 'framer-motion';

export default function PostPublicSection() {
    const t = useTranslations();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = groupPostApi.query.useGetAllPosts();

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            className='grid gap-8'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {isLoading && (
                <>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <PostSkeleton />
                        </motion.div>
                    ))}
                </>
            )}
            {data?.pages?.map((page, pageIndex) =>
                page.content.map((post, postIndex) => (
                    <motion.div
                        key={post.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                            delay: (pageIndex * page.content.length + postIndex) * 0.1
                        }}
                    >
                        <Post post={post} isGroup={true} />
                    </motion.div>
                ))
            )}
            {isFetchingNextPage && (
                <motion.div variants={itemVariants}>
                    <PostSkeleton />
                </motion.div>
            )}
            <div ref={observerElem}></div>
            {!hasNextPage && (
                <motion.div
                    className="text-center my-4 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {t("you_have_read_the_entire_article")}
                </motion.div>
            )}
        </motion.div>
    );
}
