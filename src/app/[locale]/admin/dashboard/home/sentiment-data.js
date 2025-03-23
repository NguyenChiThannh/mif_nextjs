
// Add mock sentiment data
const sentimentData = [
    { name: 'Positive', value: 65, color: '#10b981' },
    { name: 'Negative', value: 20, color: '#ef4444' },
    { name: 'Neutral', value: 15, color: '#6b7280' }
];

// Add mock movie sentiment comparison data
const movieSentimentData = [
    {
        name: 'Avengers: Endgame',
        positive: 75,
        negative: 10,
        neutral: 15,
        totalComments: 1250
    },
    {
        name: 'The Godfather',
        positive: 85,
        negative: 5,
        neutral: 10,
        totalComments: 980
    },
    {
        name: 'Titanic',
        positive: 60,
        negative: 25,
        neutral: 15,
        totalComments: 1100
    },
    {
        name: 'Star Wars: The Last Jedi',
        positive: 45,
        negative: 40,
        neutral: 15,
        totalComments: 1500
    },
    {
        name: 'Joker',
        positive: 55,
        negative: 30,
        neutral: 15,
        totalComments: 1300
    }
];

// Update mock detailed ratings data to match the provided structure
const detailedRatingsData = [
    {
        id: "674aa1b5636b510660ba03ef",
        ratingValue: 5,
        movieId: "66d73a246f744579aaed006a",
        movieName: "The Godfather",
        user: {
            id: "6741fe91821b58239de2aac7",
            displayName: "Tuấn Đặng IT",
            profilePictureUrl: "https://mif-bucket-1.s3.ap-southeast-1.amazonaws.com/3cc8b5ec-21fc-4bdf-a7d8-8b2b229cd96a_images (3).jpg"
        },
        comment: "Phim rất hay",
        updatedAt: "2024-12-11T20:57:01.981+00:00",
        createdAt: "2024-11-30T05:25:09.099+00:00",
        sentiment: "POSITIVE",
        positiveScore: 0.8867672324180603,
        negativeScore: 0.008063049986958504,
        neutralScore: 0.0951593083618208766,
        mixedScore: 0.010010392352938652
    },
    {
        id: "674aa1b5636b510660ba03e1",
        ratingValue: 4,
        movieId: "66d73a246f744579aaed006a",
        movieName: "The Godfather",
        user: {
            id: "6741fe91821b58239de2aac8",
            displayName: "Minh Nguyễn",
            profilePictureUrl: "https://mif-bucket-1.s3.ap-southeast-1.amazonaws.com/user-profile.jpg"
        },
        comment: "Một tác phẩm kinh điển của điện ảnh thế giới",
        updatedAt: "2024-12-10T15:30:01.981+00:00",
        createdAt: "2024-11-29T12:15:09.099+00:00",
        sentiment: "POSITIVE",
        positiveScore: 0.7567672324180603,
        negativeScore: 0.118063049986958504,
        neutralScore: 0.1151593083618208766,
        mixedScore: 0.010010392352938652
    },
    {
        id: "674aa1b5636b510660ba03e2",
        ratingValue: 2,
        movieId: "66d73a246f744579aaed006b",
        movieName: "Star Wars: The Last Jedi",
        user: {
            id: "6741fe91821b58239de2aac9",
            displayName: "Hương Trần",
            profilePictureUrl: "https://mif-bucket-1.s3.ap-southeast-1.amazonaws.com/user-profile-2.jpg"
        },
        comment: "Phim không đáp ứng được kỳ vọng của người hâm mộ",
        updatedAt: "2024-12-09T10:45:01.981+00:00",
        createdAt: "2024-11-28T08:20:09.099+00:00",
        sentiment: "NEGATIVE",
        positiveScore: 0.108063049986958504,
        negativeScore: 0.7867672324180603,
        neutralScore: 0.0951593083618208766,
        mixedScore: 0.010010392352938652
    },
    {
        id: "674aa1b5636b510660ba03e3",
        ratingValue: 3,
        movieId: "66d73a246f744579aaed006b",
        movieName: "Star Wars: The Last Jedi",
        user: {
            id: "6741fe91821b58239de2aad0",
            displayName: "Thành Lê",
            profilePictureUrl: "https://mif-bucket-1.s3.ap-southeast-1.amazonaws.com/user-profile-3.jpg"
        },
        comment: "Có những cảnh đẹp nhưng cốt truyện còn nhiều điểm chưa hợp lý",
        updatedAt: "2024-12-08T14:22:01.981+00:00",
        createdAt: "2024-11-27T16:40:09.099+00:00",
        sentiment: "MIXED",
        positiveScore: 0.408063049986958504,
        negativeScore: 0.3867672324180603,
        neutralScore: 0.1951593083618208766,
        mixedScore: 0.010010392352938652
    },
    {
        id: "674aa1b5636b510660ba03e4",
        ratingValue: 5,
        movieId: "66d73a246f744579aaed006c",
        movieName: "Avengers: Endgame",
        user: {
            id: "6741fe91821b58239de2aad1",
            displayName: "Phương Anh",
            profilePictureUrl: "https://mif-bucket-1.s3.ap-southeast-1.amazonaws.com/user-profile-4.jpg"
        },
        comment: "Tuyệt vời! Kết thúc hoàn hảo cho Infinity Saga",
        updatedAt: "2024-12-07T09:15:01.981+00:00",
        createdAt: "2024-11-26T11:30:09.099+00:00",
        sentiment: "POSITIVE",
        positiveScore: 0.8267672324180603,
        negativeScore: 0.048063049986958504,
        neutralScore: 0.1151593083618208766,
        mixedScore: 0.010010392352938652
    }
];

export { sentimentData, movieSentimentData, detailedRatingsData }