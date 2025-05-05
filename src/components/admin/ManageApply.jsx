import React, { useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Table,
    message,
    Space,
    Badge,
    Typography,
    Card,
    Tooltip,
    Tag,
    Divider,
    Row,
    Col,
    Dropdown,
    Menu,
    Descriptions,
    Statistic,
    Avatar,
    Spin,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    DownOutlined,
    FileTextOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    FileSearchOutlined,
} from '@ant-design/icons';
import { apiGetAllApply, apiDeleteApply, apiGetApplyById, apiUpdateApply } from '../../apis/Applications';
import moment from 'moment';
import './ManageApply.css';

const { Title, Text } = Typography;
const { confirm } = Modal;

const ManageApply = () => {
    const [listApply, setListApply] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedApply, setSelectedApply] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statisticsData, setStatisticsData] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    const fetchListApply = async () => {
        try {
            setLoading(true);
            const response = await apiGetAllApply();
            if (response.code === 200) {
                setListApply(response.data);

                // Calculate statistics
                const total = response.data.length;
                const pending = response.data.filter((item) => item.status === 'pending').length;
                const approved = response.data.filter((item) => item.status === 'accepted').length;
                const rejected = response.data.filter((item) => item.status === 'rejected').length;

                setStatisticsData({
                    total,
                    pending,
                    approved,
                    rejected,
                });
            }
        } catch (error) {
            console.error(error.message);
            message.error('Không thể tải danh sách đơn ứng tuyển');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListApply();
    }, []);

    const showDeleteConfirm = (id, name) => {
        confirm({
            title: 'Xác nhận xóa đơn ứng tuyển',
            icon: <ExclamationCircleOutlined />,
            content: `Bạn có chắc muốn xóa đơn ứng tuyển của ${name} không? Hành động này không thể hoàn tác.`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(id);
            },
        });
    };

    const handleDelete = async (id) => {
        try {
            await apiDeleteApply(id);
            fetchListApply();
            message.success('Xóa đơn ứng tuyển thành công');
        } catch (error) {
            console.error(error.message);
            message.error('Xóa đơn ứng tuyển thất bại');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await apiUpdateApply(id, { status });
            fetchListApply();
            message.success(`Cập nhật trạng thái thành công: ${status}`);

            // Update modal if it's currently showing this application
            if (selectedApply && selectedApply._id === id) {
                const updatedApply = await apiGetApplyById(id);
                if (updatedApply.code === 200) {
                    setSelectedApply(updatedApply.data);
                }
            }
        } catch (error) {
            console.error(error.message);
            message.error('Cập nhật trạng thái thất bại');
        }
    };

    const openModal = async (id) => {
        try {
            setLoading(true);
            const response = await apiGetApplyById(id);
            if (response.success === true) {
                setSelectedApply(response.data);
                setShowModal(true);
            }
        } catch (error) {
            console.error(error.message);
            message.error('Không thể lấy thông tin chi tiết');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedApply(null);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Tag color="grey">Đang xem xét</Tag>;
            case 'review':
                return <Tag color="green">Đang đánh giá</Tag>;
            case 'rejected':
                return <Tag color="red">Đã từ chối</Tag>;
            case 'interview':
                return <Tag color="orange">Mời phỏng vấn</Tag>;
            case 'accepted':
                return <Tag color="blue">Đồng ý</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const statusMenu = (record) => (
        <Menu>
            <Menu.Item
                key="1"
                onClick={() => handleUpdateStatus(record._id, 'pending')}
                icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
            >
                Đang xem xét
            </Menu.Item>
            <Menu.Item
                key="2"
                onClick={() => handleUpdateStatus(record._id, 'interview')}
                icon={<CalendarOutlined style={{ color: '#1890ff' }} />}
            >
                Mời Phỏng Vấn
            </Menu.Item>
            <Menu.Item
                key="3"
                onClick={() => handleUpdateStatus(record._id, 'review')}
                icon={<FileSearchOutlined style={{ color: '#13c2c2' }} />}
            >
                Đánh giá
            </Menu.Item>
            <Menu.Item
                key="4"
                onClick={() => handleUpdateStatus(record._id, 'accepted')}
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            >
                Chấp nhận
            </Menu.Item>
            <Menu.Item
                key="5"
                onClick={() => handleUpdateStatus(record._id, 'rejected')}
                icon={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
            >
                Từ chối
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'Ứng viên',
            key: 'candidate',
            render: (text, record) => (
                <div className="candidate-info">
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 12 }} />
                    <div>
                        <div className="candidate-name">{record.fullName}</div>
                        <div className="candidate-email">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thông tin liên hệ',
            key: 'contact',
            render: (text, record) => (
                <div>
                    <div>
                        <PhoneOutlined /> {record.phone}
                    </div>
                    <div>
                        <CalendarOutlined /> {moment(record.birthday).format('DD/MM/YYYY')}
                    </div>
                </div>
            ),
        },
        {
            title: 'CV',
            dataIndex: 'resumeUrl',
            key: 'resumeUrl',
            render: (text) => (
                <Button
                    type="primary"
                    ghost
                    icon={<FileTextOutlined />}
                    href={text}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Xem CV
                </Button>
            ),
        },
        {
            title: 'Tình trạng',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Dropdown overlay={statusMenu(record)} trigger={['click']}>
                    <div className="status-dropdown">
                        {getStatusBadge(status)}
                        <DownOutlined style={{ marginLeft: 8 }} />
                    </div>
                </Dropdown>
            ),
        },
        {
            title: 'Ngày nộp',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => (
                <div>
                    <ClockCircleOutlined /> {moment(text).format('HH:mm DD/MM/YYYY')}
                </div>
            ),
            sorter: (a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix(), // Sort từ mới nhất đến cũ nhất
        },

        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => openModal(record._id)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteConfirm(record._id, record.fullName)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const sortedData = listApply.sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix());
    return (
        <div className="manage-apply-container">
            <div className="statistics-cards">
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn đã ứng tuyển"
                                value={statisticsData.total}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Đang xem xét"
                                value={statisticsData.pending}
                                prefix={<ExclamationCircleOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Đã chấp nhận"
                                value={statisticsData.approved}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Đã từ chối"
                                value={statisticsData.rejected}
                                prefix={<CloseCircleOutlined />}
                                valueStyle={{ color: '#f5222d' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card className="applications-table-card">
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={sortedData}
                        rowKey="_id"
                        pagination={{
                            defaultPageSize: 8,
                            showSizeChanger: true,
                            pageSizeOptions: ['8', '16', '24'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn ứng tuyển`,
                        }}
                        rowClassName={(record) => `application-row application-${record.status}`}
                    />
                </Spin>
            </Card>

            {showModal && selectedApply && (
                <Modal
                    title={
                        <div className="modal-title">
                            <UserOutlined className="modal-icon" />
                            <span>Chi tiết đơn ứng tuyển</span>
                        </div>
                    }
                    open={showModal} // sửa visible thành open (Ant Design v5+)
                    onCancel={closeModal}
                    footer={[
                        <Button key="close" onClick={closeModal}>
                            Đóng
                        </Button>,
                        selectedApply.status !== 'accepted' && (
                            <Button
                                key="approve"
                                type="primary"
                                onClick={() => handleUpdateStatus(selectedApply._id, 'accepted')}
                            >
                                Chấp nhận
                            </Button>
                        ),
                        selectedApply.status !== 'rejected' && (
                            <Button
                                key="reject"
                                danger
                                onClick={() => handleUpdateStatus(selectedApply._id, 'rejected')}
                            >
                                Từ chối
                            </Button>
                        ),
                    ]}
                >
                    <Descriptions bordered column={1} size="middle" labelStyle={{ fontWeight: 'bold' }}>
                        <Descriptions.Item label="Tên ứng viên">{selectedApply.fullName}</Descriptions.Item>
                        <Descriptions.Item label="Email">{selectedApply.email}</Descriptions.Item>
                        <Descriptions.Item label="Vị trí ứng tuyển">{selectedApply.jobId.title}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{selectedApply.phone}</Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {moment(selectedApply.birthday).format('DD/MM/YYYY')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tình trạng">{getStatusBadge(selectedApply.status)}</Descriptions.Item>
                        <Descriptions.Item label="Link CV">
                            <a href={selectedApply.resumeUrl} target="_blank" rel="noopener noreferrer">
                                Xem CV
                            </a>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày nộp đơn">
                            {moment(selectedApply.createdAt).format('HH:mm DD/MM/YYYY')}
                        </Descriptions.Item>
                    </Descriptions>
                </Modal>
            )}
        </div>
    );
};

export default ManageApply;
