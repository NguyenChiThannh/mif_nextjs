import jwt from 'jsonwebtoken';

export function getUserIdFromToken(token) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            console.error('Không thể giải mã token');
            return null;
        }
        const userId = decoded.sub;
        return userId;
    } catch (error) {
        console.error('Có lỗi khi giải mã token:', error);
        return null;
    }
}
