// import { useEffect, useState } from 'react';
// import {
//     Modal,
//     Button,
//     Form,
//     Input,
//     Upload,
//     Table,
//     Popconfirm,
//     message,
//     Select,
//     Card,
//     Typography,
//     Space,
//     Tag,
//     Badge,
//     Avatar,
//     Divider,
//     Empty,
//     Skeleton,
//     Image,
//     Tooltip,
//     Spin,
//     Row,
//     Col,
//     Segmented,
//     Drawer,
//     DatePicker,
//     Tabs,
//     Statistic,
//     Progress,
//     Alert,
//     Timeline,
//     Breadcrumb,
//     theme,
// } from 'antd';
// import {
//     PlusOutlined,
//     EditOutlined,
//     DeleteOutlined,
//     TrophyOutlined,
//     UserOutlined,
//     CalendarOutlined,
//     FileImageOutlined,
//     EyeOutlined,
//     SortAscendingOutlined,
//     ReloadOutlined,
//     ExclamationCircleOutlined,
//     HomeOutlined,
//     TeamOutlined,
//     StarOutlined,
//     BarChartOutlined,
//     FilterOutlined,
//     SearchOutlined,
//     ClockCircleOutlined,
//     PictureFilled,
//     CheckCircleOutlined,
//     FileTextOutlined,
//     ToolOutlined,
//     SettingOutlined,
//     InfoCircleOutlined,
// } from '@ant-design/icons';
// import moment from 'moment';
// import { apiGetAllThanhTich, apiCreateThanhTich, apiUpdateThanhTich, apiDeleteThanhTich } from '../../apis/Thanhtich';
// import { apiGetAllUser } from '../../apis/staff';

// const { Title, Text, Paragraph } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;
// const { TabPane } = Tabs;
// const { useToken } = theme;

// export default function ManageAchievements() {
//     const { token } = useToken();
//     const [listAchievements, setListAchievements] = useState([]);
//     const [listStaff, setListStaff] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [selected, setSelected] = useState(null);
//     const [form] = Form.useForm();
//     const [fileList, setFileList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [submitLoading, setSubmitLoading] = useState(false);
//     const [oldImages, setOldImages] = useState([]);
//     const [removedOldImages, setRemovedOldImages] = useState([]);
//     const [viewType, setViewType] = useState('table');
//     const [searchText, setSearchText] = useState('');
//     const [showDetail, setShowDetail] = useState(false);
//     const [detailItem, setDetailItem] = useState(null);
//     const [previewImage, setPreviewImage] = useState('');
//     const [previewVisible, setPreviewVisible] = useState(false);
//     const [staffFilter, setStaffFilter] = useState(null);
//     const [dateFilter, setDateFilter] = useState(null);
//     const [activeTab, setActiveTab] = useState('all');
//     // Thêm trạng thái mới
//     const [activeSection, setActiveSection] = useState('achievements');
//     const [achievementStats, setAchievementStats] = useState({
//         total: 0,
//         byDepartment: {},
//         byMonth: {},
//         topEmployees: [],
//     });

//     const fetchAllAchievements = async () => {
//         try {
//             setLoading(true);
//             const res = await apiGetAllThanhTich();
//             setListAchievements(res?.data || []);

//             // Tính toán thống kê
//             calculateStats(res?.data || []);
//         } catch (err) {
//             message.error('Lỗi khi lấy danh sách thành tích');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculateStats = (data) => {
//         // Tính tổng số thành tích
//         const total = data.length;

//         // Thống kê theo phòng ban
//         const byDepartment = {};
//         data.forEach((item) => {
//             const deptName = item.nhanvien_id?.phongban_id?.tenphong || 'Chưa phân phòng';
//             byDepartment[deptName] = (byDepartment[deptName] || 0) + 1;
//         });

//         // Thống kê theo tháng
//         const byMonth = {};
//         data.forEach((item) => {
//             const month = moment(item.createdAt).format('MM/YYYY');
//             byMonth[month] = (byMonth[month] || 0) + 1;
//         });

//         // Nhân viên có nhiều thành tích nhất
//         const employeeCount = {};
//         data.forEach((item) => {
//             const employeeId = item.nhanvien_id?._id;
//             if (employeeId) {
//                 employeeCount[employeeId] = {
//                     count: (employeeCount[employeeId]?.count || 0) + 1,
//                     name: item.nhanvien_id.hoten,
//                     avatar: item.nhanvien_id.avatar,
//                     position: item.nhanvien_id.chucvu,
//                     department: item.nhanvien_id.phongban_id?.tenphong,
//                 };
//             }
//         });

//         const topEmployees = Object.values(employeeCount)
//             .sort((a, b) => b.count - a.count)
//             .slice(0, 5);

//         setAchievementStats({
//             total,
//             byDepartment,
//             byMonth,
//             topEmployees,
//         });
//     };

//     const fetchAllUsers = async () => {
//         try {
//             const response = await apiGetAllUser();
//             setListStaff(response.data);
//         } catch (error) {
//             console.error('Lỗi khi lấy dữ liệu người dùng:', error);
//             message.error('Lỗi khi lấy danh sách nhân viên');
//         }
//     };

//     useEffect(() => {
//         fetchAllAchievements();
//         fetchAllUsers();
//     }, []);

//     const handleShowAdd = () => {
//         setSelected(null);
//         form.resetFields();
//         form.setFieldsValue({
//             ngaykhen: moment(),
//         });
//         setFileList([]);
//         setOldImages([]);
//         setRemovedOldImages([]);
//         setShowModal(true);
//     };

//     const handleShowEdit = (record) => {
//         setSelected(record);
//         form.setFieldsValue({
//             nhanvien_id: record?.nhanvien_id?._id,
//             ten: record.ten,
//             mota: record.mota,
//             ngaykhen: record.ngaykhen ? moment(record.ngaykhen) : moment(record.createdAt),
//         });
//         setFileList([]);
//         setOldImages(record.hinhanh || []);
//         setRemovedOldImages([]);
//         setShowModal(true);
//     };

//     const handleViewDetail = (record) => {
//         setDetailItem(record);
//         setShowDetail(true);
//     };

//     const handleSubmit = async () => {
//         try {
//             const values = await form.validateFields();
//             const formData = new FormData();
//             formData.append('nhanvien_id', values.nhanvien_id);
//             formData.append('ten', values.ten);
//             formData.append('mota', values.mota);
//             formData.append('ngaykhen', values.ngaykhen ? values.ngaykhen.format('YYYY-MM-DD') : '');
//             formData.append('removedImages', JSON.stringify(removedOldImages));

//             fileList.forEach((file) => {
//                 formData.append('hinhanh', file.originFileObj);
//             });

//             setSubmitLoading(true);
//             const loadingMessage = selected
//                 ? message.loading('Đang cập nhật thành tích...', 0)
//                 : message.loading('Đang tạo thành tích mới...', 0);

//             if (selected) {
//                 await apiUpdateThanhTich(selected._id, formData);
//                 message.success('Cập nhật thành tích thành công');
//             } else {
//                 await apiCreateThanhTich(formData);
//                 message.success('Tạo thành tích mới thành công');
//             }

//             loadingMessage();
//             setShowModal(false);
//             fetchAllAchievements();
//         } catch (err) {
//             console.error(err);
//             message.error('Đã xảy ra lỗi khi lưu dữ liệu thành tích');
//         } finally {
//             setSubmitLoading(false);
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             const loadingMessage = message.loading('Đang xóa thành tích...', 0);
//             await apiDeleteThanhTich(id);
//             loadingMessage();
//             message.success('Xóa thành tích thành công');
//             fetchAllAchievements();
//         } catch (err) {
//             message.error('Xóa thành tích thất bại');
//         }
//     };

//     const handlePreview = (imageUrl) => {
//         setPreviewImage(imageUrl);
//         setPreviewVisible(true);
//     };

//     const handleTabChange = (key) => {
//         setActiveTab(key);
//     };

//     const handleViewTypeChange = (value) => {
//         setViewType(value);
//         // Lưu lại lựa chọn vào localStorage để giữ nguyên khi tải lại trang
//         localStorage.setItem('achievementViewType', value);
//     };

//     useEffect(() => {
//         // Khôi phục lựa chọn view từ localStorage
//         const savedViewType = localStorage.getItem('achievementViewType');
//         if (savedViewType) {
//             setViewType(savedViewType);
//         }
//     }, []);

//     const getFilteredData = () => {
//         return listAchievements.filter((item) => {
//             // Lọc theo tìm kiếm văn bản
//             const matchesSearch =
//                 (item.ten && item.ten.toLowerCase().includes(searchText.toLowerCase())) ||
//                 (item.mota && item.mota.toLowerCase().includes(searchText.toLowerCase())) ||
//                 (item.nhanvien_id?.hoten && item.nhanvien_id.hoten.toLowerCase().includes(searchText.toLowerCase()));

//             // Lọc theo nhân viên
//             const matchesStaffFilter = staffFilter ? item.nhanvien_id?._id === staffFilter : true;

//             // Lọc theo thời gian
//             const matchesDateFilter = dateFilter
//                 ? moment(item.createdAt).format('YYYY-MM') === dateFilter.format('YYYY-MM')
//                 : true;

//             // Lọc theo tab
//             let matchesTabFilter = true;
//             if (activeTab === 'recent') {
//                 matchesTabFilter = moment(item.createdAt).isAfter(moment().subtract(30, 'days'));
//             } else if (activeTab === 'top') {
//                 // Giả sử top thành tích là những thành tích có từ "xuất sắc" trong tên
//                 matchesTabFilter = item.ten.toLowerCase().includes('xuất sắc');
//             }

//             return matchesSearch && matchesStaffFilter && matchesDateFilter && matchesTabFilter;
//         });
//     };

//     const filteredData = getFilteredData();

//     const columns = [
//         {
//             title: 'Nhân viên',
//             dataIndex: ['nhanvien_id', 'hoten'],
//             key: 'nhanvien_id',
//             render: (text, record) => (
//                 <Space>
//                     <Avatar
//                         size="large"
//                         src={record.nhanvien_id?.avatar}
//                         icon={!record.nhanvien_id?.avatar && <UserOutlined />}
//                         style={{
//                             backgroundColor: record.nhanvien_id?.avatar ? 'transparent' : token.colorPrimary,
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                         }}
//                     />
//                     <div>
//                         <Text strong>{text || 'N/A'}</Text>
//                         <div>
//                             <Text type="secondary" style={{ fontSize: '12px' }}>
//                                 {record.nhanvien_id?.phongban_id?.tenphong || 'Chưa phân phòng'}
//                             </Text>
//                         </div>
//                     </div>
//                 </Space>
//             ),
//             filters: listStaff.map((staff) => ({ text: staff.hoten, value: staff._id })),
//             onFilter: (value, record) => record.nhanvien_id?._id === value,
//             sorter: (a, b) => {
//                 const nameA = a.nhanvien_id?.hoten || '';
//                 const nameB = b.nhanvien_id?.hoten || '';
//                 return nameA.localeCompare(nameB);
//             },
//             width: 220,
//         },
//         {
//             title: 'Danh hiệu',
//             dataIndex: 'ten',
//             key: 'ten',
//             sorter: (a, b) => a.ten.localeCompare(b.ten),
//             render: (text) => (
//                 <Space>
//                     <TrophyOutlined style={{ color: 'gold' }} />
//                     <Text strong>{text}</Text>
//                 </Space>
//             ),
//             width: 250,
//         },
//         {
//             title: 'Mô tả',
//             dataIndex: 'mota',
//             key: 'mota',
//             ellipsis: true,
//             render: (text) =>
//                 text ? (
//                     <Paragraph ellipsis={{ rows: 2, expandable: false, symbol: '...' }}>{text}</Paragraph>
//                 ) : (
//                     <Text type="secondary" italic>
//                         Chưa có mô tả
//                     </Text>
//                 ),
//         },
//         {
//             title: 'Ngày khen thưởng',
//             dataIndex: 'ngaykhen',
//             key: 'ngaykhen',
//             render: (text, record) => (
//                 <Space>
//                     <CalendarOutlined style={{ color: token.colorPrimary }} />
//                     <span>{moment(text || record.createdAt).format('DD/MM/YYYY')}</span>
//                 </Space>
//             ),
//             sorter: (a, b) => moment(a.ngaykhen || a.createdAt).unix() - moment(b.ngaykhen || b.createdAt).unix(),
//             width: 160,
//         },
//         {
//             title: 'Hình ảnh',
//             dataIndex: 'hinhanh',
//             key: 'hinhanh',
//             render: (images) => (
//                 <div className="flex gap-1 flex-wrap">
//                     {images && images.length > 0 ? (
//                         <>
//                             <Image.PreviewGroup>
//                                 {images.slice(0, 3).map((img, i) => (
//                                     <div
//                                         key={i}
//                                         style={{
//                                             position: 'relative',
//                                             display: 'inline-block',
//                                             marginRight: '4px',
//                                         }}
//                                     >
//                                         <Image
//                                             src={img}
//                                             alt={`Ảnh ${i}`}
//                                             width={40}
//                                             height={40}
//                                             style={{
//                                                 objectFit: 'cover',
//                                                 borderRadius: 4,
//                                                 border: `1px solid ${token.colorBorderSecondary}`,
//                                             }}
//                                             placeholder={
//                                                 <div
//                                                     className="flex items-center justify-center"
//                                                     style={{
//                                                         width: 40,
//                                                         height: 40,
//                                                         background: token.colorBgContainer,
//                                                     }}
//                                                 >
//                                                     <Spin size="small" />
//                                                 </div>
//                                             }
//                                         />
//                                     </div>
//                                 ))}
//                             </Image.PreviewGroup>
//                             {images.length > 3 && (
//                                 <Tooltip title="Xem tất cả ảnh">
//                                     <Button
//                                         size="small"
//                                         type="default"
//                                         onClick={() =>
//                                             handleViewDetail(
//                                                 listAchievements.find((achievement) => achievement.hinhanh === images),
//                                             )
//                                         }
//                                         icon={<EyeOutlined />}
//                                         style={{ borderRadius: '4px' }}
//                                     >
//                                         +{images.length - 3}
//                                     </Button>
//                                 </Tooltip>
//                             )}
//                         </>
//                     ) : (
//                         <Tag icon={<FileImageOutlined />} color="default">
//                             Không có ảnh
//                         </Tag>
//                     )}
//                 </div>
//             ),
//             width: 180,
//         },
//         {
//             title: 'Thao tác',
//             key: 'action',
//             width: 150,
//             fixed: 'right',
//             render: (record) => (
//                 <Space>
//                     <Tooltip title="Xem chi tiết">
//                         <Button
//                             type="text"
//                             icon={<EyeOutlined />}
//                             onClick={() => handleViewDetail(record)}
//                             style={{ color: token.colorPrimary }}
//                         />
//                     </Tooltip>
//                     <Tooltip title="Chỉnh sửa">
//                         <Button
//                             type="text"
//                             icon={<EditOutlined />}
//                             onClick={() => handleShowEdit(record)}
//                             style={{ color: token.colorWarning }}
//                         />
//                     </Tooltip>
//                     <Popconfirm
//                         title="Xóa thành tích"
//                         description="Bạn có chắc muốn xóa thành tích này không?"
//                         icon={<ExclamationCircleOutlined style={{ color: token.colorError }} />}
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

//     const renderCardView = () => {
//         return (
//             <div>
//                 {loading ? (
//                     <Row gutter={[16, 16]}>
//                         {[1, 2, 3, 4, 5, 6].map((i) => (
//                             <Col key={i} xs={24} sm={12} md={8} lg={6}>
//                                 <Card hoverable>
//                                     <Skeleton active avatar paragraph={{ rows: 3 }} />
//                                 </Card>
//                             </Col>
//                         ))}
//                     </Row>
//                 ) : filteredData.length > 0 ? (
//                     <Row gutter={[16, 16]}>
//                         {filteredData.map((item) => (
//                             <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
//                                 <Card
//                                     hoverable
//                                     className="achievement-card"
//                                     cover={
//                                         item.hinhanh && item.hinhanh.length > 0 ? (
//                                             <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
//                                                 <img
//                                                     alt={item.ten}
//                                                     src={item.hinhanh[0]}
//                                                     style={{
//                                                         width: '100%',
//                                                         height: '100%',
//                                                         objectFit: 'cover',
//                                                         transition: 'transform 0.3s ease',
//                                                     }}
//                                                     className="hover:scale-110"
//                                                 />
//                                                 {item.hinhanh.length > 1 && (
//                                                     <Badge
//                                                         count={`+${item.hinhanh.length - 1}`}
//                                                         style={{
//                                                             position: 'absolute',
//                                                             top: 12,
//                                                             right: 12,
//                                                             background: token.colorPrimary,
//                                                         }}
//                                                     />
//                                                 )}
//                                             </div>
//                                         ) : (
//                                             <div
//                                                 style={{
//                                                     height: 180,
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     justifyContent: 'center',
//                                                     background: token.colorBgLayout,
//                                                 }}
//                                             >
//                                                 <TrophyOutlined style={{ fontSize: 48, color: 'gold' }} />
//                                             </div>
//                                         )
//                                     }
//                                     actions={[
//                                         <Tooltip title="Xem chi tiết">
//                                             <EyeOutlined key="view" onClick={() => handleViewDetail(item)} />
//                                         </Tooltip>,
//                                         <Tooltip title="Chỉnh sửa">
//                                             <EditOutlined key="edit" onClick={() => handleShowEdit(item)} />
//                                         </Tooltip>,
//                                         <Popconfirm
//                                             title="Bạn có chắc muốn xóa?"
//                                             onConfirm={() => handleDelete(item._id)}
//                                             okText="Xóa"
//                                             cancelText="Hủy"
//                                         >
//                                             <DeleteOutlined key="delete" />
//                                         </Popconfirm>,
//                                     ]}
//                                 >
//                                     <div className="mb-3 flex items-center gap-2">
//                                         <Avatar
//                                             src={item.nhanvien_id?.avatar}
//                                             icon={!item.nhanvien_id?.avatar && <UserOutlined />}
//                                             style={{
//                                                 backgroundColor: item.nhanvien_id?.avatar
//                                                     ? 'transparent'
//                                                     : token.colorPrimary,
//                                                 boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                                             }}
//                                         />
//                                         <div>
//                                             <Text strong>{item.nhanvien_id?.hoten}</Text>
//                                             <div>
//                                                 <Text type="secondary" style={{ fontSize: '12px' }}>
//                                                     {item.nhanvien_id?.phongban_id?.tenphong || 'Chưa phân phòng'}
//                                                 </Text>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="mb-2">
//                                         <Space>
//                                             <TrophyOutlined style={{ color: 'gold' }} />
//                                             <Text strong>{item.ten}</Text>
//                                         </Space>
//                                     </div>
//                                     <Text type="secondary" ellipsis={{ rows: 2 }}>
//                                         {item.mota || 'Không có mô tả'}
//                                     </Text>
//                                     <div className="mt-3">
//                                         <Space>
//                                             <CalendarOutlined style={{ color: token.colorPrimary }} />
//                                             <Text type="secondary">
//                                                 {moment(item.ngaykhen || item.createdAt).format('DD/MM/YYYY')}
//                                             </Text>
//                                         </Space>
//                                     </div>
//                                 </Card>
//                             </Col>
//                         ))}
//                     </Row>
//                 ) : (
//                     <Empty description="Không tìm thấy thành tích nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
//                 )}
//             </div>
//         );
//     };

//     // Hiển thị thống kê
//     const renderStatistics = () => {
//         const departmentData = Object.entries(achievementStats.byDepartment).map(([name, value]) => ({
//             name,
//             value,
//         }));

//         const monthData = Object.entries(achievementStats.byMonth)
//             .sort((a, b) => {
//                 const [monthA, yearA] = a[0].split('/');
//                 const [monthB, yearB] = b[0].split('/');
//                 return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
//             })
//             .slice(-6)
//             .map(([name, value]) => ({
//                 name,
//                 value,
//             }));

//         return (
//             <div>
//                 <Row gutter={[16, 16]}>
//                     <Col xs={24} sm={12} md={8} lg={6}>
//                         <Card>
//                             <Statistic
//                                 title="Tổng số thành tích"
//                                 value={achievementStats.total}
//                                 prefix={<TrophyOutlined style={{ color: 'gold' }} />}
//                                 valueStyle={{ color: token.colorPrimary }}
//                             />
//                             <div style={{ marginTop: 16 }}>
//                                 <Text type="secondary">Người dùng đã thêm {achievementStats.total} thành tích</Text>
//                             </div>
//                         </Card>
//                     </Col>

//                     <Col xs={24} sm={12} md={8} lg={6}>
//                         <Card>
//                             <Statistic
//                                 title="Thành tích tháng này"
//                                 value={achievementStats.byMonth[moment().format('MM/YYYY')] || 0}
//                                 prefix={<CalendarOutlined style={{ color: token.colorSuccess }} />}
//                                 valueStyle={{ color: token.colorSuccess }}
//                             />
//                             <div style={{ marginTop: 16 }}>
//                                 <Progress
//                                     percent={
//                                         Math.round(
//                                             ((achievementStats.byMonth[moment().format('MM/YYYY')] || 0) /
//                                                 achievementStats.total) *
//                                                 100,
//                                         ) || 0
//                                     }
//                                     size="small"
//                                     status="active"
//                                 />
//                             </div>
//                         </Card>
//                     </Col>

//                     <Col xs={24} sm={12} md={8} lg={6}>
//                         <Card>
//                             <Statistic
//                                 title="Nhân viên có thành tích"
//                                 value={
//                                     Object.keys(
//                                         achievementStats.topEmployees.reduce((acc, emp) => {
//                                             acc[emp.name] = true;
//                                             return acc;
//                                         }, {}),
//                                     ).length
//                                 }
//                                 prefix={<UserOutlined style={{ color: token.colorInfo }} />}
//                                 valueStyle={{ color: token.colorInfo }}
//                             />
//                             <div style={{ marginTop: 16 }}>
//                                 <Text type="secondary">
//                                     {Math.round(
//                                         (Object.keys(
//                                             achievementStats.topEmployees.reduce((acc, emp) => {
//                                                 acc[emp.name] = true;
//                                                 return acc;
//                                             }, {}),
//                                         ).length /
//                                             listStaff.length) *
//                                             100,
//                                     ) || 0}
//                                     % tổng số nhân viên
//                                 </Text>
//                             </div>
//                         </Card>
//                     </Col>

//                     <Col xs={24} sm={12} md={8} lg={6}>
//                         <Card>
//                             <Statistic
//                                 title="Số phòng ban có thành tích"
//                                 value={Object.keys(achievementStats.byDepartment).length}
//                                 prefix={<TeamOutlined style={{ color: token.colorWarning }} />}
//                                 valueStyle={{ color: token.colorWarning }}
//                             />
//                             <div style={{ marginTop: 16 }}>
//                                 <Button type="link" size="small">
//                                     Xem chi tiết phòng ban
//                                 </Button>
//                             </div>
//                         </Card>
//                     </Col>
//                 </Row>

//                 <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
//                     <Col xs={24} lg={12}>
//                         <Card
//                             title={
//                                 <Space>
//                                     <BarChartOutlined />
//                                     <span>Thành tích theo phòng ban</span>
//                                 </Space>
//                             }
//                             className="statistic-card"
//                         >
//                             {departmentData.map((dept, index) => (
//                                 <div key={index} style={{ marginBottom: 12 }}>
//                                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                         <Text>{dept.name}</Text>
//                                         <Text strong>{dept.value}</Text>
//                                     </div>
//                                     <Progress
//                                         percent={Math.round((dept.value / achievementStats.total) * 100)}
//                                         showInfo={false}
//                                         strokeColor={index % 2 === 0 ? token.colorPrimary : token.colorSuccess}
//                                     />
//                                 </div>
//                             ))}
//                         </Card>
//                     </Col>

//                     <Col xs={24} lg={12}>
//                         <Card
//                             title={
//                                 <Space>
//                                     <StarOutlined />
//                                     <span>Nhân viên xuất sắc</span>
//                                 </Space>
//                             }
//                             className="statistic-card"
//                         >
//                             {achievementStats.topEmployees.slice(0, 5).map((employee, index) => (
//                                 <div
//                                     key={index}
//                                     style={{
//                                         marginBottom: 12,
//                                         padding: '8px',
//                                         backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
//                                         borderRadius: '6px',
//                                     }}
//                                 >
//                                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                                         <Avatar
//                                             src={employee.avatar}
//                                             icon={!employee.avatar && <UserOutlined />}
//                                             style={{
//                                                 marginRight: 12,
//                                                 backgroundColor: employee.avatar ? 'transparent' : token.colorPrimary,
//                                             }}
//                                         />
//                                         <div style={{ flex: 1 }}>
//                                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                                 <Text strong>{employee.name}</Text>
//                                                 <Badge
//                                                     count={employee.count}
//                                                     style={{
//                                                         backgroundColor: index === 0 ? '#FFD700' : token.colorPrimary,
//                                                     }}
//                                                 />
//                                             </div>
//                                             <Text type="secondary" style={{ fontSize: '12px' }}>
//                                                 {employee.position ? `${employee.position}` : ''}
//                                                 {employee.position && employee.department ? ' - ' : ''}
//                                                 {employee.department || 'Chưa phân phòng'}
//                                             </Text>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </Card>
//                     </Col>
//                 </Row>

//                 <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
//                     <Col span={24}>
//                         <Card
//                             title={
//                                 <Space>
//                                     <CalendarOutlined />
//                                     <span>Biểu đồ thành tích theo tháng</span>
//                                 </Space>
//                             }
//                             className="statistic-card"
//                         >
//                             <div style={{ display: 'flex', height: '200px', alignItems: 'flex-end' }}>
//                                 {monthData.map((month, index) => (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             flex: 1,
//                                             padding: '0 4px',
//                                             display: 'flex',
//                                             flexDirection: 'column',
//                                             alignItems: 'center',
//                                             justifyContent: 'flex-end',
//                                             height: '100%',
//                                         }}
//                                     >
//                                         <div
//                                             style={{
//                                                 height: `${
//                                                     (month.value / Math.max(...monthData.map((m) => m.value))) * 80
//                                                 }%`,
//                                                 width: '100%',
//                                                 backgroundColor:
//                                                     month.name === moment().format('MM/YYYY')
//                                                         ? token.colorPrimary
//                                                         : token.colorPrimaryBg,
//                                                 borderTopLeftRadius: '4px',
//                                                 borderTopRightRadius: '4px',
//                                                 position: 'relative',
//                                                 minHeight: '20px',
//                                                 cursor: 'pointer',
//                                                 transition: 'all 0.3s',
//                                             }}
//                                             className="chart-bar"
//                                         >
//                                             <div
//                                                 style={{
//                                                     position: 'absolute',
//                                                     bottom: '100%',
//                                                     left: '50%',
//                                                     transform: 'translateX(-50%)',
//                                                     fontWeight: 'bold',
//                                                     color: token.colorText,
//                                                 }}
//                                             >
//                                                 {month.value}
//                                             </div>
//                                         </div>
//                                         <div style={{ marginTop: '8px', fontSize: '12px', textAlign: 'center' }}>
//                                             {month.name}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </Card>
//                     </Col>
//                 </Row>
//             </div>
//         );
//     };

//     const renderContent = () => {
//         if (activeSection === 'statistics') {
//             return renderStatistics();
//         }

//         // Phần thành tích
//         return (
//             <>
//                 <Tabs activeKey={activeTab} onChange={handleTabChange} type="card" className="custom-tabs">
//                     <TabPane
//                         tab={
//                             <span>
//                                 <AppstoreOutlined /> Tất cả thành tích
//                             </span>
//                         }
//                         key="all"
//                     />
//                     <TabPane
//                         tab={
//                             <span>
//                                 <ClockCircleOutlined /> Thành tích gần đây
//                             </span>
//                         }
//                         key="recent"
//                     />
//                 </Tabs>

//                 {activeTab === 'recent' && (
//                     <Alert
//                         message="Thành tích trong 30 ngày gần đây"
//                         type="info"
//                         showIcon
//                         style={{ marginBottom: '16px' }}
//                     />
//                 )}

//                 {activeTab === 'top' && (
//                     <Alert
//                         message="Thành tích xuất sắc nhất"
//                         type="success"
//                         showIcon
//                         style={{ marginBottom: '16px' }}
//                     />
//                 )}

//                 {viewType === 'table' ? (
//                     <Table
//                         columns={columns}
//                         dataSource={filteredData}
//                         rowKey="_id"
//                         loading={loading}
//                         scroll={{ x: 'max-content' }}
//                         pagination={{
//                             pageSize: 10,
//                             showSizeChanger: true,
//                             pageSizeOptions: ['10', '20', '50'],
//                             showTotal: (total) => `Tổng cộng ${total} thành tích`,
//                             position: ['bottomCenter'],
//                         }}
//                         bordered
//                         locale={{
//                             emptyText: <Empty description="Không có dữ liệu thành tích" />,
//                         }}
//                         rowClassName={(record) => {
//                             // Làm nổi bật thành tích mới trong 7 ngày gần đây
//                             return moment(record.createdAt).isAfter(moment().subtract(7, 'days'))
//                                 ? 'highlight-row'
//                                 : '';
//                         }}
//                     />
//                 ) : (
//                     renderCardView()
//                 )}
//             </>
//         );
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen p-6 achievement-management">
//             <Card
//                 bordered={false}
//                 className="main-card"
//                 style={{
//                     boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1)',
//                 }}
//             >
//                 <div className="mb-4">
//                     <Breadcrumb
//                         items={[
//                             { title: <HomeOutlined /> },
//                             { title: 'Quản lý nhân sự' },
//                             { title: 'Quản lý thành tích' },
//                         ]}
//                     />
//                 </div>

//                 <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
//                     <div>
//                         <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
//                             <TrophyOutlined style={{ color: 'gold', fontSize: '28px' }} />
//                             Quản lý thành tích
//                         </Title>
//                         <Text type="secondary">Quản lý danh hiệu và thành tích của nhân viên</Text>
//                     </div>
//                     <div>
//                         <Space wrap>
//                             <Button
//                                 type={activeSection === 'achievements' ? 'primary' : 'default'}
//                                 icon={<TrophyOutlined />}
//                                 onClick={() => setActiveSection('achievements')}
//                             >
//                                 Thành tích
//                             </Button>
//                             <Button
//                                 type={activeSection === 'statistics' ? 'primary' : 'default'}
//                                 icon={<BarChartOutlined />}
//                                 onClick={() => setActiveSection('statistics')}
//                             >
//                                 Thống kê
//                             </Button>
//                             <Button
//                                 type="primary"
//                                 icon={<PlusOutlined />}
//                                 onClick={handleShowAdd}
//                                 style={{
//                                     backgroundColor: token.colorSuccess,
//                                     boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
//                                 }}
//                             >
//                                 Thêm thành tích mới
//                             </Button>
//                         </Space>
//                     </div>
//                 </div>

//                 <Divider style={{ margin: '16px 0' }} />

//                 <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
//                     <Space wrap>
//                         <Input.Search
//                             placeholder="Tìm kiếm thành tích..."
//                             allowClear
//                             enterButton={<SearchOutlined />}
//                             onSearch={(value) => setSearchText(value)}
//                             onChange={(e) => setSearchText(e.target.value)}
//                             style={{ width: 250 }}
//                         />
//                         {activeSection === 'achievements' && (
//                             <>
//                                 <Select
//                                     placeholder="Lọc theo nhân viên"
//                                     allowClear
//                                     style={{ width: 200 }}
//                                     onChange={(value) => setStaffFilter(value)}
//                                     showSearch
//                                     optionFilterProp="children"
//                                     filterOption={(input, option) =>
//                                         (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
//                                     }
//                                 >
//                                     {listStaff.map((staff) => (
//                                         <Option key={staff._id} value={staff._id}>
//                                             {staff.hoten}
//                                         </Option>
//                                     ))}
//                                 </Select>
//                                 <DatePicker
//                                     placeholder="Lọc theo tháng"
//                                     picker="month"
//                                     allowClear
//                                     onChange={setDateFilter}
//                                     format="MM/YYYY"
//                                 />
//                                 <Tooltip title="Xóa bộ lọc">
//                                     <Button
//                                         icon={<FilterOutlined />}
//                                         onClick={() => {
//                                             setStaffFilter(null);
//                                             setDateFilter(null);
//                                             setSearchText('');
//                                         }}
//                                     >
//                                         Xóa lọc
//                                     </Button>
//                                 </Tooltip>
//                             </>
//                         )}
//                     </Space>

//                     {activeSection === 'achievements' && (
//                         <Space wrap style={{ position: 'absolute' }}>
//                             <Tooltip title="Làm mới dữ liệu">
//                                 <Button icon={<ReloadOutlined />} onClick={fetchAllAchievements} />
//                             </Tooltip>
//                             <Segmented
//                                 options={[
//                                     {
//                                         value: 'table',
//                                         icon: <SortAscendingOutlined />,
//                                         label: 'Dạng bảng',
//                                     },
//                                     {
//                                         value: 'card',
//                                         icon: <AppstoreOutlined />,
//                                         label: 'Dạng thẻ',
//                                     },
//                                 ]}
//                                 value={viewType}
//                                 onChange={handleViewTypeChange}
//                             />
//                         </Space>
//                     )}
//                 </div>

//                 {renderContent()}

//                 {/* Form Modal */}
//                 <Modal
//                     title={
//                         <Space>
//                             {selected ? <EditOutlined /> : <PlusOutlined />}
//                             <span>{selected ? 'Chỉnh sửa thành tích' : 'Thêm thành tích mới'}</span>
//                         </Space>
//                     }
//                     open={showModal}
//                     onCancel={() => setShowModal(false)}
//                     footer={[
//                         <Button key="cancel" onClick={() => setShowModal(false)}>
//                             Hủy
//                         </Button>,
//                         <Button key="submit" type="primary" loading={submitLoading} onClick={handleSubmit}>
//                             {selected ? 'Cập nhật' : 'Tạo mới'}
//                         </Button>,
//                     ]}
//                     width={700}
//                     destroyOnClose
//                 >
//                     <Form layout="vertical" form={form}>
//                         <Row gutter={16}>
//                             <Col span={12}>
//                                 <Form.Item
//                                     name="nhanvien_id"
//                                     label="Nhân viên"
//                                     rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
//                                 >
//                                     <Select
//                                         placeholder="-- Chọn nhân viên --"
//                                         showSearch
//                                         optionFilterProp="children"
//                                         filterOption={(input, option) =>
//                                             (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
//                                         }
//                                     >
//                                         {listStaff.map((nv) => (
//                                             <Option key={nv._id} value={nv._id}>
//                                                 <Space>
//                                                     <Avatar
//                                                         size="small"
//                                                         src={nv.avatar}
//                                                         icon={!nv.avatar && <UserOutlined />}
//                                                     />
//                                                     {nv.hoten}
//                                                 </Space>
//                                             </Option>
//                                         ))}
//                                     </Select>
//                                 </Form.Item>
//                             </Col>
//                         </Row>

//                         <Form.Item
//                             name="ten"
//                             label="Tên thành tích"
//                             rules={[{ required: true, message: 'Vui lòng nhập tên thành tích' }]}
//                         >
//                             <Input
//                                 placeholder="Nhập tên danh hiệu hoặc thành tích"
//                                 maxLength={100}
//                                 showCount
//                                 prefix={<TrophyOutlined style={{ color: 'gold' }} />}
//                             />
//                         </Form.Item>

//                         <Form.Item name="mota" label="Mô tả" extra="Mô tả chi tiết về thành tích, lý do khen thưởng">
//                             <TextArea
//                                 rows={4}
//                                 placeholder="Nhập mô tả chi tiết về thành tích"
//                                 maxLength={500}
//                                 showCount
//                             />
//                         </Form.Item>

//                         <Form.Item label="Hình ảnh">
//                             {oldImages.length > 0 && (
//                                 <div className="mb-4">
//                                     <Text strong>Ảnh hiện tại:</Text>
//                                     <div className="flex gap-2 mt-2 flex-wrap">
//                                         {oldImages.map((img, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="relative border border-gray-200 rounded-md p-1"
//                                                 style={{
//                                                     width: 104,
//                                                     height: 104,
//                                                     position: 'relative',
//                                                     border: `1px solid ${token.colorBorderSecondary}`,
//                                                     borderRadius: '8px',
//                                                     overflow: 'hidden',
//                                                 }}
//                                             >
//                                                 <img
//                                                     src={img}
//                                                     alt="preview"
//                                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                                                 />
//                                                 <Button
//                                                     type="primary"
//                                                     danger
//                                                     size="small"
//                                                     shape="circle"
//                                                     icon={<DeleteOutlined />}
//                                                     style={{
//                                                         position: 'absolute',
//                                                         top: -10,
//                                                         right: -10,
//                                                         opacity: 0.8,
//                                                     }}
//                                                     onClick={() => {
//                                                         setOldImages(oldImages.filter((_, i) => i !== index));
//                                                         setRemovedOldImages([...removedOldImages, img]);
//                                                     }}
//                                                 />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             <Upload
//                                 listType="picture-card"
//                                 fileList={fileList}
//                                 beforeUpload={() => false}
//                                 onChange={({ fileList: newFileList }) => setFileList(newFileList)}
//                                 multiple
//                                 accept="image/*"
//                                 maxCount={10}
//                             >
//                                 <div>
//                                     <PlusOutlined />
//                                     <div style={{ marginTop: 8 }}>Tải lên</div>
//                                 </div>
//                             </Upload>
//                             <Text type="secondary">
//                                 <InfoCircleOutlined style={{ marginRight: '4px' }} />
//                                 Có thể tải lên tối đa 10 ảnh. Hỗ trợ định dạng: JPG, PNG, GIF
//                             </Text>
//                         </Form.Item>
//                     </Form>
//                 </Modal>

//                 {/* Detail Drawer */}
//                 <Drawer
//                     title={
//                         <Space>
//                             <TrophyOutlined style={{ color: 'gold' }} />
//                             <span>Chi tiết thành tích</span>
//                         </Space>
//                     }
//                     width={640}
//                     placement="right"
//                     onClose={() => setShowDetail(false)}
//                     open={showDetail}
//                     extra={
//                         <Space>
//                             <Button onClick={() => setShowDetail(false)}>Đóng</Button>
//                             {detailItem && (
//                                 <Button
//                                     type="primary"
//                                     icon={<EditOutlined />}
//                                     onClick={() => {
//                                         setShowDetail(false);
//                                         handleShowEdit(detailItem);
//                                     }}
//                                 >
//                                     Chỉnh sửa
//                                 </Button>
//                             )}
//                         </Space>
//                     }
//                 >
//                     {detailItem && (
//                         <>
//                             <div className="mb-6">
//                                 <div className="flex items-center mb-4">
//                                     <Avatar
//                                         size={64}
//                                         src={detailItem.nhanvien_id?.avatar}
//                                         icon={!detailItem.nhanvien_id?.avatar && <UserOutlined />}
//                                         style={{
//                                             backgroundColor: detailItem.nhanvien_id?.avatar
//                                                 ? 'transparent'
//                                                 : token.colorPrimary,
//                                             boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
//                                         }}
//                                     />
//                                     <div className="ml-4">
//                                         <Title level={4} style={{ margin: 0 }}>
//                                             {detailItem.nhanvien_id?.hoten}
//                                         </Title>
//                                         <Text type="secondary">
//                                             {detailItem.nhanvien_id?.chucvu && `${detailItem.nhanvien_id.chucvu} - `}
//                                             {detailItem.nhanvien_id?.phongban_id?.tenphong || 'Không có phòng ban'}
//                                         </Text>
//                                     </div>
//                                 </div>

//                                 <Card
//                                     title={
//                                         <Space>
//                                             <FileTextOutlined />
//                                             <span>Thông tin thành tích</span>
//                                         </Space>
//                                     }
//                                     className="mb-4"
//                                     bordered={false}
//                                     style={{ backgroundColor: token.colorBgLayout }}
//                                 >
//                                     <div className="mb-4">
//                                         <Badge.Ribbon text="Thành tích" color="gold">
//                                             <div
//                                                 style={{
//                                                     padding: '16px',
//                                                     backgroundColor: 'white',
//                                                     borderRadius: '8px',
//                                                     marginTop: '14px',
//                                                 }}
//                                             >
//                                                 <div className="mb-3">
//                                                     <Text type="secondary">Danh hiệu/Thành tích:</Text>
//                                                     <div>
//                                                         <Space>
//                                                             <TrophyOutlined style={{ color: 'gold' }} />
//                                                             <Text strong>{detailItem.ten}</Text>
//                                                         </Space>
//                                                     </div>
//                                                 </div>

//                                                 <div>
//                                                     <Text type="secondary">Mô tả:</Text>
//                                                     <div
//                                                         style={{
//                                                             backgroundColor: token.colorBgContainerDisabled,
//                                                             padding: '12px',
//                                                             borderRadius: '4px',
//                                                             marginTop: '8px',
//                                                         }}
//                                                     >
//                                                         {detailItem.mota ? (
//                                                             <p style={{ whiteSpace: 'pre-line', margin: 0 }}>
//                                                                 {detailItem.mota}
//                                                             </p>
//                                                         ) : (
//                                                             <Text type="secondary" italic>
//                                                                 Không có mô tả
//                                                             </Text>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </Badge.Ribbon>
//                                     </div>
//                                 </Card>

//                                 <Card
//                                     title={
//                                         <Space>
//                                             <PictureFilled />
//                                             <span>Hình ảnh</span>
//                                         </Space>
//                                     }
//                                     className="mb-4"
//                                     bordered={false}
//                                     style={{ backgroundColor: token.colorBgLayout }}
//                                 >
//                                     {detailItem.hinhanh && detailItem.hinhanh.length > 0 ? (
//                                         <Image.PreviewGroup>
//                                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                                                 {detailItem.hinhanh.map((img, index) => (
//                                                     <div
//                                                         key={index}
//                                                         className="cursor-pointer"
//                                                         style={{
//                                                             borderRadius: '8px',
//                                                             overflow: 'hidden',
//                                                             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                                                         }}
//                                                     >
//                                                         <Image
//                                                             src={img}
//                                                             alt={`Ảnh ${index + 1}`}
//                                                             style={{
//                                                                 objectFit: 'cover',
//                                                                 height: 120,
//                                                                 transition: 'transform 0.3s ease',
//                                                             }}
//                                                             className="hover:scale-110"
//                                                             preview={{
//                                                                 mask: (
//                                                                     <div
//                                                                         style={{
//                                                                             display: 'flex',
//                                                                             alignItems: 'center',
//                                                                         }}
//                                                                     >
//                                                                         <EyeOutlined style={{ marginRight: 4 }} /> Xem
//                                                                     </div>
//                                                                 ),
//                                                             }}
//                                                         />
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </Image.PreviewGroup>
//                                     ) : (
//                                         <Empty description="Không có hình ảnh" image={Empty.PRESENTED_IMAGE_SIMPLE} />
//                                     )}
//                                 </Card>

//                                 <Card
//                                     title={
//                                         <Space>
//                                             <ClockCircleOutlined />
//                                             <span>Lịch sử</span>
//                                         </Space>
//                                     }
//                                     bordered={false}
//                                     style={{ backgroundColor: token.colorBgLayout }}
//                                 >
//                                     <Timeline
//                                         items={[
//                                             {
//                                                 children: (
//                                                     <div>
//                                                         <Text strong>Thêm thành tích</Text>
//                                                         <div>
//                                                             <Text type="secondary">
//                                                                 {moment(detailItem.createdAt).format(
//                                                                     'DD/MM/YYYY HH:mm',
//                                                                 )}
//                                                             </Text>
//                                                         </div>
//                                                     </div>
//                                                 ),
//                                                 color: 'green',
//                                                 dot: <CheckCircleOutlined />,
//                                             },
//                                             {
//                                                 children: (
//                                                     <div>
//                                                         <Text strong>Cập nhật gần nhất</Text>
//                                                         <div>
//                                                             <Text type="secondary">
//                                                                 {moment(
//                                                                     detailItem.updatedAt || detailItem.createdAt,
//                                                                 ).format('DD/MM/YYYY HH:mm')}
//                                                             </Text>
//                                                         </div>
//                                                     </div>
//                                                 ),
//                                                 color: 'blue',
//                                                 dot: detailItem.updatedAt ? <EditOutlined /> : <CheckCircleOutlined />,
//                                             },
//                                         ]}
//                                     />
//                                 </Card>
//                             </div>
//                         </>
//                     )}
//                 </Drawer>

//                 {/* Image Preview Modal */}
//                 <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
//                     <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
//                 </Modal>
//             </Card>

//             <style jsx global>{`
//                 .achievement-management .main-card {
//                     border-radius: 8px;
//                 }

//                 .achievement-card {
//                     height: 100%;
//                     display: flex;
//                     flex-direction: column;
//                     transition: all 0.3s ease;
//                     border-radius: 8px;
//                     overflow: hidden;
//                 }

//                 .achievement-card:hover {
//                     transform: translateY(-5px);
//                     box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
//                 }

//                 .custom-tabs .ant-tabs-nav {
//                     margin-bottom: 16px;
//                 }

//                 .highlight-row {
//                     background-color: rgba(24, 144, 255, 0.05);
//                 }

//                 .chart-bar:hover {
//                     opacity: 0.8;
//                     transform: scaleY(1.05);
//                 }

//                 .statistic-card .ant-card-head {
//                     border-bottom-color: rgba(0, 0, 0, 0.06);
//                     background-color: rgba(0, 0, 0, 0.02);
//                 }

//                 @media (max-width: 576px) {
//                     .achievement-management {
//                         padding: 8px;
//                     }

//                     .main-card .ant-card-body {
//                         padding: 16px 8px;
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// }

// // Thêm icon thiếu
// const AppstoreOutlined = () => (
//     <svg
//         viewBox="64 64 896 896"
//         focusable="false"
//         data-icon="appstore"
//         width="1em"
//         height="1em"
//         fill="currentColor"
//         aria-hidden="true"
//     >
//         <path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path>
//     </svg>
// );

import { useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Form,
    Input,
    Upload,
    Table,
    Popconfirm,
    message,
    Select,
    Card,
    Typography,
    Space,
    Tag,
    Badge,
    Avatar,
    Divider,
    Empty,
    Skeleton,
    Image,
    Tooltip,
    Spin,
    Row,
    Col,
    Segmented,
    Drawer,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TrophyOutlined,
    UserOutlined,
    CalendarOutlined,
    FileImageOutlined,
    EyeOutlined,
    SortAscendingOutlined,
    ReloadOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { apiGetAllThanhTich, apiCreateThanhTich, apiUpdateThanhTich, apiDeleteThanhTich } from '../../apis/Thanhtich';
import { apiGetAllUser } from '../../apis/staff';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function ManageAchievements() {
    const [listAchievements, setListAchievements] = useState([]);
    const [listStaff, setListStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [oldImages, setOldImages] = useState([]);
    const [removedOldImages, setRemovedOldImages] = useState([]);
    const [viewType, setViewType] = useState('table');
    const [searchText, setSearchText] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [detailItem, setDetailItem] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [staffFilter, setStaffFilter] = useState(null);

    const fetchAllAchievements = async () => {
        try {
            setLoading(true);
            const res = await apiGetAllThanhTich();
            setListAchievements(res?.data || []);
        } catch (err) {
            message.error('Lỗi khi lấy danh sách thành tích');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await apiGetAllUser();
            setListStaff(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            message.error('Lỗi khi lấy danh sách nhân viên');
        }
    };

    useEffect(() => {
        fetchAllAchievements();
        fetchAllUsers();
    }, []);

    const handleShowAdd = () => {
        setSelected(null);
        form.resetFields();
        setFileList([]);
        setOldImages([]);
        setRemovedOldImages([]);
        setShowModal(true);
    };

    const handleShowEdit = (record) => {
        setSelected(record);
        form.setFieldsValue({
            nhanvien_id: record?.nhanvien_id?._id,
            ten: record.ten,
            mota: record.mota,
        });
        setFileList([]);
        setOldImages(record.hinhanh || []);
        setRemovedOldImages([]);
        setShowModal(true);
    };

    const handleViewDetail = (record) => {
        setDetailItem(record);
        setShowDetail(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('nhanvien_id', values.nhanvien_id);
            formData.append('ten', values.ten);
            formData.append('mota', values.mota);
            formData.append('removedImages', JSON.stringify(removedOldImages));

            fileList.forEach((file) => {
                formData.append('hinhanh', file.originFileObj);
            });

            setSubmitLoading(true);
            const loadingMessage = selected
                ? message.loading('Đang cập nhật thành tích...', 0)
                : message.loading('Đang tạo thành tích mới...', 0);

            if (selected) {
                await apiUpdateThanhTich(selected._id, formData);
                message.success('Cập nhật thành tích thành công');
            } else {
                await apiCreateThanhTich(formData);
                message.success('Tạo thành tích mới thành công');
            }

            loadingMessage();
            setShowModal(false);
            fetchAllAchievements();
        } catch (err) {
            console.error(err);
            message.error('Đã xảy ra lỗi khi lưu dữ liệu thành tích');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const loadingMessage = message.loading('Đang xóa thành tích...', 0);
            await apiDeleteThanhTich(id);
            loadingMessage();
            message.success('Xóa thành tích thành công');
            fetchAllAchievements();
        } catch (err) {
            message.error('Xóa thành tích thất bại');
        }
    };

    const handlePreview = (imageUrl) => {
        setPreviewImage(imageUrl);
        setPreviewVisible(true);
    };

    const getFilteredData = () => {
        return listAchievements.filter((item) => {
            const matchesSearch =
                (item.ten && item.ten.toLowerCase().includes(searchText.toLowerCase())) ||
                (item.mota && item.mota.toLowerCase().includes(searchText.toLowerCase())) ||
                (item.nhanvien_id?.hoten && item.nhanvien_id.hoten.toLowerCase().includes(searchText.toLowerCase()));

            const matchesStaffFilter = staffFilter ? item.nhanvien_id?._id === staffFilter : true;

            return matchesSearch && matchesStaffFilter;
        });
    };

    const filteredData = getFilteredData();

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: ['nhanvien_id', 'hoten'],
            key: 'nhanvien_id',
            render: (text, record) => (
                <Space>
                    <Avatar
                        src={record.nhanvien_id?.avatar}
                        icon={!record.nhanvien_id?.avatar && <UserOutlined />}
                        style={{ backgroundColor: record.nhanvien_id?.avatar ? 'transparent' : '#1890ff' }}
                    />
                    <Text strong>{text || 'N/A'}</Text>
                </Space>
            ),
            filters: listStaff.map((staff) => ({ text: staff.hoten, value: staff._id })),
            onFilter: (value, record) => record.nhanvien_id?._id === value,
            sorter: (a, b) => {
                const nameA = a.nhanvien_id?.hoten || '';
                const nameB = b.nhanvien_id?.hoten || '';
                return nameA.localeCompare(nameB);
            },
        },
        {
            title: 'Danh hiệu',
            dataIndex: 'ten',
            key: 'ten',
            sorter: (a, b) => a.ten.localeCompare(b.ten),
            render: (text) => (
                <Space>
                    <TrophyOutlined style={{ color: 'gold' }} />
                    <Text>{text}</Text>
                </Space>
            ),
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
            title: 'Ngày khen thưởng',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => (
                <Space>
                    <CalendarOutlined />
                    <span>{moment(text).format('DD/MM/YYYY HH:mm')}</span>
                </Space>
            ),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'hinhanh',
            key: 'hinhanh',
            render: (images) => (
                <div className="flex gap-1 flex-wrap">
                    {images && images.length > 0 ? (
                        <>
                            <Image.PreviewGroup>
                                {images.slice(0, 3).map((img, i) => (
                                    <Image
                                        key={i}
                                        src={img}
                                        alt={`Ảnh ${i}`}
                                        width={40}
                                        height={40}
                                        style={{ objectFit: 'cover', borderRadius: 4 }}
                                        placeholder={
                                            <div
                                                className="flex items-center justify-center"
                                                style={{ width: 40, height: 40, background: '#f0f0f0' }}
                                            >
                                                <Spin size="small" />
                                            </div>
                                        }
                                    />
                                ))}
                            </Image.PreviewGroup>
                            {images.length > 3 && (
                                <Tooltip title="Xem tất cả ảnh">
                                    <Button
                                        size="small"
                                        type="dashed"
                                        onClick={() =>
                                            handleViewDetail(images.find((img) => img._id === images[0]._id))
                                        }
                                        icon={<EyeOutlined />}
                                    >
                                        +{images.length - 3}
                                    </Button>
                                </Tooltip>
                            )}
                        </>
                    ) : (
                        <Tag icon={<FileImageOutlined />} color="default">
                            Không có ảnh
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (record) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleShowEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa thành tích"
                        description="Bạn có chắc muốn xóa thành tích này không?"
                        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
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

    const renderCardView = () => {
        return (
            <div>
                {loading ? (
                    <Row gutter={[16, 16]}>
                        {[1, 2, 3, 4].map((i) => (
                            <Col key={i} xs={24} sm={12} md={8} lg={6}>
                                <Card>
                                    <Skeleton active avatar paragraph={{ rows: 3 }} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : filteredData.length > 0 ? (
                    <Row gutter={[16, 16]}>
                        {filteredData.map((item) => (
                            <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                                <Card
                                    hoverable
                                    className="achievement-card"
                                    cover={
                                        item.hinhanh && item.hinhanh.length > 0 ? (
                                            <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                                                <img
                                                    alt={item.ten}
                                                    src={item.hinhanh[0]}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                {item.hinhanh.length > 1 && (
                                                    <Badge
                                                        count={`+${item.hinhanh.length - 1}`}
                                                        style={{ position: 'absolute', top: 12, right: 12 }}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    height: 180,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#f5f5f5',
                                                }}
                                            >
                                                <FileImageOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                                            </div>
                                        )
                                    }
                                    actions={[
                                        <Tooltip title="Xem chi tiết">
                                            <EyeOutlined key="view" onClick={() => handleViewDetail(item)} />
                                        </Tooltip>,
                                        <Tooltip title="Chỉnh sửa">
                                            <EditOutlined key="edit" onClick={() => handleShowEdit(item)} />
                                        </Tooltip>,
                                        <Popconfirm
                                            title="Bạn có chắc muốn xóa?"
                                            onConfirm={() => handleDelete(item._id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <DeleteOutlined key="delete" />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <div className="mb-3 flex items-center gap-2">
                                        <Avatar
                                            src={item.nhanvien_id?.avatar}
                                            icon={!item.nhanvien_id?.avatar && <UserOutlined />}
                                        />
                                        <Text strong>{item.nhanvien_id?.hoten}</Text>
                                    </div>
                                    <div className="mb-2">
                                        <Space>
                                            <TrophyOutlined style={{ color: 'gold' }} />
                                            <Text strong>{item.ten}</Text>
                                        </Space>
                                    </div>
                                    <Text type="secondary" ellipsis={{ rows: 2 }}>
                                        {item.mota || 'Không có mô tả'}
                                    </Text>
                                    <div className="mt-3">
                                        <Space>
                                            <CalendarOutlined />
                                            <Text type="secondary">{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
                                        </Space>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty description="Không tìm thấy thành tích nào" />
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 card-container-achievement ">
            <Card>
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <div>
                        <Title level={4} style={{ margin: 0 }}>
                            <TrophyOutlined style={{ color: 'gold', marginRight: 8 }} />
                            Quản lý thành tích
                        </Title>
                        <Text type="secondary">Quản lý danh hiệu và thành tích của nhân viên</Text>
                    </div>
                    <Space wrap>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleShowAdd}>
                            Thêm thành tích mới
                        </Button>
                    </Space>
                </div>

                <Divider />

                <div className=" flex items-center justify-between flex-wrap gap-2">
                    <Space wrap>
                        <Input.Search
                            placeholder="Tìm kiếm theo tên, mô tả..."
                            allowClear
                            onSearch={(value) => setSearchText(value)}
                            style={{ width: 250 }}
                        />
                        <Select
                            placeholder="Lọc theo nhân viên"
                            allowClear
                            style={{ width: 200 }}
                            onChange={(value) => setStaffFilter(value)}
                        >
                            {listStaff.map((staff) => (
                                <Option key={staff._id} value={staff._id}>
                                    {staff.hoten}
                                </Option>
                            ))}
                        </Select>
                    </Space>
                    <Space>
                        {/* <Tooltip title="Làm mới dữ liệu">
                            <Button
                                style={{ marginTop: '-77px' }}
                                icon={<ReloadOutlined />}
                                onClick={fetchAllAchievements}
                            />
                        </Tooltip> */}
                        <Segmented
                            style={{ position: 'absolute', marginLeft: '10px' }}
                            options={[
                                {
                                    value: 'table',
                                    icon: <SortAscendingOutlined />,
                                    label: 'Dạng bảng',
                                },
                                {
                                    value: 'card',
                                    icon: <AppstoreOutlined />,
                                    label: 'Dạng thẻ',
                                },
                            ]}
                            value={viewType}
                            onChange={setViewType}
                        />
                    </Space>
                </div>

                {viewType === 'table' ? (
                    <Table
                        style={{ marginTop: '10px' }}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Tổng cộng ${total} thành tích`,
                        }}
                        bordered
                        locale={{
                            emptyText: <Empty description="Không có dữ liệu thành tích" />,
                        }}
                    />
                ) : (
                    renderCardView()
                )}

                {/* Form Modal */}
                <Modal
                    title={
                        <Space>
                            {selected ? <EditOutlined /> : <PlusOutlined />}
                            <span>{selected ? 'Chỉnh sửa thành tích' : 'Thêm thành tích mới'}</span>
                        </Space>
                    }
                    open={showModal}
                    onCancel={() => setShowModal(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setShowModal(false)}>
                            Hủy
                        </Button>,
                        <Button key="submit" type="primary" loading={submitLoading} onClick={handleSubmit}>
                            {selected ? 'Cập nhật' : 'Tạo mới'}
                        </Button>,
                    ]}
                    width={700}
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item
                            name="nhanvien_id"
                            label="Nhân viên"
                            rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                        >
                            <Select
                                placeholder="-- Chọn nhân viên --"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {listStaff
                                    .filter((nv) => nv.phongban_id)
                                    .map((nv) => (
                                        <Option key={nv._id} value={nv._id}>
                                            {nv.hoten}-{nv.phongban_id?.tenphong}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="ten"
                            label="Tên thành tích"
                            rules={[{ required: true, message: 'Vui lòng nhập tên thành tích' }]}
                        >
                            <Input placeholder="Nhập tên danh hiệu hoặc thành tích" maxLength={100} showCount />
                        </Form.Item>

                        <Form.Item name="mota" label="Mô tả" extra="Mô tả chi tiết về thành tích, lý do khen thưởng">
                            <TextArea
                                rows={4}
                                placeholder="Nhập mô tả chi tiết về thành tích"
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item label="Hình ảnh">
                            {oldImages.length > 0 && (
                                <div className="mb-4">
                                    <Text strong>Ảnh hiện tại:</Text>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {oldImages.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative border border-gray-200 rounded-md p-1"
                                                style={{ width: 104, height: 104, position: 'relative' }}
                                            >
                                                <img
                                                    src={img}
                                                    alt="preview"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <Button
                                                    type="primary"
                                                    danger
                                                    size="small"
                                                    shape="circle"
                                                    icon={<DeleteOutlined />}
                                                    style={{
                                                        position: 'absolute',
                                                        top: -10,
                                                        right: -10,
                                                        opacity: 0.8,
                                                    }}
                                                    onClick={() => {
                                                        setOldImages(oldImages.filter((_, i) => i !== index));
                                                        setRemovedOldImages([...removedOldImages, img]);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={() => false}
                                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                multiple
                                accept="image/*"
                                maxCount={10}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            </Upload>
                            <Text type="secondary">Có thể tải lên tối đa 10 ảnh. Hỗ trợ định dạng: JPG, PNG, GIF</Text>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Detail Drawer */}
                <Drawer
                    title={
                        <Space>
                            <TrophyOutlined style={{ color: 'gold' }} />
                            <span>Chi tiết thành tích</span>
                        </Space>
                    }
                    width={640}
                    placement="right"
                    onClose={() => setShowDetail(false)}
                    open={showDetail}
                    extra={
                        <Space>
                            <Button onClick={() => setShowDetail(false)}>Đóng</Button>
                            {detailItem && (
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setShowDetail(false);
                                        handleShowEdit(detailItem);
                                    }}
                                >
                                    Chỉnh sửa
                                </Button>
                            )}
                        </Space>
                    }
                >
                    {detailItem && (
                        <>
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <Avatar
                                        size={64}
                                        src={detailItem.nhanvien_id?.avatar}
                                        icon={!detailItem.nhanvien_id?.avatar && <UserOutlined />}
                                    />
                                    <div className="ml-4">
                                        <Title level={4} style={{ margin: 0 }}>
                                            {detailItem.nhanvien_id?.hoten}
                                        </Title>
                                        <Text type="secondary">
                                            {detailItem.nhanvien_id?.chucvu && `${detailItem.nhanvien_id.chucvu} - `}
                                            {detailItem.nhanvien_id?.phongban_id?.tenphong || 'Không có phòng ban'}
                                        </Text>
                                    </div>
                                </div>

                                <Card title="Thông tin thành tích" className="mb-4">
                                    <div className="mb-4">
                                        <Text type="secondary">Danh hiệu/Thành tích:</Text>
                                        <div>
                                            <Space>
                                                <TrophyOutlined style={{ color: 'gold' }} />
                                                <Text strong>{detailItem.ten}</Text>
                                            </Space>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <Text type="secondary">Ngày khen thưởng:</Text>
                                        <div>
                                            <Space>
                                                <CalendarOutlined />
                                                <Text>{moment(detailItem.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                                            </Space>
                                        </div>
                                    </div>

                                    <div>
                                        <Text type="secondary">Mô tả:</Text>
                                        <div>
                                            {detailItem.mota ? (
                                                <p style={{ whiteSpace: 'pre-line' }}>{detailItem.mota}</p>
                                            ) : (
                                                <Text type="secondary" italic>
                                                    Không có mô tả
                                                </Text>
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                <Card title="Hình ảnh" className="mb-4">
                                    {detailItem.hinhanh && detailItem.hinhanh.length > 0 ? (
                                        <Image.PreviewGroup>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {detailItem.hinhanh.map((img, index) => (
                                                    <div key={index} className="cursor-pointer">
                                                        <Image
                                                            src={img}
                                                            alt={`Ảnh ${index + 1}`}
                                                            style={{ objectFit: 'cover', height: 120 }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </Image.PreviewGroup>
                                    ) : (
                                        <Empty description="Không có hình ảnh" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    )}
                                </Card>
                            </div>
                        </>
                    )}
                </Drawer>

                {/* Image Preview Modal */}
                <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                    <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Card>

            <style jsx global>{`
                .achievement-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s;
                }
                .achievement-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
            `}</style>
        </div>
    );
}

// Thêm icon thiếu
const AppstoreOutlined = () => (
    <svg
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="appstore"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
    >
        <path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path>
    </svg>
);
