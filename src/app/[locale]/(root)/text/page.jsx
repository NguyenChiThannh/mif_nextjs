// import Image from "next/image";
// import "./style.css"
// 'use client'
// import DialogOTP from "@/components/dialog-otp";
// import OTPDialog from "@/components/dialog-otp";
// import { FancyMultiSelect } from "@/components/fancy-multi-select";


// const images = [
//     'https://thanhnien.mediacdn.vn/Uploaded/phongdt/2022_08_04/spider-man-2363.jpg',
//     'https://facts.net/wp-content/uploads/2023/06/37-facts-about-the-movie-titanic-1687656865.jpg',
//     'https://i.ytimg.com/vi/xWh0g4rKGjI/maxresdefault.jpg',
//     'https://live.staticflickr.com/4005/4686746190_31c292dc8c_b.jpg',
//     'https://cdna.artstation.com/p/assets/images/images/017/022/542/large/amirhosein-naseri-desktop-screenshot-2019-04-03-18-17-47-11.jpg?1554338571',
//     'https://townsquare.media/site/442/files/2013/05/man-of-steel-poster-banner.jpg',
//     'https://cdnmedia.baotintuc.vn/2017/04/13/13/44/fastfurious.jpg',
//     'https://images.squarespace-cdn.com/content/v1/5fbc4a62c2150e62cfcb09aa/1657909007498-F339J4NXVFU4CAIJRDIE/the%2Bgodfather%2Bthumbnail%2Breal.png',
//     'https://i.ytimg.com/vi/UmDVjN7EetM/maxresdefault.jpg',
//     'https://cdn.galaxycine.vn/media/2024/6/28/twisters-750_1719558114559.jpg',
//     'https://i.ytimg.com/vi/S1dnnQsY0QU/maxresdefault.jpg',
//     'https://i.ytimg.com/vi/TBZrZpGKzI4/maxresdefault.jpg',
// ]



// export default function MovieStrip() {
//     return (
//         <div className="grid gap-2 rotate-[30deg]">
//             {Array.from({ length: 4 }).map((_, rowIndex) => (
//                 <div key={rowIndex} className="grid grid-cols-4">
//                     {Array.from({ length: 4 }).map((_, colIndex) => {
//                         const imageIndex = rowIndex * 3 + colIndex;
//                         return (
//                             <div key={colIndex} className="movie-strip">
//                                 <div className="strip-row">
//                                     {Array.from({ length: 7 }).map((_, squareIndex) => (
//                                         <div key={squareIndex} className="strip-square"></div>
//                                     ))}
//                                 </div>
//                                 <div className="strip-main">
//                                     <div className="strip-frame">
//                                         <Image
//                                             src={images[imageIndex]} // Use dynamic images here
//                                             alt={`Movie Frame ${imageIndex}`}
//                                             height={152}
//                                             width={400}
//                                             className="h-[152px]"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="strip-row">
//                                     {Array.from({ length: 7 }).map((_, squareIndex) => (
//                                         <div key={squareIndex} className="strip-square"></div>
//                                     ))}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             ))}
//         </div>
//     );
// }

// import React from "react";

// const genres = [
//     { value: 'action', label: 'Action' },
//     { value: 'comedy', label: 'Comedy' },
//     { value: 'drama', label: 'Drama' },
//     { value: 'horror', label: 'Horror' },
//     { value: 'sci-fi', label: 'Sci-Fi' },
//     { value: 'romance', label: 'Romance' },
// ];

// export default function MovieForm() {
//     const [selectedGenres, setSelectedGenres] = React.useState([]);

//     const handleSelectionChange = (selected) => {
//         setSelectedGenres(selected);
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         // Sử dụng selectedGenres ở đây
//         console.log("Selected genres:", selectedGenres);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="grid gap-4">
//             <div className="flex justify-between">
//                 <p className="text-2xl font-bold">Create Movie</p>
//                 <button type="submit" className="btn-primary">Submit</button>
//             </div>


//             <DialogOTP />

//             {/* FancyMultiSelect */}
//             <div className="grid grid-cols-1 gap-4">
//                 <div className="col-span-1">
//                     <p className="text-sm font-semibold pb-2">Genres</p>
//                     <FancyMultiSelect
//                         values={genres}
//                         initialSelected={[]}
//                         onSelectionChange={handleSelectionChange}
//                     />
//                 </div>
//             </div>

//             {/* Bạn có thể render các thể loại đã chọn bên dưới */}
//             <div>
//                 <p className="text-sm font-semibold">Selected Genres:</p>
//                 <ul>
//                     {selectedGenres.map((genre) => (
//                         <li key={genre.value}>{genre.label}</li>
//                     ))}
//                 </ul>
//             </div>
//         </form>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// URL của WebSocket
const SOCKET_URL = "http://localhost:8080/ws"; // Chỉnh sửa URL theo backend của bạn

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [client, setClient] = useState(null);

    const token =
        "eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3R1c2VyMkBleGFtcGxlLmNvbSIsInN1YiI6IjY2YzJkZmI4ZWYxNGRlN2YwZGEyZDRlMCIsImlhdCI6MTczMzI0MDUxMCwiZXhwIjoxNzQxODgwNTEwfQ.EN9pQwqJFsOG7rj87DSfNJ9VhExaCGQJEHxgBEYt4JU"; // Thay thế bằng token thực tế của bạn

    // Khởi tạo kết nối WebSocket khi component mount
    useEffect(() => {
        // Tạo kết nối SockJS
        const socket = new SockJS(SOCKET_URL); // Kết nối SockJS với URL của server
        const stompClient = new Client({
            webSocketFactory: () => socket, // Sử dụng SockJS làm kết nối WebSocket
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                Authorization: `Bearer ${token}`, // Đính kèm token vào header khi kết nối
            },
            onConnect: (frame) => {
                console.log("Connected:", frame);
                setIsConnected(true); // Đánh dấu đã kết nối
                // Subscribe để nhận thông báo
                stompClient.subscribe(
                    `/user/queue/notifications`, // Thay đổi ID người dùng ở đây
                    (msg) => {
                        if (msg.body) {
                            const notification = JSON.parse(msg.body);
                            setNotifications((prevNotifications) => {
                                console.log(notification);
                                // Kiểm tra nếu thông báo đã tồn tại trong list
                                const isDuplicate = prevNotifications.some(
                                    (existingNotification) =>
                                        existingNotification.id === notification.id
                                );
                                if (isDuplicate) {
                                    return prevNotifications; // Nếu trùng lặp, không thêm vào
                                } else {
                                    return [...prevNotifications, notification]; // Nếu không trùng lặp, thêm vào
                                }
                            });
                        }
                    }
                );
            },
            onDisconnect: () => {
                console.log("Disconnected!");
                setIsConnected(false); // Đánh dấu đã ngắt kết nối
            },
        });

        // Kích hoạt client WebSocket
        stompClient.activate();

        // Lưu lại client để sử dụng sau này
        setClient(stompClient);

        // Dọn dẹp khi component unmount
        return () => {
            if (stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, []); // Chỉ chạy 1 lần khi component mount

    return (
        <div>
            <h1>Notification Center</h1>
            <div>
                {isConnected ? "Connected to WebSocket!" : "Connecting to WebSocket..."}
            </div>
            <div>
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div key={index}>
                            <strong>{notification.message}</strong>
                            <p>{notification.type}</p>
                            <p>{new Date(notification.createdAt).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No notifications yet</p>
                )}
            </div>
        </div>
    );
};

export default NotificationComponent;