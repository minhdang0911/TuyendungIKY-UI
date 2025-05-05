import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Thêm useLocation để theo dõi đường dẫn
import { apiInfoUser, apiLogoutUser } from '../apis/staff';
import { Layout, Menu, Button, Dropdown, Avatar, Space, notification, Drawer } from 'antd';
import {
    HomeOutlined,
    InfoCircleOutlined,
    TrophyOutlined,
    TeamOutlined,
    UserOutlined,
    LogoutOutlined,
    LoginOutlined,
    MenuOutlined,
    BankOutlined,
    DownOutlined,
} from '@ant-design/icons';
import Cookies from 'js-cookie';
import './Navigation.css';

const { Header } = Layout;

export const Navigation = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Thêm useLocation để theo dõi đường dẫn
    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState(null);

    const token = Cookies.get('token');

    useEffect(() => {
        const loginStatus = localStorage.getItem('isLogin');
        if (loginStatus === 'true') {
            setIsLogin(true);
        }
    }, []);

    useEffect(() => {
        const fetchInfo = async () => {
            const response = await apiInfoUser();

            if (response.code === 200) {
                setUserName(response.data.hoten);
                setInfo(response.data);
            }
        };
        fetchInfo();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await apiLogoutUser();

            if (response?.code === 200) {
                notification.success({
                    message: 'Đăng xuất thành công',
                });
                localStorage.setItem('isLogin', 'false');
                navigate('/login');
            } else {
                notification.error({
                    message: 'Có lỗi khi đăng xuất',
                    description: response?.message || 'Không thể đăng xuất.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Có lỗi khi đăng xuất',
                description: 'Không thể kết nối đến máy chủ.',
            });
        }
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/profile">Thông tin cá nhân</Link>
            </Menu.Item>
            {isLogin && info?.role?.tenRole === 'Admin' && (
                <Menu.Item key="admin" icon={<TeamOutlined />}>
                    <Link to="/admin">Quản trị</Link>
                </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const navItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: (
                <Link to="/" className={location.pathname === '/' ? 'selected' : ''}>
                    Trang chủ
                </Link>
            ),
        },
        {
            key: 'intro',
            icon: <InfoCircleOutlined />,
            label: (
                <Link to="/about-us" className={location.pathname === '/about-us' ? 'selected1' : ''}>
                    Giới thiệu
                </Link>
            ),
        },
        {
            key: 'rewards',
            icon: <TrophyOutlined />,
            label: (
                <Link
                    to="/danh-sach-khen-thuong"
                    className={location.pathname === '/danh-sach-khen-thuong' ? 'selected1' : ''}
                >
                    Khen Thưởng
                </Link>
            ),
        },
        {
            key: 'departments',
            icon: <BankOutlined />,
            label: (
                <Link to="/phong-ban" className={location.pathname === '/phong-ban' ? 'selected1' : ''}>
                    Phòng Ban
                </Link>
            ),
        },
        {
            key: 'career-opportunities',
            icon: <BankOutlined />,
            label: (
                <Link
                    to="/co-hoi-nghe-nghiep"
                    className={location.pathname === '/co-hoi-nghe-nghiep' ? 'selected1' : ''}
                >
                    Cơ hội nghề nghiệp
                </Link>
            ),
        },
        {
            key: 'employees',
            icon: <TeamOutlined />,
            label: (
                <Link
                    to="/danh-sach-nhan-vien"
                    className={location.pathname === '/danh-sach-nhan-vien' ? 'selected1' : ''}
                >
                    Nhân Viên
                </Link>
            ),
        },
    ];

    return (
        <Layout className="layout1">
            <Header className="nav-header">
                <div className="logo-container">
                    <Link to="/">
                        <img
                            src="https://theme.hstatic.net/200000863565/1001224143/14/logo.png?v=128"
                            alt="Logo"
                            className="logo"
                        />
                    </Link>
                </div>

                <div className="desktop-menu">
                    <Menu
                        theme="light"
                        mode="horizontal"
                        selectedKeys={[location.pathname.replace(/\/$/, '')]} // Loại bỏ dấu / cuối nếu có
                        className="main-menu"
                        items={navItems}
                    />

                    <div className="auth-section">
                        {!info && !token ? (
                            <Button
                                type="primary"
                                icon={<LoginOutlined />}
                                className="login-button"
                                onClick={() => navigate('/login')}
                            >
                                Đăng Nhập
                            </Button>
                        ) : (
                            <Dropdown overlay={userMenu} trigger={['click']}>
                                <Space className="user-dropdown">
                                    <Avatar icon={<UserOutlined />} />
                                    <span className="welcome-text">Chào mừng {userName}</span>
                                    <DownOutlined />
                                </Space>
                            </Dropdown>
                        )}
                    </div>
                </div>

                <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} className="mobile-menu-button" />

                <Drawer
                    title="Menu"
                    placement="right"
                    closable={true}
                    onClose={closeDrawer}
                    open={drawerVisible}
                    className="mobile-drawer"
                >
                    <Menu mode="vertical" selectedKeys={[location.pathname]} items={navItems} onClick={closeDrawer} />
                    <div className="mobile-auth-section">
                        {!info && !token ? (
                            <Button
                                type="primary"
                                icon={<LoginOutlined />}
                                block
                                onClick={() => {
                                    navigate('/login');
                                    closeDrawer();
                                }}
                            >
                                Đăng Nhập
                            </Button>
                        ) : (
                            <>
                                <div className="mobile-user-section">
                                    <div className="mobile-user-info">
                                        <Avatar icon={<UserOutlined />} size="large" />
                                        <span className="welcome-text">Chào mừng {userName}</span>
                                    </div>

                                    {info?.role?.tenRole === 'Admin' && (
                                        <Button
                                            type="default"
                                            icon={<TeamOutlined />}
                                            block
                                            className="mobile-admin-button"
                                            onClick={() => {
                                                navigate('/admin');
                                                closeDrawer();
                                            }}
                                        >
                                            Quản trị
                                        </Button>
                                    )}

                                    {info && (
                                        <Button
                                            type="default"
                                            icon={<UserOutlined />}
                                            block
                                            className="mobile-admin-button"
                                            onClick={() => {
                                                navigate('/profile');
                                                closeDrawer();
                                            }}
                                        >
                                            Thông tin cá nhân
                                        </Button>
                                    )}

                                    <Button
                                        type="primary"
                                        danger
                                        icon={<LogoutOutlined />}
                                        block
                                        onClick={() => {
                                            handleLogout();
                                            closeDrawer();
                                        }}
                                    >
                                        Đăng xuất
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </Drawer>
            </Header>
        </Layout>
    );
};
