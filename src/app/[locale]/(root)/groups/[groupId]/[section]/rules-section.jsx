'use client'
import DialogAddOrEditRuleToGroup from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-add-rule'
import DialogConfirmDelete, { confirmDelete } from '@/components/dialog-confirm-delete'
import Loading from '@/components/loading'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { groupRulesApi } from '@/services/groupRulesApi'
import { MoreHorizontal } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function RulesSection({ isOwner, group, t }) {
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [rule, setRule] = useState('')

    const { data: rules, isLoading } = groupRulesApi.query.useGetRulesByGroupId(group.id)
    const deleteRuleMutation = groupRulesApi.mutation.useDeleteRuleFromGroup(group.id)

    const handleEditRule = (rule) => {
        setIsOpenAdd(true)
        setRule(rule)
    }

    const handleDeleteRule = (rule) => {
        confirmDelete('', (result) => {
            if (result) {
                deleteRuleMutation.mutate({
                    groupId: group.id,
                    ruleId: rule.id,
                })
            }
        });
    }

    if (isLoading || deleteRuleMutation.isPending) return (<Loading />)

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
        >
            <Card className="w-full max-w-3xl mx-auto my-8 border-border bg-card">
                <CardContent>
                    {/* Title */}
                    <motion.div
                        variants={itemVariants}
                        className="my-6 grid gap-2"
                    >
                        <div className='flex justify-between items-center'>
                            <p className="font-bold text-lg text-foreground flex items-center">{t('rules')}</p>
                            {isOwner && (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <DialogAddOrEditRuleToGroup
                                        isOpen={isOpenAdd}
                                        setIsOpen={setIsOpenAdd}
                                        groupId={group.id}
                                        setRule={setRule}
                                        rule={rule}
                                    />
                                </motion.div>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">{t('rules_description')}</p>
                    </motion.div>

                    <Separator className="bg-border" />

                    {/* Rules */}
                    <div className="mt-4">
                        <Accordion type="multiple" collapsible className="w-full">
                            {rules && rules.map((rule, index) => {
                                const number = Number(index) + 1
                                return (
                                    <AccordionItem
                                        value={`item-${number}`}
                                        className="border-border"
                                    >
                                        <AccordionTrigger className="rounded-lg h-fit p-3 hover:bg-muted/50 transition-colors duration-200 my-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-foreground font-medium">
                                                    {t('rules')} {number}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className='flex justify-between items-start p-2'>
                                                <p className='text-muted-foreground text-sm leading-relaxed'>
                                                    {rule.ruleDescription}
                                                </p>
                                                {isOwner && (
                                                    <DropdownMenu modal={false}>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                aria-haspopup="true"
                                                                size="icon"
                                                                variant="ghost"
                                                                className="hover:bg-muted/50"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                                <span className="sr-only">Menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-background border-border">
                                                            <DropdownMenuLabel className="text-foreground">{t("actions")}</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => handleEditRule(rule)}
                                                            >
                                                                {t("edit")}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteRule(rule)}
                                                            >
                                                                {t("delete")}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </div>
                    <DialogConfirmDelete />
                </CardContent>
            </Card>
        </motion.div>
    )
}