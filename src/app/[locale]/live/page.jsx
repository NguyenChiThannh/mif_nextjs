'use client'

import useUserId from '@/hooks/useUserId'
import { userApi } from '@/services/userApi'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import Script from 'next/script'

export default function LiveStreamPage() {
    const searchParams = useSearchParams()
    const roomId = searchParams.get('roomID')
    const role = searchParams.get('role')
    console.log('🚀 ~ LiveStreamPage ~ role:', role)
    const userId = useUserId()
    const { data: user, isLoading } = userApi.query.useGetUserInfoById(userId)
    const zegoRef = useRef(null)

    // Xử lý khởi tạo Zego khi script load xong
    const handleScriptLoad = () => {
        if (!user || !roomId || !window.ZegoUIKitPrebuilt) return;

        const appID = 84210812;
        const serverSecret = "5bacd772ffbaef9a664945d0abb4c175";

        const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            userId,
            user.displayName || `User_${userId}`
        );

        // Get role from URL
        const role = searchParams.get('role') === 'Audience'
            ? window.ZegoUIKitPrebuilt.Audience
            : window.ZegoUIKitPrebuilt.Host;

        const config = {
            turnOnCameraWhenJoining: false,
            showMyCameraToggleButton: true,
            showAudioVideoSettingsButton: true,
            showScreenSharingButton: true,
            showTextChat: true,
            showUserList: true,
        };

        // Cleanup previous instance if exists
        if (zegoRef.current) {
            zegoRef.current.destroy();
        }

        // Create new instance
        const zp = window.ZegoUIKitPrebuilt.create(kitToken);
        zegoRef.current = zp;

        zp.joinRoom({
            container: document.querySelector("#zego-root"),
            scenario: {
                mode: window.ZegoUIKitPrebuilt.LiveStreaming,
                config: { role },
            },
            sharedLinks: [{
                name: 'Join as an audience',
                url: `${window.location.origin}/live?roomID=${roomId}&role=Audience`,
            }],
            ...config
        });
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (zegoRef.current) {
                zegoRef.current.destroy();
            }
        };
    }, []);

    if (isLoading) return <div>Loading...</div>

    return (
        <>
            <Script
                src="https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js"
                strategy="afterInteractive"
                onLoad={handleScriptLoad}
            />
            <div
                id="zego-root"
                className="w-screen h-screen"
                style={{
                    width: '100vw',
                    height: '100vh'
                }}
            />
        </>
    )
}