
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


export const calculateTimeAgo = (isoString, locale) => {  
    const now = new Date();
    const timestamp = new Date(isoString).getTime();
    const secondsPast = (now.getTime() - timestamp) / 1000;

    const translations = {
        vi: ["giây trước", "phút trước", "giờ trước", "ngày trước", "tháng trước", "năm trước"],
        en: ["seconds ago", "minutes ago", "hours ago", "days ago", "months ago", "years ago"]
    };

    const t = translations[locale] || translations.vi;

    if (secondsPast < 60) {
        return `${Math.floor(secondsPast)} ${t[0]}`;
    }
    if (secondsPast < 3600) {
        return `${Math.floor(secondsPast / 60)} ${t[1]}`;
    }
    if (secondsPast < 86400) {
        return `${Math.floor(secondsPast / 3600)} ${t[2]}`;
    }
    if (secondsPast < 2592000) {
        return `${Math.floor(secondsPast / 86400)} ${t[3]}`;
    }
    if (secondsPast < 31536000) {
        return `${Math.floor(secondsPast / 2592000)} ${t[4]}`;
    }
    return `${Math.floor(secondsPast / 31536000)} ${t[5]}`;
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

export const getYouTubeThumbnail = (url) => {
    try {
        const id = new URL(url).searchParams.get("v");
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    } catch {
        return null;
    }
};
