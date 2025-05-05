import React, { useState, useEffect } from 'react';
import {
    Card,
    Avatar,
    Typography,
    Divider,
    Row,
    Col,
    Space,
    Tag,
    Skeleton,
    Alert,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    Upload,
    notification,
    Spin,
    Tooltip,
    message,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    TeamOutlined,
    IdcardOutlined,
    PhoneOutlined,
    EditOutlined,
    LoadingOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { apiInfoUser } from '../../apis/staff';
import moment from 'moment';
import axiosInstance from '../../utils/axiosConfig';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Profile = () => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    const [form] = Form.useForm();

    const fetchInfo = async () => {
        setLoading(true);
        try {
            const response = await apiInfoUser();
            if (response.code === 200) {
                setInfo(response.data);
                // Reset avatar URL when fetching new data
                setAvatarUrl(null);
                setAvatarFile(null);
            } else {
                setError('Không thể tải thông tin người dùng');
                message.error('Không thể tải thông tin người dùng');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi kết nối với máy chủ');
            message.error('Đã xảy ra lỗi khi kết nối với máy chủ');
        } finally {
            setLoading(false);
        }
    };

    // Handle file selection with validation
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước ảnh phải nhỏ hơn 2MB!');
            return Upload.LIST_IGNORE;
        }

        setUploadLoading(true);
        setAvatarFile(file);
        const fileUrl = URL.createObjectURL(file);
        setAvatarUrl(fileUrl);
        setUploadLoading(false);
        return false; // Prevent auto upload
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    // Open modal and initialize form values
    const showEditModal = () => {
        form.setFieldsValue({
            hoten: info?.hoten || '',
            email: info?.email || '',
            gioitinh: info?.gioitinh || 'Nam',
            ngaysinh: info?.ngaysinh ? moment(info.ngaysinh) : null,
            chucvu: info?.chucvu || '',
            phongban: info?.phongban_id?.tenphong || '',
            sdt: info?.sdt || '',
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setAvatarUrl(null); // Reset avatar URL when closing modal
        setAvatarFile(null);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('hoten', values.hoten);
        formData.append('gioitinh', values.gioitinh);
        formData.append('sdt', values.sdt);
        formData.append('ngaysinh', values.ngaysinh ? values.ngaysinh.format('DD-MM-YYYY') : '');
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            setUploadLoading(true);
            const response = await axiosInstance.put(`/api/users/${info._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.code === 200) {
                notification.success({
                    message: 'Cập nhật thành công',
                    description: 'Thông tin cá nhân của bạn đã được cập nhật.',
                });
                setIsModalOpen(false);
                fetchInfo();
            } else {
                notification.error({
                    message: 'Cập nhật thất bại',
                    description: response.data.message || 'Đã xảy ra lỗi khi cập nhật thông tin.',
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi khi gửi form',
                description: err.message || 'Đã xảy ra lỗi khi kết nối với máy chủ.',
            });
        } finally {
            setUploadLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        return moment(dateString).format('DD/MM/YYYY');
    };

    // Avatar upload button in form
    const uploadButton = (
        <div>
            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    if (error) {
        return (
            <div style={{ padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
                <Alert
                    message="Lỗi"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button type="primary" onClick={fetchInfo}>
                            Thử lại
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div
            style={{
                padding: '24px',
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Title level={2} style={{ marginTop: 20, marginBottom: 0 }}>
                    Thông tin cá nhân
                </Title>
                <Divider style={{ marginTop: 16 }} />

                <Skeleton loading={loading} active avatar paragraph={{ rows: 6 }}>
                    {info && (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Row gutter={[24, 24]} style={{ width: '100%', maxWidth: '1000px' }}>
                                <Col xs={24} md={8}>
                                    <Card
                                        hoverable
                                        style={{
                                            textAlign: 'center',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <Avatar
                                                    size={150}
                                                    src={info.avatar}
                                                    icon={<UserOutlined />}
                                                    style={{
                                                        border: '4px solid #f0f0f0',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                    }}
                                                />
                                                <Tooltip title="Chỉnh sửa thông tin">
                                                    <Button
                                                        type="primary"
                                                        shape="circle"
                                                        icon={<EditOutlined />}
                                                        size="small"
                                                        onClick={showEditModal}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                        }}
                                                    />
                                                </Tooltip>
                                            </div>
                                            <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                                                {info.hoten || 'Chưa cập nhật'}
                                            </Title>
                                            <Space size="small" wrap>
                                                {/* <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                                                    {info.role?.tenRole || 'Người dùng'}
                                                </Tag> */}
                                                {info.chucvu && (
                                                    <Tag
                                                        color="green"
                                                        style={{ fontSize: '14px', padding: '4px 12px' }}
                                                    >
                                                        {info.chucvu}
                                                    </Tag>
                                                )}
                                            </Space>

                                            {info.sdt && (
                                                <Paragraph style={{ marginTop: 8 }}>
                                                    <PhoneOutlined style={{ marginRight: 8 }} />
                                                    {info.sdt}
                                                </Paragraph>
                                            )}
                                        </Space>
                                    </Card>
                                </Col>

                                <Col xs={24} md={16}>
                                    <Card
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}>
                                                <UserOutlined style={{ marginRight: 8 }} />
                                                Chi tiết cá nhân
                                            </div>
                                        }
                                        extra={
                                            <Button type="primary" icon={<EditOutlined />} onClick={showEditModal}>
                                                Chỉnh sửa
                                            </Button>
                                        }
                                        style={{
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Row gutter={[24, 32]}>
                                            <Col xs={24} sm={12}>
                                                <Space align="start">
                                                    <MailOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                                                    <div>
                                                        <Text strong style={{ fontSize: '15px', display: 'block' }}>
                                                            Email
                                                        </Text>
                                                        <Text>{info.email || 'Chưa cập nhật'}</Text>
                                                    </div>
                                                </Space>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Space align="start">
                                                    <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                                                    <div>
                                                        <Text strong style={{ fontSize: '15px', display: 'block' }}>
                                                            Giới tính
                                                        </Text>
                                                        <Text>{info.gioitinh || 'Chưa cập nhật'}</Text>
                                                    </div>
                                                </Space>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Space align="start">
                                                    <CalendarOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                                                    <div>
                                                        <Text strong style={{ fontSize: '15px', display: 'block' }}>
                                                            Ngày sinh
                                                        </Text>
                                                        <Text>{formatDate(info.ngaysinh)}</Text>
                                                    </div>
                                                </Space>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Space align="start">
                                                    <PhoneOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                                                    <div>
                                                        <Text strong style={{ fontSize: '15px', display: 'block' }}>
                                                            Số điện thoại
                                                        </Text>
                                                        <Text>{info.sdt || 'Chưa cập nhật'}</Text>
                                                    </div>
                                                </Space>
                                            </Col>

                                            {info && info.chucvu && (
                                                <Col xs={24} sm={12}>
                                                    <Space align="start">
                                                        <IdcardOutlined
                                                            style={{ fontSize: '18px', color: '#1890ff' }}
                                                        />
                                                        <div>
                                                            <Text strong style={{ fontSize: '15px', display: 'block' }}>
                                                                Chức vụ
                                                            </Text>
                                                            <Text>{info.chucvu}</Text>
                                                        </div>
                                                    </Space>
                                                </Col>
                                            )}

                                            {info && info.phongban_id && (
                                                <Col xs={24} sm={12}>
                                                    <Space align="start">
                                                        <TeamOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                                                        <div>
                                                            <Text strong style={{ fontSize: '15px', display: 'block' }}>
                                                                Phòng ban
                                                            </Text>
                                                            <Text>{info.phongban_id?.tenphong}</Text>
                                                        </div>
                                                    </Space>
                                                </Col>
                                            )}
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Skeleton>

                <Modal
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <EditOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                            <span>Cập nhật thông tin cá nhân</span>
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={700}
                    destroyOnClose
                    style={{ top: 20 }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            hoten: info?.hoten,
                            email: info?.email,
                            gioitinh: info?.gioitinh || 'Nam',
                            ngaysinh: info?.ngaysinh ? moment(info.ngaysinh) : null,
                            sdt: info?.sdt,
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <Form.Item name="avatar" style={{ marginBottom: 8 }}>
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                >
                                    {uploadLoading ? (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                                        </div>
                                    ) : avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt="avatar"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : info?.avatar ? (
                                        <img
                                            src={info.avatar}
                                            alt="avatar"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </Form.Item>
                            <Text type="secondary">Nhấn vào ảnh để thay đổi avatar</Text>
                        </div>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="hoten"
                                    label="Họ tên"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                >
                                    <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} disabled />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="sdt"
                                    label="Số điện thoại"
                                    rules={[{ pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }]}
                                >
                                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="gioitinh" label="Giới tính">
                                    <Select placeholder="Chọn giới tính">
                                        <Option value="Nam">Nam</Option>
                                        <Option value="Nữ">Nữ</Option>
                                        <Option value="Khác">Khác</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item name="ngaysinh" label="Ngày sinh">
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format="DD/MM/YYYY"
                                        placeholder="Chọn ngày sinh"
                                        disabledDate={(current) => current && current > moment().endOf('day')}
                                    />
                                </Form.Item>
                            </Col>

                            {info && info.phongban_id && (
                                <Col xs={24} md={12}>
                                    <Form.Item name="phongban" label="Phòng ban">
                                        <Input prefix={<TeamOutlined />} disabled />
                                    </Form.Item>
                                </Col>
                            )}

                            {info && info.chucvu && (
                                <Col xs={24} md={12}>
                                    <Form.Item name="chucvu" label="Chức vụ">
                                        <Input prefix={<IdcardOutlined />} disabled />
                                    </Form.Item>
                                </Col>
                            )}
                        </Row>

                        <Form.Item style={{ marginTop: 16, marginBottom: 0 }}>
                            <Row gutter={16} justify="end">
                                <Col>
                                    <Button onClick={handleCancel}>Hủy</Button>
                                </Col>
                                <Col>
                                    <Button type="primary" htmlType="submit" loading={uploadLoading}>
                                        Lưu thay đổi
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default Profile;
