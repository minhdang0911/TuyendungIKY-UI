import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    MenuOutlined,
    DashboardOutlined,
    UserOutlined,
    BankOutlined,
    TrophyOutlined,
    SafetyCertificateOutlined,
    UserSwitchOutlined,
    HomeOutlined,
    LogoutOutlined,
    ProjectOutlined,
    AuditOutlined,
} from '@ant-design/icons';
import './admin.css';
import { apiInfoUser } from '../../apis/staff';

export default function Sidebar() {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [info, setInfo] = useState([]);

    useEffect(() => {
        // Chỉ gọi fetchApplications khi info._id có giá trị

        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        const response = await apiInfoUser();

        if (response.code === 200) {
            setInfo(response.data);
        }
    };

    const menuItems = [
        {
            id: 'overview',
            path: '/admin/overview',
            label: 'Tổng quan',
            icon: <DashboardOutlined />,
            description: 'Thống kê và báo cáo',
        },
        {
            id: 'users',
            path: '/admin/users',
            label: 'Quản lý User',
            icon: <UserOutlined />,
            description: 'Thêm, sửa, xóa users',
        },
        {
            id: 'departments',
            path: '/admin/departments',
            label: 'Quản lý Phòng ban',
            icon: <BankOutlined />,
            description: 'Cấu trúc tổ chức',
        },
        {
            id: 'rewards',
            path: '/admin/rewards',
            label: 'Quản lý Khen thưởng',
            icon: <TrophyOutlined />,
            description: 'Danh sách khen thưởng',
        },
        {
            id: 'achievements',
            path: '/admin/achievements',
            label: 'Quản lý Thành Tích',
            icon: <SafetyCertificateOutlined />,
            description: 'Thành tích nhân viên',
        },
        {
            id: 'job',
            path: '/admin/job',
            label: 'Quản lý job',
            icon: <ProjectOutlined />, // Icon biểu thị quản lý dự án/công việc
            description: 'Các Job tuyển dụng',
        },
        {
            id: 'application', // Nên thay đổi id để không trùng với id 'job' phía trên
            path: '/admin/application',
            label: 'Quản lý danh sách ứng tuyển',
            icon: <AuditOutlined />, // Icon biểu thị hồ sơ/đánh giá
            description: 'Danh sách ứng tuyển',
        },
        {
            id: 'roles',
            path: '/admin/roles',
            label: 'Quản lý Role',
            icon: <UserSwitchOutlined />,
            description: 'Phân quyền hệ thống',
        },
        {
            id: 'back',
            path: '/',
            label: 'Trở về trang chủ',
            icon: <HomeOutlined />,
            description: 'Quay lại trang chính',
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth > 768) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleSidebarToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    return (
        <>
            <div className="mobile-header">
                <button onClick={handleSidebarToggle} className="hamburger-button" aria-label="Toggle sidebar menu">
                    <MenuOutlined style={{ fontSize: '20px' }} />
                </button>
                <h2>Admin Dashboard</h2>
                <div className="mobile-actions">
                    <button aria-label="Log out" className="logout-button">
                        <LogoutOutlined />
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {open && <div className="sidebar-overlay" onClick={handleSidebarToggle}></div>}

            <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <div className="logo">
                            <TrophyOutlined style={{ fontSize: '28px', color: '#fff' }} />
                        </div>
                        <h1>Admin Dashboard</h1>
                    </div>
                    {windowWidth <= 768 && (
                        <button onClick={handleSidebarToggle} className="close-sidebar" aria-label="Close sidebar">
                            &times;
                        </button>
                    )}
                </div>

                <div className="user-profile">
                    <div className="avatar">
                        <img src={info?.avatar} alt="Admin" />
                    </div>
                    <div className="user-info">
                        <p>{info?.hoten}</p>
                        <p>Quản trị viên</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.id} className={isActive(item.path) ? 'active-item' : ''}>
                                <Link
                                    to={item.path}
                                    className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                    onClick={() => setOpen(false)}
                                >
                                    <span className="menu-icon">{item.icon}</span>
                                    <div className="menu-text">
                                        <span className="menu-label">{item.label}</span>
                                        <span className="menu-description">{item.description}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <p>© {new Date().getFullYear()} Hệ thống Khen thưởng</p>
                </div>
            </aside>

            {/* CSS cần thêm vào file admin.css của bạn */}
            <style jsx>{`
                /* Base styling */
                :root {
                    --sidebar-bg: #2c3e50;
                    --sidebar-hover: #34495e;
                    --sidebar-active: #3498db;
                    --sidebar-text: #ecf0f1;
                    --header-height: 60px;
                    --sidebar-width: 260px;
                    --transition-speed: 0.3s;
                }

                /* Mobile header */
                .mobile-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #fff;
                    padding: 0 20px;
                    height: var(--header-height);
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 899;
                }

                .mobile-header h2 {
                    font-size: 18px;
                    margin: 0;
                    color: #2c3e50;
                }

                .hamburger-button,
                .logout-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: #555;
                    transition: background-color 0.2s;
                }

                .hamburger-button:hover,
                .logout-button:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }

                .mobile-actions {
                    display: flex;
                    align-items: center;
                }

                /* Sidebar overlay */
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 998;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* Admin sidebar */
                .admin-sidebar {
                    width: var(--sidebar-width);
                    height: 100vh;
                    background-color: var(--sidebar-bg);
                    color: var(--sidebar-text);
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 999;
                    display: flex;
                    flex-direction: column;
                    transition: transform var(--transition-speed);
                    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
                }

                /* Sidebar header */
                .sidebar-header {
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logo {
                    width: 40px;
                    height: 40px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .admin-sidebar h1 {
                    font-size: 18px;
                    margin: 0;
                    font-weight: 600;
                }

                .close-sidebar {
                    background: none;
                    border: none;
                    color: var(--sidebar-text);
                    font-size: 24px;
                    cursor: pointer;
                }

                /* User profile section */
                .user-profile {
                    padding: 20px 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    overflow: hidden;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.2);
                }

                .avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .user-info h3 {
                    margin: 0;
                    font-size: 14px;
                    font-weight: 500;
                }

                .user-info p {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.7;
                }

                /* Navigation */
                .sidebar-nav {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px 0;
                }

                .sidebar-nav ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .sidebar-nav li {
                    position: relative;
                    margin: 5px 10px;
                    border-radius: 8px;
                    transition: background-color 0.2s;
                }

                .sidebar-nav li:hover {
                    background-color: var(--sidebar-hover);
                }

                .active-item {
                    background-color: var(--sidebar-active);
                }

                .active-item:hover {
                    background-color: var(--sidebar-active);
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 12px 15px;
                    text-decoration: none;
                    color: var(--sidebar-text);
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .sidebar-link.active {
                    font-weight: 500;
                }

                .menu-icon {
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                }

                .menu-text {
                    display: flex;
                    flex-direction: column;
                }

                .menu-label {
                    font-size: 14px;
                }

                .menu-description {
                    font-size: 11px;
                    opacity: 0.7;
                    margin-top: 2px;
                }

                /* Footer */
                .sidebar-footer {
                    padding: 15px;
                    font-size: 12px;
                    text-align: center;
                    opacity: 0.7;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                /* Mobile adjustments */
                @media (max-width: 768px) {
                    .admin-sidebar {
                        transform: translateX(-100%);
                    }

                    .admin-sidebar.open {
                        transform: translateX(0);
                    }

                    .sidebar-nav li {
                        margin: 5px 10px;
                    }
                }

                @media (min-width: 769px) {
                    body {
                        padding-left: var(--sidebar-width);
                    }

                    .mobile-header {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}
