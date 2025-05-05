import axiosInstance from '../utils/axiosConfig';
export const apiGetKhenThuongById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/khenthuong/${id}`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

// Lấy tất cả khen thưởng
export const apiGetKhenthuongs = async () => {
    try {
        const response = await axiosInstance.get('/api/khenthuong/all', {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch rewards:', error.message);
        throw new Error('Failed to fetch rewards');
    }
};

// Tạo khen thưởng mới
export const apiCreateKhenthuong = async (data) => {
    try {
        const response = await axiosInstance.post('/api/khenthuong/create', data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create reward:', error.message);
        throw new Error('Failed to create reward');
    }
};

// Cập nhật khen thưởng
export const apiUpdateKhenthuong = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/api/khenthuong/${id}`, data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update reward:', error.message);
        throw new Error('Failed to update reward');
    }
};

// Xóa khen thưởng
export const apiDeleteKhenthuong = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/khenthuong/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete reward:', error.message);
        throw new Error('Failed to delete reward');
    }
};
