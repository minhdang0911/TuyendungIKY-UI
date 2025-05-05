import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Tag, Row, Col, Spin, Empty, Button, Input, Divider, notification } from 'antd';
import { apiGetKhenthuongs } from '../apis/khenthuong';
import moment from 'moment';
import {
    ClockCircleOutlined,
    UserOutlined,
    TrophyOutlined,
    FileTextOutlined,
    SearchOutlined,
    ReloadOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { Navigation } from './navigation';
import { apiInfoUser } from '../apis/staff';
import { Link, useNavigate } from 'react-router-dom';
import { formatName } from '../utils/Function';
import './Reward.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const Reward = () => {
    const [listReward, setListReward] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState([]);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const fetchListReward = async () => {
        setLoading(true);
        try {
            const response = await apiGetKhenthuongs();
            if (response.code === 200) {
                const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setListReward(sortedData);
                notification.success({
                    message: 'Thành công',
                    description: 'Đã tải danh sách khen thưởng thành công',
                    placement: 'bottomRight',
                    duration: 3,
                });
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách khen thưởng:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể tải danh sách khen thưởng',
                placement: 'bottomRight',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchInfo = async () => {
        try {
            const response = await apiInfoUser();
            if (response.code === 200) {
                setUserName(response.data.hoten);
                setInfo(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải thông tin người dùng:', error);
        }
    };

    useEffect(() => {
        fetchListReward();
        fetchInfo();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredRewards = listReward.filter(
        (item) =>
            item.hoten?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.ten?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.lydo?.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.phongban_id?.tenphong &&
                item.phongban_id.tenphong.toLowerCase().includes(searchText.toLowerCase())) ||
            (item.chucvu && item.chucvu.toLowerCase().includes(searchText.toLowerCase())),
    );

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="layout-wrapper">
            <Navigation data={info} userName={userName} />
            <div className="reward-container">
                <div className="reward-header">
                    <div className="reward-actions">
                        <Search
                            placeholder="Tìm kiếm theo tên, danh hiệu..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onSearch={handleSearch}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={fetchListReward}
                            className="refresh-button"
                        >
                            Làm mới
                        </Button>

                        <Button
                            type="primary"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/')}
                            className="back-button"
                            style={{ color: 'black' }}
                        >
                            Quay lại
                        </Button>
                    </div>
                </div>

                <Title level={3} className="reward-title">
                    Danh Sách Khen Thưởng
                </Title>

                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" tip="Đang tải dữ liệu..." />
                    </div>
                ) : filteredRewards.length === 0 ? (
                    <Empty description="Không tìm thấy kết quả phù hợp" />
                ) : (
                    <Row gutter={[16, 16]} className="reward-list">
                        {filteredRewards.map((item) => (
                            <Col key={item._id} xs={24} sm={12} md={8} lg={6} xl={6}>
                                <Link
                                    to={`/nhansu/${formatName(item.hoten)}`}
                                    onClick={() => localStorage.setItem('userId', item?.nhanvien_id)}
                                    className="reward-link"
                                >
                                    <Card hoverable className="reward-card" bodyStyle={{ padding: '16px' }}>
                                        <div className="reward-card-header">
                                            <Avatar
                                                size={64}
                                                src={item.avatar}
                                                icon={!item.avatar && <UserOutlined />}
                                                className="reward-avatar"
                                            />
                                            <div className="reward-user-info">
                                                <Text className="reward-user-name">{item.hoten}</Text>
                                                <Tag color="blue" className="reward-user-role">
                                                    {item.chucvu || 'Chưa cập nhật'}
                                                </Tag>
                                                <Text type="secondary" className="reward-user-department">
                                                    {item?.tenphong || 'Chưa phân phòng'}
                                                </Text>
                                            </div>
                                        </div>

                                        <Divider className="reward-divider" />

                                        <div className="reward-details">
                                            <div className="reward-detail-item">
                                                <Text strong className="reward-detail-label">
                                                    <TrophyOutlined className="reward-icon trophy-icon" /> Danh hiệu:
                                                </Text>
                                                <Text className="reward-detail-value reward-title-text">
                                                    {item.ten}
                                                </Text>
                                            </div>

                                            <div className="reward-detail-item">
                                                <Text strong className="reward-detail-label">
                                                    <FileTextOutlined className="reward-icon reason-icon" /> Lý do:
                                                </Text>
                                                <Paragraph ellipsis={{ rows: 2 }} className="reward-detail-value">
                                                    {item.lydo}
                                                </Paragraph>
                                            </div>

                                            {/* <div className="reward-detail-item">
                                                <Text strong className="reward-detail-label">
                                                    <DollarOutlined className="reward-icon money-icon" /> Số tiền:
                                                </Text>
                                                <Text className="reward-detail-value reward-money">
                                                    {formatCurrency(item.sotien)}
                                                </Text>
                                            </div> */}
                                        </div>

                                        <div className="reward-timestamp">
                                            <Text type="secondary" className="reward-time">
                                                <ClockCircleOutlined className="reward-icon" />{' '}
                                                {moment(item.createdAt).format('HH:mm DD/MM/YYYY')}
                                            </Text>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
            {/* <Contact /> */}
        </div>
    );
};

export default Reward;
