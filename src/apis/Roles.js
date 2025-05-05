import axiosInstance from '../utils/axiosConfig';

// Lấy danh sách tất cả role
export const apiGetRoles = async () => {
    try {
        const response = await axiosInstance.get('/api/roles', {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch roles:', error.message);
        throw error;
    }
};

// Tạo role mới
export const apiCreateRole = async (data) => {
    try {
        const response = await axiosInstance.post('/api/roles/create', data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create role:', error.message);
        throw error;
    }
};

// Lấy role theo ID
export const apiGetRoleById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/roles/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch role by ID:', error.message);
        throw error;
    }
};

// Cập nhật role
export const apiUpdateRole = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/api/roles/${id}`, data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update role:', error.message);
        throw error;
    }
};

// Xóa role
export const apiDeleteRole = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/roles/${id}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete role:', error.message);
        throw error;
    }
};
