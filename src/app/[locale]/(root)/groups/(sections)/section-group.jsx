'use client'
import CardGroups, { CardGroupsSkeleton } from '@/components/card-groups'
import { DialogCreateGroup } from '@/app/[locale]/(root)/groups/(components)/dialog-create-group'
import Title from '@/components/title'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { groupsApi } from '@/services/groupsApi'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const tab = (t) => [
    {
        title: "all",
        display_title: t('all'),
    },
    {
        title: "ownerGroups",
        display_title: t('groups_you_have_created'),
    },
    {
        title: "userGroups",
        display_title: t('groups_you_have_joined'),
    }
]

export function SectionGroup({ movieCategories, userId, t }) {
    const [activeTab, setActiveTab] = useState('all');

    const { isLoading: loadingOwnerGroups, data: ownerGroups } = groupsApi.query.useFindByOwnerId(0, 24)
    const { isLoading: loadingUserGroups, data: userGroups } = groupsApi.query.useGetUserGroups(0, 24, userId)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            <div>
                <Title title={t('title')} isMore={false} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <motion.div
                    className="flex gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {tab(t).map((item, index) => (
                        <Button
                            key={index}
                            size="sm"
                            variant={activeTab === item.title ? "default" : "outline"}
                            onClick={() => setActiveTab(item.title)}
                            className="transition-all duration-200"
                        >
                            {item.display_title}
                        </Button>
                    ))}
                </motion.div>

                <motion.div
                    className="flex gap-2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <DialogCreateGroup movieCategories={movieCategories} />
                </motion.div>
            </div>

            <motion.div
                className="grid gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
                variants={containerVariants}
            >
                {loadingOwnerGroups || loadingUserGroups ? (
                    <>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <CardGroupsSkeleton />
                            </motion.div>
                        ))}
                    </>
                ) : (
                    <>
                        {activeTab === 'ownerGroups' &&
                            ownerGroups.content.map((group, index) => (
                                <motion.div
                                    key={group.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CardGroups group={group} initialStatus="joined" categories={movieCategories} />
                                </motion.div>
                            ))}
                        {activeTab === 'userGroups' &&
                            userGroups.content.map((group, index) => (
                                <motion.div
                                    key={group.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CardGroups group={group} initialStatus="joined" categories={movieCategories} />
                                </motion.div>
                            ))}
                        {activeTab === 'all' && (
                            <>
                                {Array.from(
                                    new Map(
                                        [...ownerGroups.content, ...userGroups.content].map(group => [group.id, group])
                                    ).values()
                                ).map((group, index) => (
                                    <motion.div
                                        key={group.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CardGroups
                                            group={group}
                                            initialStatus="joined"
                                            categories={movieCategories}
                                        />
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </motion.div>
        </motion.div>
    )
}
