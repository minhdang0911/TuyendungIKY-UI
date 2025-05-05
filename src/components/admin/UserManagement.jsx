import { useEffect, useState } from 'react';
import './admin.css';
import { apiGetAllUser } from '../../apis/staff';
import moment from 'moment';
import {
    Modal,
    Button,
    Form,
    Input,
    DatePicker,
    Select,
    Popconfirm,
    Upload,
    notification,
    Table,
    Card,
    Space,
    Typography,
    Avatar,
    Badge,
    Tag,
    Tooltip,
    Divider,
} from 'antd';
import {
    UserAddOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    SearchOutlined,
    ReloadOutlined,
    UserOutlined,
    TeamOutlined,
    BarsOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { apiGetAllPhongBan } from '../../apis/Department';
import { apiGetRoles } from '../../apis/Roles';
import axiosInstance from '../../utils/axiosConfig';

const { Title } = Typography;
const { Option } = Select;

export default function UserManagement() {
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [avatarFile, setAvatarFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Phân trang
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
    });

    const [phongBan, setPhongBan] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const getAllPhongBan = async () => {
            const response = await apiGetAllPhongBan();
            setPhongBan(response?.data || []);
        };
        getAllPhongBan();
    }, []);

    useEffect(() => {
        const getAllRoles = async () => {
            const response = await apiGetRoles();
            setRoles(response || []);
        };
        getAllRoles();
    }, []);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setTableLoading(true);
            const response = await apiGetAllUser();
            setStaff(response.data);
            setPagination((prev) => ({
                ...prev,
                total: response.data.length,
            }));
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            notification.error({
                message: 'Lỗi dữ liệu',
                description: 'Không thể tải danh sách người dùng',
                placement: 'topRight',
            });
        } finally {
            setTableLoading(false);
        }
    };

    // Xử lý thêm người dùng
    const showAddModal = () => {
        form.resetFields();
        setIsAddModalVisible(true);
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const handleAddSubmit = () => {
        setLoading(true);

        form.validateFields()
            .then((values) => {
                const formData = new FormData();

                formData.append('hoten', values.hoten);
                formData.append('email', values.email);
                formData.append('ngaysinh', moment(values.ngaysinh).format('DD-MM-YYYY'));
                formData.append('gioitinh', values.gioitinh);
                formData.append('phongban_id', values.phongban_id);
                formData.append('role', values.role);
                formData.append('password', values.password);
                formData.append('chucvu', values.chucvu);

                if (avatarFile) {
                    formData.append('avatar', avatarFile);
                }

                axiosInstance
                    .post('/api/users/create', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then((response) => {
                        if (response.data && response.data.status === 'success') {
                            notification.success({
                                message: 'Thành công',
                                description: 'Đã thêm người dùng thành công',
                                placement: 'topRight',
                                duration: 3,
                            });

                            fetchAllUsers();
                            setIsAddModalVisible(false);
                            form.resetFields();
                            setAvatarFile(null);
                        } else {
                            notification.warning({
                                message: 'Cảnh báo',
                                description: 'Có lỗi xảy ra khi thêm người dùng',
                                placement: 'topRight',
                                duration: 3,
                            });
                        }
                    })
                    .catch((error) => {
                        console.error('Error when adding user:', error);
                        notification.error({
                            message: 'Lỗi',
                            description: 'Không thể thêm người dùng',
                            placement: 'topRight',
                        });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .catch((info) => {
                setLoading(false);
                notification.warning({
                    message: 'Lỗi nhập liệu',
                    description: 'Vui lòng kiểm tra lại thông tin đã nhập',
                    placement: 'topRight',
                    duration: 3,
                });
            });
    };

    // Xử lý sửa người dùng
    const showEditModal = (user) => {
        setCurrentUser(user);
        editForm.setFieldsValue({
            _id: user._id,
            hoten: user.hoten,
            email: user.email,
            ngaysinh: moment(user.ngaysinh),
            gioitinh: user.gioitinh,
            phongban_id: user.phongban_id?._id,
            chucvu: user.chucvu,
            role: user.role?._id,
            avatar: user?.avatar,
            password: '',
        });
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleEditSubmit = () => {
        const _id = editForm.getFieldValue('_id');
        setLoadingEdit(true);

        editForm.validateFields().then((values) => {
            const formData = new FormData();
            formData.append('hoten', values.hoten);
            formData.append('email', values.email);
            formData.append('ngaysinh', moment(values.ngaysinh).format('DD-MM-YYYY'));
            formData.append('gioitinh', values.gioitinh);

            // Chỉ append nếu tồn tại
            if (values.phongban_id) {
                formData.append('phongban_id', values.phongban_id);
            }

            if (values.role) {
                formData.append('role', values.role);
            }

            if (values.chucvu) {
                formData.append('chucvu', values.chucvu);
            }

            if (values.password) {
                formData.append('password', values.password);
            }

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            axiosInstance
                .put(`/api/users/${_id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then((response) => {
                    if (response.data && response.data.status === 'success') {
                        notification.success({
                            message: 'Cập nhật thành công',
                            description: 'Đã cập nhật người dùng thành công',
                            placement: 'topRight',
                            duration: 3,
                        });
                        fetchAllUsers();
                        setIsEditModalVisible(false);
                        setAvatarFile(null);
                        editForm.resetFields();
                    } else {
                        notification.warning({
                            message: 'Có lỗi xảy ra',
                            description: 'Có lỗi xảy ra khi cập nhật người dùng',
                            placement: 'topRight',
                            duration: 3,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi sửa người dùng:', error);
                    notification.error({
                        message: 'Lỗi khi sửa người dùng',
                        description: 'Có lỗi xảy ra khi sửa người dùng. Vui lòng thử lại.',
                        placement: 'topRight',
                        duration: 3,
                    });
                })
                .finally(() => {
                    setLoadingEdit(false);
                });
        });
    };

    // Xử lý xóa người dùng
    const handleDelete = async (userId) => {
        try {
            const response = await axiosInstance.delete(`/api/users/${userId}`);
            if (response.status === 200) {
                notification.success({
                    message: 'Xóa người dùng thành công',
                    description: 'Người dùng đã được xóa khỏi hệ thống.',
                    placement: 'topRight',
                });

                fetchAllUsers();
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            notification.error({
                message: 'Xóa người dùng thất bại',
                description: 'Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.',
                placement: 'topRight',
            });
        }
    };

    // Hàm tìm kiếm
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Lọc dữ liệu theo tìm kiếm và bộ lọc
    const filteredData = staff.filter((user) => {
        const matchSearch =
            !searchText ||
            user.hoten.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase());

        const matchDepartment = !selectedDepartment || user.phongban_id?._id === selectedDepartment;

        const matchRole = !selectedRole || user.role?._id === selectedRole;

        return matchSearch && matchDepartment && matchRole;
    });

    // Xử lý thay đổi phân trang
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    // Options
    const genderOptions = [
        { value: 'Nam', label: 'Nam' },
        { value: 'Nữ', label: 'Nữ' },
        { value: 'Khác', label: 'Khác' },
    ];

    const roleOptions = [
        { value: 'Giám Đốc', label: 'Giám Đốc' },
        { value: 'Trưởng Phòng', label: 'Trưởng Phòng' },
        { value: 'Phó Phòng', label: 'Phó Phòng' },
        { value: 'Quản lý', label: 'Quản lý' },
        { value: 'Nhân viên', label: 'Nhân viên' },
    ];

    // Định nghĩa cột cho bảng
    const columns = [
        {
            title: 'Nhân viên',
            key: 'user',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={record.avatar} size={40} icon={!record.avatar && <UserOutlined />} />
                    <div style={{ marginLeft: 10 }}>
                        <div style={{ fontWeight: 'bold' }}>{record.hoten}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thông tin cá nhân',
            children: [
                {
                    title: 'Ngày sinh',
                    dataIndex: 'ngaysinh',
                    key: 'ngaysinh',
                    render: (text) => moment(text).format('DD/MM/YYYY'),
                    width: 120,
                },
                {
                    title: 'Giới tính',
                    dataIndex: 'gioitinh',
                    key: 'gioitinh',
                    render: (text) => {
                        let color = text === 'Nam' ? 'blue' : text === 'Nữ' ? 'pink' : 'default';
                        return <Tag color={color}>{text}</Tag>;
                    },
                    width: 100,
                },
            ],
        },
        {
            title: 'Thông tin công việc',
            children: [
                {
                    title: 'Phòng ban',
                    dataIndex: ['phongban_id', 'tenphong'],
                    key: 'phongban',
                    render: (text) => (
                        <Tag color="cyan" icon={<TeamOutlined />}>
                            {text || 'Chưa phân công'}
                        </Tag>
                    ),
                },
                {
                    title: 'Chức vụ',
                    dataIndex: 'chucvu',
                    key: 'chucvu',
                    render: (text) => <Tag color="purple">{text || 'Chưa phân công'}</Tag>,
                },
                {
                    title: 'Vai trò',
                    dataIndex: ['role', 'tenRole'],
                    key: 'role',
                    render: (text) => (
                        <Tag color="green" icon={<BarsOutlined />}>
                            {text || 'Chưa phân vai trò'}
                        </Tag>
                    ),
                },
            ],
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Sửa">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => showEditModal(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc chắn muốn xóa người dùng này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Tooltip title="Xóa">
                            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} size="small" />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
            width: 120,
            fixed: 'right',
        },
    ];

    return (
        <div className="user-management-container">
            <Card bordered={false}>
                <div className="header-section" style={{ marginBottom: 16 }}>
                    <div
                        className="header-title"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <Title level={3}>
                            <UserOutlined style={{ marginRight: 8 }} />
                            Quản lý nhân viên
                        </Title>
                        <Button type="primary" icon={<UserAddOutlined />} onClick={showAddModal}>
                            Thêm người dùng
                        </Button>
                    </div>

                    <Divider style={{ margin: '16px 0' }} />

                    <div
                        className="filter-section"
                        style={{ display: 'flex', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}
                    >
                        <Input.Search
                            placeholder="Tìm kiếm theo tên, email..."
                            allowClear
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                            prefix={<SearchOutlined />}
                        />

                        <Select
                            placeholder="Lọc theo phòng ban"
                            style={{ width: 200 }}
                            allowClear
                            onChange={setSelectedDepartment}
                        >
                            {phongBan.map((dept) => (
                                <Option key={dept._id} value={dept._id}>
                                    {dept.tenphong}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Lọc theo vai trò"
                            style={{ width: 200 }}
                            allowClear
                            onChange={setSelectedRole}
                        >
                            {roles.map((role) => (
                                <Option key={role._id} value={role._id}>
                                    {role.tenRole}
                                </Option>
                            ))}
                        </Select>

                        <Button icon={<ReloadOutlined />} onClick={fetchAllUsers} title="Làm mới dữ liệu">
                            Làm mới
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="_id"
                    pagination={pagination}
                    onChange={handleTableChange}
                    loading={tableLoading}
                    scroll={{ x: true }}
                    size="middle"
                    bordered
                />
            </Card>

            {/* Modal Thêm người dùng */}
            <Modal
                title={
                    <>
                        <UserAddOutlined /> Thêm người dùng mới
                    </>
                }
                open={isAddModalVisible}
                onCancel={handleAddCancel}
                width={700}
                footer={[
                    <Button key="back" onClick={handleAddCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddSubmit} loading={loading}>
                        Thêm
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <Form.Item
                                name="hoten"
                                label="Họ tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input placeholder="example@example.com" />
                            </Form.Item>

                            <Form.Item name="password" label="Mật khẩu">
                                <Input.Password placeholder="Nhập mật khẩu" />
                            </Form.Item>

                            <Form.Item
                                name="ngaysinh"
                                label="Ngày sinh"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    style={{ width: '100%' }}
                                    placeholder="Chọn ngày sinh"
                                />
                            </Form.Item>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Form.Item
                                name="gioitinh"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                            >
                                <Select options={genderOptions} placeholder="Chọn giới tính" />
                            </Form.Item>

                            <Form.Item name="role" label="Vai trò (Role)">
                                <Select placeholder="Chọn vai trò">
                                    {roles.map((role) => (
                                        <Option key={role._id} value={role._id}>
                                            {role.tenRole}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="phongban_id"
                                label="Phòng ban"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng ban!' }]}
                            >
                                <Select placeholder="Chọn phòng ban">
                                    {phongBan.map((dept) => (
                                        <Option key={dept._id} value={dept._id}>
                                            {dept.tenphong}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="chucvu"
                                label="Chức vụ"
                                rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
                            >
                                <Select options={roleOptions} placeholder="Chọn chức vụ" />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item name="avatar" label="Ảnh đại diện">
                        <Upload
                            name="avatar"
                            beforeUpload={(file) => {
                                setAvatarFile(file);
                                return false;
                            }}
                            listType="picture-card"
                            maxCount={1}
                            accept="image/*"
                        >
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Sửa người dùng */}
            <Modal
                title={
                    <>
                        <EditOutlined /> Chỉnh sửa người dùng
                    </>
                }
                open={isEditModalVisible}
                onCancel={handleEditCancel}
                width={700}
                footer={[
                    <Button key="back" onClick={handleEditCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleEditSubmit} loading={loadingEdit}>
                        Cập nhật
                    </Button>,
                ]}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    {currentUser?.avatar ? (
                        <Badge
                            count={
                                <Tooltip title="Tải ảnh mới">
                                    <Upload
                                        beforeUpload={(file) => {
                                            setAvatarFile(file);
                                            setCurrentUser((prevUser) => ({
                                                ...prevUser,
                                                avatar: URL.createObjectURL(file),
                                            }));
                                            return false;
                                        }}
                                        showUploadList={false}
                                    >
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon={<UploadOutlined />}
                                            style={{ background: '#1890ff', color: 'white' }}
                                        />
                                    </Upload>
                                </Tooltip>
                            }
                        >
                            <Avatar
                                src={currentUser.avatar}
                                size={100}
                                icon={!currentUser.avatar && <UserOutlined />}
                            />
                        </Badge>
                    ) : (
                        <Badge
                            count={
                                <Tooltip title="Tải ảnh">
                                    <Upload
                                        beforeUpload={(file) => {
                                            setAvatarFile(file);
                                            setCurrentUser((prevUser) => ({
                                                ...prevUser,
                                                avatar: URL.createObjectURL(file),
                                            }));
                                            return false;
                                        }}
                                        showUploadList={false}
                                    >
                                        <Button
                                            shape="circle"
                                            size="small"
                                            icon={<UploadOutlined />}
                                            style={{ background: '#1890ff', color: 'white' }}
                                        />
                                    </Upload>
                                </Tooltip>
                            }
                        >
                            <Avatar size={100} icon={<UserOutlined />} />
                        </Badge>
                    )}
                </div>

                <Form form={editForm} layout="vertical">
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <Form.Item
                                name="hoten"
                                label="Họ tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item name="password" label="Mật khẩu mới">
                                <Input.Password placeholder="Để trống nếu không muốn đổi mật khẩu" />
                            </Form.Item>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Form.Item
                                name="ngaysinh"
                                label="Ngày sinh"
                                rules={[{ required: true, message: 'Chọn ngày sinh!' }]}
                            >
                                <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                name="gioitinh"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Chọn giới tính!' }]}
                            >
                                <Select options={genderOptions} placeholder="Chọn giới tính" />
                            </Form.Item>

                            <Form.Item name="phongban_id" label="Phòng Ban">
                                <Select
                                    placeholder="Chọn Phòng Ban"
                                    options={phongBan.map((pb) => ({
                                        value: pb._id,
                                        label: pb.tenphong,
                                    }))}
                                />
                            </Form.Item>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="chucvu" label="Chức vụ" style={{ flex: 1 }}>
                            <Select placeholder="Chọn chức vụ" options={roleOptions} />
                        </Form.Item>

                        <Form.Item name="role" label="Vai trò" style={{ flex: 1 }}>
                            <Select
                                placeholder="Chọn vai trò"
                                options={roles.map((r) => ({
                                    value: r._id,
                                    label: r.tenRole,
                                }))}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
