import axiosInstance from '../utils/axiosConfig';

// Lấy tất cả người dùng
export const apiGetAllUser = async () => {
    try {
        const response = await axiosInstance.get('/api/users/all', {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error.message);
        throw new Error('Failed to fetch users');
    }
};

// Lấy người dùng theo ID
export const apiGetUserById = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/users/${id}`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

// Đăng xuất người dùng
export const apiLogoutUser = async () => {
    try {
        const response = await axiosInstance.post(
            '/api/users/logout',
            {},
            {
                withCredentials: true, // Đảm bảo gửi cookies kèm theo request
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error during logout:', error);
        return { code: 500, status: 'error', message: 'Có lỗi khi đăng xuất' };
    }
};

// Lấy người dùng theo phòng ban
export const apiGetUserByPhongban = async (phongban_id) => {
    try {
        const response = await axiosInstance.get(`/api/users/phongban/${phongban_id}`, {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

// Đăng nhập người dùng
export const apiLoginUser = async (email, password) => {
    try {
        const response = await axiosInstance.post(
            '/api/users/login',
            { email, password },
            {
                withCredentials: true, // Quan trọng để gửi cookies kèm theo request
            },
        );

        if (response.data.code === 200) {
            // Lưu trạng thái đăng nhập và tên người dùng vào localStorage
            localStorage.setItem('isLogin', 'true');
            return response.data; // Trả về dữ liệu response từ server
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Đăng nhập thất bại:', error.message);
        throw new Error('Đăng nhập thất bại');
    }
};

// Lấy thông tin người dùng
export const apiInfoUser = async () => {
    try {
        const response = await axiosInstance.get('/api/users/me', {
            withCredentials: true, // Quan trọng để gửi cookies kèm theo request
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by id:', error.message);
        throw new Error('Failed to fetch user by id');
    }
};

// Đăng ký người dùng
export const apiRegister = (data) =>
    axiosInstance.post('/api/users/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

// Thay đổi mật khẩu
export const apiChangePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
    try {
        const response = await axiosInstance.post(
            '/api/users/change-password',
            {
                oldPassword,
                newPassword,
                confirmPassword,
            },
            {
                withCredentials: true, // Quan trọng để gửi cookie chứa token (nếu dùng cookie)
            },
        );
        return response.data;
    } catch (error) {
        console.error('Failed to change password:', error.message);
        throw new Error(error.response?.data?.message || 'Failed to change password');
    }
};
