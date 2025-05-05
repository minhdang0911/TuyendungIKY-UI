import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './admin.css';

const { Content } = Layout;

export default function LayoutComponent() {
    // const location = useLocation();

    // const getPageTitle = () => {
    //     if (location.pathname.includes('/overview')) return 'Tổng quan';
    //     if (location.pathname.includes('/users')) return 'Quản lý User';
    //     if (location.pathname.includes('/departments')) return 'Quản lý Phòng ban';
    //     if (location.pathname.includes('/rewards')) return 'Quản lý Khen thưởng';
    //     if (location.pathname.includes('/achievements')) return 'Quản lý thành tích';
    //     return 'Dashboard';
    // };

    return (
        <div className="admin-layout-wrapper">
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout
                    className="layout-admin-dashboard"
                    style={{ left: '14%', position: 'absolute', transition: 'margin-left 0.3s ease', minWidth: '105%' }}
                >
                    {/* <Header
                    style={{
                        background: '#fff',
                        padding: 0,
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        width: '100%', // hoặc width: '1200px' nếu bạn muốn cố định theo pixel
                        maxWidth: '100vw',
                        overflow: 'hidden',
                    }}
                >
                    <span
                        style={{
                            marginLeft: '16px',
                            fontSize: '18px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'inline-block',
                            width: 'calc(100% - 32px)', // trừ marginLeft để nội dung không tràn
                        }}
                    >
                        {getPageTitle()}
                    </span>
                </Header> */}

                    <Content
                        className="content-dashboard"
                        style={{
                            margin: '16px',
                            overflowY: 'auto',
                            height: 'calc(100vh - 64px)',
                            padding: '24px',
                            background: '#fff',
                            minHeight: '100%',
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}
