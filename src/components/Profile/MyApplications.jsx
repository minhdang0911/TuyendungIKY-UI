import React, { useState, useEffect } from 'react';
import {
    Table,
    Tag,
    Space,
    Typography,
    Card,
    Button,
    Empty,
    Spin,
    Tooltip,
    Descriptions,
    Row,
    Col,
    Statistic,
    Avatar,
    Modal,
    Badge,
} from 'antd';
import {
    FileTextOutlined,
    CalendarOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    FileSearchOutlined,
    ProductOutlined,
} from '@ant-design/icons';
import { apiGetApplyByUser } from '../../apis/Applications';
import dayjs from 'dayjs';
import { apiInfoUser } from '../../apis/staff';

const { Title, Text } = Typography;

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });
    const [viewingApplication, setViewingApplication] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [info, setInfo] = useState('');

    useEffect(() => {
        // Chỉ gọi fetchApplications khi info._id có giá trị
        if (info._id) {
            fetchApplications();
        }
    }, [info]);

    useEffect(() => {
        const fetchInfo = async () => {
            const response = await apiInfoUser();

            if (response.code === 200) {
                setInfo(response.data);
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        if (info?._id) {
            fetchApplications();
        }
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await apiGetApplyByUser(info?._id);

            if (response.success && response.data) {
                setApplications(response.data);

                // Tính toán số liệu thống kê
                const totalApps = response.data.length;
                const pendingApps = response.data.filter((app) => app.status === 'pending').length;
                const approvedApps = response.data.filter((app) => app.status === 'accepted').length;
                const rejectedApps = response.data.filter((app) => app.status === 'rejected').length;

                setStats({
                    total: totalApps,
                    pending: pendingApps,
                    approved: approvedApps,
                    rejected: rejectedApps,
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const viewApplicationDetails = (application) => {
        setViewingApplication(application);
        setModalVisible(true);
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <Tag icon={<ClockCircleOutlined />} color="blue">
                        Đang xử lý
                    </Tag>
                );
            case 'review':
                return (
                    <Tag icon={<ClockCircleOutlined />} color="blue">
                        Đang Đánh giá
                    </Tag>
                );

            case 'interview':
                return (
                    <Tag icon={<ClockCircleOutlined />} color="blue">
                        Phỏng vấn
                    </Tag>
                );
            case 'accepted':
                return (
                    <Tag icon={<CheckCircleOutlined />} color="green">
                        Đã chấp nhận
                    </Tag>
                );
            case 'rejected':
                return (
                    <Tag icon={<CloseCircleOutlined />} color="red">
                        Đã từ chối
                    </Tag>
                );
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const columns = [
        {
            title: 'Vị trí ứng tuyển',
            dataIndex: ['jobId', 'title'],
            key: 'title',
            render: (text, record) => <Text strong>{text}</Text>,
        },
        {
            title: 'Địa điểm',
            dataIndex: ['jobId', 'location'],
            key: 'location',
            render: (text) => (
                <Space>
                    <EnvironmentOutlined />
                    <Text>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Hạn ứng tuyển',
            dataIndex: ['jobId', 'deadline'],
            key: 'deadline',
            render: (text) => (
                <Space>
                    <CalendarOutlined />
                    <Text>{formatDate(text)}</Text>
                </Space>
            ),
        },
        {
            title: 'Ngày ứng tuyển',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => (
                <Space>
                    <CalendarOutlined />
                    <Text>{formatDate(text)}</Text>
                </Space>
            ),
        },
        {
            title: 'Lương mong muốn',
            dataIndex: 'expectedSalary',
            key: 'expectedSalary',
            render: (text) => (
                <Space>
                    <DollarOutlined />
                    <Text>{parseInt(text).toLocaleString('vi-VN')} VND</Text>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => viewApplicationDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xem CV">
                        <Button
                            type="default"
                            shape="circle"
                            icon={<FileSearchOutlined />}
                            onClick={() => window.open(record.resumeUrl, '_blank')}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>
                <FileTextOutlined /> Đơn ứng tuyển của tôi
            </Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic title="Tổng số đơn" value={stats.total} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Đang xử lý"
                            value={stats.pending}
                            valueStyle={{ color: '#1890ff' }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Đã chấp nhận"
                            value={stats.approved}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Đã từ chối"
                            value={stats.rejected}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<CloseCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Spin spinning={loading}>
                    {applications.length > 0 ? (
                        <Table columns={columns} dataSource={applications} rowKey="_id" pagination={{ pageSize: 10 }} />
                    ) : (
                        <Empty description="Bạn chưa có đơn ứng tuyển nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </Spin>
            </Card>

            <Modal
                title={
                    <Space>
                        <Badge
                            status={
                                viewingApplication?.status === 'pending'
                                    ? 'processing'
                                    : viewingApplication?.status === 'approved'
                                    ? 'success'
                                    : 'error'
                            }
                        />
                        <span>Chi tiết đơn ứng tuyển</span>
                    </Space>
                }
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button
                        key="view-resume"
                        type="primary"
                        icon={<FileSearchOutlined />}
                        onClick={() => viewingApplication && window.open(viewingApplication.resumeUrl, '_blank')}
                    >
                        Xem CV
                    </Button>,
                ]}
                width={700}
            >
                {viewingApplication && (
                    <>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card title="Thông tin công việc" bordered={false}>
                                    <Descriptions column={{ xs: 1, sm: 2 }}>
                                        <Descriptions.Item label="Vị trí">
                                            {viewingApplication.jobId.title}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Địa điểm">
                                            {viewingApplication.jobId.location}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Hạn ứng tuyển">
                                            {formatDate(viewingApplication.jobId.deadline)}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái">
                                            {getStatusTag(viewingApplication.status)}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            <Col span={24}>
                                <Card title="Thông tin ứng viên" bordered={false}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                                            <Avatar size={80} icon={<UserOutlined />} />
                                            <div style={{ marginTop: 8 }}>
                                                <Text strong>{viewingApplication.fullName}</Text>
                                            </div>
                                        </Col>
                                        <Col xs={24} md={18}>
                                            <Descriptions column={1}>
                                                {' '}
                                                {/* Chỉ có một cột */}
                                                <Descriptions.Item
                                                    label={
                                                        <>
                                                            <MailOutlined /> Email
                                                        </>
                                                    }
                                                >
                                                    {viewingApplication.email}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <>
                                                            <PhoneOutlined /> Số điện thoại
                                                        </>
                                                    }
                                                >
                                                    {viewingApplication.phone}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <>
                                                            <CalendarOutlined /> Ngày sinh
                                                        </>
                                                    }
                                                >
                                                    {formatDate(viewingApplication.birthday)}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <>
                                                            <ProductOutlined /> Vị trí ứng tuyển
                                                        </>
                                                    }
                                                >
                                                    {viewingApplication.jobId?.title}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <>
                                                            <DollarOutlined /> Lương mong muốn
                                                        </>
                                                    }
                                                >
                                                    {parseInt(viewingApplication.expectedSalary).toLocaleString(
                                                        'vi-VN',
                                                    )}{' '}
                                                    VND
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={
                                                        <>
                                                            <CalendarOutlined /> Ngày ứng tuyển
                                                        </>
                                                    }
                                                >
                                                    {formatDate(viewingApplication.createdAt)}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default MyApplications;
