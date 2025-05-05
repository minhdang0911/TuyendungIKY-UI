import axiosInstance from '../utils/axiosConfig';

export const apiGetJobById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/job/${id}`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

export const apiGetAllJob = async () => {
    try {
        const response = await axiosInstance.get(`/api/job/all`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

export const apiCreateJob = (data) => axiosInstance.post('/api/job/create', data);
export const apiUpdateJob = (id, data) => axiosInstance.put(`/api/job/${id}`, data);
export const apiDeleteJob = (id) => axiosInstance.delete(`/api/job/${id}`);
