// giao diện mới
// import { useEffect, useState } from 'react';
// import {
//     Table,
//     Button,
//     Modal,
//     Form,
//     Input,
//     InputNumber,
//     Select,
//     notification,
//     Space,
//     Card,
//     Typography,
//     Avatar,
//     Tag,
//     Tooltip,
//     Divider,
//     Statistic,
//     Row,
//     Col,
//     Drawer,
//     DatePicker,
//     Badge,
//     Empty,
//     Skeleton,
//     Tabs,
//     ConfigProvider,
//     Segmented,
//     FloatButton,
//     theme,
// } from 'antd';
// import {
//     PlusOutlined,
//     EditOutlined,
//     DeleteOutlined,
//     TrophyOutlined,
//     TeamOutlined,
//     DollarOutlined,
//     FileSearchOutlined,
//     CalendarOutlined,
//     SearchOutlined,
//     BarChartOutlined,
//     FilterOutlined,
//     ReloadOutlined,
//     EyeOutlined,
//     DownloadOutlined,
//     PrinterOutlined,
//     UpOutlined,
//     ThunderboltOutlined,
//     GiftOutlined,
//     RiseOutlined,
//     BulbOutlined,
// } from '@ant-design/icons';
// import moment from 'moment';
// import {
//     apiGetKhenthuongs,
//     apiDeleteKhenthuong,
//     apiCreateKhenthuong,
//     apiUpdateKhenthuong,
// } from '../../apis/khenthuong';
// import { apiGetAllUser } from '../../apis/staff';
// import useWindowSize from '../../hooks/useWindowSize';
// import { Chart } from 'react-chartjs-2';
// import 'chart.js/auto';

// const { Option } = Select;
// const { Title, Text, Paragraph } = Typography;
// const { useToken } = theme;

// export default function RewardManagement() {
//     // Theme từ Ant Design
//     const { token } = useToken();

//     // States
//     const [rewards, setRewards] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//     const [editingReward, setEditingReward] = useState(null);
//     const [form] = Form.useForm();
//     const [searchText, setSearchText] = useState('');
//     const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
//     const [stats, setStats] = useState({ total: 0, totalAmount: 0, topEmployee: null });
//     const [viewMode, setViewMode] = useState('table');
//     const [detailDrawer, setDetailDrawer] = useState({ visible: false, reward: null });
//     const [filterOptions, setFilterOptions] = useState({
//         dateRange: [],
//         departments: [],
//         rewardTypes: [],
//     });
//     const [filters, setFilters] = useState({
//         dateRange: null,
//         department: null,
//         rewardType: null,
//     });
//     const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
//     const [chartData, setChartData] = useState(null);
//     const [rewardDistribution, setRewardDistribution] = useState([]);
//     const [recentActivity, setRecentActivity] = useState([]);

//     // Hook theo dõi kích thước màn hình
//     const { width } = useWindowSize() || { width: typeof window !== 'undefined' ? window.innerWidth : 1200 };
//     const isMobile = width < 768;
//     const isTablet = width >= 768 && width < 992;

//     useEffect(() => {
//         fetchData();
//     }, []);

//     // Xử lý khi filters thay đổi
//     useEffect(() => {
//         if (rewards.length > 0) {
//             processData();
//         }
//     }, [rewards, filters]);

//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const resReward = await apiGetKhenthuongs();
//             const resUser = await apiGetAllUser();

//             const rewardData = resReward.data;
//             setRewards(rewardData);
//             setUsers(resUser.data);

//             // Tính toán thống kê
//             processStats(rewardData);
//             extractFilterOptions(rewardData);

//             // Lấy hoạt động gần đây
//             const sortedRewards = [...rewardData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             setRecentActivity(sortedRewards.slice(0, 5));

//             setLoading(false);
//         } catch (error) {
//             notification.error({
//                 message: 'Lỗi khi tải dữ liệu',
//                 description: error.message,
//             });
//             setLoading(false);
//         }
//     };

//     const processStats = (rewardData) => {
//         // Tính toán thống kê cơ bản
//         const totalAmount = rewardData.reduce((sum, reward) => sum + (reward.sotien || 0), 0);

//         // Tìm nhân viên có số tiền thưởng cao nhất
//         const employeeRewards = {};
//         rewardData.forEach((reward) => {
//             const employeeId = reward.nhanvien_id?._id || reward.nhanvien_id;
//             const employeeName = reward.hoten || reward.nhanvien_id?.hoten;
//             const employeeAvatar = reward.avatar || reward.nhanvien_id?.avatar;

//             if (!employeeRewards[employeeId]) {
//                 employeeRewards[employeeId] = {
//                     id: employeeId,
//                     name: employeeName,
//                     avatar: employeeAvatar,
//                     totalAmount: 0,
//                     count: 0,
//                 };
//             }

//             employeeRewards[employeeId].totalAmount += reward.sotien || 0;
//             employeeRewards[employeeId].count += 1;
//         });

//         const topEmployee = Object.values(employeeRewards).sort((a, b) => b.totalAmount - a.totalAmount)[0];

//         setStats({
//             total: rewardData.length,
//             totalAmount,
//             topEmployee,
//         });
//     };

//     const extractFilterOptions = (rewardData) => {
//         // Extract departments
//         const departments = [...new Set(rewardData.map((reward) => reward.phongban_id?.tenphong).filter(Boolean))];

//         // Extract reward types
//         const rewardTypes = [...new Set(rewardData.map((reward) => reward.ten))];

//         setFilterOptions({
//             departments,
//             rewardTypes,
//         });
//     };

//     const processData = () => {
//         // Apply filters to data
//         let filteredData = [...rewards];

//         if (filters.dateRange && filters.dateRange.length === 2) {
//             const startDate = filters.dateRange[0].startOf('day');
//             const endDate = filters.dateRange[1].endOf('day');

//             filteredData = filteredData.filter((reward) => {
//                 const rewardDate = moment(reward.createdAt);
//                 return rewardDate.isBetween(startDate, endDate, null, '[]');
//             });
//         }

//         if (filters.department) {
//             filteredData = filteredData.filter((reward) => reward.phongban_id?.tenphong === filters.department);
//         }

//         if (filters.rewardType) {
//             filteredData = filteredData.filter((reward) => reward.ten === filters.rewardType);
//         }

//         // Process chart data
//         processChartData(filteredData);

//         // Process reward distribution
//         processRewardDistribution(filteredData);
//     };

//     const processChartData = (filteredData) => {
//         // Group by month for chart
//         const last6Months = [];
//         for (let i = 5; i >= 0; i--) {
//             last6Months.push(moment().subtract(i, 'months').format('MM/YYYY'));
//         }

//         const monthlyData = last6Months.map((month) => {
//             const [monthNum, year] = month.split('/');
//             const count = filteredData.filter((reward) => {
//                 const rewardDate = moment(reward.createdAt);
//                 return rewardDate.month() + 1 === parseInt(monthNum) && rewardDate.year() === parseInt(year);
//             }).length;

//             const amount = filteredData
//                 .filter((reward) => {
//                     const rewardDate = moment(reward.createdAt);
//                     return rewardDate.month() + 1 === parseInt(monthNum) && rewardDate.year() === parseInt(year);
//                 })
//                 .reduce((sum, reward) => sum + (reward.sotien || 0), 0);

//             return { month, count, amount };
//         });

//         setChartData({
//             labels: monthlyData.map((item) => item.month),
//             datasets: [
//                 {
//                     label: 'Số lượng',
//                     data: monthlyData.map((item) => item.count),
//                     backgroundColor: token.colorPrimary,
//                     borderColor: token.colorPrimary,
//                     borderWidth: 1,
//                 },
//                 {
//                     label: 'Số tiền (triệu)',
//                     data: monthlyData.map((item) => item.amount / 1000000),
//                     backgroundColor: token.colorSuccess,
//                     borderColor: token.colorSuccess,
//                     borderWidth: 1,
//                     yAxisID: 'y1',
//                 },
//             ],
//         });
//     };

//     const processRewardDistribution = (filteredData) => {
//         // Tính phân bố khen thưởng theo phòng ban
//         const departmentDistribution = {};

//         filteredData.forEach((reward) => {
//             const department = reward.phongban_id?.tenphong || 'Chưa phân loại';

//             if (!departmentDistribution[department]) {
//                 departmentDistribution[department] = {
//                     name: department,
//                     count: 0,
//                     amount: 0,
//                 };
//             }

//             departmentDistribution[department].count += 1;
//             departmentDistribution[department].amount += reward.sotien || 0;
//         });

//         const distribution = Object.values(departmentDistribution).sort((a, b) => b.amount - a.amount);

//         setRewardDistribution(distribution);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await apiDeleteKhenthuong(id);
//             notification.success({
//                 message: 'Xóa thành công',
//                 icon: <DeleteOutlined style={{ color: token.colorSuccess }} />,
//             });
//             setRewards((prev) => prev.filter((r) => r._id !== id));
//             fetchData(); // Cập nhật lại thống kê
//             setConfirmDelete({ visible: false, id: null });
//         } catch (error) {
//             notification.error({
//                 message: 'Xóa thất bại',
//                 description: error.message,
//             });
//         }
//     };

//     const showDeleteConfirm = (id) => {
//         setConfirmDelete({ visible: true, id });
//     };

//     const showDetailDrawer = (reward) => {
//         setDetailDrawer({ visible: true, reward });
//     };

//     const openFormHandler = (record = null) => {
//         setEditingReward(record);
//         if (isMobile) {
//             setIsDrawerOpen(true);
//         } else {
//             setIsModalOpen(true);
//         }

//         if (!record) {
//             form.resetFields();
//         }
//     };

//     const closeFormHandler = () => {
//         if (isMobile) {
//             setIsDrawerOpen(false);
//         } else {
//             setIsModalOpen(false);
//         }
//     };

//     const applyFilters = (values) => {
//         setFilters(values);
//         setFilterDrawerVisible(false);
//     };

//     const resetFilters = () => {
//         setFilters({
//             dateRange: null,
//             department: null,
//             rewardType: null,
//         });
//         setFilterDrawerVisible(false);
//     };

//     useEffect(() => {
//         if (editingReward && (isModalOpen || isDrawerOpen) && users.length > 0) {
//             const matchedUser = users.find(
//                 (user) =>
//                     user.hoten === editingReward.hoten &&
//                     user.chucvu === editingReward.chucvu &&
//                     user.avatar === editingReward.avatar,
//             );

//             form.setFieldsValue({
//                 nhanvien_id: matchedUser?._id,
//                 ten: editingReward.ten,
//                 lydo: editingReward.lydo,
//                 sotien: editingReward.sotien,
//                 ngaykhenthuong: editingReward.createdAt ? moment(editingReward.createdAt) : undefined,
//             });
//         }
//     }, [editingReward, isModalOpen, isDrawerOpen, users, form]);

//     const handleSubmit = async () => {
//         try {
//             const values = await form.validateFields();
//             if (editingReward) {
//                 await apiUpdateKhenthuong(editingReward._id, values);
//                 notification.success({
//                     message: 'Cập nhật thành công',
//                     icon: <EditOutlined style={{ color: token.colorSuccess }} />,
//                 });
//             } else {
//                 await apiCreateKhenthuong(values);
//                 notification.success({
//                     message: 'Thêm mới thành công',
//                     icon: <PlusOutlined style={{ color: token.colorSuccess }} />,
//                 });
//             }
//             closeFormHandler();
//             fetchData();
//         } catch (error) {
//             notification.error({
//                 message: 'Lỗi xử lý',
//                 description: error.message,
//             });
//         }
//     };

//     // Tìm kiếm theo tên nhân viên hoặc danh hiệu
//     const filteredRewards = rewards
//         .filter(
//             (reward) =>
//                 (reward.hoten || reward.nhanvien_id?.hoten || '').toLowerCase().includes(searchText.toLowerCase()) ||
//                 (reward.ten || '').toLowerCase().includes(searchText.toLowerCase()),
//         )
//         .filter((reward) => {
//             // Apply filters for table view
//             let matchesFilters = true;

//             if (filters.dateRange && filters.dateRange.length === 2) {
//                 const startDate = filters.dateRange[0].startOf('day');
//                 const endDate = filters.dateRange[1].endOf('day');
//                 const rewardDate = moment(reward.createdAt);

//                 if (!rewardDate.isBetween(startDate, endDate, null, '[]')) {
//                     matchesFilters = false;
//                 }
//             }

//             if (filters.department && reward.phongban_id?.tenphong !== filters.department) {
//                 matchesFilters = false;
//             }

//             if (filters.rewardType && reward.ten !== filters.rewardType) {
//                 matchesFilters = false;
//             }

//             return matchesFilters;
//         });

//     // Responsive columns
//     const getColumns = () => {
//         const baseColumns = [
//             {
//                 title: 'Nhân viên',
//                 dataIndex: ['hoten'],
//                 key: 'hoten',
//                 render: (_, record) => (
//                     <Space>
//                         <Badge dot={moment(record.createdAt).isAfter(moment().subtract(7, 'days'))}>
//                             <Avatar
//                                 src={record.avatar || record.nhanvien_id?.avatar}
//                                 size={isMobile ? 'small' : 'default'}
//                                 style={{
//                                     cursor: 'pointer',
//                                     border: `2px solid ${token.colorPrimary}`,
//                                 }}
//                             >
//                                 {(record.hoten || record.nhanvien_id?.hoten || '')[0]}
//                             </Avatar>
//                         </Badge>
//                         <div>
//                             <Text strong>{record.hoten || record.nhanvien_id?.hoten}</Text>
//                             {!isMobile && (
//                                 <div>
//                                     <Tag color="blue">{record.chucvu || record.nhanvien_id?.chucvu}</Tag>
//                                 </div>
//                             )}
//                         </div>
//                     </Space>
//                 ),
//                 fixed: 'left',
//             },
//             {
//                 title: 'Danh hiệu',
//                 dataIndex: 'ten',
//                 render: (text) => (
//                     <Space>
//                         <TrophyOutlined style={{ color: token.colorWarning }} />
//                         <Text strong>{text}</Text>
//                     </Space>
//                 ),
//             },
//             {
//                 title: 'Số tiền',
//                 dataIndex: 'sotien',
//                 render: (value) => (
//                     <Text style={{ color: token.colorSuccess, fontWeight: 'bold' }}>
//                         {value.toLocaleString('vi-VN')}đ
//                     </Text>
//                 ),
//                 sorter: (a, b) => a.sotien - b.sotien,
//             },
//             {
//                 title: 'Thao tác',
//                 render: (_, record) => (
//                     <Space>
//                         <Tooltip title="Xem chi tiết">
//                             <Button
//                                 type="default"
//                                 shape="circle"
//                                 icon={<EyeOutlined />}
//                                 size="small"
//                                 onClick={() => showDetailDrawer(record)}
//                             />
//                         </Tooltip>
//                         <Tooltip title="Sửa">
//                             <Button
//                                 type="primary"
//                                 shape="circle"
//                                 icon={<EditOutlined />}
//                                 size="small"
//                                 onClick={() => openFormHandler(record)}
//                             />
//                         </Tooltip>
//                         <Tooltip title="Xóa">
//                             <Button
//                                 danger
//                                 shape="circle"
//                                 icon={<DeleteOutlined />}
//                                 size="small"
//                                 onClick={() => showDeleteConfirm(record._id)}
//                             />
//                         </Tooltip>
//                     </Space>
//                 ),
//                 fixed: 'right',
//             },
//         ];

//         // Thêm cột cho tablet và desktop
//         if (!isMobile) {
//             baseColumns.splice(2, 0, {
//                 title: 'Lý do',
//                 dataIndex: 'lydo',
//                 ellipsis: {
//                     showTitle: false,
//                 },
//                 render: (text) => (
//                     <Tooltip title={text} placement="topLeft">
//                         <Paragraph
//                             ellipsis={{ rows: 2, expandable: false, tooltip: true }}
//                             style={{ maxWidth: 200, margin: 0 }}
//                         >
//                             {text}
//                         </Paragraph>
//                     </Tooltip>
//                 ),
//             });

//             baseColumns.splice(3, 0, {
//                 title: 'Ngày khen thưởng',
//                 dataIndex: 'createdAt',
//                 render: (date) => (
//                     <Space>
//                         <CalendarOutlined style={{ color: token.colorPrimary }} />
//                         {moment(date).format('DD/MM/YYYY')}
//                     </Space>
//                 ),
//                 sorter: (a, b) => moment(a.createdAt) - moment(b.createdAt),
//             });
//         }

//         // Thêm cột cho desktop
//         if (!isMobile && !isTablet) {
//             baseColumns.splice(4, 0, {
//                 title: 'Phòng ban',
//                 dataIndex: ['phongban_id', 'tenphong'],
//                 render: (_, record) => (
//                     <Tag
//                         color="purple"
//                         style={{
//                             padding: '2px 8px',
//                             borderRadius: '16px',
//                         }}
//                     >
//                         {record.phongban_id?.tenphong || 'Chưa phân loại'}
//                     </Tag>
//                 ),
//                 filters: filterOptions.departments.map((dept) => ({
//                     text: dept,
//                     value: dept,
//                 })),
//                 onFilter: (value, record) => record.phongban_id?.tenphong === value,
//             });
//         }

//         return baseColumns;
//     };

//     // Form layout cho responsive
//     const getFormContent = () => (
//         <Form form={form} layout="vertical">
//             <Form.Item
//                 name="nhanvien_id"
//                 label={
//                     <Space>
//                         <TeamOutlined /> Nhân viên
//                     </Space>
//                 }
//                 rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
//             >
//                 <Select
//                     showSearch
//                     optionFilterProp="children"
//                     placeholder="Chọn nhân viên"
//                     filterOption={(input, option) =>
//                         option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
//                     }
//                     size="large"
//                 >
//                     {users.map((user) => (
//                         <Option key={user._id} value={user._id}>
//                             <Space>
//                                 <Avatar src={user.avatar} size="small">
//                                     {user.hoten?.[0]}
//                                 </Avatar>
//                                 {user.hoten} - {user.chucvu}
//                             </Space>
//                         </Option>
//                     ))}
//                 </Select>
//             </Form.Item>

//             <Form.Item
//                 name="ten"
//                 label={
//                     <Space>
//                         <TrophyOutlined /> Danh hiệu
//                     </Space>
//                 }
//                 rules={[{ required: true, message: 'Vui lòng nhập danh hiệu' }]}
//             >
//                 <Input placeholder="Nhập danh hiệu khen thưởng" size="large" />
//             </Form.Item>

//             <Form.Item
//                 name="lydo"
//                 label={
//                     <Space>
//                         <FileSearchOutlined /> Lý do
//                     </Space>
//                 }
//                 rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
//             >
//                 <Input.TextArea rows={4} placeholder="Nhập lý do khen thưởng" showCount maxLength={500} size="large" />
//             </Form.Item>

//             <Form.Item
//                 name="sotien"
//                 label={
//                     <Space>
//                         <DollarOutlined /> Số tiền
//                     </Space>
//                 }
//                 rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
//             >
//                 <InputNumber
//                     min={0}
//                     style={{ width: '100%' }}
//                     formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                     addonAfter="đ"
//                     placeholder="Nhập số tiền thưởng"
//                     size="large"
//                 />
//             </Form.Item>

//             <Form.Item
//                 name="ngaykhenthuong"
//                 label={
//                     <Space>
//                         <CalendarOutlined /> Ngày khen thưởng
//                     </Space>
//                 }
//             >
//                 <DatePicker
//                     style={{ width: '100%' }}
//                     placeholder="Chọn ngày khen thưởng"
//                     format="DD/MM/YYYY"
//                     size="large"
//                 />
//             </Form.Item>
//         </Form>
//     );

//     // Responsive header
//     const renderHeader = () => (
//         <div className={`reward-header ${isMobile ? 'mobile' : ''}`}>
//             <div className="header-main">
//                 <Space align="center" className={isMobile ? 'mb-4' : ''}>
//                     <div className="header-icon">
//                         <TrophyOutlined
//                             style={{
//                                 fontSize: isMobile ? 24 : 28,
//                                 color: token.colorPrimary,
//                             }}
//                         />
//                     </div>
//                     <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
//                         Quản lý khen thưởng
//                     </Title>
//                 </Space>

//                 <div className="header-actions">
//                     <Space>
//                         {!isMobile && (
//                             <Segmented
//                                 value={viewMode}
//                                 onChange={setViewMode}
//                                 options={[
//                                     {
//                                         label: 'Bảng',
//                                         value: 'table',
//                                         icon: <FileSearchOutlined />,
//                                     },
//                                     {
//                                         label: 'Thống kê',
//                                         value: 'charts',
//                                         icon: <BarChartOutlined />,
//                                     },
//                                 ]}
//                             />
//                         )}

//                         <Button type="default" icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
//                             {!isMobile && 'Lọc dữ liệu'}
//                         </Button>

//                         <Button
//                             type="primary"
//                             icon={<PlusOutlined />}
//                             onClick={() => openFormHandler()}
//                             size={isMobile ? 'middle' : 'large'}
//                         >
//                             {!isMobile && 'Thêm khen thưởng'}
//                         </Button>
//                     </Space>
//                 </div>
//             </div>
//         </div>
//     );

//     // Responsive stats
//     const renderStats = () => (
//         <Row gutter={[16, 16]} className="mb-4">
//             <Col xs={24} sm={24} md={8}>
//                 <Card hoverable>
//                     <Statistic
//                         title={
//                             <Space>
//                                 <TrophyOutlined style={{ color: token.colorPrimary }} />
//                                 <span>Tổng số khen thưởng</span>
//                             </Space>
//                         }
//                         value={stats.total}
//                         valueStyle={{ color: token.colorPrimary }}
//                         prefix={<ThunderboltOutlined />}
//                         suffix={<small>lượt</small>}
//                     />
//                 </Card>
//             </Col>

//             <Col xs={24} sm={12} md={8}>
//                 <Card hoverable>
//                     <Statistic
//                         title={
//                             <Space>
//                                 <DollarOutlined style={{ color: token.colorSuccess }} />
//                                 <span>Tổng số tiền</span>
//                             </Space>
//                         }
//                         value={stats.totalAmount}
//                         suffix="đ"
//                         valueStyle={{ color: token.colorSuccess }}
//                         formatter={(value) => `${value.toLocaleString('vi-VN')}`}
//                     />
//                 </Card>
//             </Col>

//             <Col xs={24} sm={12} md={8}>
//                 <Card hoverable>
//                     {stats.topEmployee ? (
//                         <>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                 <div>
//                                     <Text type="secondary">Nhân viên xuất sắc</Text>
//                                     <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
//                                         <Avatar
//                                             src={stats.topEmployee.avatar}
//                                             size="large"
//                                             style={{ border: `2px solid ${token.colorWarning}` }}
//                                         >
//                                             {stats.topEmployee.name?.[0]}
//                                         </Avatar>
//                                         <div style={{ marginLeft: 12 }}>
//                                             <Text strong>{stats.topEmployee.name}</Text>
//                                             <div>
//                                                 <Tag color="gold" icon={<TrophyOutlined />}>
//                                                     {stats.topEmployee.count} khen thưởng
//                                                 </Tag>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <Statistic
//                                     value={stats.topEmployee.totalAmount}
//                                     valueStyle={{ color: token.colorWarning }}
//                                     suffix="đ"
//                                     formatter={(value) => `${value.toLocaleString('vi-VN')}`}
//                                 />
//                             </div>
//                         </>
//                     ) : (
//                         <Skeleton avatar paragraph={{ rows: 1 }} active />
//                     )}
//                 </Card>
//             </Col>
//         </Row>
//     );

//     // Render search box
//     const renderSearchBox = () => (
//         <div style={{ marginBottom: 16 }}>
//             <Input.Search
//                 placeholder="Tìm kiếm nhân viên/danh hiệu"
//                 onChange={(e) => setSearchText(e.target.value)}
//                 allowClear
//                 enterButton
//                 prefix={<SearchOutlined />}
//                 size="large"
//             />
//         </div>
//     );

//     // Render phần thống kê biểu đồ
//     const renderCharts = () => (
//         <div>
//             <Row gutter={[16, 16]}>
//                 <Col xs={24}>
//                     <Card title="Biểu đồ khen thưởng theo tháng" bordered hoverable>
//                         {chartData ? (
//                             <Chart
//                                 type="bar"
//                                 data={chartData}
//                                 options={{
//                                     responsive: true,
//                                     scales: {
//                                         y: {
//                                             beginAtZero: true,
//                                             title: {
//                                                 display: true,
//                                                 text: 'Số lượng',
//                                             },
//                                         },
//                                         y1: {
//                                             beginAtZero: true,
//                                             position: 'right',
//                                             title: {
//                                                 display: true,
//                                                 text: 'Triệu đồng',
//                                             },
//                                             grid: {
//                                                 drawOnChartArea: false,
//                                             },
//                                         },
//                                     },
//                                 }}
//                                 height={300}
//                             />
//                         ) : (
//                             <Empty description="Chưa có dữ liệu" />
//                         )}
//                     </Card>
//                 </Col>

//                 <Col xs={24} lg={12}>
//                     <Card
//                         title={
//                             <Space>
//                                 <RiseOutlined style={{ color: token.colorPrimary }} />
//                                 <span>Phân bố khen thưởng theo phòng ban</span>
//                             </Space>
//                         }
//                         bordered
//                         hoverable
//                     >
//                         {rewardDistribution.length > 0 ? (
//                             <>
//                                 {rewardDistribution.map((item, index) => (
//                                     <div key={index} style={{ marginBottom: 16 }}>
//                                         <div
//                                             style={{
//                                                 display: 'flex',
//                                                 justifyContent: 'space-between',
//                                                 marginBottom: 4,
//                                             }}
//                                         >
//                                             <Text strong>{item.name}</Text>
//                                             <Space>
//                                                 <Tag color="blue">{item.count} khen thưởng</Tag>
//                                                 <Text type="success">{item.amount.toLocaleString('vi-VN')}đ</Text>
//                                             </Space>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </>
//                         ) : (
//                             <Empty description="Chưa có dữ liệu" />
//                         )}
//                     </Card>
//                 </Col>

//                 <Col xs={24} lg={12}>
//                     <Card
//                         title={
//                             <Space>
//                                 <ThunderboltOutlined style={{ color: token.colorWarning }} />
//                                 <span>Hoạt động gần đây</span>
//                             </Space>
//                         }
//                         bordered
//                         hoverable
//                     >
//                         {recentActivity.length > 0 ? (
//                             <>
//                                 {recentActivity.map((reward, index) => (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             padding: '12px 0',
//                                             borderBottom:
//                                                 index < recentActivity.length - 1
//                                                     ? `1px solid ${token.colorBorderSecondary}`
//                                                     : 'none',
//                                         }}
//                                     >
//                                         <div style={{ display: 'flex', alignItems: 'flex-start' }}>
//                                             <Avatar
//                                                 src={reward.avatar || reward.nhanvien_id?.avatar}
//                                                 style={{ marginRight: 12 }}
//                                             >
//                                                 {(reward.hoten || reward.nhanvien_id?.hoten || '')[0]}
//                                             </Avatar>
//                                             <div style={{ flex: 1 }}>
//                                                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                                     <Text strong>{reward.hoten || reward.nhanvien_id?.hoten}</Text>
//                                                     <Text type="secondary">{moment(reward.createdAt).fromNow()}</Text>
//                                                 </div>
//                                                 <div>
//                                                     <Text>
//                                                         Nhận danh hiệu <Text strong>{reward.ten}</Text>
//                                                     </Text>
//                                                 </div>
//                                                 <div style={{ marginTop: 4 }}>
//                                                     <Tag color="green">{reward.sotien.toLocaleString('vi-VN')}đ</Tag>
//                                                     {reward.phongban_id?.tenphong && (
//                                                         <Tag color="purple">{reward.phongban_id?.tenphong}</Tag>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </>
//                         ) : (
//                             <Empty description="Chưa có hoạt động gần đây" />
//                         )}
//                     </Card>
//                 </Col>
//             </Row>
//         </div>
//     );

//     // CSS cho component
//     const getStyles = () => `
//         .reward-management {
//             position: relative;
//         }

//         .reward-header {
//             margin-bottom: 16px;
//         }

//         .reward-header .header-main {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//         }

//         .reward-header.mobile .header-main {
//             flex-direction: column;
//             align-items: flex-start;
//         }

//         .reward-header .header-icon {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             width: 48px;
//             height: 48px;
//             border-radius: 24px;
//             background-color: ${token.colorBgContainerDisabled};
//             margin-right: 12px;
//         }

//         .reward-header.mobile .header-actions {
//             margin-top: 16px;
//             align-self: flex-end;
//         }

//         .ant-card-head-title {
//             font-weight: 600;
//         }

//         .ant-tag {
//             margin-right: 0;
//         }

//         .ant-statistic-title {
//             margin-bottom: 8px;
//         }

//         /* Animation styles */
//         @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//         }

//         .fade-in {
//             animation: fadeIn 0.5s ease-in-out;
//         }

//         .ant-table-cell {
//             padding: 12px 16px !important;
//         }

//         .ant-table-row:hover {
//             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
//     `;

//     return (
//         <ConfigProvider
//             theme={{
//                 components: {
//                     Card: {
//                         headerBg: token.colorBgContainerDisabled,
//                         headerFontSize: 16,
//                         headerFontSizeSM: 14,
//                     },
//                     Table: {
//                         headerBg: token.colorBgContainer,
//                         headerColor: token.colorPrimary,
//                         headerFilterHoverBg: token.colorPrimaryBg,
//                         headerSortHoverBg: token.colorPrimaryBg,
//                     },
//                 },
//             }}
//         >
//             <style>{getStyles()}</style>
//             <div className="reward-management card-container-achievement fade-in">
//                 <Card className="mb-4">
//                     {renderHeader()}

//                     <Divider />

//                     {/* Thống kê responsive */}
//                     {renderStats()}

//                     {/* Search box */}
//                     {renderSearchBox()}

//                     {/* Main content area */}
//                     {viewMode === 'table' ? (
//                         <Table
//                             dataSource={filteredRewards}
//                             columns={getColumns()}
//                             rowKey="_id"
//                             loading={loading}
//                             bordered
//                             scroll={{ x: 'max-content' }}
//                             pagination={{
//                                 pageSize: isMobile ? 5 : 10,
//                                 showSizeChanger: !isMobile,
//                                 showTotal: (total) => `Tổng số ${total} bản ghi`,
//                                 size: isMobile ? 'small' : 'default',
//                             }}
//                             rowClassName={() => 'reward-table-row'}
//                             onRow={(record) => ({
//                                 onClick: () => {
//                                     if (isMobile) {
//                                         showDetailDrawer(record);
//                                     }
//                                 },
//                             })}
//                         />
//                     ) : (
//                         renderCharts()
//                     )}
//                 </Card>

//                 {/* Form trong Modal cho màn hình lớn */}
//                 <Modal
//                     title={
//                         <Space>
//                             {editingReward ? <EditOutlined /> : <PlusOutlined />}
//                             <span>{editingReward ? 'Cập nhật khen thưởng' : 'Thêm khen thưởng'}</span>
//                         </Space>
//                     }
//                     open={isModalOpen}
//                     onCancel={closeFormHandler}
//                     onOk={handleSubmit}
//                     okText={editingReward ? 'Cập nhật' : 'Tạo mới'}
//                     width={600}
//                     centered
//                     okButtonProps={{
//                         size: 'large',
//                         icon: editingReward ? <EditOutlined /> : <PlusOutlined />,
//                     }}
//                     cancelButtonProps={{ size: 'large' }}
//                 >
//                     {getFormContent()}
//                 </Modal>

//                 {/* Form trong Drawer cho điện thoại */}
//                 <Drawer
//                     title={
//                         <Space>
//                             {editingReward ? <EditOutlined /> : <PlusOutlined />}
//                             <span>{editingReward ? 'Cập nhật khen thưởng' : 'Thêm khen thưởng'}</span>
//                         </Space>
//                     }
//                     placement="right"
//                     onClose={closeFormHandler}
//                     open={isDrawerOpen}
//                     width={isMobile ? '100%' : 400}
//                     footer={
//                         <div style={{ textAlign: 'right' }}>
//                             <Button onClick={closeFormHandler} style={{ marginRight: 8 }}>
//                                 Hủy
//                             </Button>
//                             <Button
//                                 onClick={handleSubmit}
//                                 type="primary"
//                                 icon={editingReward ? <EditOutlined /> : <PlusOutlined />}
//                             >
//                                 {editingReward ? 'Cập nhật' : 'Tạo mới'}
//                             </Button>
//                         </div>
//                     }
//                 >
//                     {getFormContent()}
//                 </Drawer>

//                 {/* Chi tiết khen thưởng drawer */}
//                 <Drawer
//                     title={
//                         <Space>
//                             <TrophyOutlined style={{ color: token.colorWarning }} />
//                             <span>Chi tiết khen thưởng</span>
//                         </Space>
//                     }
//                     placement="right"
//                     onClose={() => setDetailDrawer({ visible: false, reward: null })}
//                     open={detailDrawer.visible}
//                     width={isMobile ? '100%' : 400}
//                     footer={
//                         detailDrawer.reward && (
//                             <div style={{ textAlign: 'right' }}>
//                                 <Button
//                                     onClick={() => {
//                                         setDetailDrawer({ visible: false, reward: null });
//                                         openFormHandler(detailDrawer.reward);
//                                     }}
//                                     type="primary"
//                                     icon={<EditOutlined />}
//                                 >
//                                     Chỉnh sửa
//                                 </Button>
//                             </div>
//                         )
//                     }
//                 >
//                     {detailDrawer.reward && (
//                         <div>
//                             <div style={{ textAlign: 'center', marginBottom: 24 }}>
//                                 <Avatar
//                                     src={detailDrawer.reward.avatar || detailDrawer.reward.nhanvien_id?.avatar}
//                                     size={80}
//                                     style={{ border: `3px solid ${token.colorWarning}`, marginBottom: 16 }}
//                                 >
//                                     {(detailDrawer.reward.hoten || detailDrawer.reward.nhanvien_id?.hoten || '')[0]}
//                                 </Avatar>
//                                 <Title level={4}>
//                                     {detailDrawer.reward.hoten || detailDrawer.reward.nhanvien_id?.hoten}
//                                 </Title>
//                                 <div>
//                                     <Tag color="blue">
//                                         {detailDrawer.reward.chucvu || detailDrawer.reward.nhanvien_id?.chucvu}
//                                     </Tag>
//                                     {detailDrawer.reward.phongban_id?.tenphong && (
//                                         <Tag color="purple">{detailDrawer.reward.phongban_id?.tenphong}</Tag>
//                                     )}
//                                 </div>
//                             </div>

//                             <Divider />

//                             <div style={{ marginBottom: 16 }}>
//                                 <Text type="secondary">Danh hiệu</Text>
//                                 <div
//                                     style={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         marginTop: 8,
//                                         background: token.colorPrimaryBg,
//                                         padding: '12px 16px',
//                                         borderRadius: 8,
//                                     }}
//                                 >
//                                     <TrophyOutlined
//                                         style={{ fontSize: 24, color: token.colorWarning, marginRight: 12 }}
//                                     />
//                                     <Title level={4} style={{ margin: 0 }}>
//                                         {detailDrawer.reward.ten}
//                                     </Title>
//                                 </div>
//                             </div>

//                             <div style={{ marginBottom: 16 }}>
//                                 <Text type="secondary">Số tiền thưởng</Text>
//                                 <div
//                                     style={{
//                                         marginTop: 8,
//                                         background: token.colorSuccessBg,
//                                         padding: '12px 16px',
//                                         borderRadius: 8,
//                                     }}
//                                 >
//                                     <Statistic
//                                         value={detailDrawer.reward.sotien}
//                                         suffix="đ"
//                                         valueStyle={{ color: token.colorSuccess }}
//                                         formatter={(value) => `${value.toLocaleString('vi-VN')}`}
//                                     />
//                                 </div>
//                             </div>

//                             <div style={{ marginBottom: 16 }}>
//                                 <Text type="secondary">Ngày khen thưởng</Text>
//                                 <div style={{ marginTop: 8 }}>
//                                     <Text strong>
//                                         <CalendarOutlined style={{ marginRight: 8, color: token.colorPrimary }} />
//                                         {moment(detailDrawer.reward.createdAt).format('DD/MM/YYYY')}
//                                     </Text>
//                                 </div>
//                             </div>

//                             <div style={{ marginBottom: 16 }}>
//                                 <Text type="secondary">Lý do khen thưởng</Text>
//                                 <div
//                                     style={{
//                                         marginTop: 8,
//                                         background: token.colorBgContainerDisabled,
//                                         padding: '12px 16px',
//                                         borderRadius: 8,
//                                     }}
//                                 >
//                                     <Paragraph>{detailDrawer.reward.lydo}</Paragraph>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </Drawer>

//                 {/* Drawer lọc dữ liệu */}
//                 <Drawer
//                     title={
//                         <Space>
//                             <FilterOutlined />
//                             <span>Lọc dữ liệu</span>
//                         </Space>
//                     }
//                     placement="right"
//                     onClose={() => setFilterDrawerVisible(false)}
//                     open={filterDrawerVisible}
//                     width={isMobile ? '100%' : 400}
//                     footer={
//                         <div style={{ textAlign: 'right' }}>
//                             <Button onClick={resetFilters} style={{ marginRight: 8 }} icon={<ReloadOutlined />}>
//                                 Đặt lại
//                             </Button>
//                             <Button type="primary" onClick={() => applyFilters(filters)} icon={<FilterOutlined />}>
//                                 Áp dụng
//                             </Button>
//                         </div>
//                     }
//                 >
//                     <Form layout="vertical">
//                         <Form.Item label="Khoảng thời gian">
//                             <DatePicker.RangePicker
//                                 style={{ width: '100%' }}
//                                 format="DD/MM/YYYY"
//                                 value={filters.dateRange}
//                                 onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
//                                 allowClear
//                             />
//                         </Form.Item>

//                         <Form.Item label="Phòng ban">
//                             <Select
//                                 style={{ width: '100%' }}
//                                 placeholder="Chọn phòng ban"
//                                 value={filters.department}
//                                 onChange={(value) => setFilters({ ...filters, department: value })}
//                                 allowClear
//                             >
//                                 {filterOptions.departments.map((dept, index) => (
//                                     <Option key={index} value={dept}>
//                                         {dept}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>

//                         <Form.Item label="Danh hiệu">
//                             <Select
//                                 style={{ width: '100%' }}
//                                 placeholder="Chọn danh hiệu"
//                                 value={filters.rewardType}
//                                 onChange={(value) => setFilters({ ...filters, rewardType: value })}
//                                 allowClear
//                             >
//                                 {filterOptions.rewardTypes.map((type, index) => (
//                                     <Option key={index} value={type}>
//                                         {type}
//                                     </Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </Form>
//                 </Drawer>

//                 {/* Modal xác nhận xóa */}
//                 <Modal
//                     title={
//                         <Space>
//                             <DeleteOutlined style={{ color: token.colorError }} />
//                             <span>Xác nhận xóa</span>
//                         </Space>
//                     }
//                     open={confirmDelete.visible}
//                     onOk={() => handleDelete(confirmDelete.id)}
//                     onCancel={() => setConfirmDelete({ visible: false, id: null })}
//                     okText="Xóa"
//                     cancelText="Hủy"
//                     okButtonProps={{ danger: true }}
//                     centered
//                 >
//                     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
//                         <DeleteOutlined style={{ fontSize: 48, color: token.colorError }} />
//                     </div>
//                     <Paragraph style={{ textAlign: 'center' }}>Bạn có chắc chắn muốn xóa khen thưởng này?</Paragraph>
//                     <Paragraph strong style={{ textAlign: 'center', color: token.colorError }}>
//                         Hành động này không thể hoàn tác.
//                     </Paragraph>
//                 </Modal>

//                 {/* Float buttons cho điện thoại */}
//                 {isMobile && (
//                     <FloatButton.Group
//                         trigger="click"
//                         type="primary"
//                         style={{ right: 24 }}
//                         icon={<BulbOutlined />}
//                         tooltip="Thao tác nhanh"
//                     >
//                         <FloatButton
//                             icon={<PlusOutlined />}
//                             tooltip="Thêm khen thưởng"
//                             onClick={() => openFormHandler()}
//                         />
//                         <FloatButton
//                             icon={<FilterOutlined />}
//                             tooltip="Lọc dữ liệu"
//                             onClick={() => setFilterDrawerVisible(true)}
//                         />
//                         <FloatButton
//                             icon={viewMode === 'table' ? <BarChartOutlined /> : <FileSearchOutlined />}
//                             tooltip={viewMode === 'table' ? 'Xem thống kê' : 'Xem bảng'}
//                             onClick={() => setViewMode(viewMode === 'table' ? 'charts' : 'table')}
//                         />
//                     </FloatButton.Group>
//                 )}
//             </div>
//         </ConfigProvider>
//     );
// }

// // Hook theo dõi kích thước màn hình - Thêm nếu chưa có
// // Đặt ở file riêng: src/hooks/useWindowSize.js
// /*
// import { useState, useEffect } from 'react';

// function useWindowSize() {
//   const [windowSize, setWindowSize] = useState({
//     width: undefined,
//     height: undefined,
//   });

//   useEffect(() => {
//     function handleResize() {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     }

//     // Add event listener
//     window.addEventListener("resize", handleResize);

//     // Call handler right away so state gets updated with initial window size
//     handleResize();

//     // Remove event listener on cleanup
//     return () => window.removeEventListener("resize", handleResize);
//   }, []); // Empty array ensures that effect is only run on mount

//   return windowSize;
// }

// export default useWindowSize;
// */

import { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    notification,
    Space,
    Card,
    Typography,
    Avatar,
    Tag,
    Tooltip,
    Divider,
    Statistic,
    Row,
    Col,
    Drawer,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TrophyOutlined,
    TeamOutlined,
    DollarOutlined,
    FileSearchOutlined,
    CalendarOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
    apiGetKhenthuongs,
    apiDeleteKhenthuong,
    apiCreateKhenthuong,
    apiUpdateKhenthuong,
} from '../../apis/khenthuong';
import { apiGetAllUser } from '../../apis/staff';
import useWindowSize from '../../hooks/useWindowSize';

const { Option } = Select;
const { Title, Text } = Typography;

export default function RewardManagement() {
    const [rewards, setRewards] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingReward, setEditingReward] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
    const [stats, setStats] = useState({ total: 0, totalAmount: 0 });

    // Hook theo dõi kích thước màn hình
    const { width } = useWindowSize() || { width: typeof window !== 'undefined' ? window.innerWidth : 1200 };
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 992;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const resReward = await apiGetKhenthuongs();
            const resUser = await apiGetAllUser();

            const rewardData = resReward.data;
            setRewards(rewardData);
            setUsers(resUser.data);

            // Tính toán thống kê
            const totalAmount = rewardData.reduce((sum, reward) => sum + (reward.sotien || 0), 0);
            setStats({
                total: rewardData.length,
                totalAmount,
            });

            setLoading(false);
        } catch (error) {
            notification.error({
                message: 'Lỗi khi tải dữ liệu',
                description: error.message,
            });
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiDeleteKhenthuong(id);
            notification.success({
                message: 'Xóa thành công',
                icon: <DeleteOutlined style={{ color: '#52c41a' }} />,
            });
            setRewards((prev) => prev.filter((r) => r._id !== id));
            fetchData(); // Cập nhật lại thống kê
            setConfirmDelete({ visible: false, id: null });
        } catch (error) {
            notification.error({
                message: 'Xóa thất bại',
                description: error.message,
            });
        }
    };

    const showDeleteConfirm = (id) => {
        setConfirmDelete({ visible: true, id });
    };

    const openFormHandler = (record = null) => {
        setEditingReward(record);
        if (isMobile) {
            setIsDrawerOpen(true);
        } else {
            setIsModalOpen(true);
        }

        if (!record) {
            form.resetFields();
        }
    };

    const closeFormHandler = () => {
        if (isMobile) {
            setIsDrawerOpen(false);
        } else {
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        if (editingReward && (isModalOpen || isDrawerOpen) && users.length > 0) {
            const matchedUser = users.find(
                (user) =>
                    user.hoten === editingReward.hoten &&
                    user.chucvu === editingReward.chucvu &&
                    user.avatar === editingReward.avatar,
            );

            form.setFieldsValue({
                nhanvien_id: matchedUser?._id,
                ten: editingReward.ten,
                lydo: editingReward.lydo,
                sotien: editingReward.sotien,
            });
        }
    }, [editingReward, isModalOpen, isDrawerOpen, users, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingReward) {
                await apiUpdateKhenthuong(editingReward._id, values);
                notification.success({
                    message: 'Cập nhật thành công',
                    icon: <EditOutlined style={{ color: '#52c41a' }} />,
                });
            } else {
                await apiCreateKhenthuong(values);
                notification.success({
                    message: 'Thêm mới thành công',
                    icon: <PlusOutlined style={{ color: '#52c41a' }} />,
                });
            }
            closeFormHandler();
            fetchData();
        } catch (error) {
            notification.error({
                message: 'Lỗi xử lý',
                description: error.message,
            });
        }
    };

    // Tìm kiếm theo tên nhân viên hoặc danh hiệu
    const filteredRewards = rewards.filter(
        (reward) =>
            (reward.hoten || reward.nhanvien_id?.hoten || '').toLowerCase().includes(searchText.toLowerCase()) ||
            (reward.ten || '').toLowerCase().includes(searchText.toLowerCase()),
    );

    // Responsive columns
    const getColumns = () => {
        const baseColumns = [
            {
                title: 'Nhân viên',
                dataIndex: ['hoten'],
                key: 'hoten',
                render: (_, record) => (
                    <Space>
                        <Avatar src={record.avatar || record.nhanvien_id?.avatar} size={isMobile ? 'small' : 'default'}>
                            {(record.hoten || record.nhanvien_id?.hoten || '')[0]}
                        </Avatar>
                        <Text strong>{record.hoten || record.nhanvien_id?.hoten}</Text>
                    </Space>
                ),
            },
            {
                title: 'Danh hiệu',
                dataIndex: 'ten',
                render: (text) => (
                    <Space>
                        <TrophyOutlined style={{ color: '#faad14' }} />
                        <Text>{text}</Text>
                    </Space>
                ),
            },
            {
                title: 'Số tiền',
                dataIndex: 'sotien',
                render: (value) => (
                    <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>{value.toLocaleString('vi-VN')}đ</Text>
                ),
            },
            {
                title: 'Thao tác',
                render: (_, record) => (
                    <Space>
                        <Tooltip title="Sửa">
                            <Button
                                type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => openFormHandler(record)}
                            />
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <Button
                                danger
                                shape="circle"
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={() => showDeleteConfirm(record._id)}
                            />
                        </Tooltip>
                    </Space>
                ),
            },
        ];

        // Thêm cột cho tablet và desktop
        if (!isMobile) {
            baseColumns.splice(2, 0, {
                title: 'Lý do',
                dataIndex: 'lydo',
                ellipsis: {
                    showTitle: false,
                },
                render: (text) => (
                    <Tooltip title={text} placement="topLeft">
                        <Text style={{ maxWidth: 150 }} ellipsis>
                            {text}
                        </Text>
                    </Tooltip>
                ),
            });

            baseColumns.splice(3, 0, {
                title: 'Ngày khen thưởng',
                dataIndex: 'createdAt',
                render: (date) => (
                    <Space>
                        <CalendarOutlined />
                        {moment(date).format('DD/MM/YYYY')}
                    </Space>
                ),
            });
        }

        // Thêm cột cho desktop
        if (!isMobile && !isTablet) {
            baseColumns.splice(1, 0, {
                title: 'Chức vụ',
                dataIndex: 'chucvu',
                render: (_, record) => <Tag color="blue">{record.chucvu || record.nhanvien_id?.chucvu}</Tag>,
            });

            baseColumns.splice(2, 0, {
                title: 'Phòng ban',
                dataIndex: ['phongban_id', 'tenphong'],
                render: (_, record) => <Tag color="purple">{record.phongban_id?.tenphong}</Tag>,
            });
        }

        return baseColumns;
    };

    // Form layout cho responsive
    const getFormContent = () => (
        <Form form={form} layout="vertical">
            <Form.Item
                name="nhanvien_id"
                label={
                    <Space>
                        <TeamOutlined /> Nhân viên
                    </Space>
                }
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
                <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="Chọn nhân viên"
                    filterOption={(input, option) => option.children.toLowerCase?.().indexOf(input.toLowerCase()) >= 0}
                >
                    {users.map((user) => (
                        <Option key={user._id} value={user._id}>
                            <Space>
                                <Avatar src={user.avatar} size="small">
                                    {user.hoten?.[0]}
                                </Avatar>
                                {user.hoten} - {user.chucvu}
                            </Space>
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="ten"
                label={
                    <Space>
                        <TrophyOutlined /> Danh hiệu
                    </Space>
                }
                rules={[{ required: true, message: 'Vui lòng nhập danh hiệu' }]}
            >
                <Input placeholder="Nhập danh hiệu khen thưởng" />
            </Form.Item>

            <Form.Item
                name="lydo"
                label={
                    <Space>
                        <FileSearchOutlined /> Lý do
                    </Space>
                }
                rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
            >
                <Input.TextArea rows={4} placeholder="Nhập lý do khen thưởng" showCount maxLength={500} />
            </Form.Item>

            <Form.Item
                name="sotien"
                label={
                    <Space>
                        <DollarOutlined /> Số tiền
                    </Space>
                }
                rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}
            >
                <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter="đ"
                    placeholder="Nhập số tiền thưởng"
                />
            </Form.Item>
        </Form>
    );

    // Responsive header
    const renderHeader = () => (
        <div
            className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-${isMobile ? 'start' : 'center'} mb-4 `}
        >
            <Space align="center" className={isMobile ? 'mb-4' : ''}>
                <TrophyOutlined style={{ fontSize: isMobile ? 24 : 28, color: '#1890ff' }} />
                <Title level={isMobile ? 3 : 2} style={{ margin: 0 }}>
                    Quản lý khen thưởng
                </Title>
            </Space>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openFormHandler()}
                size={isMobile ? 'middle' : 'large'}
                block={isMobile}
                style={{ marginLeft: '10px' }}
            >
                Thêm khen thưởng
            </Button>
        </div>
    );

    // Responsive stats
    const renderStats = () => (
        <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={24} md={8}>
                <Card>
                    <Statistic
                        title="Tổng số khen thưởng"
                        value={stats.total}
                        prefix={<TrophyOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Card>
                    <Statistic
                        title="Tổng số tiền"
                        value={stats.totalAmount}
                        prefix={<DollarOutlined />}
                        suffix="đ"
                        valueStyle={{ color: '#52c41a' }}
                        formatter={(value) => `${value.toLocaleString('vi-VN')}`}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Card>
                    <Input.Search
                        placeholder="Tìm kiếm nhân viên/danh hiệu"
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        prefix={<SearchOutlined />}
                    />
                </Card>
            </Col>
        </Row>
    );

    return (
        <div className="reward-management  ">
            <Card className="mb-4">
                {renderHeader()}

                <Divider />

                {/* Thống kê responsive */}
                {renderStats()}

                <Table
                    dataSource={filteredRewards}
                    columns={getColumns()}
                    rowKey="_id"
                    loading={loading}
                    bordered
                    scroll={{ x: 'max-content' }} // Cho phép cuộn ngang trên màn hình nhỏ
                    pagination={{
                        pageSize: isMobile ? 5 : 10,
                        showSizeChanger: !isMobile,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} khen thưởng`,
                        size: isMobile ? 'small' : 'default',
                    }}
                />
            </Card>

            {/* Form trong Modal cho màn hình lớn */}
            <Modal
                title={
                    <Space>
                        {editingReward ? <EditOutlined /> : <PlusOutlined />}
                        <span>{editingReward ? 'Cập nhật khen thưởng' : 'Thêm khen thưởng'}</span>
                    </Space>
                }
                open={isModalOpen}
                onCancel={closeFormHandler}
                onOk={handleSubmit}
                okText={editingReward ? 'Cập nhật' : 'Tạo mới'}
                width={600}
                centered
            >
                {getFormContent()}
            </Modal>

            {/* Form trong Drawer cho điện thoại */}
            <Drawer
                title={
                    <Space>
                        {editingReward ? <EditOutlined /> : <PlusOutlined />}
                        <span>{editingReward ? 'Cập nhật khen thưởng' : 'Thêm khen thưởng'}</span>
                    </Space>
                }
                placement="right"
                onClose={closeFormHandler}
                open={isDrawerOpen}
                width={isMobile ? '100%' : 400}
                footer={
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={closeFormHandler} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} type="primary">
                            {editingReward ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                }
            >
                {getFormContent()}
            </Drawer>

            <Modal
                title="Xác nhận xóa"
                open={confirmDelete.visible}
                onOk={() => handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete({ visible: false, id: null })}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn xóa khen thưởng này?</p>
                <p>Hành động này không thể hoàn tác.</p>
            </Modal>
        </div>
    );
}

// Hook theo dõi kích thước màn hình - Thêm nếu chưa có
// Đặt ở file riêng: src/hooks/useWindowSize.js
/*
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  
  return windowSize;
}

export default useWindowSize;
*/
