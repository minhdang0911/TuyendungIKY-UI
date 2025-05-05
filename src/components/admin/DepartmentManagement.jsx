import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    Input,
    Form,
    message,
    Card,
    Typography,
    Table,
    Space,
    Tooltip as TooltipAntd,
    Badge,
    Divider,
    Row,
    Col,
    Statistic,
    Tag,
    Popconfirm,
    Empty,
    Spin,
    Avatar,
    Select,
    Progress,
    Drawer,
    List,
    PageHeader,
    Tabs,
    Alert,
    DatePicker,
    Segmented,
    App,
    Descriptions,
    notification,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined,
    InfoCircleOutlined,
    BuildOutlined,
    FileTextOutlined,
    ExclamationCircleOutlined,
    SearchOutlined,
    ReloadOutlined,
    DashboardOutlined,
    BarChartOutlined,
    EyeOutlined,
    UserOutlined,
    CalendarOutlined,
    BulbOutlined,
    PieChartOutlined,
    FilterOutlined,
    SettingOutlined,
    DownloadOutlined,
    QuestionCircleOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    AppstoreOutlined,
} from '@ant-design/icons';
import { apiGetAllPhongBan, apiCreatePhongBan, apiUpdatePhongBan, apiDeletePhongBan } from '../../apis/Department';
import { apiGetAllUser } from '../../apis/staff';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortOrder, setSortOrder] = useState({ field: 'tenphong', order: 'ascend' });
    const [dataViewMode, setDataViewMode] = useState('table');
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [departmentsRes, staffRes] = await Promise.all([apiGetAllPhongBan(), apiGetAllUser()]);

            const filteredStaff = staffRes.data.filter((user) => user.phongban_id); // Chỉ lấy user có phòng ban

            setDepartments(departmentsRes.data);
            setStaff(filteredStaff);

            notification.success({
                message: 'Tải dữ liệu thành công',
                description: `Đã tải ${departmentsRes.data.length} phòng ban và ${filteredStaff.length} nhân viên`,
                placement: 'topRight',
                duration: 2,
                showProgress: true,
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi tải dữ liệu',
                description: error.message || 'Đã xảy ra lỗi khi tải dữ liệu',
                placement: 'topRight',
                duration: 2,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddDepartment = () => {
        setIsEditing(false);
        setCurrentDepartment(null);
        form.resetFields();
        form.setFieldsValue({
            ngaythanhlap: new Date(),
        });
        setIsModalVisible(true);
    };

    const handleEditDepartment = (record) => {
        setIsEditing(true);
        setCurrentDepartment(record);
        form.setFieldsValue({
            maphong: record.maphong,
            tenphong: record.tenphong,
            mota: record.mota,
            trangthai: record.trangthai || 'active',
            ngaythanhlap: record.ngaythanhlap ? new Date(record.ngaythanhlap) : new Date(),
        });
        setIsModalVisible(true);
    };

    const handleViewDepartmentDetail = (record) => {
        setSelectedDepartment(record);
        setDrawerVisible(true);
    };

    const handleDeleteDepartment = async (id) => {
        try {
            await apiDeletePhongBan(id);
            setDepartments(departments.filter((department) => department._id !== id));
            notification.success({
                message: 'Xóa thành công',
                description: 'Phòng ban đã được xóa thành công',
                placement: 'topRight',
                icon: <DeleteOutlined style={{ color: '#52c41a' }} />,
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi khi xóa',
                description: error.message || 'Đã xảy ra lỗi khi xóa phòng ban',
                placement: 'topRight',
            });
        }
    };

    const handleConfirmDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận xóa phòng ban',
            icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
            content: (
                <>
                    <Paragraph>
                        Bạn có chắc chắn muốn xóa phòng ban <Text strong>{record.tenphong}</Text> không?
                    </Paragraph>
                    <Paragraph type="danger">
                        Lưu ý: Việc xóa phòng ban có thể ảnh hưởng đến các nhân viên thuộc phòng ban này.
                    </Paragraph>
                </>
            ),
            okText: 'Xóa',
            okButtonProps: { danger: true },
            cancelText: 'Hủy',
            onOk: () => handleDeleteDepartment(record._id),
        });
    };

    const handleModalOk = async () => {
        try {
            setConfirmLoading(true);
            const values = await form.validateFields();

            if (isEditing && currentDepartment) {
                await apiUpdatePhongBan(currentDepartment._id, values);
                setDepartments(
                    departments.map((department) =>
                        department._id === currentDepartment._id ? { ...department, ...values } : department,
                    ),
                );
                notification.success({
                    message: 'Cập nhật thành công',
                    description: `Phòng ban "${values.tenphong}" đã được cập nhật`,
                    placement: 'topRight',
                    icon: <EditOutlined style={{ color: '#52c41a' }} />,
                });
            } else {
                const response = await apiCreatePhongBan(values);

                setDepartments([...departments, response.data]);
                if (response?.status === 'success') {
                    notification.success({
                        message: 'Thêm mới thành công',
                        description: `Phòng ban "${values.tenphong}" đã được tạo`,
                        placement: 'topRight',
                        icon: <PlusOutlined style={{ color: '#52c41a' }} />,
                    });
                }
            }
            setIsModalVisible(false);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error.message || 'Đã xảy ra lỗi khi xử lý',
                placement: 'topRight',
            });
        } finally {
            setConfirmLoading(false);
        }
    };

    const getStaffCountByDepartment = (departmentId) => {
        return staff.filter((user) => user.phongban_id && user.phongban_id._id === departmentId).length;
    };

    const getDepartmentStaff = (departmentId) => {
        return staff.filter((user) => user.phongban_id && user.phongban_id._id === departmentId);
    };

    // Tính toán thống kê
    const totalDepartments = departments.length;
    const totalStaff = staff.length;
    const averageStaffPerDepartment = totalDepartments ? Math.round((totalStaff / totalDepartments) * 10) / 10 : 0;

    // Tìm phòng ban có nhiều nhân viên nhất
    const departmentWithMostStaff = departments.reduce(
        (max, dept) => {
            const count = getStaffCountByDepartment(dept._id);
            return count > (max.count || 0) ? { name: dept.tenphong, count, id: dept._id } : max;
        },
        { name: '', count: 0, id: null },
    );

    // Tìm phòng ban có ít nhân viên nhất
    const departmentWithLeastStaff = departments.reduce(
        (min, dept) => {
            const count = getStaffCountByDepartment(dept._id);
            return min.id === null || count < min.count ? { name: dept.tenphong, count, id: dept._id } : min;
        },
        { name: '', count: Infinity, id: null },
    );

    // Các phòng ban không có nhân viên
    const emptyDepartments = departments.filter((dept) => getStaffCountByDepartment(dept._id) === 0);

    // Phân bố nhân viên theo phòng ban cho biểu đồ
    const departmentDistribution = departments.map((dept) => ({
        name: dept.tenphong,
        value: getStaffCountByDepartment(dept._id),
    }));

    const chartData = {
        labels: departmentDistribution.map((item) => item.name),
        datasets: [
            {
                label: 'Số lượng nhân viên',
                data: departmentDistribution.map((item) => item.value),
                backgroundColor: ['#0088FE', '#00C49F', '#FFBB28'],
                borderWidth: 1,
            },
        ],
    };

    // Lọc và sắp xếp dữ liệu
    let filteredData = [...departments];

    // Lọc theo trạng thái
    if (filterStatus !== 'all') {
        filteredData = filteredData.filter((item) => item.trangthai === filterStatus);
    }

    // Lọc theo tìm kiếm
    if (searchText) {
        filteredData = filteredData.filter(
            (item) =>
                item.tenphong.toLowerCase().includes(searchText.toLowerCase()) ||
                item.maphong.toLowerCase().includes(searchText.toLowerCase()) ||
                (item.mota && item.mota.toLowerCase().includes(searchText.toLowerCase())),
        );
    }

    // Sắp xếp
    filteredData.sort((a, b) => {
        const field = sortOrder.field;
        if (field === 'staffCount') {
            return sortOrder.order === 'ascend'
                ? getStaffCountByDepartment(a._id) - getStaffCountByDepartment(b._id)
                : getStaffCountByDepartment(b._id) - getStaffCountByDepartment(a._id);
        }

        const valA = a[field] || '';
        const valB = b[field] || '';

        return sortOrder.order === 'ascend'
            ? valA.toString().localeCompare(valB.toString())
            : valB.toString().localeCompare(valA.toString());
    });

    const handleSort = (field) => {
        if (sortOrder.field === field) {
            setSortOrder({
                field,
                order: sortOrder.order === 'ascend' ? 'descend' : 'ascend',
            });
        } else {
            setSortOrder({ field, order: 'ascend' });
        }
    };

    const getSortIcon = (field) => {
        if (sortOrder.field !== field) return null;
        return sortOrder.order === 'ascend' ? <SortAscendingOutlined /> : <SortDescendingOutlined />;
    };

    const columns = [
        {
            title: (
                <Space style={{ cursor: 'pointer' }} onClick={() => handleSort('maphong')}>
                    <BuildOutlined /> Mã phòng {getSortIcon('maphong')}
                </Space>
            ),
            dataIndex: 'maphong',
            key: 'maphong',
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: (
                <Space style={{ cursor: 'pointer' }} onClick={() => handleSort('tenphong')}>
                    <TeamOutlined /> Tên phòng {getSortIcon('tenphong')}
                </Space>
            ),
            dataIndex: 'tenphong',
            key: 'tenphong',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: (
                <Space>
                    <FileTextOutlined /> Mô tả
                </Space>
            ),
            dataIndex: 'mota',
            key: 'mota',
            ellipsis: {
                showTitle: false,
            },
            render: (text) => (
                <TooltipAntd title={text} placement="topLeft">
                    <Text ellipsis style={{ maxWidth: 300 }}>
                        {text}
                    </Text>
                </TooltipAntd>
            ),
            responsive: ['md'],
        },
        {
            title: (
                <Space style={{ cursor: 'pointer' }} onClick={() => handleSort('staffCount')}>
                    <TeamOutlined /> Nhân viên {getSortIcon('staffCount')}
                </Space>
            ),
            key: 'staffCount',
            render: (_, record) => {
                const count = getStaffCountByDepartment(record._id);
                const totalCount = staff.length;
                const percentage = totalCount ? Math.round((count / totalCount) * 100) : 0;

                let color = 'green';
                if (count === 0) color = 'red';
                else if (count < 3) color = 'orange';

                return (
                    <Space>
                        <Badge count={count} showZero color={color} overflowCount={99} />
                        <Progress
                            percent={percentage}
                            size="small"
                            status={count === 0 ? 'exception' : 'active'}
                            style={{ width: 80 }}
                            strokeColor={color}
                        />
                    </Space>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'trangthai',
            key: 'trangthai',
            render: (status) => {
                let color = 'green';
                let text = 'Hoạt động';

                if (status === 'inactive') {
                    color = 'volcano';
                    text = 'Tạm dừng';
                } else if (status === 'pending') {
                    color = 'gold';
                    text = 'Chờ xử lý';
                }

                return <Tag color={color}>{text}</Tag>;
            },
            responsive: ['md'],
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <TooltipAntd title="Xem chi tiết">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDepartmentDetail(record)}
                            size="small"
                        />
                    </TooltipAntd>
                    <TooltipAntd title="Chỉnh sửa">
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            size="small"
                            onClick={() => handleEditDepartment(record)}
                        />
                    </TooltipAntd>
                    <TooltipAntd title="Xóa">
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            size="small"
                            onClick={() => handleConfirmDelete(record)}
                        />
                    </TooltipAntd>
                </Space>
            ),
        },
    ];

    const renderStats = () => (
        <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} md={8} lg={6}>
                <Card hoverable className="stat-card">
                    <Statistic
                        title="Tổng số phòng ban"
                        value={totalDepartments}
                        prefix={<BuildOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                    <div className="stat-footer">
                        <Text type="secondary">Cập nhật gần nhất: {new Date().toLocaleDateString()}</Text>
                    </div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Card hoverable className="stat-card">
                    <Statistic
                        title="Tổng số nhân viên"
                        value={totalStaff}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                    <div className="stat-footer">
                        <Text type="secondary">Từ tất cả các phòng ban</Text>
                    </div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Card hoverable className="stat-card">
                    <Statistic
                        title="Trung bình nhân viên/phòng"
                        value={averageStaffPerDepartment}
                        precision={1}
                        valueStyle={{ color: '#722ed1' }}
                        suffix="người/phòng"
                    />
                    <div className="stat-footer">
                        <Text type="secondary">Phân bố nhân lực</Text>
                    </div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={24} lg={6}>
                <Card hoverable className="stat-card">
                    <Statistic
                        title="Phòng đông nhất"
                        value={departmentWithMostStaff.name}
                        valueStyle={{ fontSize: '16px', color: '#fa541c' }}
                    />
                    <div style={{ marginTop: 8 }}>
                        <Tag color="orange" icon={<TeamOutlined />}>
                            {departmentWithMostStaff.count} nhân viên
                        </Tag>
                    </div>
                </Card>
            </Col>
        </Row>
    );

    const renderFilterOptions = () => (
        <Space wrap style={{ marginBottom: 16 }}>
            <Text strong>Trạng thái:</Text>
            <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 140 }}
                options={[
                    { label: 'Tất cả', value: 'all' },
                    { label: 'Đang hoạt động', value: 'active' },
                    { label: 'Tạm dừng', value: 'inactive' },
                    { label: 'Chờ xử lý', value: 'pending' },
                ]}
            />
        </Space>
    );

    const renderEmpty = () => (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>{searchText ? 'Không tìm thấy phòng ban phù hợp' : 'Chưa có phòng ban nào'}</span>}
            style={{ margin: '40px 0' }}
        >
            <Button type="primary" onClick={handleAddDepartment} icon={<PlusOutlined />}>
                Thêm phòng ban mới
            </Button>
        </Empty>
    );

    const renderCardView = () => (
        <Row gutter={[16, 16]}>
            {filteredData.map((dept) => {
                const staffCount = getStaffCountByDepartment(dept._id);
                let statusColor = 'green';
                let statusText = 'Hoạt động';

                if (dept.trangthai === 'inactive') {
                    statusColor = 'volcano';
                    statusText = 'Tạm dừng';
                } else if (dept.trangthai === 'pending') {
                    statusColor = 'gold';
                    statusText = 'Chờ xử lý';
                }

                return (
                    <Col xs={24} sm={12} md={8} lg={6} key={dept._id}>
                        <Card
                            hoverable
                            actions={[
                                <TooltipAntd title="Xem chi tiết">
                                    <EyeOutlined key="view" onClick={() => handleViewDepartmentDetail(dept)} />
                                </TooltipAntd>,
                                <TooltipAntd title="Chỉnh sửa">
                                    <EditOutlined key="edit" onClick={() => handleEditDepartment(dept)} />
                                </TooltipAntd>,
                                <TooltipAntd title="Xóa">
                                    <DeleteOutlined key="delete" onClick={() => handleConfirmDelete(dept)} />
                                </TooltipAntd>,
                            ]}
                            title={
                                <Space>
                                    <Avatar
                                        style={{
                                            backgroundColor:
                                                staffCount === 0 ? '#ff4d4f' : staffCount < 3 ? '#faad14' : '#52c41a',
                                        }}
                                    >
                                        {dept.maphong.substring(0, 2).toUpperCase()}
                                    </Avatar>
                                    <Text ellipsis strong style={{ maxWidth: 150 }}>
                                        {dept.tenphong}
                                    </Text>
                                </Space>
                            }
                            extra={<Tag color="blue">{dept.maphong}</Tag>}
                        >
                            <Paragraph ellipsis={{ rows: 2, expandable: false, tooltip: true }} style={{ height: 40 }}>
                                {dept.mota}
                            </Paragraph>
                            <div
                                style={{
                                    marginTop: 16,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Tag color={statusColor}>{statusText}</Tag>
                                <Space>
                                    <TeamOutlined />
                                    <Text>{staffCount} nhân viên</Text>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );

    return (
        <App>
            <Card className="department-management" style={{ borderRadius: 8 }}>
                <div className="header-container" style={{ marginBottom: 24 }}>
                    <Row justify="space-between" align="middle" gutter={[16, 16]}>
                        <Col>
                            <Space align="center" size="large">
                                <Avatar size={54} icon={<BuildOutlined />} style={{ backgroundColor: '#1890ff' }} />
                                <Title level={2} style={{ margin: 0 }}>
                                    Quản lý phòng ban
                                </Title>
                            </Space>
                        </Col>
                        <Col>
                            <Space>
                                <TooltipAntd title="Tải lại dữ liệu">
                                    <Button icon={<ReloadOutlined />} onClick={fetchData} />
                                </TooltipAntd>
                                <TooltipAntd title="Cài đặt hiển thị">
                                    <Button icon={<SettingOutlined />} />
                                </TooltipAntd>
                                <TooltipAntd title="Xuất dữ liệu">
                                    <Button icon={<DownloadOutlined />} />
                                </TooltipAntd>
                                <TooltipAntd title="Trợ giúp">
                                    <Button icon={<QuestionCircleOutlined />} />
                                </TooltipAntd>
                            </Space>
                        </Col>
                    </Row>
                </div>

                <Divider style={{ margin: '16px 0' }} />

                {renderStats()}

                <Tabs defaultActiveKey="list" style={{ marginTop: 24 }}>
                    <TabPane
                        tab={
                            <span>
                                <DashboardOutlined /> Danh sách phòng ban
                            </span>
                        }
                        key="list"
                    >
                        <div
                            className="table-actions"
                            style={{
                                marginBottom: 16,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 16,
                            }}
                        >
                            <Space wrap>
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDepartment}>
                                    Thêm phòng ban
                                </Button>
                                <Segmented
                                    options={[
                                        {
                                            value: 'table',
                                            icon: <DashboardOutlined />,
                                            label: 'Bảng',
                                        },
                                        {
                                            value: 'card',
                                            icon: <AppstoreOutlined />,
                                            label: 'Thẻ',
                                        },
                                    ]}
                                    value={dataViewMode}
                                    onChange={setDataViewMode}
                                />
                                <Button
                                    icon={<FilterOutlined />}
                                    onClick={() => {
                                        Modal.info({
                                            title: 'Bộ lọc phòng ban',
                                            content: (
                                                <Form layout="vertical">
                                                    <Form.Item label="Trạng thái">
                                                        <Select
                                                            defaultValue="all"
                                                            style={{ width: '100%' }}
                                                            options={[
                                                                { label: 'Tất cả', value: 'all' },
                                                                { label: 'Đang hoạt động', value: 'active' },
                                                                { label: 'Tạm dừng', value: 'inactive' },
                                                                { label: 'Chờ xử lý', value: 'pending' },
                                                            ]}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item label="Số lượng nhân viên">
                                                        <Select
                                                            defaultValue="all"
                                                            style={{ width: '100%' }}
                                                            options={[
                                                                { label: 'Tất cả', value: 'all' },
                                                                { label: 'Không có nhân viên', value: 'empty' },
                                                                { label: 'Ít hơn 5 nhân viên', value: 'less5' },
                                                                { label: '5-10 nhân viên', value: '5to10' },
                                                                { label: 'Nhiều hơn 10 nhân viên', value: 'more10' },
                                                            ]}
                                                        />
                                                    </Form.Item>
                                                    {/* <Form.Item label="Ngày thành lập">
                                                        <DatePicker.RangePicker style={{ width: '100%' }} />
                                                    </Form.Item> */}
                                                </Form>
                                            ),
                                            width: 500,
                                        });
                                    }}
                                >
                                    Bộ lọc
                                </Button>
                            </Space>

                            <Input.Search
                                placeholder="Tìm kiếm phòng ban..."
                                prefix={<SearchOutlined />}
                                allowClear
                                style={{ width: 300 }}
                                onChange={(e) => setSearchText(e.target.value)}
                                enterButton
                            />
                        </div>

                        {renderFilterOptions()}

                        {filteredData.length === 0 && !loading && renderEmpty()}

                        {filteredData.length > 0 && !loading && (
                            <>
                                {dataViewMode === 'table' ? (
                                    <Table
                                        columns={columns}
                                        dataSource={filteredData}
                                        rowKey="_id"
                                        pagination={{
                                            defaultPageSize: 10,
                                            showSizeChanger: true,
                                            pageSizeOptions: ['5', '10', '20', '50'],
                                            showTotal: (total) => `Tổng cộng ${total} phòng ban`,
                                        }}
                                        bordered
                                        size="middle"
                                        loading={loading}
                                        rowClassName={(record) => {
                                            if (record.trangthai === 'inactive') return 'row-inactive';
                                            if (getStaffCountByDepartment(record._id) === 0) return 'row-warning';
                                            return '';
                                        }}
                                    />
                                ) : (
                                    renderCardView()
                                )}
                            </>
                        )}

                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
                                <Spin tip="Đang tải dữ liệu phòng ban..." size="large" />
                            </div>
                        )}
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <BarChartOutlined /> Thống kê & Phân tích
                            </span>
                        }
                        key="stats"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card title="Thống kê" variant={false}>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={[
                                            {
                                                title: 'Tổng số phòng ban',
                                                value: totalDepartments,
                                                icon: <BuildOutlined style={{ color: '#1890ff' }} />,
                                            },
                                            {
                                                title: 'Tổng số nhân viên',
                                                value: totalStaff,
                                                icon: <TeamOutlined style={{ color: '#52c41a' }} />,
                                            },
                                            {
                                                title: 'Trung bình nhân viên/phòng',
                                                value: `${averageStaffPerDepartment} người/phòng`,
                                                icon: <BarChartOutlined style={{ color: '#722ed1' }} />,
                                            },
                                            {
                                                title: 'Phòng đông nhất',
                                                value: `${departmentWithMostStaff.name} (${departmentWithMostStaff.count} nhân viên)`,
                                                icon: <PieChartOutlined style={{ color: '#fa541c' }} />,
                                            },
                                            {
                                                title: 'Phòng ít nhân viên nhất',
                                                value:
                                                    departmentWithLeastStaff.count === Infinity
                                                        ? 'Không có dữ liệu'
                                                        : `${departmentWithLeastStaff.name} (${departmentWithLeastStaff.count} nhân viên)`,
                                                icon: <PieChartOutlined style={{ color: '#faad14' }} />,
                                            },
                                            {
                                                title: 'Số phòng không có nhân viên',
                                                value: `${emptyDepartments.length} phòng`,
                                                icon: (
                                                    <ExclamationCircleOutlined
                                                        style={{
                                                            color: emptyDepartments.length > 0 ? '#ff4d4f' : '#8c8c8c',
                                                        }}
                                                    />
                                                ),
                                            },
                                        ]}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={item.icon} />}
                                                    title={item.title}
                                                    description={<Text strong>{item.value}</Text>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} md={12}>
                                <Card title="Phân bố nhân viên theo phòng ban" variant={false}>
                                    <div className="w-[200px] h-[200px]" style={{ width: '80%', height: '80%' }}>
                                        <Pie data={chartData} />
                                    </div>
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card title="Phòng ban không có nhân viên" variant={false}>
                                    {emptyDepartments.length > 0 ? (
                                        <Table
                                            dataSource={emptyDepartments}
                                            columns={[
                                                {
                                                    title: 'Mã phòng',
                                                    dataIndex: 'maphong',
                                                    key: 'maphong',
                                                    render: (text) => <Tag color="blue">{text}</Tag>,
                                                },
                                                {
                                                    title: 'Tên phòng',
                                                    dataIndex: 'tenphong',
                                                    key: 'tenphong',
                                                },
                                                {
                                                    title: 'Mô tả',
                                                    dataIndex: 'mota',
                                                    key: 'mota',
                                                    ellipsis: true,
                                                },
                                                {
                                                    title: 'Thao tác',
                                                    key: 'action',
                                                    render: (_, record) => (
                                                        <Button
                                                            type="primary"
                                                            size="small"
                                                            onClick={() => handleEditDepartment(record)}
                                                        >
                                                            Quản lý
                                                        </Button>
                                                    ),
                                                },
                                            ]}
                                            rowKey="_id"
                                            pagination={false}
                                            size="small"
                                        />
                                    ) : (
                                        <Alert
                                            message="Tuyệt vời!"
                                            description="Tất cả các phòng ban đều có nhân viên. Hệ thống phân bổ nhân sự đang hoạt động tốt."
                                            type="success"
                                            showIcon
                                        />
                                    )}
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>

                {/* Form thêm/sửa phòng ban */}
                <Modal
                    title={
                        <Space>
                            {isEditing ? <EditOutlined /> : <PlusOutlined />}
                            <span>{isEditing ? 'Cập nhật phòng ban' : 'Thêm phòng ban mới'}</span>
                        </Space>
                    }
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setIsModalVisible(false)}>
                            Hủy
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleModalOk} loading={confirmLoading}>
                            {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </Button>,
                    ]}
                    destroyOnClose
                    width={600}
                    centered
                >
                    <Form form={form} layout="vertical" name="departmentForm">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="maphong"
                                    label="Mã phòng"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mã phòng!' },
                                        { max: 10, message: 'Mã phòng không được quá 10 ký tự!' },
                                        { pattern: /^[A-Z0-9]+$/, message: 'Mã phòng chỉ gồm chữ in hoa và số!' },
                                    ]}
                                    tooltip={{
                                        title: 'Mã phòng phải là duy nhất và chỉ gồm chữ in hoa và số',
                                        icon: <InfoCircleOutlined />,
                                    }}
                                >
                                    <Input
                                        prefix={<BuildOutlined />}
                                        placeholder="Nhập mã phòng (VD: PB001)"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                                <Form.Item
                                    name="trangthai"
                                    label="Trạng thái"
                                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                    initialValue="active"
                                >
                                    <Select placeholder="Chọn trạng thái">
                                        <Option value="active">Hoạt động</Option>
                                        <Option value="inactive">Tạm dừng</Option>
                                        <Option value="pending">Chờ xử lý</Option>
                                    </Select>
                                </Form.Item>
                            </Col> */}
                        </Row>

                        <Form.Item
                            name="tenphong"
                            label="Tên phòng"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên phòng!' },
                                { max: 100, message: 'Tên phòng không được quá 100 ký tự!' },
                            ]}
                        >
                            <Input prefix={<TeamOutlined />} placeholder="Nhập tên phòng (VD: Phòng Kế toán)" />
                        </Form.Item>

                        {/* <Form.Item name="ngaythanhlap" label="Ngày thành lập">
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày thành lập"
                                format="DD/MM/YYYY"
                            />
                        </Form.Item> */}

                        <Form.Item
                            name="mota"
                            label="Mô tả"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả phòng!' }]}
                        >
                            <TextArea
                                placeholder="Nhập mô tả phòng ban"
                                rows={4}
                                showCount
                                maxLength={500}
                                prefix={<FileTextOutlined />}
                            />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Drawer xem chi tiết phòng ban */}
                <Drawer
                    title={
                        <Space>
                            <BuildOutlined />
                            <span>Chi tiết phòng ban</span>
                        </Space>
                    }
                    width={640}
                    placement="right"
                    closable={true}
                    onClose={() => setDrawerVisible(false)}
                    open={drawerVisible}
                >
                    {selectedDepartment && (
                        <>
                            <Descriptions
                                title="Thông tin phòng ban"
                                bordered
                                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                            >
                                <Descriptions.Item label="Mã phòng">
                                    <Tag color="blue">{selectedDepartment.maphong}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">
                                    {selectedDepartment.trangthai === 'inactive' ? (
                                        <Tag color="volcano">Tạm dừng</Tag>
                                    ) : selectedDepartment.trangthai === 'pending' ? (
                                        <Tag color="gold">Chờ xử lý</Tag>
                                    ) : (
                                        <Tag color="green">Hoạt động</Tag>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tên phòng" span={2}>
                                    <Text strong>{selectedDepartment.tenphong}</Text>
                                </Descriptions.Item>
                                {/* <Descriptions.Item label="Ngày thành lập">
                                    {selectedDepartment.ngaythanhlap
                                        ? new Date(selectedDepartment.ngaythanhlap).toLocaleDateString()
                                        : 'Chưa cập nhật'}
                                </Descriptions.Item> */}
                                <Descriptions.Item label="Số nhân viên">
                                    <Badge
                                        count={getStaffCountByDepartment(selectedDepartment._id)}
                                        showZero
                                        style={{
                                            backgroundColor:
                                                getStaffCountByDepartment(selectedDepartment._id) === 0
                                                    ? '#ff4d4f'
                                                    : '#52c41a',
                                        }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Mô tả" span={2}>
                                    <Paragraph>{selectedDepartment.mota}</Paragraph>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider orientation="left">Danh sách nhân viên</Divider>

                            {getDepartmentStaff(selectedDepartment._id).length > 0 ? (
                                <List
                                    dataSource={getDepartmentStaff(selectedDepartment._id)}
                                    renderItem={(staff) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<UserOutlined />} />}
                                                title={
                                                    <Space>
                                                        <Text strong>{staff.hoten || 'Nhân viên'}</Text>
                                                        <Tag color="blue">{staff.manv || 'NV000'}</Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space direction="vertical" size={0}>
                                                        <Text>Chức vụ: {staff.chucvu || 'Chưa cập nhật'}</Text>
                                                        <Text>Email: {staff.email || 'Chưa cập nhật'}</Text>
                                                    </Space>
                                                }
                                            />
                                            {/* <Button size="small" type="primary">
                                                Xem chi tiết
                                            </Button> */}
                                        </List.Item>
                                    )}
                                    pagination={{
                                        pageSize: 5,
                                        size: 'small',
                                    }}
                                />
                            ) : (
                                <Empty
                                    description="Chưa có nhân viên nào thuộc phòng ban này"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                >
                                    <Button type="primary" icon={<PlusOutlined />}>
                                        Thêm nhân viên mới
                                    </Button>
                                </Empty>
                            )}

                            <div style={{ marginTop: 24, textAlign: 'right' }}>
                                <Space>
                                    <Button onClick={() => setDrawerVisible(false)}>Đóng</Button>
                                    <Button type="primary" onClick={() => handleEditDepartment(selectedDepartment)}>
                                        <EditOutlined /> Chỉnh sửa
                                    </Button>
                                </Space>
                            </div>
                        </>
                    )}
                </Drawer>

                {/* Custom CSS - You would typically put this in a separate CSS file */}
                <style jsx global>{`
                    .department-management .stat-card {
                        height: 100%;
                        transition: all 0.3s;
                    }

                    .department-management .stat-card:hover {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        transform: translateY(-3px);
                    }

                    .department-management .stat-footer {
                        margin-top: 12px;
                        padding-top: 12px;
                        border-top: 1px solid #f0f0f0;
                    }

                    .department-management .row-inactive {
                        background-color: #fff1f0;
                    }

                    .department-management .row-warning {
                        background-color: #fffbe6;
                    }

                    .department-management .header-container {
                        border-radius: 8px;
                        padding: 8px 0;
                    }

                    .department-management .ant-card-head {
                        min-height: 48px;
                    }

                    .department-management .ant-card-head-title {
                        padding: 12px 0;
                    }

                    .department-management .ant-table-tbody > tr.ant-table-row:hover > td {
                        background-color: #e6f7ff;
                    }
                `}</style>
            </Card>
        </App>
    );
}
