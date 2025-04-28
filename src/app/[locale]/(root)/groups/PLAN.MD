# Kế hoạch triển khai tính năng tag phim

## Tổng quan

Triển khai tính năng tag phim tương tự như tag bạn bè trong comment của Facebook. Người dùng có thể gõ "@" và tên phim để tag phim vào bài viết.

## Cách tiếp cận kỹ thuật

### 1. Xử lý input text

- Sử dụng thư viện `react-mentions` để xử lý chức năng @mention
  - Nhẹ và dễ triển khai
  - Hỗ trợ tùy chỉnh style
  - Có sẵn dropdown gợi ý
  - Hỗ trợ điều hướng bằng bàn phím
  - Hỗ trợ nhiều mention

### 2. Cấu trúc dữ liệu mock

```javascript
const mockMovies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    year: 1994,
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    overview:
      "Framed in the 1940s for the double murder of his wife and her lover...",
    rating: 9.3,
  },
  // ... các phim khác
];
```

### 3. Các bước triển khai

1. **Cài đặt react-mentions**

   - Cài package: `npm install react-mentions`
   - Tạo component wrapper cho input text với mentions

2. **Tạo MovieMentionInput Component**

   - Xử lý trigger @
   - Hiển thị dropdown gợi ý phim
   - Tùy chỉnh style cho mentions
   - Xử lý điều hướng bàn phím

3. **Gợi ý phim**

   - Lọc phim dựa trên input
   - Hiển thị poster và năm phát hành trong gợi ý
   - Giới hạn 5 gợi ý

4. **Lưu trữ dữ liệu**

   - Lưu ID phim trong nội dung bài viết
   - Format: `@[movieId]Tên phim`
   - Parse mentions khi hiển thị bài viết

5. **UI/UX**
   - Animation mượt cho dropdown
   - Feedback rõ ràng khi tag phim
   - Responsive cho mobile
   - Loading state cho gợi ý

### 4. Cấu trúc component

### 5. Cách sử dụng

```jsx
<MovieMentionInput
  value={postContent}
  onChange={handleChange}
  movies={mockMovies}
  placeholder="Viết gì đó..."
/>
```

## Payload khi tạo bài viết

### Cấu trúc payload hiện tại

```javascript
{
  content: string,      // Nội dung bài viết
  groupId: string,      // ID nhóm
  userId: string,       // ID người tạo
  // ... các trường khác
}
```

### Cấu trúc payload sau khi thêm tag phim

```javascript
{
  content: string,      // Nội dung bài viết (có chứa @[movieId]Tên phim)
  groupId: string,      // ID nhóm
  userId: string,       // ID người tạo
  taggedMovies: [       // Mảng các phim được tag
    {
      movieId: string,  // ID phim
      title: string,    // Tên phim
      position: number  // Vị trí tag trong content
    }
  ]
}
```

### Lưu ý

- Không cần thay đổi API server vì có thể parse `taggedMovies` từ `content`
- Có thể thêm trường `taggedMovies` để tối ưu việc query sau này
- Format `@[movieId]Tên phim` giúp dễ dàng parse và hiển thị lại

## Các bước tiếp theo

1. Tạo MovieMentionInput component
2. Triển khai mock data và filtering
3. Thêm styling và animations
4. Test với các kích thước màn hình
5. Tích hợp vào flow tạo bài viết hiện tại

## Dependencies

- react-mentions
