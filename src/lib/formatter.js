
export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatToVietnameseDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Sử dụng định dạng 24 giờ
    });
};


export const calculateTimeAgo = (isoString) => {
    const now = new Date();
    const timestamp = new Date(isoString).getTime();
    const secondsPast = (now.getTime() - timestamp) / 1000;

    if (secondsPast < 60) {
        return `${Math.floor(secondsPast)} giây trước`;
    }
    if (secondsPast < 3600) {
        return `${Math.floor(secondsPast / 60)} phút trước`;
    }
    if (secondsPast < 86400) {
        return `${Math.floor(secondsPast / 3600)} giờ trước`;
    }
    if (secondsPast < 2592000) {
        return `${Math.floor(secondsPast / 86400)} ngày trước`;
    }
    if (secondsPast < 31536000) {
        return `${Math.floor(secondsPast / 2592000)} tháng trước`;
    }
    return `${Math.floor(secondsPast / 31536000)} năm trước`;
};

export const formatDateOrTimeAgo = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();

    const isSameDay = (date, now) => {
        return date.toDateString() === now.toDateString();
    };

    if (isSameDay(date, now)) {
        return calculateTimeAgo(isoString);
    } else {
        return formatToVietnameseDateTime(isoString);
    }
};


export const formateTimestampToIso = (timestamp) => {
    let date = new Date(timestamp * 1000);
    return date.toISOString();
}
