'use client';
import CreatePostDialog from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-create-post';
import Post, { PostSkeleton } from '@/components/post';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { groupPostApi } from '@/services/groupPostApi';
import {
  Clock,
  Eye,
  Filter,
  Lock,
  SquareLibrary,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { categoryApi } from '@/services/movieCategoriesApi';
import React, { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIcon } from '@/components/badge-icon';

export default function FeedSection({ group, canCreate, activeMembers, t }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    groupPostApi.query.useGetPostsByGroupIdInfinite(group.id);

  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

  return (
    <div className='grid md:grid-cols-3 gap-4 grid-cols-2'>
      <div className='grid gap-4 col-span-2'>
        <div className='flex justify-between items-center mt-4'>
          {canCreate && (
            <div>
              <CreatePostDialog groupId={group?.id} />
            </div>
          )}
        </div>

        <div className='space-y-2'>
          {isLoading && (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}
          {data?.pages?.map((page, pageIndex) =>
            page.content.map((post, postIndex) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: postIndex * 0.08 }}
                className="rounded-xl shadow-lg border border-border bg-card/80 hover:shadow-2xl transition-all duration-300"
              >
                <Post post={post} />
              </motion.div>
            ))
          )}
          {isFetchingNextPage && <PostSkeleton />}
          <div ref={observerElem}></div>
          {!hasNextPage && (
            <div className='text-center my-4 text-sm text-muted-foreground'>
              {t('no_more_posts')}
            </div>
          )}
        </div>
      </div>

      {/* Left content */}
      <div>
        <LeftContent group={group} t={t} />
        <MembersFeaturedSection activeMembers={activeMembers} t={t} />
      </div>
    </div>
  );
}

function LeftContent({ group, t }) {
  const { data: movieCategories } =
    categoryApi.query.useGetAllmovieCategories();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='mt-6 hidden md:block'
    >
      <Card className='w-full shadow-xl rounded-2xl'>
        <CardHeader className='font-bold text-lg'>
          {t('introduce')}
        </CardHeader>
        <CardContent className='grid text-sm gap-4'>
          {group.description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-muted-foreground italic'
            >
              {group.description}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className='space-y-2'
          >
            {group.isPublic ? (
              <div className='space-y-1'>
                <p className='flex items-center gap-2 font-bold '>
                  <Users className='h-4 w-4' />
                  {t('public_mode')}
                </p>
                <p className='text-muted-foreground pl-6'>
                  &middot; {t('public_mode_description')}
                </p>
              </div>
            ) : (
              <div className='space-y-1'>
                <p className='flex items-center gap-2 font-bold'>
                  <Lock className='h-4 w-4' />
                  {t('private_mode')}
                </p>
                <p className='text-muted-foreground pl-6'>
                  &middot; {t('private_mode_description')}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='space-y-1'
          >
            <p className='flex items-center gap-2 font-bold'>
              <Eye className='h-4 w-4' />
              {t('display_mode')}
            </p>
            <p className='text-muted-foreground pl-6'>
              &middot; {t('display_mode_description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className='space-y-1'
          >
            <p className='flex items-center gap-2 font-bold'>
              <SquareLibrary className='h-4 w-4' />
              {t('category')}
            </p>
            <p className='text-muted-foreground pl-6'>
              &middot;{' '}
              {movieCategories?.find(
                (category) => category.id === group.categoryId,
              )?.categoryName || t('category_action')}
            </p>
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button
            className='w-full'
            variant='secondary'
          >
            <Link href={`/groups/${group?.id}/about`} className='w-full block'>
              {t('more')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function MembersFeaturedSection({ activeMembers, t }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const renderActiveMembersSection = useMemo(
    () => (
      <motion.div variants={itemVariants} className='space-y-4 mt-8'>
        <p className='text-lg font-bold drop-shadow'>
          {t('active_members')}
        </p>
        <div className='grid grid-cols-1 gap-4'>
          {activeMembers?.map((member, index) => (
            <motion.div
              key={member.userId}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
            >
              <Card className='w-full shadow-sm rounded-xl'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='relative group'>
                        <Avatar className='w-12 h-12 border-2 shadow group-hover:scale-110 transition-transform duration-200'>
                          <AvatarImage
                            src={member.avatar}
                            alt={member.displayName}
                          />
                          <AvatarFallback className='text-sm font-medium bg-background'>
                            {member.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {member.badgeLevel && (
                          <div className='absolute -bottom-1 -right-1 group-hover:scale-110 transition-transform duration-200'>
                            <BadgeIcon
                              level={member.badgeLevel}
                              size='sm'
                              showAnimation
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link href={`/user/${member.userId}`} className='hover:underline'>
                          <p className='font-medium text-foreground'>
                            {member.displayName}
                          </p>
                        </Link>
                        <p className='text-sm text-muted-foreground'>
                          Score: <span className=' font-semibold'>{member.totalScore}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),
    [activeMembers],
  );
  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={containerVariants}
      className='space-y-8 mt-6'
    >
      <motion.div variants={itemVariants}>
        <Card className='w-full max-w-3xl mx-auto border-border bg-card'>
          <CardContent>{renderActiveMembersSection}</CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
