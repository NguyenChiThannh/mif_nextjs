'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from '@/components/loading';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { reportPostApi } from '@/services/reportPostApi';
import { formatDate, formatDateOrTimeAgo } from '@/lib/formatter';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Ban, ShieldAlert, Flag, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportSection({ groupId }) {
    const t = useTranslations('Groups.Report');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [activeTab, setActiveTab] = useState("reports");

    const {
        data: reportsData,
        fetchNextPage: fetchNextReports,
        hasNextPage: hasNextReports,
        isFetchingNextPage: isFetchingNextReports,
        isLoading: isLoadingReports,
    } = reportPostApi.query.useGetUnresolvedReportsByGroup(groupId);

    const {
        data: blockedData,
        fetchNextPage: fetchNextBlocked,
        hasNextPage: hasNextBlocked,
        isFetchingNextPage: isFetchingNextBlocked,
        isLoading: isLoadingBlocked,
    } = reportPostApi.query.useGetBlockedPostsByGroup(groupId);

    const { data: analysisData } = reportPostApi.query.useAnalyzeReport(
        selectedReport?.id, selectedReport, showAnalysis
    );

    const blockPostMutation = reportPostApi.mutation.useBlockPost(groupId);
    const unBlockPostMutation = reportPostApi.mutation.useUnBlockPost(groupId);

    const reportsObserverElem = useInfiniteScroll(hasNextReports, fetchNextReports);
    const blockedObserverElem = useInfiniteScroll(hasNextBlocked, fetchNextBlocked);

    const handleViewAnalysis = (report) => {
        setSelectedReport(report);
        setShowAnalysis(true);
    };

    const handleBlockPost = (reportId) => {
        confirmDelete('Bạn muốn chặn bài viết này không', (result) => {
            if (result) {
                blockPostMutation.mutate(reportId)
            }
        });
    };

    const handleUnblockPost = (reportId) => {
        confirmDelete('Bạn muốn bỏ chặn bài viết này không', (result) => {
            if (result) {
                unBlockPostMutation.mutate(reportId);
            }
        });
    };

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
        visible: { opacity: 1, y: 0 }
    };

    const renderAnalysisDialog = () => {
        if (!analysisData) return null;

        const categories = analysisData.moderation.results[0].categories;
        const scores = analysisData.moderation.results[0].category_scores;

        return (
            <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-foreground">Phân tích nội dung</DialogTitle>
                    </DialogHeader>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Tiêu đề bài viết:</h3>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{analysisData.post.title}</p>
                            <h3 className="font-semibold text-foreground">Nội dung bài viết:</h3>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{analysisData.post.content}</p>
                        </div>
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground">Kết quả phân tích:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(categories).map(([category, flagged], index) => (
                                    <motion.div
                                        key={category}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <span className="text-sm font-medium text-foreground">{category}</span>
                                        <div className="flex items-center gap-2">
                                            {flagged ? (
                                                <XCircle className="h-4 w-4 text-destructive" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            )}
                                            <span className="text-sm font-medium">
                                                {(scores[category] * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </DialogContent>
            </Dialog>
        );
    };

    const renderReportedPosts = () => {
        if (isLoadingReports) return <Loading />;

        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
            >
                {reportsData?.pages?.map((page) =>
                    page.content.map((report, index) => (
                        <motion.div
                            key={report.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="border-border bg-card hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Flag className="h-4 w-4 text-destructive" />
                                                <span className="text-foreground">Báo cáo #{report.id.slice(-6)}</span>
                                                <Badge variant={report.status === 'PENDING' ? 'warning' : 'destructive'}>
                                                    {report.status}
                                                </Badge>
                                            </CardTitle>
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(report.createdAt)}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-sm">
                                            {report.reportCount} báo cáo
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>Người đăng: {report.ownerUsername}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm text-foreground">Danh sách báo cáo:</h4>
                                            {report.groupReports.map((groupReport, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                                        <div className="flex-1 space-y-1">
                                                            <div className="text-sm">
                                                                <span className="font-medium text-foreground">Lý do:</span> {groupReport.reason}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDateOrTimeAgo(groupReport.reportedAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {index < report.groupReports.length - 1 && <Separator />}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewAnalysis(report)}
                                                className="hover:bg-muted"
                                            >
                                                Xem phân tích
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`/groups/${groupId}/post/${report.postId}`, '_blank')}
                                                className="hover:bg-muted"
                                            >
                                                Xem bài viết
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleBlockPost(report.id)}
                                                disabled={blockPostMutation.isLoading}
                                                className="hover:bg-destructive/90"
                                            >
                                                <Ban className="h-4 w-4 mr-2" />
                                                {blockPostMutation.isLoading ? 'Đang chặn...' : 'Chặn bài viết'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
                {isFetchingNextReports && <Loading />}
                <div ref={reportsObserverElem} />
            </motion.div>
        );
    };

    const renderBlockedPosts = () => {
        if (isLoadingBlocked) return <Loading />;

        return (
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4"
            >
                {blockedData?.pages?.map((page) =>
                    page.content.map((report, index) => (
                        <motion.div
                            key={report.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="border-border bg-card hover:shadow-lg transition-all duration-300">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <Ban className="h-4 w-4 text-destructive" />
                                                <span className="text-foreground">Báo cáo #{report.id.slice(-6)}</span>
                                                <Badge variant="destructive">BLOCKED</Badge>
                                            </CardTitle>
                                            <div className="text-sm text-muted-foreground">
                                                {formatDate(report.updatedAt)}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-sm">
                                            {report.reportCount} báo cáo
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4" />
                                            <span>Người đăng: {report.ownerUsername}</span>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-sm text-foreground">Lý do bị chặn:</h4>
                                            {report.groupReports.map((groupReport, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="space-y-2"
                                                >
                                                    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {groupReport.reporterId.slice(-2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="text-sm">
                                                                <span className="font-medium text-foreground">Lý do:</span> {groupReport.reason}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {formatDateOrTimeAgo(groupReport.reportedAt)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {index < report.groupReports.length - 1 && <Separator />}
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`/groups/${groupId}/post/${report.postId}`, '_blank')}
                                                className="hover:bg-muted"
                                            >
                                                Xem bài viết
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleUnblockPost(report.id)}
                                                disabled={unBlockPostMutation.isLoading}
                                                className="hover:bg-muted"
                                            >
                                                <ShieldAlert className="h-4 w-4 mr-2" />
                                                {unBlockPostMutation.isLoading ? 'Đang bỏ chặn...' : 'Bỏ chặn bài viết'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
                {isFetchingNextBlocked && <Loading />}
                <div ref={blockedObserverElem} />
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-2 mt-4">
                <h2 className="text-2xl font-bold text-foreground">Quản lý tố cáo</h2>
            </div>

            <Tabs defaultValue="reports" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                    <TabsTrigger value="reports" className="data-[state=active]:bg-background">
                        Bài viết bị tố cáo
                    </TabsTrigger>
                    <TabsTrigger value="blocked" className="data-[state=active]:bg-background">
                        Bài viết bị chặn
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="reports">
                    {renderReportedPosts()}
                </TabsContent>
                <TabsContent value="blocked">
                    {renderBlockedPosts()}
                </TabsContent>
            </Tabs>

            <DialogConfirmDelete />
            {renderAnalysisDialog()}
        </motion.div>
    );
}

let setDialogState, onDialogResult;
function confirmDelete(message, callback) {
    if (setDialogState) {
        setDialogState({
            isOpen: true,
            message: message,
            result: null,
        });
        onDialogResult = callback;
    }
}

function DialogConfirmDelete() {
    const t = useTranslations('DialogConfirmDelete')

    const [dialogState, setDialogStateInternal] = useState({
        isOpen: false,
        message: '',
        result: null,
    });

    setDialogState = setDialogStateInternal;

    const handleConfirm = (result) => {
        setDialogStateInternal({
            ...dialogState,
            isOpen: false,
            result,
        });
        onDialogResult(result);
    };

    return (
        <Dialog open={dialogState.isOpen} onOpenChange={() => handleConfirm(false)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground">Xác nhận</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">{dialogState.message || t('message_default')}</p>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleConfirm(false)}
                        className="hover:bg-muted"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleConfirm(true)}
                        className="hover:bg-destructive/90"
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
