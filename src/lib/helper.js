import jwt from 'jsonwebtoken';

export function getUserIdFromToken(token) {
    try {
        console.log('Here')
        const decoded = jwt.decode(token);
        console.log('🚀 ~ getUserIdFromToken ~ decoded:', decoded)
        if (!decoded) {
            console.error('Không thể giải mã token');
            return null;
        }
        const userId = decoded.sub;
        console.log('🚀 ~ getUserIdFromToken ~ userId:', userId)
        return userId;
    } catch (error) {
        console.error('Có lỗi khi giải mã token:', error);
        return null;
    }
}
