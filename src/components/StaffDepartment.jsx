import React, { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Card,
    Avatar,
    List,
    Tag,
    Spin,
    Empty,
    Breadcrumb,
    Divider,
    Badge,
    Statistic,
    Row,
    Col,
    Input,
    Button,
    Tooltip,
    Select,
    Space,
    Alert,
    Tabs,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    TeamOutlined,
    IdcardOutlined,
    SearchOutlined,
    ArrowLeftOutlined,
    FilterOutlined,
    PhoneOutlined,
    BarChartOutlined,
    AppstoreOutlined,
    BarsOutlined,
    SortAscendingOutlined,
    ManOutlined,
    WomanOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { apiGetUserByPhongban, apiInfoUser } from '../apis/staff';
import { apiGetPhongBanById } from '../apis/Department';
import { formatName } from '../utils/Function';
import { Navigation } from './navigation';
import './StaffDepartment.css';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const StaffDepartment = () => {
    const [detailDepartment, setDetailDepartment] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departmentName, setDepartmentName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState([]);
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
    const [positionFilter, setPositionFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('position'); // 'name', 'position', 'newest'
    const [departmentInfo, setDepartmentInfo] = useState(null);
    const DepartmentID = localStorage.getItem('maphong');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchuserByDepartment = async (DepartmentID) => {
            try {
                setLoading(true);
                const response = await apiGetUserByPhongban(DepartmentID);

                if (response?.data && response.data.length > 0) {
                    setDetailDepartment(response.data);
                    setFilteredStaff(response.data);

                    // Tìm trưởng phòng
                    const truongphong =
                        response.data.find((user) => user.chucvu?.toLowerCase() === 'trưởng phòng')?.hoten ||
                        'Chưa có trưởng phòng';

                    // Gọi thêm API lấy thông tin phòng ban (lấy mô tả, ngày thành lập, ...)
                    const departmentDetail = await apiGetPhongBanById(DepartmentID);

                    setDepartmentName(response.data[0].phongban_id?.tenphong || 'Chưa cập nhật tên phòng');

                    setDepartmentInfo({
                        tenphong: response.data[0].phongban_id?.tenphong || 'Chưa cập nhật tên phòng',
                        mota: departmentDetail?.data?.mota || 'Chưa có mô tả cho phòng ban này',
                        truongphong: truongphong,
                        ngaythanhlap: departmentDetail?.data?.ngaythanhlap || 'Chưa cập nhật',
                        soluong: response.data.length,
                    });
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', error);
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

        fetchInfo();

        if (DepartmentID) {
            fetchuserByDepartment(DepartmentID);
        } else {
            console.error('Không tìm thấy mã phòng ban trong localStorage');
            setLoading(false);
        }
    }, [DepartmentID]);

    // Filter and sort staff
    useEffect(() => {
        let filtered = [...detailDepartment];

        // Apply search term filter
        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(
                (user) =>
                    user.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (user.chucvu && user.chucvu.toLowerCase().includes(searchTerm.toLowerCase())),
            );
        }

        // Apply position filter
        if (positionFilter !== 'all') {
            filtered = filtered.filter((user) => user.chucvu === positionFilter);
        }

        // Apply gender filter
        if (genderFilter !== 'all') {
            filtered = filtered.filter((user) => user.gioitinh === genderFilter);
        }

        // Apply sorting
        if (sortOrder === 'name') {
            filtered.sort((a, b) => a.hoten.localeCompare(b.hoten));
        } else if (sortOrder === 'position') {
            const positionOrder = ['Giám đốc', 'Trưởng phòng', 'Phó phòng', 'Trưởng nhóm'];
            filtered.sort((a, b) => {
                const posA = a.chucvu || '';
                const posB = b.chucvu || '';
                const indexA = positionOrder.indexOf(posA);
                const indexB = positionOrder.indexOf(posB);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return posA.localeCompare(posB);
            });
        } else if (sortOrder === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        setFilteredStaff(filtered);
    }, [searchTerm, detailDepartment, positionFilter, genderFilter, sortOrder]);

    const getPositionColor = (position) => {
        const positionColors = {
            'Giám đốc': 'gold',
            'Trưởng phòng': 'volcano',
            'Phó phòng': 'orange',
            'Trưởng nhóm': 'geekblue',
            'Nhân viên': 'green',
        };

        return positionColors[position] || 'blue';
    };

    const getUniquePositions = () => {
        const positions = new Set(detailDepartment.map((user) => user.chucvu).filter(Boolean));
        return Array.from(positions);
    };

    const maleCount = detailDepartment.filter((user) => user.gioitinh === 'Nam').length;
    const femaleCount = detailDepartment.filter((user) => user.gioitinh === 'Nữ').length;

    const renderCardView = () => (
        <Row gutter={[16, 16]} className="staff-grid">
            {filteredStaff.map((user) => (
                <Col xs={24} sm={12} md={8} lg={8} xl={6} key={user._id}>
                    <Link
                        to={`/nhansu/${formatName(user.hoten)}`}
                        onClick={() => localStorage.setItem('userId', user._id)}
                        className="staff-link"
                    >
                        <Badge.Ribbon
                            text={user.chucvu || 'Nhân viên'}
                            color={getPositionColor(user.chucvu)}
                            className="position-ribbon"
                        >
                            <Card
                                className="staff-card modern-card"
                                hoverable
                                cover={
                                    <div className="staff-card-cover">
                                        <Avatar
                                            size={100}
                                            src={user.avatar}
                                            icon={!user.avatar && <UserOutlined />}
                                            className="staff-avatar-large"
                                        />
                                    </div>
                                }
                            >
                                <div className="staff-card-content text-center">
                                    <Title level={4} className="staff-name">
                                        {user.hoten}
                                    </Title>
                                    <Tag color={getPositionColor(user.chucvu)} className="position-tag">
                                        {user.chucvu || 'Nhân viên'}
                                    </Tag>
                                    <Divider className="divider-sm" />
                                    <div className="staff-info-container">
                                        <p className="staff-info-item">
                                            <MailOutlined /> {user.email || 'Chưa cập nhật email'}
                                        </p>
                                        <p className="staff-info-item">
                                            <PhoneOutlined /> {user.sodienthoai || 'Chưa cập nhật SĐT'}
                                        </p>
                                        <p className="staff-info-item">
                                            <CalendarOutlined />{' '}
                                            {user.ngaysinh
                                                ? new Date(user.ngaysinh).toLocaleDateString('vi-VN')
                                                : 'Chưa cập nhật'}
                                        </p>
                                        <p className="staff-info-item">
                                            {user.gioitinh === 'Nam' ? <ManOutlined /> : <WomanOutlined />}{' '}
                                            {user.gioitinh || 'Không rõ'}
                                        </p>
                                    </div>
                                </div>
                                <div className="card-hover-effect"></div>
                            </Card>
                        </Badge.Ribbon>
                    </Link>
                </Col>
            ))}
        </Row>
    );

    const renderListView = () => (
        <List
            className="staff-list modern-list"
            itemLayout="horizontal"
            dataSource={filteredStaff}
            renderItem={(user) => (
                <List.Item className="staff-list-item">
                    <Link
                        to={`/nhansu/${formatName(user.hoten)}`}
                        onClick={() => localStorage.setItem('userId', user._id)}
                        className="staff-link"
                    >
                        <Card className="staff-card list-card" hoverable>
                            <div className="staff-card-content horizontal">
                                <Avatar
                                    size={64}
                                    src={user.avatar}
                                    icon={!user.avatar && <UserOutlined />}
                                    className="staff-avatar"
                                />
                                <div className="staff-details">
                                    <div className="staff-header">
                                        <Title level={4} className="staff-name">
                                            {user.hoten}
                                        </Title>
                                        <Tag color={getPositionColor(user.chucvu)}>{user.chucvu || 'Nhân viên'}</Tag>
                                    </div>

                                    <div className="staff-info-container horizontal">
                                        <div className="staff-info-col">
                                            <p className="staff-info-item">
                                                <MailOutlined /> <Text strong>Email:</Text>{' '}
                                                {user.email || 'Chưa cập nhật'}
                                            </p>
                                            <p className="staff-info-item">
                                                <PhoneOutlined /> <Text strong>SĐT:</Text>{' '}
                                                {user.sodienthoai || 'Chưa cập nhật'}
                                            </p>
                                        </div>
                                        <div className="staff-info-col">
                                            <p className="staff-info-item">
                                                <CalendarOutlined /> <Text strong>Ngày sinh:</Text>{' '}
                                                {user.ngaysinh
                                                    ? new Date(user.ngaysinh).toLocaleDateString('vi-VN')
                                                    : 'Chưa cập nhật'}
                                            </p>
                                            <p className="staff-info-item">
                                                {user.gioitinh === 'Nam' ? <ManOutlined /> : <WomanOutlined />}
                                                <Text strong> Giới tính:</Text> {user.gioitinh || 'Không rõ'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </List.Item>
            )}
        />
    );

    return (
        <Layout className="staff-department-layout modern-layout">
            <Navigation data={info} userName={userName} />
            <Content className="staff-department-content">
                <div className="staff-department-header">
                    <Breadcrumb className="staff-breadcrumb">
                        <Breadcrumb.Item>
                            <Link to="/">Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/phongban">Phòng ban</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{departmentName}</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="back-button" onClick={() => navigate('/phong-ban')}>
                        <ArrowLeftOutlined /> Quay lại danh sách phòng ban
                    </div>

                    <div className="section-title">
                        <Title level={2}>{departmentName || 'Phòng Ban'}</Title>
                        <Paragraph className="section-subtitle">Danh sách nhân viên thuộc phòng ban</Paragraph>
                    </div>
                </div>

                <div className="department-content-container">
                    <Tabs defaultActiveKey="members" className="department-tabs">
                        <TabPane
                            tab={
                                <span>
                                    <TeamOutlined />
                                    Nhân viên
                                </span>
                            }
                            key="members"
                        >
                            {/* Statistics */}
                            <div className="department-stats">
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={8}>
                                        <Card className="stat-card">
                                            <Statistic
                                                title="Tổng số nhân viên"
                                                value={detailDepartment.length}
                                                prefix={<TeamOutlined />}
                                                valueStyle={{ color: '#1890ff' }}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Card className="stat-card">
                                            <Statistic
                                                title="Nam"
                                                value={maleCount}
                                                prefix={<ManOutlined />}
                                                suffix={`(${Math.round(
                                                    (maleCount / detailDepartment.length) * 100 || 0,
                                                )}%)`}
                                                valueStyle={{ color: '#096dd9' }}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Card className="stat-card">
                                            <Statistic
                                                title="Nữ"
                                                value={femaleCount}
                                                prefix={<WomanOutlined />}
                                                suffix={`(${Math.round(
                                                    (femaleCount / detailDepartment.length) * 100 || 0,
                                                )}%)`}
                                                valueStyle={{ color: '#eb2f96' }}
                                            />
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            {/* Filters and controls */}
                            <div className="controls-container">
                                <Row gutter={[16, 16]} align="middle">
                                    <Col xs={24} md={8}>
                                        <Input
                                            placeholder="Tìm kiếm nhân viên theo tên, email, chức vụ..."
                                            prefix={<SearchOutlined className="site-form-item-icon" />}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="search-input"
                                            allowClear
                                        />
                                    </Col>

                                    <Col xs={12} md={4}>
                                        <Select
                                            placeholder="Lọc theo chức vụ"
                                            value={positionFilter}
                                            onChange={setPositionFilter}
                                            style={{ width: '100%' }}
                                            className="filter-select"
                                        >
                                            <Option value="all">Tất cả chức vụ</Option>
                                            {getUniquePositions().map((position) => (
                                                <Option key={position} value={position}>
                                                    {position}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Col>

                                    <Col xs={12} md={4}>
                                        <Select
                                            placeholder="Lọc theo giới tính"
                                            value={genderFilter}
                                            onChange={setGenderFilter}
                                            style={{ width: '100%' }}
                                            className="filter-select"
                                        >
                                            <Option value="all">Tất cả giới tính</Option>
                                            <Option value="Nam">Nam</Option>
                                            <Option value="Nữ">Nữ</Option>
                                            <Option value="Khác">Khác</Option>
                                        </Select>
                                    </Col>

                                    <Col xs={12} md={4}>
                                        <Select
                                            placeholder="Sắp xếp theo"
                                            value={sortOrder}
                                            onChange={setSortOrder}
                                            style={{ width: '100%' }}
                                            className="filter-select"
                                        >
                                            <Option value="position">Theo chức vụ</Option>
                                            <Option value="name">Theo tên A-Z</Option>
                                            <Option value="newest">Mới nhất</Option>
                                        </Select>
                                    </Col>

                                    <Col xs={12} md={4}>
                                        <Space>
                                            <Tooltip title="Hiển thị dạng thẻ">
                                                <Button
                                                    type={viewMode === 'card' ? 'primary' : 'default'}
                                                    icon={<AppstoreOutlined />}
                                                    onClick={() => setViewMode('card')}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Hiển thị dạng danh sách">
                                                <Button
                                                    type={viewMode === 'list' ? 'primary' : 'default'}
                                                    icon={<BarsOutlined />}
                                                    onClick={() => setViewMode('list')}
                                                />
                                            </Tooltip>
                                        </Space>
                                    </Col>
                                </Row>
                            </div>

                            {/* Results status */}
                            <div className="results-status">
                                {filteredStaff.length !== detailDepartment.length && (
                                    <Alert
                                        message={`Đang hiển thị ${filteredStaff.length} / ${detailDepartment.length} nhân viên`}
                                        type="info"
                                        showIcon
                                        className="filter-alert"
                                    />
                                )}
                            </div>

                            {/* Staff List */}
                            {loading ? (
                                <div className="loading-container">
                                    <Spin size="large" />
                                    <p>Đang tải dữ liệu nhân viên...</p>
                                </div>
                            ) : filteredStaff.length > 0 ? (
                                <div className="staff-content">
                                    {viewMode === 'card' ? renderCardView() : renderListView()}
                                </div>
                            ) : (
                                <Empty
                                    description="Không tìm thấy nhân viên nào"
                                    className="empty-container"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )}

                            <Divider className="staff-divider" />
                            <div className="staff-footer">
                                <Text type="secondary">
                                    Hiển thị {filteredStaff.length} / {detailDepartment.length} nhân viên
                                </Text>
                            </div>
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                                    <InfoCircleOutlined />
                                    Thông tin phòng ban
                                </span>
                            }
                            key="info"
                        >
                            {departmentInfo ? (
                                <div className="department-info-container">
                                    <Card className="department-info-card">
                                        <Title level={3}>{departmentInfo.tenphong}</Title>
                                        <Divider />

                                        <Row gutter={[24, 24]}>
                                            <Col xs={24} md={12}>
                                                <div className="info-section">
                                                    <Title level={4}>Thông tin chi tiết</Title>
                                                    <div className="info-item">
                                                        <Text strong>Trưởng phòng:</Text> {departmentInfo.truongphong}
                                                    </div>
                                                    {/* <div className="info-item">
                                                        <Text strong>Ngày thành lập:</Text>{' '}
                                                        {departmentInfo.ngaythanhlap}
                                                    </div> */}
                                                    <div className="info-item">
                                                        <Text strong>Số lượng nhân viên:</Text> {departmentInfo.soluong}
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <div className="info-section">
                                                    <Title level={4}>Mô tả phòng ban</Title>
                                                    <Paragraph>{departmentInfo.mota}</Paragraph>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Divider />

                                        <div className="info-section">
                                            <Title level={4}>Cơ cấu nhân sự</Title>
                                            <Row gutter={[16, 16]} className="position-stats">
                                                {getUniquePositions().map((position) => {
                                                    const count = detailDepartment.filter(
                                                        (user) => user.chucvu === position,
                                                    ).length;
                                                    const percentage = Math.round(
                                                        (count / detailDepartment.length) * 100,
                                                    );

                                                    return (
                                                        <Col xs={12} sm={8} md={6} key={position}>
                                                            <Card className="position-stat-card">
                                                                <Statistic
                                                                    title={position}
                                                                    value={count}
                                                                    suffix={`(${percentage}%)`}
                                                                    valueStyle={{ color: getPositionColor(position) }}
                                                                />
                                                            </Card>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        </div>
                                    </Card>
                                </div>
                            ) : (
                                <Empty description="Không có thông tin phòng ban" />
                            )}
                        </TabPane>
                    </Tabs>
                </div>
            </Content>
        </Layout>
    );
};

export default StaffDepartment;
