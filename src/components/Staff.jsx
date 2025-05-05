import React, { useEffect, useState } from 'react';
import { apiGetAllUser, apiInfoUser } from '../apis/staff';
import {
    Card,
    Col,
    Row,
    Avatar,
    Typography,
    Spin,
    Divider,
    Tag,
    Layout,
    Breadcrumb,
    Statistic,
    Input,
    Select,
    Empty,
    Button,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    TeamOutlined,
    CalendarOutlined,
    IdcardOutlined,
    SearchOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Navigation } from './navigation';
import { formatName } from '../utils/Function';

import './Staff.css';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;

const Staff = () => {
    const [allUser, setAllUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');

    // Get all unique department names
    const departments = [
        ...new Set(allUser.filter((user) => user?.phongban_id?.tenphong).map((user) => user.phongban_id.tenphong)),
    ];
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAllUser = async () => {
            try {
                const response = await apiGetAllUser();
                if (response.code === 200) {
                    const usersWithDepartment = response.data.filter((user) => user.phongban_id);
                    setAllUser(usersWithDepartment);
                    setFilteredUsers(usersWithDepartment);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu nhân viên:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllUser();
    }, []);

    useEffect(() => {
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
    }, []);

    // Apply filters whenever filter values change
    useEffect(() => {
        let result = [...allUser];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(
                (user) =>
                    user.hoten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user.chucvu && user.chucvu.toLowerCase().includes(searchTerm.toLowerCase())),
            );
        }

        // Apply department filter
        if (departmentFilter !== 'all') {
            result = result.filter((user) => user?.phongban_id?.tenphong === departmentFilter);
        }

        // Apply gender filter
        if (genderFilter !== 'all') {
            result = result.filter((user) => user.gioitinh === genderFilter);
        }

        setFilteredUsers(result);
    }, [searchTerm, departmentFilter, genderFilter, allUser]);

    // Calculate statistics
    const maleCount = allUser.filter((user) => user.gioitinh === 'Nam').length;
    const femaleCount = allUser.filter((user) => user.gioitinh === 'Nữ').length;

    // const getPositionColor = (position) => {
    //     // Define colors for different positions
    //     const positionColors = {
    //         'Giám đốc': 'gold',
    //         'Trưởng phòng': 'volcano',
    //         'Phó phòng': 'orange',
    //         'Trưởng nhóm': 'geekblue',
    //         'Nhân viên': 'green',
    //     };

    //     return positionColors[position] || 'blue';
    // };

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <div className="staff-navigation-wrapper">
                    <Navigation data={info} userName={userName} />
                </div>
                <Layout className="staff-layout">
                    <Content className="staff-content">
                        <Button
                            type="primary"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/')}
                            className="back-button"
                            style={{ color: 'black' }}
                        >
                            Quay lại
                        </Button>
                        <Breadcrumb
                            className="department-breadcrumb"
                            items={[{ title: 'Trang chủ', href: '/' }, { title: 'Nhân sự' }]}
                        />
                        <div className="staff-header">
                            <div className="section-title2">
                                <Title level={2}>Đội ngũ nhân sự công ty</Title>
                                <Paragraph className="section-subtitle">
                                    Gồm các phòng ban và vị trí chuyên môn khác nhau – cùng nhau xây dựng nên sức mạnh
                                    cốt lõi cho tổ chức.
                                </Paragraph>
                            </div>
                        </div>

                        {/* Statistics Section */}
                        <div className="stats-container">
                            <Row gutter={[16, 16]} className="stats-row">
                                <Col xs={24} sm={8}>
                                    <Card className="stat-card">
                                        <Statistic
                                            title="Tổng số nhân viên"
                                            value={allUser.length}
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
                                            suffix={`(${Math.round((maleCount / allUser.length) * 100 || 0)}%)`}
                                            valueStyle={{ color: '#096dd9' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <Card className="stat-card">
                                        <Statistic
                                            title="Nữ"
                                            value={femaleCount}
                                            suffix={`(${Math.round((femaleCount / allUser.length) * 100 || 0)}%)`}
                                            valueStyle={{ color: '#eb2f96' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>

                        {/* Filter Section */}
                        <div className="filter-container">
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} md={10}>
                                    <Input
                                        placeholder="Tìm kiếm theo tên, email, chức vụ..."
                                        prefix={<SearchOutlined />}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </Col>
                                <Col xs={12} md={7}>
                                    <Select
                                        placeholder="Phòng ban"
                                        style={{ width: '100%' }}
                                        value={departmentFilter}
                                        onChange={(value) => setDepartmentFilter(value)}
                                        className="filter-select"
                                    >
                                        <Option value="all">Tất cả phòng ban</Option>
                                        {departments.map((dept) => (
                                            <Option key={dept._id} value={dept}>
                                                {dept}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col xs={12} md={7}>
                                    <Select
                                        placeholder="Giới tính"
                                        style={{ width: '100%' }}
                                        value={genderFilter}
                                        onChange={(value) => setGenderFilter(value)}
                                        className="filter-select"
                                    >
                                        <Option value="all">Tất cả</Option>
                                        <Option value="Nam">Nam</Option>
                                        <Option value="Nữ">Nữ</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </div>

                        {/* Staff Cards */}
                        {loading ? (
                            <div className="loading-container">
                                <Spin size="large" />
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <Row gutter={[24, 24]} className="staff-cards-container">
                                {filteredUsers.map((member) => (
                                    <Col key={member._id} xs={24} sm={12} md={8} lg={6}>
                                        <Link
                                            to={`/nhansu/${formatName(member.hoten)}`}
                                            onClick={() => localStorage.setItem('userId', member._id)}
                                            className="staff-card-link"
                                        >
                                            <Card hoverable className="staff-card">
                                                <div className="avatar-container">
                                                    <Avatar
                                                        src={member.avatar}
                                                        size={100}
                                                        className="staff-avatar"
                                                        icon={!member.avatar && <UserOutlined />}
                                                    />
                                                </div>

                                                <div className="staff-info">
                                                    <Title level={4} className="staff-name">
                                                        {member.hoten}
                                                    </Title>

                                                    <Text className="staff-email">
                                                        <MailOutlined /> {member.email}
                                                    </Text>

                                                    {member.ngaysinh && (
                                                        <Text className="staff-detail">
                                                            <CalendarOutlined />{' '}
                                                            {new Date(member.ngaysinh).toLocaleDateString('vi-VN')}
                                                        </Text>
                                                    )}

                                                    <Text className="staff-detail">
                                                        <IdcardOutlined /> {member.chucvu || 'Chưa có chức vụ'}
                                                    </Text>

                                                    <Text className="staff-detail">
                                                        <TeamOutlined />{' '}
                                                        {member?.phongban_id?.tenphong || 'Chưa có phòng ban'}
                                                    </Text>

                                                    <div className="staff-tags">
                                                        <Tag
                                                            color={member.gioitinh === 'Nữ' ? 'magenta' : 'blue'}
                                                            className="gender-tag"
                                                        >
                                                            {member.gioitinh || 'Không rõ'}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Empty description="Không tìm thấy nhân viên nào" className="empty-result" />
                        )}

                        <Divider className="staff-divider" />
                        <div className="staff-footer">
                            <Text type="secondary">
                                Hiển thị {filteredUsers.length} / {allUser.length} nhân viên
                            </Text>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Staff;
