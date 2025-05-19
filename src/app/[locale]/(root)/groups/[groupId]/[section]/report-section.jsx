'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Loading from '@/components/loading';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { reportPostApi } from '@/services/reportPostApi';
import { formatDateOrTimeAgo } from '@/lib/formatter';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Ban } from 'lucide-react';

export default function ReportSection({ groupId }) {
    const t = useTranslations('Groups.Report');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = reportPostApi.query.useGetUnresolvedReportsByGroup(groupId);

    const { data: analysisData } = reportPostApi.query.useAnalyzeReport(
        selectedReport?.id, selectedReport, showAnalysis
    );

    const blockPostMutation = reportPostApi.mutation.useBlockPost(groupId);

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

    if (isLoading) return <Loading />;

    const handleViewAnalysis = (report) => {
        setSelectedReport(report);
        setShowAnalysis(true);
    };

    const handleBlockPost = (postId) => {
        confirmDelete('Bạn muốn chặn bài viết này không', (result) => {
            if (result) {
                blockPostMutation.mutate(postId)
            }
        });
    };

    const renderAnalysisDialog = () => {
        if (!analysisData) return null;

        const categories = analysisData.moderation.results[0].categories;
        const scores = analysisData.moderation.results[0].category_scores;

        return (
            <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Phân tích nội dung</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Nội dung bài viết:</h3>
                            <p className="text-sm text-muted-foreground">{analysisData.post.content}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">Kết quả phân tích:</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(categories).map(([category, flagged]) => (
                                    <div key={category} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                        <span className="text-sm">{category}</span>
                                        <div className="flex items-center gap-2">
                                            {flagged ? (
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            )}
                                            <span className="text-sm">
                                                {(scores[category] * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mt-4">
                <h2 className="text-xl font-bold">Quản lý tố cáo</h2>
                
            </div>
            <div className="grid gap-4">
                {data?.pages?.map((page) =>
                    page.content.map((report) => (
                        <Card key={report.id}>
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between items-center">
                                    <span>Báo cáo #{report.id.slice(-6)}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {formatDateOrTimeAgo(report.reportedAt)}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-semibold">Lý do:</span> {report.reason}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewAnalysis(report)}
                                        >
                                            Xem phân tích
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(`/groups/${groupId}/post/${report.groupPostId}`, '_blank')}
                                        >
                                            Xem bài viết
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleBlockPost(report.groupPostId)}
                                            disabled={blockPostMutation.isLoading}
                                        >
                                            <Ban className="h-4 w-4 mr-2" />
                                            {blockPostMutation.isLoading ? 'Đang chặn...' : 'Chặn bài viết'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
                {isFetchingNextPage && <Loading />}
                <div ref={observerElem} />
            </div>
            <DialogConfirmDelete />
            {renderAnalysisDialog()}
        </div>
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
                    <DialogTitle>Chặn bài viết</DialogTitle>
                </DialogHeader>
                <p>{dialogState.message || t('message_default')}</p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleConfirm(false)}>Hủy</Button>
                    <Button variant="destructive" onClick={() => handleConfirm(true)}>Chặn</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
