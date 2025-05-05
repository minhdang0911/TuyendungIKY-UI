import React, { useEffect, useState } from 'react';
import {
    Table,
    Tabs,
    Button,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Typography,
    Card,
    Tag,
    Space,
    Divider,
    Avatar,
    Badge,
    Tooltip,
    Empty,
    Drawer,
    Skeleton,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    TeamOutlined,
    SearchOutlined,
    ExportOutlined,
    ReloadOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { apiGetRoles, apiCreateRole, apiUpdateRole, apiDeleteRole } from '../../apis/Roles';
import { apiGetAllUser } from '../../apis/staff';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Search } = Input;

const RoleManage = () => {
    const [roles, setRoles] = useState([]);
    const [listUser, setListUser] = useState([]);
    const [form] = Form.useForm();
    const [editingRole, setEditingRole] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [roleDetails, setRoleDetails] = useState(null);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await apiGetRoles();
            setRoles(res);
        } catch (error) {
            message.error('Không thể tải dữ liệu vai trò');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await apiGetAllUser();
            setListUser(res.data);
        } catch (error) {
            message.error('Không thể tải dữ liệu người dùng');
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    const handleAdd = () => {
        form.resetFields();
        setEditingRole(null);
        setIsModalVisible(true);
    };

    const handleEdit = (role) => {
        form.setFieldsValue(role);
        setEditingRole(role);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await apiDeleteRole(id);
            message.success('Xóa vai trò thành công!');
            fetchRoles();
        } catch (error) {
            message.error('Không thể xóa vai trò');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            if (editingRole) {
                await apiUpdateRole(editingRole._id, values);
                message.success('Cập nhật vai trò thành công!');
            } else {
                await apiCreateRole(values);
                message.success('Tạo vai trò mới thành công!');
            }

            fetchRoles();
            setIsModalVisible(false);
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleViewDetails = (role) => {
        setRoleDetails(role);
        const usersInRole = listUser.filter((user) => user.role?._id === role._id);
        setSelectedRole({ ...role, users: usersInRole });
        setDrawerVisible(true);
    };

    const filteredRoles = roles.filter(
        (role) =>
            role.tenRole.toLowerCase().includes(searchText.toLowerCase()) ||
            (role.mota && role.mota.toLowerCase().includes(searchText.toLowerCase())),
    );

    const columns = [
        {
            title: 'Tên vai trò',
            dataIndex: 'tenRole',
            key: 'tenRole',
            render: (text, record) => (
                <Space>
                    <Text strong>{text}</Text>
                    <Badge
                        count={listUser.filter((user) => user.role?._id === record._id).length}
                        showZero
                        style={{
                            backgroundColor:
                                listUser.filter((user) => user.role?._id === record._id).length > 0
                                    ? '#1890ff'
                                    : '#d9d9d9',
                        }}
                    />
                </Space>
            ),
            sorter: (a, b) => a.tenRole.localeCompare(b.tenRole),
        },
        {
            title: 'Mô tả',
            dataIndex: 'mota',
            key: 'mota',
            ellipsis: true,
            render: (text) =>
                text || (
                    <Text type="secondary" italic>
                        Chưa có mô tả
                    </Text>
                ),
        },
        {
            title: 'Số nhân viên',
            key: 'userCount',
            render: (_, record) => {
                const count = listUser.filter((user) => user.role?._id === record._id).length;
                return <Tag color={count > 0 ? 'blue' : 'default'}>{count} nhân viên</Tag>;
            },
            sorter: (a, b) => {
                const countA = listUser.filter((user) => user.role?._id === a._id).length;
                const countB = listUser.filter((user) => user.role?._id === b._id).length;
                return countA - countB;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<InfoCircleOutlined />} onClick={() => handleViewDetails(record)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa vai trò này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="left"
                    >
                        <Tooltip title="Xóa">
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const userColumns = [
        {
            title: 'Họ tên',
            dataIndex: 'hoten',
            key: 'hoten',
            render: (text, record) => (
                <Space>
                    <Avatar
                        style={{ backgroundColor: record.avatar ? 'transparent' : '#1890ff' }}
                        src={record.avatar}
                        icon={!record.avatar && <UserOutlined />}
                    />
                    <Text>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
        },
        {
            title: 'Chức vụ',
            dataIndex: 'chucvu',
            key: 'chucvu',
            render: (text) =>
                text || (
                    <Text type="secondary" italic>
                        Chưa cập nhật
                    </Text>
                ),
        },
        {
            title: 'Phòng ban',
            dataIndex: ['phongban_id', 'tenphong'],
            key: 'phongban_id',
            render: (text) =>
                text || (
                    <Text type="secondary" italic>
                        Chưa phân công
                    </Text>
                ),
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-6 roles-admin">
            <Card>
                <Tabs defaultActiveKey="roles" type="card">
                    <TabPane
                        tab={
                            <span>
                                <TeamOutlined /> Quản lý vai trò
                            </span>
                        }
                        key="roles"
                    >
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                            <Title level={4} style={{ margin: 0 }}>
                                Danh sách vai trò
                            </Title>
                            <Space>
                                <Search
                                    placeholder="Tìm kiếm vai trò"
                                    allowClear
                                    onSearch={handleSearch}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 250 }}
                                    suffix={<SearchOutlined />}
                                />
                                <Tooltip title="Làm mới dữ liệu">
                                    <Button icon={<ReloadOutlined />} onClick={() => fetchRoles()} />
                                </Tooltip>
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                                    Thêm vai trò
                                </Button>
                            </Space>
                        </div>

                        <Table
                            dataSource={filteredRoles}
                            columns={columns}
                            rowKey="_id"
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Tổng cộng ${total} vai trò`,
                            }}
                            size="middle"
                            bordered
                            locale={{
                                emptyText: (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Không có dữ liệu vai trò"
                                    />
                                ),
                            }}
                        />
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <UserOutlined /> Nhân viên theo vai trò
                            </span>
                        }
                        key="users"
                    >
                        {loading ? (
                            <div className="space-y-8">
                                {[1, 2, 3].map((i) => (
                                    <Card key={i}>
                                        <Skeleton active paragraph={{ rows: 1 }} />
                                        <Divider />
                                        <Skeleton active paragraph={{ rows: 3 }} />
                                    </Card>
                                ))}
                            </div>
                        ) : roles.length > 0 ? (
                            <div className="space-y-8">
                                {roles.map((role) => {
                                    const usersInRole = listUser.filter((user) => user.role?._id === role._id);
                                    return (
                                        <Card
                                            key={role._id}
                                            title={
                                                <Space>
                                                    <Text strong>{role.tenRole}</Text>
                                                    <Tag color="blue">{usersInRole.length} nhân viên</Tag>
                                                </Space>
                                            }
                                            extra={
                                                <Space>
                                                    <Button
                                                        type="text"
                                                        icon={<EditOutlined />}
                                                        onClick={() => handleEdit(role)}
                                                    >
                                                        Sửa vai trò
                                                    </Button>
                                                    <Tooltip title="Xem chi tiết">
                                                        <Button
                                                            type="primary"
                                                            ghost
                                                            onClick={() => handleViewDetails(role)}
                                                        >
                                                            Chi tiết
                                                        </Button>
                                                    </Tooltip>
                                                </Space>
                                            }
                                        >
                                            {role.mota && <Divider orientation="left">Mô tả</Divider>}
                                            {role.mota ? (
                                                <p>{role.mota}</p>
                                            ) : (
                                                <Text type="secondary" italic>
                                                    Chưa có mô tả cho vai trò này
                                                </Text>
                                            )}

                                            <Divider orientation="left">Danh sách nhân viên</Divider>

                                            <Table
                                                dataSource={usersInRole}
                                                rowKey="_id"
                                                columns={userColumns}
                                                pagination={usersInRole.length > 10 ? { pageSize: 10 } : false}
                                                size="middle"
                                                locale={{
                                                    emptyText: (
                                                        <Empty description="Chưa có nhân viên nào trong vai trò này" />
                                                    ),
                                                }}
                                            />
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <Empty description="Chưa có vai trò nào được tạo" />
                        )}
                    </TabPane>
                </Tabs>
            </Card>

            {/* Modal Form */}
            <Modal
                title={
                    <Space>
                        {editingRole ? <EditOutlined /> : <PlusOutlined />}
                        <Text>{editingRole ? 'Cập nhật vai trò' : 'Thêm vai trò mới'}</Text>
                    </Space>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
                        {editingRole ? 'Cập nhật' : 'Tạo mới'}
                    </Button>,
                ]}
                maskClosable={false}
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên vai trò"
                        name="tenRole"
                        rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}
                    >
                        <Input placeholder="Nhập tên vai trò" maxLength={100} showCount />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="mota"
                        extra="Mô tả chi tiết về trách nhiệm và quyền hạn của vai trò này"
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả vai trò" maxLength={500} showCount />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Drawer chi tiết vai trò */}
            <Drawer
                title={
                    <Space>
                        <TeamOutlined />
                        <Text strong>Chi tiết vai trò: {selectedRole?.tenRole}</Text>
                    </Space>
                }
                width={700}
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                extra={
                    <Space>
                        <Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setDrawerVisible(false);
                                handleEdit(selectedRole);
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    </Space>
                }
            >
                {selectedRole && (
                    <>
                        <Card title="Thông tin vai trò" className="mb-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Text type="secondary">Tên vai trò:</Text>
                                    <div>
                                        <Text strong>{selectedRole.tenRole}</Text>
                                    </div>
                                </div>
                                <div>
                                    <Text type="secondary">Mô tả:</Text>
                                    <div>
                                        {selectedRole.mota ? (
                                            <Text>{selectedRole.mota}</Text>
                                        ) : (
                                            <Text type="secondary" italic>
                                                Chưa có mô tả
                                            </Text>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Text type="secondary">Số lượng nhân viên:</Text>
                                    <div>
                                        <Tag color="blue">{selectedRole.users?.length || 0} nhân viên</Tag>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card
                            title={
                                <Space>
                                    <UserOutlined />
                                    <Text>Nhân viên trong vai trò này</Text>
                                </Space>
                            }
                            extra={
                                <Tooltip title="Xuất danh sách">
                                    <Button icon={<ExportOutlined />}>Xuất Excel</Button>
                                </Tooltip>
                            }
                        >
                            {selectedRole.users && selectedRole.users.length > 0 ? (
                                <Table
                                    dataSource={selectedRole.users}
                                    columns={userColumns}
                                    rowKey="_id"
                                    pagination={false}
                                    size="middle"
                                />
                            ) : (
                                <Empty description="Chưa có nhân viên nào trong vai trò này" />
                            )}
                        </Card>
                    </>
                )}
            </Drawer>
        </div>
    );
};

export default RoleManage;

// import React, { useEffect, useState } from 'react';
// import {
//     Table,
//     Tabs,
//     Button,
//     Modal,
//     Form,
//     Input,
//     message,
//     Popconfirm,
//     Typography,
//     Card,
//     Tag,
//     Space,
//     Divider,
//     Avatar,
//     Badge,
//     Tooltip,
//     Empty,
//     Drawer,
//     Skeleton,
//     Row,
//     Col,
//     Statistic,
//     Select,
//     Progress,
//     List,
//     Segmented,
//     Result,
//     Checkbox,
// } from 'antd';
// import {
//     PlusOutlined,
//     EditOutlined,
//     DeleteOutlined,
//     UserOutlined,
//     TeamOutlined,
//     SearchOutlined,
//     ExportOutlined,
//     ReloadOutlined,
//     InfoCircleOutlined,
//     AppstoreOutlined,
//     UnorderedListOutlined,
//     CheckCircleOutlined,
//     WarningOutlined,
//     BarChartOutlined,
//     FileExcelOutlined,
//     FilePdfOutlined,
//     SettingOutlined,
//     LockOutlined,
//     UnlockOutlined,
//     EyeOutlined,
//     PieChartOutlined,
// } from '@ant-design/icons';
// import { apiGetRoles, apiCreateRole, apiUpdateRole, apiDeleteRole } from '../../apis/Roles';
// import { apiGetAllUser } from '../../apis/staff';

// const { TabPane } = Tabs;
// const { Title, Text, Paragraph } = Typography;
// const { Search } = Input;
// const { Option } = Select;

// const RoleManage = () => {
//     const [roles, setRoles] = useState([]);
//     const [listUser, setListUser] = useState([]);
//     const [form] = Form.useForm();
//     const [editingRole, setEditingRole] = useState(null);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [searchText, setSearchText] = useState('');
//     const [selectedRole, setSelectedRole] = useState(null);
//     const [drawerVisible, setDrawerVisible] = useState(false);
//     const [roleDetails, setRoleDetails] = useState(null);
//     const [viewMode, setViewMode] = useState('table');
//     const [permissionForm] = Form.useForm();
//     const [permissionModalVisible, setPermissionModalVisible] = useState(false);
//     const [userSearchText, setUserSearchText] = useState('');
//     const [activeTab, setActiveTab] = useState('roles');
//     const [statsLoading, setStatsLoading] = useState(true);

//     // Dữ liệu mẫu cho quyền hạn
//     const permissionCategories = [
//         {
//             name: 'Quản lý người dùng',
//             permissions: [
//                 { id: 'user_view', name: 'Xem người dùng' },
//                 { id: 'user_create', name: 'Tạo người dùng' },
//                 { id: 'user_edit', name: 'Sửa người dùng' },
//                 { id: 'user_delete', name: 'Xóa người dùng' },
//             ],
//         },
//         {
//             name: 'Quản lý dự án',
//             permissions: [
//                 { id: 'project_view', name: 'Xem dự án' },
//                 { id: 'project_create', name: 'Tạo dự án' },
//                 { id: 'project_edit', name: 'Sửa dự án' },
//                 { id: 'project_delete', name: 'Xóa dự án' },
//             ],
//         },
//         {
//             name: 'Báo cáo',
//             permissions: [
//                 { id: 'report_view', name: 'Xem báo cáo' },
//                 { id: 'report_export', name: 'Xuất báo cáo' },
//                 { id: 'report_create', name: 'Tạo báo cáo' },
//             ],
//         },
//     ];

//     const fetchRoles = async () => {
//         setLoading(true);
//         try {
//             const res = await apiGetRoles();
//             setRoles(res);
//         } catch (error) {
//             message.error('Không thể tải dữ liệu vai trò');
//         } finally {
//             setLoading(false);
//             setStatsLoading(false);
//         }
//     };

//     const fetchUsers = async () => {
//         try {
//             const res = await apiGetAllUser();
//             setListUser(res.data);
//         } catch (error) {
//             message.error('Không thể tải dữ liệu người dùng');
//         }
//     };

//     useEffect(() => {
//         fetchRoles();
//         fetchUsers();

//         // Giả lập thời gian tải thống kê
//         setTimeout(() => {
//             setStatsLoading(false);
//         }, 1500);
//     }, []);

//     const handleAdd = () => {
//         form.resetFields();
//         setEditingRole(null);
//         setIsModalVisible(true);
//     };

//     const handleEdit = (role) => {
//         form.setFieldsValue(role);
//         setEditingRole(role);
//         setIsModalVisible(true);
//     };

//     const handleDelete = async (id) => {
//         setLoading(true);
//         try {
//             await apiDeleteRole(id);
//             message.success('Xóa vai trò thành công!');
//             fetchRoles();
//         } catch (error) {
//             message.error('Không thể xóa vai trò');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async () => {
//         try {
//             const values = await form.validateFields();
//             setLoading(true);

//             if (editingRole) {
//                 await apiUpdateRole(editingRole._id, values);
//                 message.success('Cập nhật vai trò thành công!');
//             } else {
//                 await apiCreateRole(values);
//                 message.success('Tạo vai trò mới thành công!');
//             }

//             fetchRoles();
//             setIsModalVisible(false);
//         } catch (error) {
//             message.error('Có lỗi xảy ra, vui lòng thử lại');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = (value) => {
//         setSearchText(value);
//     };

//     const handleViewDetails = (role) => {
//         setRoleDetails(role);
//         const usersInRole = listUser.filter((user) => user.role?._id === role._id);
//         setSelectedRole({ ...role, users: usersInRole });
//         setDrawerVisible(true);
//     };

//     const handleManagePermissions = (role) => {
//         setEditingRole(role);
//         // Điền quyền hạn mặc định hoặc lấy từ API
//         permissionForm.resetFields();

//         // Giả lập các quyền đã có
//         const mockPermissions = ['user_view', 'project_view', 'report_view'];
//         permissionForm.setFieldsValue({
//             permissions: mockPermissions,
//         });

//         setPermissionModalVisible(true);
//     };

//     const handlePermissionSubmit = async () => {
//         try {
//             const values = await permissionForm.validateFields();
//             // API call sẽ được thêm vào ở đây
//             message.success('Cập nhật quyền hạn thành công!');
//             setPermissionModalVisible(false);
//         } catch (error) {
//             message.error('Có lỗi xảy ra khi cập nhật quyền hạn');
//         }
//     };

//     const getStatusColor = (count) => {
//         if (count === 0) return '#d9d9d9';
//         if (count < 3) return '#faad14';
//         return '#1890ff';
//     };

//     const filteredRoles = roles.filter(
//         (role) =>
//             role.tenRole.toLowerCase().includes(searchText.toLowerCase()) ||
//             (role.mota && role.mota.toLowerCase().includes(searchText.toLowerCase())),
//     );

//     const filteredUsers = (roleId) => {
//         const usersInRole = listUser.filter((user) => user.role?._id === roleId);
//         return usersInRole.filter(
//             (user) =>
//                 user.hoten?.toLowerCase().includes(userSearchText.toLowerCase()) ||
//                 user.email?.toLowerCase().includes(userSearchText.toLowerCase()) ||
//                 user.chucvu?.toLowerCase().includes(userSearchText.toLowerCase()),
//         );
//     };

//     const columns = [
//         {
//             title: 'Tên vai trò',
//             dataIndex: 'tenRole',
//             key: 'tenRole',
//             render: (text, record) => (
//                 <Space>
//                     <Text strong>{text}</Text>
//                     <Badge
//                         count={listUser.filter((user) => user.role?._id === record._id).length}
//                         showZero
//                         style={{
//                             backgroundColor: getStatusColor(
//                                 listUser.filter((user) => user.role?._id === record._id).length,
//                             ),
//                         }}
//                     />
//                 </Space>
//             ),
//             sorter: (a, b) => a.tenRole.localeCompare(b.tenRole),
//         },
//         {
//             title: 'Mô tả',
//             dataIndex: 'mota',
//             key: 'mota',
//             ellipsis: true,
//             render: (text) =>
//                 text || (
//                     <Text type="secondary" italic>
//                         Chưa có mô tả
//                     </Text>
//                 ),
//         },
//         {
//             title: 'Số nhân viên',
//             key: 'userCount',
//             render: (_, record) => {
//                 const count = listUser.filter((user) => user.role?._id === record._id).length;
//                 return (
//                     <Tag color={count > 0 ? 'blue' : 'default'} style={{ minWidth: '80px', textAlign: 'center' }}>
//                         {count} nhân viên
//                     </Tag>
//                 );
//             },
//             sorter: (a, b) => {
//                 const countA = listUser.filter((user) => user.role?._id === a._id).length;
//                 const countB = listUser.filter((user) => user.role?._id === b._id).length;
//                 return countA - countB;
//             },
//         },
//         {
//             title: 'Phân quyền',
//             key: 'permission',
//             align: 'center',
//             render: (_, record) => {
//                 // Giả lập số quyền
//                 const mockPermissions = Math.floor(Math.random() * 10) + 1;
//                 return (
//                     <Space>
//                         <Tag color="purple">{mockPermissions} quyền</Tag>
//                         <Button
//                             type="text"
//                             icon={<SettingOutlined />}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleManagePermissions(record);
//                             }}
//                         />
//                     </Space>
//                 );
//             },
//         },
//         {
//             title: 'Hành động',
//             key: 'action',
//             render: (_, record) => (
//                 <Space size="small">
//                     <Tooltip title="Xem chi tiết">
//                         <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
//                     </Tooltip>
//                     <Tooltip title="Chỉnh sửa">
//                         <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
//                     </Tooltip>
//                     <Popconfirm
//                         title="Bạn có chắc chắn muốn xóa vai trò này?"
//                         onConfirm={() => handleDelete(record._id)}
//                         okText="Xóa"
//                         cancelText="Hủy"
//                         placement="left"
//                     >
//                         <Tooltip title="Xóa">
//                             <Button type="text" danger icon={<DeleteOutlined />} />
//                         </Tooltip>
//                     </Popconfirm>
//                 </Space>
//             ),
//         },
//     ];

//     const userColumns = [
//         {
//             title: 'Họ tên',
//             dataIndex: 'hoten',
//             key: 'hoten',
//             render: (text, record) => (
//                 <Space>
//                     <Avatar
//                         style={{ backgroundColor: record.avatar ? 'transparent' : '#1890ff' }}
//                         src={record.avatar}
//                         icon={!record.avatar && <UserOutlined />}
//                     />
//                     <Text>{text}</Text>
//                 </Space>
//             ),
//         },
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//             ellipsis: true,
//         },
//         {
//             title: 'Chức vụ',
//             dataIndex: 'chucvu',
//             key: 'chucvu',
//             render: (text) =>
//                 text || (
//                     <Text type="secondary" italic>
//                         Chưa cập nhật
//                     </Text>
//                 ),
//         },
//         {
//             title: 'Phòng ban',
//             dataIndex: ['phongban_id', 'tenphong'],
//             key: 'phongban_id',
//             render: (text) =>
//                 text || (
//                     <Text type="secondary" italic>
//                         Chưa phân công
//                     </Text>
//                 ),
//         },
//         {
//             title: 'Trạng thái',
//             key: 'status',
//             align: 'center',
//             render: () => {
//                 // Giả lập trạng thái active/inactive
//                 const active = Math.random() > 0.3;
//                 return (
//                     <Tag
//                         color={active ? 'success' : 'default'}
//                         icon={active ? <CheckCircleOutlined /> : <WarningOutlined />}
//                     >
//                         {active ? 'Đang hoạt động' : 'Không hoạt động'}
//                     </Tag>
//                 );
//             },
//         },
//     ];

//     const renderCardView = () => {
//         return (
//             <Row gutter={[16, 16]}>
//                 {filteredRoles.map((role) => {
//                     const usersCount = listUser.filter((user) => user.role?._id === role._id).length;
//                     return (
//                         <Col xs={24} sm={12} md={8} lg={8} xl={6} key={role._id}>
//                             <Card
//                                 hoverable
//                                 className="role-card"
//                                 cover={
//                                     <div
//                                         style={{
//                                             padding: '20px',
//                                             background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
//                                             textAlign: 'center',
//                                             color: 'white',
//                                         }}
//                                     >
//                                         <TeamOutlined style={{ fontSize: '32px' }} />
//                                         <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>
//                                             {role.tenRole}
//                                         </div>
//                                     </div>
//                                 }
//                                 actions={[
//                                     <Tooltip title="Xem chi tiết">
//                                         <EyeOutlined key="view" onClick={() => handleViewDetails(role)} />
//                                     </Tooltip>,
//                                     <Tooltip title="Chỉnh sửa">
//                                         <EditOutlined key="edit" onClick={() => handleEdit(role)} />
//                                     </Tooltip>,
//                                     <Popconfirm
//                                         title="Bạn có chắc chắn muốn xóa vai trò này?"
//                                         onConfirm={() => handleDelete(role._id)}
//                                         okText="Xóa"
//                                         cancelText="Hủy"
//                                     >
//                                         <DeleteOutlined key="delete" />
//                                     </Popconfirm>,
//                                 ]}
//                             >
//                                 <Space direction="vertical" style={{ width: '100%' }}>
//                                     <div>
//                                         <Text type="secondary">Nhân viên:</Text>
//                                         <Tag color={getStatusColor(usersCount)} style={{ marginLeft: 8 }}>
//                                             {usersCount} người
//                                         </Tag>
//                                     </div>

//                                     <div>
//                                         <Text type="secondary">Phân quyền:</Text>
//                                         <Tag color="purple" style={{ marginLeft: 8 }}>
//                                             {Math.floor(Math.random() * 10) + 1} quyền
//                                         </Tag>
//                                     </div>

//                                     <Paragraph
//                                         type="secondary"
//                                         ellipsis={{ rows: 2, expandable: false, tooltip: role.mota }}
//                                     >
//                                         {role.mota || 'Chưa có mô tả cho vai trò này'}
//                                     </Paragraph>

//                                     <Button
//                                         type="primary"
//                                         ghost
//                                         icon={<SettingOutlined />}
//                                         block
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleManagePermissions(role);
//                                         }}
//                                     >
//                                         Phân quyền
//                                     </Button>
//                                 </Space>
//                             </Card>
//                         </Col>
//                     );
//                 })}

//                 {/* Card thêm vai trò mới */}
//                 <Col xs={24} sm={12} md={8} lg={8} xl={6}>
//                     <Card
//                         hoverable
//                         className="add-role-card"
//                         style={{
//                             height: '100%',
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             border: '1px dashed #d9d9d9',
//                             background: '#fafafa',
//                         }}
//                         onClick={handleAdd}
//                     >
//                         <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                             <PlusOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
//                             <div style={{ marginTop: 16 }}>
//                                 <Text strong>Thêm vai trò mới</Text>
//                             </div>
//                         </div>
//                     </Card>
//                 </Col>
//             </Row>
//         );
//     };

//     const renderDashboard = () => {
//         return (
//             <div>
//                 <Row gutter={[16, 16]} className="stats-row">
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Tổng số vai trò"
//                                 value={roles.length}
//                                 prefix={<TeamOutlined />}
//                                 loading={statsLoading}
//                             />
//                             <div style={{ marginTop: 8 }}>
//                                 <Progress
//                                     percent={Math.min(100, roles.length * 10)}
//                                     strokeColor="#1890ff"
//                                     showInfo={false}
//                                     status="active"
//                                 />
//                             </div>
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Tổng số nhân viên"
//                                 value={listUser.length}
//                                 prefix={<UserOutlined />}
//                                 loading={statsLoading}
//                             />
//                             <div style={{ marginTop: 8 }}>
//                                 <Progress
//                                     percent={Math.min(100, listUser.length / 2)}
//                                     strokeColor="#52c41a"
//                                     showInfo={false}
//                                     status="active"
//                                 />
//                             </div>
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Vai trò có nhân viên"
//                                 value={
//                                     roles.filter((role) => listUser.some((user) => user.role?._id === role._id)).length
//                                 }
//                                 prefix={<CheckCircleOutlined />}
//                                 loading={statsLoading}
//                             />
//                             <div style={{ marginTop: 8 }}>
//                                 <Progress
//                                     percent={Math.min(
//                                         100,
//                                         (roles.filter((role) => listUser.some((user) => user.role?._id === role._id))
//                                             .length /
//                                             roles.length) *
//                                             100 || 0,
//                                     )}
//                                     strokeColor="#722ed1"
//                                     showInfo={false}
//                                     status="active"
//                                 />
//                             </div>
//                         </Card>
//                     </Col>
//                     <Col xs={24} sm={12} md={6}>
//                         <Card>
//                             <Statistic
//                                 title="Vai trò không có nhân viên"
//                                 value={
//                                     roles.filter((role) => !listUser.some((user) => user.role?._id === role._id)).length
//                                 }
//                                 prefix={<WarningOutlined />}
//                                 loading={statsLoading}
//                                 valueStyle={{
//                                     color:
//                                         roles.filter((role) => !listUser.some((user) => user.role?._id === role._id))
//                                             .length > 0
//                                             ? '#faad14'
//                                             : '#8c8c8c',
//                                 }}
//                             />
//                             <div style={{ marginTop: 8 }}>
//                                 <Progress
//                                     percent={Math.min(
//                                         100,
//                                         (roles.filter((role) => !listUser.some((user) => user.role?._id === role._id))
//                                             .length /
//                                             roles.length) *
//                                             100 || 0,
//                                     )}
//                                     strokeColor="#faad14"
//                                     showInfo={false}
//                                     status="active"
//                                 />
//                             </div>
//                         </Card>
//                     </Col>
//                 </Row>

//                 <Divider orientation="left">Phân bố nhân viên theo vai trò</Divider>

//                 <Row gutter={[16, 16]}>
//                     <Col xs={24} md={16}>
//                         <Card title="Top vai trò" extra={<BarChartOutlined />}>
//                             {statsLoading ? (
//                                 <Skeleton active paragraph={{ rows: 6 }} />
//                             ) : (
//                                 <List
//                                     dataSource={roles
//                                         .map((role) => ({
//                                             ...role,
//                                             userCount: listUser.filter((user) => user.role?._id === role._id).length,
//                                         }))
//                                         .sort((a, b) => b.userCount - a.userCount)
//                                         .slice(0, 5)}
//                                     renderItem={(item) => (
//                                         <List.Item>
//                                             <List.Item.Meta
//                                                 avatar={
//                                                     <Avatar style={{ backgroundColor: '#1890ff' }}>
//                                                         {item.userCount}
//                                                     </Avatar>
//                                                 }
//                                                 title={item.tenRole}
//                                                 description={item.mota || 'Chưa có mô tả'}
//                                             />
//                                             <div>
//                                                 <Progress
//                                                     percent={Math.min(
//                                                         100,
//                                                         (item.userCount / listUser.length) * 100 || 0,
//                                                     )}
//                                                     format={(percent) => `${Math.round(percent)}%`}
//                                                 />
//                                             </div>
//                                         </List.Item>
//                                     )}
//                                 />
//                             )}
//                         </Card>
//                     </Col>
//                     <Col xs={24} md={8}>
//                         <Card title="Hành động nhanh" extra={<SettingOutlined />} className="quick-actions">
//                             <Space direction="vertical" style={{ width: '100%' }}>
//                                 <Button type="primary" icon={<PlusOutlined />} block onClick={handleAdd}>
//                                     Thêm vai trò mới
//                                 </Button>

//                                 <Button icon={<FileExcelOutlined />} block>
//                                     Xuất dữ liệu vai trò
//                                 </Button>

//                                 <Button icon={<FilePdfOutlined />} block>
//                                     In báo cáo vai trò
//                                 </Button>

//                                 <Divider />

//                                 <Button
//                                     type="dashed"
//                                     icon={<ReloadOutlined />}
//                                     block
//                                     onClick={() => {
//                                         setStatsLoading(true);
//                                         fetchRoles();
//                                         fetchUsers();
//                                         setTimeout(() => setStatsLoading(false), 1000);
//                                     }}
//                                 >
//                                     Làm mới dữ liệu
//                                 </Button>
//                             </Space>
//                         </Card>
//                     </Col>
//                 </Row>
//             </div>
//         );
//     };

//     const renderUsersByRole = () => {
//         if (loading) {
//             return (
//                 <div className="space-y-8">
//                     {[1, 2, 3].map((i) => (
//                         <Card key={i}>
//                             <Skeleton active paragraph={{ rows: 1 }} />
//                             <Divider />
//                             <Skeleton active paragraph={{ rows: 3 }} />
//                         </Card>
//                     ))}
//                 </div>
//             );
//         }

//         if (roles.length === 0) {
//             return (
//                 <Result
//                     icon={<TeamOutlined />}
//                     title="Chưa có vai trò nào được tạo"
//                     subTitle="Hãy tạo vai trò mới để bắt đầu phân công nhân viên"
//                     extra={
//                         <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
//                             Tạo vai trò mới
//                         </Button>
//                     }
//                 />
//             );
//         }

//         return (
//             <div className="space-y-8">
//                 {roles.map((role) => {
//                     const usersInRole = filteredUsers(role._id);
//                     const totalUsersInRole = listUser.filter((user) => user.role?._id === role._id).length;

//                     return (
//                         <Card
//                             key={role._id}
//                             title={
//                                 <Space>
//                                     <Text strong>{role.tenRole}</Text>
//                                     <Tag color="blue">{totalUsersInRole} nhân viên</Tag>
//                                 </Space>
//                             }
//                             extra={
//                                 <Space>
//                                     <Search
//                                         placeholder="Tìm nhân viên"
//                                         allowClear
//                                         onSearch={(value) => setUserSearchText(value)}
//                                         onChange={(e) => setUserSearchText(e.target.value)}
//                                         style={{ width: 200 }}
//                                     />
//                                     <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(role)}>
//                                         Sửa vai trò
//                                     </Button>
//                                     <Button
//                                         type="primary"
//                                         ghost
//                                         icon={<LockOutlined />}
//                                         onClick={() => handleManagePermissions(role)}
//                                     >
//                                         Phân quyền
//                                     </Button>
//                                     <Button type="primary" onClick={() => handleViewDetails(role)}>
//                                         Chi tiết
//                                     </Button>
//                                 </Space>
//                             }
//                             className="role-users-card"
//                         >
//                             {role.mota && (
//                                 <>
//                                     <Divider orientation="left">Mô tả</Divider>
//                                     <Paragraph>{role.mota}</Paragraph>
//                                 </>
//                             )}

//                             <Divider orientation="left">
//                                 <Space>
//                                     <TeamOutlined />
//                                     Danh sách nhân viên
//                                     {userSearchText && (
//                                         <Tag color="blue">
//                                             Tìm: {userSearchText} ({usersInRole.length}/{totalUsersInRole})
//                                         </Tag>
//                                     )}
//                                 </Space>
//                             </Divider>

//                             <Table
//                                 dataSource={usersInRole}
//                                 rowKey="_id"
//                                 columns={userColumns}
//                                 pagination={usersInRole.length > 10 ? { pageSize: 10 } : false}
//                                 size="middle"
//                                 locale={{
//                                     emptyText: userSearchText ? (
//                                         <Empty
//                                             description={`Không tìm thấy nhân viên nào khớp với "${userSearchText}"`}
//                                         />
//                                     ) : (
//                                         <Empty description="Chưa có nhân viên nào trong vai trò này" />
//                                     ),
//                                 }}
//                             />
//                         </Card>
//                     );
//                 })}
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen p-6 roles-admin">
//             <Card>
//                 <Tabs
//                     defaultActiveKey="roles"
//                     type="card"
//                     activeKey={activeTab}
//                     onChange={(key) => setActiveTab(key)}
//                     tabBarExtraContent={
//                         activeTab === 'roles' && (
//                             <Space>
//                                 <Segmented
//                                     options={[
//                                         {
//                                             value: 'table',
//                                             icon: <UnorderedListOutlined />,
//                                             label: 'Bảng',
//                                         },
//                                         {
//                                             value: 'card',
//                                             icon: <AppstoreOutlined />,
//                                             label: 'Thẻ',
//                                         },
//                                         {
//                                             value: 'dashboard',
//                                             icon: <PieChartOutlined />,
//                                             label: 'Thống kê',
//                                         },
//                                     ]}
//                                     value={viewMode}
//                                     onChange={setViewMode}
//                                 />

//                                 <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
//                                     Thêm vai trò
//                                 </Button>
//                             </Space>
//                         )
//                     }
//                 >
//                     <TabPane
//                         tab={
//                             <span>
//                                 <TeamOutlined /> Quản lý vai trò
//                             </span>
//                         }
//                         key="roles"
//                     >
//                         <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
//                             <Title level={4} style={{ margin: 0 }}>
//                                 Danh sách vai trò
//                             </Title>
//                             {viewMode !== 'dashboard' && (
//                                 <Space>
//                                     <Search
//                                         placeholder="Tìm kiếm vai trò"
//                                         allowClear
//                                         onSearch={handleSearch}
//                                         onChange={(e) => setSearchText(e.target.value)}
//                                         style={{ width: 250 }}
//                                         suffix={<SearchOutlined />}
//                                     />
//                                     <Tooltip title="Làm mới dữ liệu">
//                                         <Button icon={<ReloadOutlined />} onClick={() => fetchRoles()} />
//                                     </Tooltip>
//                                 </Space>
//                             )}
//                         </div>

//                         {viewMode === 'table' && (
//                             <Table
//                                 dataSource={filteredRoles}
//                                 columns={columns}
//                                 rowKey="_id"
//                                 loading={loading}
//                                 pagination={{
//                                     pageSize: 10,
//                                     showSizeChanger: true,
//                                     showTotal: (total) => `Tổng cộng ${total} vai trò`,
//                                 }}
//                                 size="middle"
//                                 bordered
//                                 locale={{
//                                     emptyText: (
//                                         <Empty
//                                             image={Empty.PRESENTED_IMAGE_SIMPLE}
//                                             description="Không có dữ liệu vai trò"
//                                         />
//                                     ),
//                                 }}
//                                 rowClassName={(record, index) => (index % 2 === 0 ? 'bg-gray-50' : '')}
//                                 onRow={(record) => ({
//                                     onClick: () => handleViewDetails(record),
//                                     style: { cursor: 'pointer' },
//                                 })}
//                             />
//                         )}

//                         {viewMode === 'card' && renderCardView()}
//                         {viewMode === 'dashboard' && renderDashboard()}
//                     </TabPane>

//                     <TabPane
//                         tab={
//                             <span>
//                                 <UserOutlined /> Nhân viên theo vai trò
//                             </span>
//                         }
//                         key="users"
//                     >
//                         {renderUsersByRole()}
//                     </TabPane>
//                 </Tabs>
//             </Card>

//             {/* Modal Form Thêm/Sửa Vai trò */}
//             <Modal
//                 title={
//                     <Space>
//                         {editingRole ? <EditOutlined /> : <PlusOutlined />}
//                         <Text>{editingRole ? 'Cập nhật vai trò' : 'Thêm vai trò mới'}</Text>
//                     </Space>
//                 }
//                 open={isModalVisible}
//                 onCancel={() => setIsModalVisible(false)}
//                 footer={[
//                     <Button key="cancel" onClick={() => setIsModalVisible(false)}>
//                         Hủy
//                     </Button>,
//                     <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
//                         {editingRole ? 'Cập nhật' : 'Tạo mới'}
//                     </Button>,
//                 ]}
//                 maskClosable={false}
//                 destroyOnClose
//             >
//                 <Form form={form} layout="vertical">
//                     <Form.Item
//                         label="Tên vai trò"
//                         name="tenRole"
//                         rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}
//                     >
//                         <Input placeholder="Nhập tên vai trò" maxLength={100} showCount />
//                     </Form.Item>
//                     <Form.Item
//                         label="Mô tả"
//                         name="mota"
//                         extra="Mô tả chi tiết về trách nhiệm và quyền hạn của vai trò này"
//                     >
//                         <Input.TextArea rows={4} placeholder="Nhập mô tả vai trò" maxLength={500} showCount />
//                     </Form.Item>

//                     {!editingRole && (
//                         <Form.Item label="Quyền hạn mặc định" name="defaultPermissions">
//                             <Select mode="multiple" placeholder="Chọn quyền hạn mặc định" optionFilterProp="children">
//                                 {permissionCategories.flatMap((category) =>
//                                     category.permissions.map((permission) => (
//                                         <Option key={permission.id} value={permission.id}>
//                                             {category.name}: {permission.name}
//                                         </Option>
//                                     )),
//                                 )}
//                             </Select>
//                         </Form.Item>
//                     )}
//                 </Form>
//             </Modal>

//             {/* Modal Phân quyền */}
//             <Modal
//                 title={
//                     <Space>
//                         <LockOutlined />
//                         <Text>Phân quyền cho vai trò: {editingRole?.tenRole}</Text>
//                     </Space>
//                 }
//                 open={permissionModalVisible}
//                 onCancel={() => setPermissionModalVisible(false)}
//                 footer={[
//                     <Button key="cancel" onClick={() => setPermissionModalVisible(false)}>
//                         Hủy
//                     </Button>,
//                     <Button key="submit" type="primary" onClick={handlePermissionSubmit}>
//                         Lưu phân quyền
//                     </Button>,
//                 ]}
//                 width={700}
//                 maskClosable={false}
//                 destroyOnClose
//             >
//                 <Form form={permissionForm} layout="vertical">
//                     <Form.Item
//                         name="permissions"
//                         rules={[{ required: true, message: 'Vui lòng chọn ít nhất một quyền' }]}
//                     >
//                         <div className="space-y-4">
//                             {permissionCategories.map((category) => (
//                                 <div key={category.name} className="permission-category">
//                                     <Divider orientation="left">{category.name}</Divider>
//                                     <Row gutter={[16, 16]}>
//                                         {category.permissions.map((permission) => (
//                                             <Col span={12} key={permission.id}>
//                                                 <Form.Item name={['permissions']} valuePropName="checked" noStyle>
//                                                     <Checkbox value={permission.id} style={{ lineHeight: '32px' }}>
//                                                         {permission.name}
//                                                     </Checkbox>
//                                                 </Form.Item>
//                                             </Col>
//                                         ))}
//                                     </Row>
//                                 </div>
//                             ))}
//                         </div>
//                     </Form.Item>
//                 </Form>
//             </Modal>

//             {/* Drawer chi tiết vai trò */}
//             <Drawer
//                 title={
//                     <Space>
//                         <TeamOutlined />
//                         <Text strong>Chi tiết vai trò: {selectedRole?.tenRole}</Text>
//                     </Space>
//                 }
//                 width={700}
//                 placement="right"
//                 onClose={() => setDrawerVisible(false)}
//                 open={drawerVisible}
//                 extra={
//                     <Space>
//                         <Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
//                         <Button
//                             type="primary"
//                             icon={<EditOutlined />}
//                             onClick={() => {
//                                 setDrawerVisible(false);
//                                 handleEdit(selectedRole);
//                             }}
//                         >
//                             Chỉnh sửa
//                         </Button>
//                     </Space>
//                 }
//             >
//                 {selectedRole && (
//                     <>
//                         <Card
//                             title={
//                                 <Space>
//                                     <InfoCircleOutlined />
//                                     Thông tin vai trò
//                                 </Space>
//                             }
//                             className="mb-4"
//                             bordered={false}
//                         >
//                             <Row gutter={[16, 16]}>
//                                 <Col span={12}>
//                                     <Statistic
//                                         title="Tên vai trò"
//                                         value={selectedRole.tenRole}
//                                         valueStyle={{ fontSize: '16px' }}
//                                     />
//                                 </Col>
//                                 <Col span={12}>
//                                     <Statistic
//                                         title="Số lượng nhân viên"
//                                         value={selectedRole.users?.length || 0}
//                                         valueStyle={{ fontSize: '16px' }}
//                                         suffix="người"
//                                     />
//                                 </Col>
//                                 <Col span={24}>
//                                     <div className="bg-gray-50 p-4 rounded-md">
//                                         <Title level={5}>Mô tả</Title>
//                                         {selectedRole.mota ? (
//                                             <Paragraph>{selectedRole.mota}</Paragraph>
//                                         ) : (
//                                             <Text type="secondary" italic>
//                                                 Chưa có mô tả
//                                             </Text>
//                                         )}
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </Card>

//                         <div className="flex justify-center mb-4">
//                             <Space>
//                                 <Button
//                                     icon={<LockOutlined />}
//                                     onClick={() => {
//                                         setDrawerVisible(false);
//                                         handleManagePermissions(selectedRole);
//                                     }}
//                                 >
//                                     Phân quyền
//                                 </Button>
//                                 <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
//                             </Space>
//                         </div>

//                         <Card
//                             title={
//                                 <Space>
//                                     <UserOutlined />
//                                     <Text>Nhân viên trong vai trò này</Text>
//                                     <Tag color="blue">{selectedRole.users?.length || 0} nhân viên</Tag>
//                                 </Space>
//                             }
//                             extra={
//                                 <Search
//                                     placeholder="Tìm nhân viên"
//                                     allowClear
//                                     onSearch={(value) => setUserSearchText(value)}
//                                     onChange={(e) => setUserSearchText(e.target.value)}
//                                     style={{ width: 200 }}
//                                 />
//                             }
//                             bordered={false}
//                         >
//                             {selectedRole.users && selectedRole.users.length > 0 ? (
//                                 <List
//                                     dataSource={selectedRole.users.filter(
//                                         (user) =>
//                                             user.hoten?.toLowerCase().includes(userSearchText.toLowerCase()) ||
//                                             user.email?.toLowerCase().includes(userSearchText.toLowerCase()) ||
//                                             user.chucvu?.toLowerCase().includes(userSearchText.toLowerCase()),
//                                     )}
//                                     renderItem={(user) => (
//                                         <List.Item
//                                             actions={[
//                                                 <Button key="edit" type="text" icon={<EditOutlined />}>
//                                                     Chỉnh sửa
//                                                 </Button>,
//                                                 <Button key="view" type="text" icon={<EyeOutlined />}>
//                                                     Xem chi tiết
//                                                 </Button>,
//                                             ]}
//                                         >
//                                             <List.Item.Meta
//                                                 avatar={
//                                                     <Avatar
//                                                         style={{
//                                                             backgroundColor: user.avatar ? 'transparent' : '#1890ff',
//                                                         }}
//                                                         src={user.avatar}
//                                                         icon={!user.avatar && <UserOutlined />}
//                                                         size="large"
//                                                     />
//                                                 }
//                                                 title={
//                                                     <Space>
//                                                         <Text strong>{user.hoten}</Text>
//                                                         {/* Giả lập trạng thái online */}
//                                                         {Math.random() > 0.5 && (
//                                                             <Badge status="success" text="Online" />
//                                                         )}
//                                                     </Space>
//                                                 }
//                                                 description={
//                                                     <Space direction="vertical" size={0}>
//                                                         <Text type="secondary">{user.email}</Text>
//                                                         <Space>
//                                                             {user.chucvu && <Tag color="blue">{user.chucvu}</Tag>}
//                                                             {user.phongban_id?.tenphong && (
//                                                                 <Tag color="purple">{user.phongban_id.tenphong}</Tag>
//                                                             )}
//                                                         </Space>
//                                                     </Space>
//                                                 }
//                                             />
//                                         </List.Item>
//                                     )}
//                                     pagination={{
//                                         pageSize: 5,
//                                         size: 'small',
//                                         hideOnSinglePage: true,
//                                     }}
//                                     locale={{
//                                         emptyText: userSearchText ? (
//                                             <Empty
//                                                 description={`Không tìm thấy nhân viên nào khớp với "${userSearchText}"`}
//                                             />
//                                         ) : (
//                                             <Empty description="Không có nhân viên nào trong vai trò này" />
//                                         ),
//                                     }}
//                                 />
//                             ) : (
//                                 <Empty description="Chưa có nhân viên nào trong vai trò này" />
//                             )}
//                         </Card>
//                     </>
//                 )}
//             </Drawer>

//             {/* CSS styles */}
//             <style jsx global>{`
//                 .roles-admin .ant-card {
//                     box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
//                     border-radius: 8px;
//                 }

//                 .roles-admin .role-card {
//                     transition: all 0.3s;
//                 }

//                 .roles-admin .role-card:hover {
//                     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//                     transform: translateY(-2px);
//                 }

//                 .roles-admin .stats-row .ant-card {
//                     height: 100%;
//                 }

//                 .roles-admin .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
//                     border-radius: 6px 6px 0 0;
//                     padding: 8px 16px;
//                 }

//                 .roles-admin .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
//                     background-color: #ffffff;
//                     border-bottom-color: #ffffff;
//                 }

//                 .roles-admin .quick-actions .ant-btn {
//                     margin-bottom: 8px;
//                 }

//                 .roles-admin .ant-avatar {
//                     box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
//                 }

//                 .roles-admin .role-users-card {
//                     margin-bottom: 24px;
//                 }

//                 .roles-admin .permission-category {
//                     background-color: #fafafa;
//                     padding: 8px 16px;
//                     border-radius: 8px;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default RoleManage;
