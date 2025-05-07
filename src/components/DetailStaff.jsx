import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetUserById } from '../apis/staff';
import { apiGetKhenThuongById } from '../apis/khenthuong';
import { apiGetThanhTichById } from '../apis/Thanhtich';
import moment from 'moment';
import { Navigation } from './navigation';
import {
    Layout,
    Card,
    Avatar,
    Typography,
    Divider,
    Button,
    Descriptions,
    Spin,
    Empty,
    Tag,
    Row,
    Col,
    Image,
    Space,
    Tooltip,
    Badge,
    Progress,
    Tabs,
    Timeline,
    Statistic,
} from 'antd';
import {
    ArrowLeftOutlined,
    TrophyOutlined,
    MailOutlined,
    CalendarOutlined,
    UserOutlined,
    TeamOutlined,
    DollarOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    IdcardOutlined,
    ClockCircleOutlined,
    FireOutlined,
} from '@ant-design/icons';
import './DetailUser.css';
import { IoMedalOutline } from 'react-icons/io5';
import { FaAward, FaCertificate, FaTrophy } from 'react-icons/fa';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const DetailUser = () => {
    const navigate = useNavigate();
    const { userName } = useParams();
    const [userData, setUserData] = useState(null);
    const [khenthuongData, setKhenThuongData] = useState([]);
    const [thanhtichData, setThanhTichData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('1');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiGetUserById(userId);
                setUserData(response?.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchKhenThuongData = async () => {
            try {
                const response = await apiGetKhenThuongById(userId);
                setKhenThuongData(response?.data || []);
            } catch (error) {
                console.error('Error fetching khen thuong data:', error);
            }
        };

        const fetchThanhTichData = async () => {
            try {
                const response = await apiGetThanhTichById(userId);
                if (Array.isArray(response?.data)) {
                    setThanhTichData(response?.data);
                } else {
                    setThanhTichData([]);
                }
            } catch (error) {
                console.error('Error fetching thanh tich data:', error);
            }
        };

        Promise.all([fetchUserData(), fetchKhenThuongData(), fetchThanhTichData()]).finally(() => setLoading(false));
    }, [userId, userName]);

    const formatCurrency = (value) => value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const calculateStats = () => {
        const totalAwards = khenthuongData.length;
        const totalAchievements = thanhtichData.length;

        // Additional stats you might want to show
        const recentAwards = khenthuongData.filter((item) =>
            moment(item.createdAt).isAfter(moment().subtract(3, 'months')),
        ).length;

        return {
            totalAwards,
            totalAchievements,
            recentAwards,
            performanceIndex: Math.min(100, (totalAwards + totalAchievements) * 10),
        };
    };

    const stats = userData ? calculateStats() : null;

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Đang tải thông tin..." />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="not-found-container">
                <Empty description="Không tìm thấy thông tin người dùng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <Button type="primary" onClick={() => navigate('/')} icon={<ArrowLeftOutlined />}>
                    Quay lại trang chủ
                </Button>
            </div>
        );
    }

    return (
        <Layout className="detail-layout">
            <Navigation />
            <Content className="detail-content">
                <div className="header-container">
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/')}
                        className="back-buttonn"
                        style={{ color: 'black' }}
                    >
                        Quay lại
                    </Button>
                    <Title level={2} className="page-title">
                        Hồ sơ nhân viên
                    </Title>
                </div>

                <Row gutter={[24, 24]} className="detail-container">
                    <Col xs={24} md={8} lg={7} xl={6}>
                        <Card className="profile-card" bordered={false}>
                            <div className="profile-header">
                                <div className="avatar-wrapper">
                                    <Avatar
                                        src={userData.avatar}
                                        alt={userData.hoten}
                                        size={140}
                                        icon={<UserOutlined />}
                                        className="user-avatar"
                                    />
                                    {/* {stats && (
                                        <div className="performance-indicator">
                                            <Tooltip title={`Chỉ số hiệu suất: ${stats.performanceIndex}%`}>
                                                <Progress
                                                    type="circle"
                                                    percent={stats.performanceIndex}
                                                    size={44}
                                                    strokeColor={{
                                                        '0%': '#108ee9',
                                                        '100%': '#87d068',
                                                    }}
                                                    strokeWidth={10}
                                                />
                                            </Tooltip>
                                        </div>
                                    )} */}
                                </div>
                                <div className="user-info-header">
                                    <Title level={3} className="user-name">
                                        {userData.hoten}
                                    </Title>
                                    <Tag color="blue" className="user-position">
                                        {userData.chucvu}
                                    </Tag>
                                </div>
                            </div>

                            <Divider className="info-divider" />

                            <div className="employee-stats">
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Khen thưởng"
                                            value={stats?.totalAwards || 0}
                                            prefix={<FaAward className="stat-icon award-icon" />}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Thành tích"
                                            value={stats?.totalAchievements || 0}
                                            prefix={<FaTrophy className="stat-icon achievement-icon" />}
                                        />
                                    </Col>
                                </Row>
                            </div>

                            <Divider className="info-divider" />

                            <Descriptions
                                column={1}
                                className="user-details"
                                title="Thông tin cá nhân"
                                layout="horizontal"
                            >
                                <Descriptions.Item
                                    label={
                                        <Text className="detail-label">
                                            <TeamOutlined /> Phòng ban
                                        </Text>
                                    }
                                >
                                    <Text className="detail-value">
                                        {userData?.phongban_id?.tenphong || 'Chưa có thông tin'}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={
                                        <Text className="detail-label">
                                            <UserOutlined /> Giới tính
                                        </Text>
                                    }
                                >
                                    <Text className="detail-value">{userData.gioitinh}</Text>
                                </Descriptions.Item>
                                {/* {userData.email && (
                                    <Descriptions.Item
                                        label={
                                            <Text className="detail-label">
                                                <MailOutlined /> Email
                                            </Text>
                                        }
                                    >
                                        <Text className="detail-value">{userData.email}</Text>
                                    </Descriptions.Item>
                                )}
                                {userData.ngaysinh && (
                                    <Descriptions.Item
                                        label={
                                            <Text className="detail-label">
                                                <CalendarOutlined /> Ngày sinh
                                            </Text>
                                        }
                                    >
                                        <Text className="detail-value">
                                            {moment(userData.ngaysinh).format('DD/MM/YYYY')}
                                        </Text>
                                    </Descriptions.Item>
                                )} */}
                            </Descriptions>
                        </Card>
                    </Col>

                    <Col xs={24} md={16} lg={17} xl={18}>
                        <Card className="content-card" bordered={false}>
                            <Tabs activeKey={activeTab} onChange={setActiveTab} className="detail-tabs" type="card">
                                <TabPane
                                    tab={
                                        <span>
                                            <IoMedalOutline className="tab-icon" /> Khen thưởng
                                        </span>
                                    }
                                    key="1"
                                >
                                    {khenthuongData?.length > 0 ? (
                                        <div className="awards-list">
                                            <Timeline mode="left">
                                                {khenthuongData.map((item) => (
                                                    <Timeline.Item
                                                        key={item._id}
                                                        color="blue"
                                                        label={moment(item.createdAt).format('DD/MM/YYYY')}
                                                    >
                                                        <Card className="award-item" bordered={false}>
                                                            <Space
                                                                direction="vertical"
                                                                size="small"
                                                                style={{ width: '100%' }}
                                                            >
                                                                <div className="award-header">
                                                                    <FaAward className="award-icon" />
                                                                    <Text strong className="award-name">
                                                                        {item.ten}
                                                                    </Text>
                                                                </div>
                                                                <Paragraph className="award-reason">
                                                                    <Text type="secondary">Lý do:</Text> {item.lydo}
                                                                </Paragraph>
                                                                {item.sotien && (
                                                                    <Paragraph className="award-money">
                                                                        <DollarOutlined />{' '}
                                                                        <Text type="success">
                                                                            {formatCurrency(item.sotien)}
                                                                        </Text>
                                                                    </Paragraph>
                                                                )}
                                                            </Space>
                                                        </Card>
                                                    </Timeline.Item>
                                                ))}
                                            </Timeline>
                                        </div>
                                    ) : (
                                        <Empty
                                            description="Không có khen thưởng nào"
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            className="empty-data"
                                        />
                                    )}
                                </TabPane>
                                <TabPane
                                    tab={
                                        <span>
                                            <TrophyOutlined className="tab-icon" /> Thành tích
                                        </span>
                                    }
                                    key="2"
                                >
                                    {thanhtichData?.length > 0 ? (
                                        <div className="achievements-grid">
                                            <Row gutter={[24, 24]}>
                                                {thanhtichData.map((item, index) => (
                                                    <Col xs={24} sm={24} md={24} lg={12} key={index}>
                                                        <Card className="achievement-card enhanced" bordered={false}>
                                                            <div className="achievement-header">
                                                                <div className="achievement-title-container">
                                                                    <div className="achievement-badge large">
                                                                        <FaTrophy className="trophy-icon" />
                                                                    </div>
                                                                    <div className="achievement-title">
                                                                        <Text strong className="achievement-name">
                                                                            {item.ten}
                                                                        </Text>
                                                                        <Tag
                                                                            color="orange"
                                                                            className="achievement-date"
                                                                        >
                                                                            {moment().format('DD/MM/YYYY')}
                                                                        </Tag>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Paragraph className="achievement-description">
                                                                {item.mota}
                                                            </Paragraph>

                                                            {item.hinhanh && item.hinhanh.length > 0 && (
                                                                <div className="achievement-gallery">
                                                                    <Image.PreviewGroup>
                                                                        <Row gutter={[12, 12]}>
                                                                            {item.hinhanh.length === 1 ? (
                                                                                <Col span={24}>
                                                                                    <div className="gallery-image-wrapper single">
                                                                                        <Image
                                                                                            src={item.hinhanh[0]}
                                                                                            alt={`Thành tích ${
                                                                                                index + 1
                                                                                            }`}
                                                                                            className="gallery-image"
                                                                                            preview={{
                                                                                                mask: (
                                                                                                    <div className="image-preview-mask">
                                                                                                        <div className="mask-content">
                                                                                                            <div className="mask-icon">
                                                                                                                🔍
                                                                                                            </div>
                                                                                                            <div>
                                                                                                                Phóng to
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ),
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </Col>
                                                                            ) : item.hinhanh.length === 2 ? (
                                                                                <>
                                                                                    {item.hinhanh.map(
                                                                                        (image, imageIndex) => (
                                                                                            <Col
                                                                                                span={12}
                                                                                                key={imageIndex}
                                                                                            >
                                                                                                <div className="gallery-image-wrapper">
                                                                                                    <Image
                                                                                                        src={image}
                                                                                                        alt={`Thành tích ${
                                                                                                            index + 1
                                                                                                        } - ${
                                                                                                            imageIndex +
                                                                                                            1
                                                                                                        }`}
                                                                                                        className="gallery-image"
                                                                                                        preview={{
                                                                                                            mask: (
                                                                                                                <div className="image-preview-mask">
                                                                                                                    <div className="mask-content">
                                                                                                                        <div className="mask-icon">
                                                                                                                            🔍
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ),
                                                                                                        }}
                                                                                                    />
                                                                                                </div>
                                                                                            </Col>
                                                                                        ),
                                                                                    )}
                                                                                </>
                                                                            ) : item.hinhanh.length === 3 ? (
                                                                                <>
                                                                                    <Col span={16}>
                                                                                        <div className="gallery-image-wrapper large">
                                                                                            <Image
                                                                                                src={item.hinhanh[0]}
                                                                                                alt={`Thành tích ${
                                                                                                    index + 1
                                                                                                } - 1`}
                                                                                                className="gallery-image"
                                                                                                preview={{
                                                                                                    mask: (
                                                                                                        <div className="image-preview-mask">
                                                                                                            <div className="mask-content">
                                                                                                                <div className="mask-icon">
                                                                                                                    🔍
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col span={8}>
                                                                                        <Row gutter={[12, 12]}>
                                                                                            {item.hinhanh
                                                                                                .slice(1, 3)
                                                                                                .map(
                                                                                                    (
                                                                                                        image,
                                                                                                        imageIndex,
                                                                                                    ) => (
                                                                                                        <Col
                                                                                                            span={24}
                                                                                                            key={
                                                                                                                imageIndex
                                                                                                            }
                                                                                                        >
                                                                                                            <div className="gallery-image-wrapper small">
                                                                                                                <Image
                                                                                                                    src={
                                                                                                                        image
                                                                                                                    }
                                                                                                                    alt={`Thành tích ${
                                                                                                                        index +
                                                                                                                        1
                                                                                                                    } - ${
                                                                                                                        imageIndex +
                                                                                                                        2
                                                                                                                    }`}
                                                                                                                    className="gallery-image"
                                                                                                                    preview={{
                                                                                                                        mask: (
                                                                                                                            <div className="image-preview-mask">
                                                                                                                                <div className="mask-content">
                                                                                                                                    <div className="mask-icon">
                                                                                                                                        🔍
                                                                                                                                    </div>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        ),
                                                                                                                    }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        </Col>
                                                                                                    ),
                                                                                                )}
                                                                                        </Row>
                                                                                    </Col>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Col span={12}>
                                                                                        <div className="gallery-image-wrapper large">
                                                                                            <Image
                                                                                                src={item.hinhanh[0]}
                                                                                                alt={`Thành tích ${
                                                                                                    index + 1
                                                                                                } - 1`}
                                                                                                className="gallery-image"
                                                                                                preview={{
                                                                                                    mask: (
                                                                                                        <div className="image-preview-mask">
                                                                                                            <div className="mask-content">
                                                                                                                <div className="mask-icon">
                                                                                                                    🔍
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col span={12}>
                                                                                        <div className="gallery-image-wrapper large">
                                                                                            <Image
                                                                                                src={item.hinhanh[1]}
                                                                                                alt={`Thành tích ${
                                                                                                    index + 1
                                                                                                } - 2`}
                                                                                                className="gallery-image"
                                                                                                preview={{
                                                                                                    mask: (
                                                                                                        <div className="image-preview-mask">
                                                                                                            <div className="mask-content">
                                                                                                                <div className="mask-icon">
                                                                                                                    🔍
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ),
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </Col>
                                                                                    <Col span={24}>
                                                                                        <div className="additional-images">
                                                                                            <Image.PreviewGroup>
                                                                                                <div className="thumbnails-container">
                                                                                                    {item.hinhanh
                                                                                                        .slice(2)
                                                                                                        .map(
                                                                                                            (
                                                                                                                image,
                                                                                                                imageIndex,
                                                                                                            ) => (
                                                                                                                <div
                                                                                                                    key={
                                                                                                                        imageIndex
                                                                                                                    }
                                                                                                                    className="thumbnail-wrapper"
                                                                                                                >
                                                                                                                    <Image
                                                                                                                        src={
                                                                                                                            image
                                                                                                                        }
                                                                                                                        alt={`Thành tích ${
                                                                                                                            index +
                                                                                                                            1
                                                                                                                        } - ${
                                                                                                                            imageIndex +
                                                                                                                            3
                                                                                                                        }`}
                                                                                                                        className="thumbnail-image enhanced"
                                                                                                                    />
                                                                                                                    {imageIndex ===
                                                                                                                        0 &&
                                                                                                                        item
                                                                                                                            .hinhanh
                                                                                                                            .length >
                                                                                                                            5 && (
                                                                                                                            <div className="more-images-overlay">
                                                                                                                                <span>
                                                                                                                                    +
                                                                                                                                    {item
                                                                                                                                        .hinhanh
                                                                                                                                        .length -
                                                                                                                                        4}{' '}
                                                                                                                                    ảnh
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                        )}
                                                                                                                </div>
                                                                                                            ),
                                                                                                        )}
                                                                                                </div>
                                                                                            </Image.PreviewGroup>
                                                                                        </div>
                                                                                    </Col>
                                                                                </>
                                                                            )}
                                                                        </Row>
                                                                    </Image.PreviewGroup>
                                                                </div>
                                                            )}
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    ) : (
                                        <Empty
                                            description="Không có thành tích nào"
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            className="empty-data"
                                        />
                                    )}
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default DetailUser;
