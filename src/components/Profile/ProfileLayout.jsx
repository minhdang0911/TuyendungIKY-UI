import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Button, Typography, Drawer, Avatar, Divider } from 'antd';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    UserOutlined,
    ProfileOutlined,
    FileDoneOutlined,
    LockOutlined,
    MenuOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Navigation } from '../navigation';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// Custom styles to avoid class conflicts
const styles = {
    profileLayoutContainer: {
        minHeight: 'calc(100vh - 64px)',
        marginTop: '64px',
    },
    profileSider: {
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        left: 0,
        overflow: 'auto',
        zIndex: 5,
    },
    profileSiderCollapsed: {
        width: '80px !important',
        minWidth: '80px !important',
        maxWidth: '80px !important',
    },
    profileSiderExpanded: {
        width: '250px !important',
        minWidth: '250px !important',
        maxWidth: '250px !important',
    },
    profileContent: {
        transition: 'all 0.2s',
        background: '#f0f2f5',
        padding: '24px',
        minHeight: 'calc(100vh - 64px)',
    },
    profileContentWithExpandedSider: {
        marginLeft: '250px',
    },
    profileContentWithCollapsedSider: {
        marginLeft: '80px',
    },
    profileContentMobile: {
        marginLeft: '0',
        padding: '16px',
    },
    headerProfile: {
        padding: '20px 16px',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: 16,
    },
    menuProfile: {
        border: 'none',
    },
    breadcrumbProfile: {
        margin: '0 0 16px 0',
        padding: '10px 16px',
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    contentWrapper: {
        background: '#fff',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        minHeight: 500,
    },
    contentWrapperMobile: {
        padding: '16px',
        marginBottom: '16px',
    },
    mobileHeader: {
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 4,
    },
    menuButton: {
        border: 'none',
        marginRight: '10px',
        fontSize: '18px',
    },
    menuItemProfile: {
        fontSize: '15px',
        margin: '4px 0',
        borderRadius: '4px',
    },
    drawerBody: {
        padding: 0,
    },
    avatarProfile: {
        marginBottom: 12,
        backgroundColor: '#1890ff',
    },
    profileTitle: {
        margin: '8px 0 4px',
        fontSize: '16px',
    },
};

const ProfileLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const location = useLocation();

    // Handle window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            setMobileView(isMobile);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get current path for menu selection
    const getCurrentPath = () => {
        const path = location.pathname;
        if (path === '/profile') return 'profile';
        if (path === '/profile/danh-sach-cong-viec-da-ung-tuyen') return 'applications';
        if (path === '/profile/doi-mat-khau') return 'password';
        return 'profile';
    };

    // Get breadcrumb title based on path
    const getBreadcrumbTitle = () => {
        const path = location.pathname;
        if (path === '/profile') return 'Thông tin cá nhân';
        if (path === '/profile/danh-sach-cong-viec-da-ung-tuyen') return 'Công việc đã ứng tuyển';
        if (path === '/profile/doi-mat-khau') return 'Đổi mật khẩu';
        return '';
    };

    const ProfileHeader = () => (
        <div style={styles.headerProfile}>
            <Avatar size={64} icon={<UserOutlined />} style={styles.avatarProfile} />
            <Title level={5} style={styles.profileTitle}>
                Tài khoản của bạn
            </Title>
            <Text type="secondary">Quản lý thông tin cá nhân</Text>
        </div>
    );

    // Profile Menu Component
    const ProfileMenu = () => (
        <Menu
            mode="inline"
            selectedKeys={[getCurrentPath()]}
            style={styles.menuProfile}
            className="profile-custom-menu"
            items={[
                {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: <Link to="/profile">Thông tin cá nhân</Link>,
                    className: 'profile-menu-item',
                },
                {
                    key: 'applications',
                    icon: <FileDoneOutlined />,
                    label: <Link to="/profile/danh-sach-cong-viec-da-ung-tuyen">Đã ứng tuyển</Link>,
                    className: 'profile-menu-item',
                },
                {
                    key: 'password',
                    icon: <LockOutlined />,
                    label: <Link to="/profile/doi-mat-khau">Đổi mật khẩu</Link>,
                    className: 'profile-menu-item',
                },
            ]}
        />
    );

    return (
        <>
            <Navigation />

            {/* Custom profile layout container */}
            <div style={styles.profileLayoutContainer} className="profile-layout-container">
                {/* Mobile Header */}
                {mobileView && (
                    <div style={styles.mobileHeader} className="profile-mobile-header">
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setDrawerVisible(true)}
                            style={styles.menuButton}
                            className="profile-menu-button"
                        />
                        <Title level={4} style={{ margin: 0 }}>
                            {getBreadcrumbTitle()}
                        </Title>
                    </div>
                )}

                {/* Desktop Sidebar */}
                {!mobileView && (
                    <div
                        style={{
                            ...styles.profileSider,
                            ...(collapsed ? styles.profileSiderCollapsed : styles.profileSiderExpanded),
                        }}
                        className="profile-sider"
                    >
                        <ProfileHeader />
                        {/* <Button
                            type="text"
                            icon={collapsed ? <MenuOutlined /> : <MenuOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                margin: '8px 16px',
                                width: 'calc(100% - 32px)',
                            }}
                            className="profile-collapse-button"
                        >
                            {!collapsed && 'Thu gọn menu'}
                        </Button> */}
                        <Divider style={{ margin: '8px 0' }} />
                        <ProfileMenu />
                    </div>
                )}

                {/* Mobile Drawer */}
                <Drawer
                    title="Menu tài khoản"
                    placement="left"
                    closable={true}
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                    width={250}
                    bodyStyle={styles.drawerBody}
                    className="profile-drawer"
                >
                    <ProfileHeader />
                    <ProfileMenu />
                </Drawer>

                {/* Main Content */}
                <div
                    style={{
                        ...styles.profileContent,
                        ...(mobileView
                            ? styles.profileContentMobile
                            : collapsed
                            ? styles.profileContentWithCollapsedSider
                            : styles.profileContentWithExpandedSider),
                    }}
                    className="profile-content-container"
                >
                    {/* Breadcrumb for Desktop */}
                    {!mobileView && (
                        <Breadcrumb
                            style={styles.breadcrumbProfile}
                            className="profile-breadcrumb"
                            items={[
                                {
                                    title: (
                                        <Link to="/">
                                            <HomeOutlined /> Trang chủ
                                        </Link>
                                    ),
                                },
                                {
                                    title: (
                                        <Link to="/profile">
                                            <UserOutlined /> Tài khoản
                                        </Link>
                                    ),
                                },
                                {
                                    title: getBreadcrumbTitle(),
                                },
                            ]}
                        />
                    )}

                    {/* Extra top padding for mobile to account for fixed header */}
                    {mobileView && <div style={{ height: '60px' }} />}

                    {/* Content */}
                    <div
                        style={{
                            ...styles.contentWrapper,
                            ...(mobileView && styles.contentWrapperMobile),
                        }}
                        className="profile-content-wrapper"
                    >
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx="true">{`
                .profile-layout-container {
                    display: flex;
                    flex-direction: column;
                }

                .profile-menu-item {
                    height: 50px;
                    line-height: 50px;
                    margin: 4px 16px;
                    border-radius: 6px;
                    overflow: hidden;
                }

                .profile-menu-item:hover {
                    background-color: #f5f5f5;
                }

                .profile-custom-menu .ant-menu-item-selected {
                    background-color: #e6f7ff !important;
                    font-weight: 500;
                }

                .profile-custom-menu .ant-menu-item {
                    padding-left: 16px !important;
                }

                .profile-custom-menu .ant-menu-item-icon {
                    font-size: 18px;
                }

                .profile-sider {
                    transition: all 0.2s;
                    width: 13%;
                }

                .profile-content-container {
                    transition: all 0.2s;
                }

                @media (min-width: 1024px) and (max-width: 1366px) {
                    .profile-sider {
                        transition: all 0.2s;
                        width: 18%;
                    }
                }
            `}</style>
        </>
    );
};

export default ProfileLayout;
