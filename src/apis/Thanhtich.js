import axiosInstance from '../utils/axiosConfig';
export const apiGetThanhTichById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/ThanhTich/${id}`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

export const apiGetAllThanhTich = async () => {
    try {
        const response = await axiosInstance.get(`/api/ThanhTich/all`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

export const apiCreateThanhTich = (data) => axiosInstance.post('/api/ThanhTich/create', data);
export const apiUpdateThanhTich = (id, data) => axiosInstance.put(`/api/ThanhTich/${id}`, data);
export const apiDeleteThanhTich = (id) => axiosInstance.delete(`/api/ThanhTich/${id}`);
