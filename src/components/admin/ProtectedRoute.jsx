import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Result, Button, Space } from 'antd';
import { useEffect } from 'react';
import { apiInfoUser } from '../../apis/staff';

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');

    const isLoggedIn = localStorage.getItem('isLogin');

    useEffect(() => {
        const fetchInfo = async () => {
            const response = await apiInfoUser();

            if (response.code === 200) {
                setRole(response.data?.role?.tenRole || '');
            }
        };
        fetchInfo();
    }, []);
    // Nếu chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <Result
                    status="warning"
                    title="Bạn cần đăng nhập"
                    subTitle="Vui lòng đăng nhập để tiếp tục."
                    extra={
                        <Button type="primary" onClick={() => navigate('/login')}>
                            Đăng nhập
                        </Button>
                    }
                />
            </div>
        );
    }

    // Nếu người dùng không phải là Admin, hiển thị thông báo không có quyền truy cập
    if (role !== 'Admin') {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn không có quyền truy cập trang này."
                    extra={
                        <Space>
                            <Button type="primary" onClick={() => navigate('/')}>
                                Trang chủ
                            </Button>
                            <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
                        </Space>
                    }
                />
            </div>
        );
    }

    // Trả về các trang con nếu người dùng có quyền Admin
    return <Outlet />;
};

export default ProtectedRoute;
