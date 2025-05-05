import axiosInstance from '../utils/axiosConfig';
export const apiGetAllPhongBan = async () => {
    try {
        const response = await axiosInstance.get('/api/phongban', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng ban:', error.message);
        throw new Error('Lỗi khi lấy danh sách phòng ban');
    }
};

// API tạo phòng ban
export const apiCreatePhongBan = async (newDepartment) => {
    try {
        const response = await axiosInstance.post('/api/phongban', newDepartment, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo phòng ban:', error.message);
        throw new Error('Lỗi khi tạo phòng ban');
    }
};

// API cập nhật phòng ban
export const apiUpdatePhongBan = async (id, updatedData) => {
    try {
        const response = await axiosInstance.put(`/api/phongban/${id}`, updatedData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật phòng ban:', error.message);
        throw new Error('Lỗi khi cập nhật phòng ban');
    }
};

// API xóa phòng ban
export const apiDeletePhongBan = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/phongban/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa phòng ban:', error.message);
        throw new Error('Lỗi khi xóa phòng ban');
    }
};

export const apiGetPhongBanById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/phongban/${id}`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};
