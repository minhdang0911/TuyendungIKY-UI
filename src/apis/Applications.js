import axiosInstance from '../utils/axiosConfig';

export const apiApplyJob = async (data) => {
    try {
        const response = await axiosInstance.post('/api/application/apply', data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi apply:', error.message);
        throw new Error('Lỗi khi apply');
    }
};

export const apiGetAllApply = async () => {
    try {
        const response = await axiosInstance.get('/api/application/all');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách ứng tuyển:', error.message);
        throw new Error('Lỗi khi lấy danh sách ứng tuyển');
    }
};

export const apiUpdateApply = async (id, updatedData) => {
    try {
        const response = await axiosInstance.put(`/api/application/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật đơn ứng tuyển:', error.message);
        throw new Error('Lỗi khi cập nhật đơn ứng tuyển');
    }
};

export const apiDeleteApply = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/application/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa phòng ban:', error.message);
        throw new Error('Lỗi khi xóa phòng ban');
    }
};

export const apiGetApplyById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/application/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch by id:', error.message);
        throw new Error('Failed to fetch by id');
    }
};

export const apiGetApplyByUser = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/application/user/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch by user:', error.message);
        throw new Error('Failed to fetch by user');
    }
};

export const getApplicationsByJob = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/application/job/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch by job:', error.message);
        throw new Error('Failed to fetch by job');
    }
};

export const apiHello = async () => {
    try {
        const response = await axiosInstance.get('/hello');
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Lỗi khi gọi API /hello:', error.message);
        throw new Error('Lỗi khi gọi API /hello');
    }
};
