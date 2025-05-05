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
} from 'antd';
import {
    ArrowLeftOutlined,
    TrophyOutlined,
    MailOutlined,
    CalendarOutlined,
    UserOutlined,
    TeamOutlined,
    DollarOutlined,
    ManOutlined,
} from '@ant-design/icons';
import './DetailUser.css';
import { IoMedalOutline } from 'react-icons/io5';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

const DetailUser = () => {
    const navigate = useNavigate();
    const { userName } = useParams();
    const [userData, setUserData] = useState(null);
    const [khenthuongData, setKhenThuongData] = useState([]);
    const [thanhtichData, setThanhTichData] = useState([]);
    const [loading, setLoading] = useState(true);
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
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                    className="back-button"
                    style={{ color: 'black' }}
                >
                    Quay lại
                </Button>

                <Row gutter={[24, 24]} className="detail-container">
                    <Col xs={24} md={8} lg={7} xl={6}>
                        <Card className="profile-card" variant={false}>
                            <div className="avatar-container">
                                <Avatar
                                    src={userData.avatar}
                                    alt={userData.hoten}
                                    size={120}
                                    icon={<UserOutlined />}
                                    className="user-avatar"
                                />
                            </div>
                            <div className="user-info">
                                <Title level={3} className="user-name">
                                    {userData.hoten}
                                </Title>
                                <Tag color="blue" className="user-position">
                                    {userData.chucvu}
                                </Tag>
                                <Divider className="info-divider" />
                                <Descriptions column={1} className="user-details">
                                    <Descriptions.Item
                                        label={
                                            <>
                                                <TeamOutlined /> Phòng ban
                                            </>
                                        }
                                    >
                                        {userData?.phongban_id?.tenphong || 'Chưa có thông tin'}
                                    </Descriptions.Item>
                                    {/* <Descriptions.Item
                                        label={
                                            <>
                                                <MailOutlined /> Email
                                            </>
                                        }
                                    >
                                        {userData.email}
                                    </Descriptions.Item> */}
                                    <Descriptions.Item
                                        label={
                                            <>
                                                <UserOutlined /> Giới tính
                                            </>
                                        }
                                    >
                                        {userData.gioitinh}
                                    </Descriptions.Item>
                                    {/* <Descriptions.Item
                                        label={
                                            <>
                                                <CalendarOutlined /> Ngày sinh
                                            </>
                                        }
                                    >
                                        {moment(userData.ngaysinh).format('DD/MM/YYYY')}
                                    </Descriptions.Item> */}
                                </Descriptions>
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} md={16} lg={17} xl={18}>
                        <Card
                            className="awards-card"
                            title={
                                <>
                                    <IoMedalOutline /> Khen thưởng
                                </>
                            }
                            variant={false}
                        >
                            {khenthuongData?.length > 0 ? (
                                <div className="awards-list">
                                    {khenthuongData.map((item) => (
                                        <Card key={item._id} className="award-item" variant={false} type="inner">
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                <Badge
                                                    color="blue"
                                                    text={
                                                        <Text strong className="award-name">
                                                            {item.ten}
                                                        </Text>
                                                    }
                                                />
                                                <Paragraph className="award-reason">
                                                    <Text type="secondary">Lý do:</Text> {item.lydo}
                                                </Paragraph>
                                                {/* <Paragraph className="award-money">
                                                    <DollarOutlined />{' '}
                                                    <Text type="success">{formatCurrency(item.sotien)}</Text>
                                                </Paragraph> */}
                                                <Text type="secondary" className="award-date">
                                                    <CalendarOutlined /> Ngày thưởng:{' '}
                                                    {moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                                </Text>
                                            </Space>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty description="Không có khen thưởng nào" />
                            )}
                        </Card>

                        <Card
                            className="achievements-card"
                            title={
                                <>
                                    <TrophyOutlined /> Thành tích
                                </>
                            }
                            variant={false}
                        >
                            {thanhtichData?.length > 0 ? (
                                <div className="achievements-list">
                                    {thanhtichData.map((item, index) => (
                                        <Card key={index} className="achievement-item" variant={false} type="inner">
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                <Badge
                                                    color="orange"
                                                    text={
                                                        <Text strong className="achievement-name">
                                                            {item.ten}
                                                        </Text>
                                                    }
                                                />
                                                <Paragraph className="achievement-description">{item.mota}</Paragraph>
                                                {item.hinhanh && item.hinhanh.length > 0 && (
                                                    <div className="image-gallery">
                                                        <Image.PreviewGroup>
                                                            <Row gutter={[16, 16]}>
                                                                {item.hinhanh.map((image, imageIndex) => (
                                                                    <Col key={imageIndex} xs={12} sm={8} md={6}>
                                                                        <Tooltip title="Nhấn để xem">
                                                                            <Image
                                                                                src={image}
                                                                                alt={`Thành tích ${imageIndex + 1}`}
                                                                                className="achievement-image"
                                                                            />
                                                                        </Tooltip>
                                                                    </Col>
                                                                ))}
                                                            </Row>
                                                        </Image.PreviewGroup>
                                                    </div>
                                                )}
                                            </Space>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Empty description="Không có thành tích nào" />
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default DetailUser;
