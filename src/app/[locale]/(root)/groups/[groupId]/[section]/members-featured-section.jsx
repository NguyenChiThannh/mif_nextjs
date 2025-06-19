import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BadgeIcon } from '@/components/badge-icon';

export default function MembersFeaturedSection({activeMembers , t}) {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const renderActiveMembersSection = useMemo(() => (
        <motion.div
            variants={itemVariants}
            className="space-y-4 mt-8"
        >
            <p className='text-lg font-bold text-foreground'>{t("active_members")}</p>
            <div className="grid grid-cols-1 gap-4">
                {activeMembers?.map((member, index) => (
                    <motion.div
                        key={member.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Card className="w-full border-border bg-card">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage
                                                    src={member.avatar}
                                                    alt={member.displayName}
                                                />
                                                <AvatarFallback className="text-sm font-medium text-primary">
                                                    {member.displayName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {member.badgeLevel && (
                                                <div className="absolute -bottom-1 -right-1">
                                                    <BadgeIcon level={member.badgeLevel} size="sm" showAnimation />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{member.displayName}</p>
                                            <p className="text-sm text-muted-foreground">Score: {member.totalScore}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    ), [activeMembers]);
  return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-8 mt-6"
        >
            <motion.div variants={itemVariants}>
                <Card className="w-full max-w-3xl mx-auto border-border bg-card">
                    <CardContent>
                        {renderActiveMembersSection}
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}