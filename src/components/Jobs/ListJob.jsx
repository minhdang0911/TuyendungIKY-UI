import React, { useEffect, useState } from 'react';
import { apiGetAllJob } from '../../apis/Jobs';
import {
    Select,
    Button,
    Card,
    Row,
    Col,
    Input,
    Empty,
    Spin,
    Badge,
    Tag,
    Tooltip,
    Pagination,
    Slider,
    Divider,
    Drawer,
    Space,
    Typography,
    Avatar,
} from 'antd';
import {
    EnvironmentOutlined,
    ClockCircleOutlined,
    SearchOutlined,
    FilterOutlined,
    HeartOutlined,
    HeartFilled,
    DollarOutlined,
    BarsOutlined,
    AppstoreOutlined,
    ArrowUpOutlined,
    BankOutlined,
} from '@ant-design/icons';
import './ListJob.css';
import { Link } from 'react-router-dom';
import { formatName } from '../../utils/Function';
import { Navigation } from '../navigation';
import { Contact } from '../contact';
import JsonData from '../../data/data.json';

const { Option } = Select;
const { Search } = Input;
const { Title, Paragraph } = Typography;

const ListJob = () => {
    const [landingPageData, setLandingPageData] = useState({});
    const [listJob, setListJob] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [jobType, setJobType] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [salaryRange, setSalaryRange] = useState([0, 100000000]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [hoveredJobId, setHoveredJobId] = useState(null);

    useEffect(() => {
        const fetchListJob = async () => {
            try {
                setLoading(true);
                const response = await apiGetAllJob();
                if (response.code === 200) {
                    setListJob(response.data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListJob();

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favoriteJobs');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    const toggleFavorite = (jobId) => {
        let newFavorites;
        if (favorites.includes(jobId)) {
            newFavorites = favorites.filter((id) => id !== jobId);
        } else {
            newFavorites = [...favorites, jobId];
        }
        setFavorites(newFavorites);
        localStorage.setItem('favoriteJobs', JSON.stringify(newFavorites));
    };

    // Filter and sort jobs
    const filterAndSortJobs = () => {
        let result = [...listJob];

        // Filter by location
        if (selectedLocation) {
            result = result.filter((job) => job.location === selectedLocation);
        }

        // Filter by job type
        if (jobType !== 'all') {
            result = result.filter((job) => job.time === jobType);
        }

        // Filter by search text
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            result = result.filter(
                (job) =>
                    job.title.toLowerCase().includes(lowerSearch) ||
                    (job.description && job.description.toLowerCase().includes(lowerSearch)) ||
                    (job.companyName && job.companyName.toLowerCase().includes(lowerSearch)),
            );
        }

        // Filter out jobs that are past the deadline
        result = result.filter((job) => new Date(job.deadline) > new Date());

        // Filter by salary range
        result = result.filter(
            (job) =>
                (!job.minSalary || job.minSalary <= salaryRange[1]) &&
                (!job.maxSalary || job.maxSalary >= salaryRange[0]),
        );

        // Sort jobs
        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt || Date.now()) - new Date(b.createdAt || Date.now()));
                break;
            case 'salary-high':
                result.sort((a, b) => (b.maxSalary || 0) - (a.maxSalary || 0));
                break;
            case 'salary-low':
                result.sort((a, b) => (a.minSalary || 0) - (b.minSalary || 0));
                break;
            default:
                break;
        }

        return result;
    };

    const filteredJobs = filterAndSortJobs();

    // Paginate the filtered jobs
    const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when changing page
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const resetFilters = () => {
        setSelectedLocation('');
        setJobType('all');
        setSalaryRange([0, 100000000]);
        setSortBy('newest');
        setSearchText('');
    };

    // Function to generate a placeholder color based on company name
    const getCompanyColor = (companyName) => {
        if (!companyName) return '#1890ff';
        const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#13c2c2', '#52c41a', '#eb2f96'];
        let sum = 0;
        for (let i = 0; i < companyName.length; i++) {
            sum += companyName.charCodeAt(i);
        }
        return colors[sum % colors.length];
    };

    // Modified renderGridView function to fix card issues
    const renderGridView = () => (
        <Row gutter={[24, 24]} className="job-list">
            {paginatedJobs.map((job) => (
                <Col xs={24} sm={12} lg={8} key={job._id}>
                    <Card
                        hoverable
                        className="job-card"
                        style={{ height: '450px' }} // Thêm chiều cao tại đây
                        cover={
                            <div className="job-card-image-container">
                                <img
                                    alt={job.title}
                                    src={
                                        job.hinhanh && job.hinhanh[0]
                                            ? job.hinhanh[0]
                                            : 'https://via.placeholder.com/300x150'
                                    }
                                    className="job-image"
                                />
                                <Button
                                    type="text"
                                    className="favorite-btn"
                                    icon={
                                        favorites.includes(job._id) ? (
                                            <HeartFilled className="favorite-icon active" />
                                        ) : (
                                            <HeartOutlined className="favorite-icon" />
                                        )
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(job._id);
                                    }}
                                />
                                {job.isNew && <Badge.Ribbon text="Mới" color="#52c41a" className="new-badge" />}
                            </div>
                        }
                    >
                        <div className="job-card-company">
                            <Avatar
                                size={42}
                                style={{ backgroundColor: getCompanyColor(job.companyName) }}
                                src={job.companyLogo}
                            >
                                {job.companyName ? job.companyName.charAt(0).toUpperCase() : <BankOutlined />}
                            </Avatar>
                            <div className="company-info">
                                {/* Full job title shown without truncation */}
                                <Tooltip title={job.title}>
                                    <h3 className="job-title" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                        {job.title}
                                    </h3>
                                </Tooltip>
                                <div className="company-name">
                                    {job.companyName || 'Công ty cổ phần công nghệ tiện ích thông minh'}
                                </div>
                            </div>
                        </div>

                        <Divider style={{ margin: '12px 0' }} />

                        <div className="job-meta">
                            <Tooltip title="Vị trí">
                                <div className="job-meta-item">
                                    <EnvironmentOutlined className="job-icon" />
                                    <span>{job.location}</span>
                                </div>
                            </Tooltip>
                            <Tooltip title="Loại công việc">
                                <div className="job-meta-item">
                                    <ClockCircleOutlined className="job-icon" />
                                    <span>{job.time || 'Full Time'}</span>
                                </div>
                            </Tooltip>
                            <Tooltip title="Mức lương">
                                <div className="job-meta-item">
                                    <DollarOutlined className="job-icon" />
                                    <span>
                                        {job.minSalary && job.maxSalary
                                            ? `${formatCurrency(job.minSalary)} - ${formatCurrency(job.maxSalary)}`
                                            : 'Thỏa thuận'}
                                    </span>
                                </div>
                            </Tooltip>
                        </div>

                        {job.skills && job.skills.length > 0 && (
                            <div className="job-skills">
                                {job.skills.slice(0, 3).map((skill, index) => (
                                    <Tag key={index} color="blue">
                                        {skill}
                                    </Tag>
                                ))}
                                {job.skills.length > 3 && <Tag color="default">+{job.skills.length - 3}</Tag>}
                            </div>
                        )}

                        {/* Action buttons always visible, no hover required */}
                        <div className="job-card-actions" style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                            <Link
                                to={`/chi-tiet-cong-viec/${formatName(job?.title)}`}
                                onClick={() => localStorage.setItem('idJob', job._id)}
                                style={{ flex: 1 }}
                            >
                                <Button type="primary" ghost style={{ width: '100%' }}>
                                    Chi tiết
                                </Button>
                            </Link>
                            {/* <Button type="primary" style={{ flex: 1 }}>
                                Ứng tuyển
                            </Button> */}
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    );

    const renderListView = () => (
        <div className="job-list-view">
            {paginatedJobs.map((job) => (
                <Card
                    key={job._id}
                    className="job-list-item"
                    hoverable
                    onMouseEnter={() => setHoveredJobId(job._id)}
                    onMouseLeave={() => setHoveredJobId(null)}
                >
                    <div className="job-list-content">
                        <div className="job-list-left">
                            <Avatar
                                size={64}
                                shape="square"
                                style={{ backgroundColor: getCompanyColor(job.companyName) }}
                                src={job.companyLogo}
                            >
                                {job.companyName ? job.companyName.charAt(0).toUpperCase() : <BankOutlined />}
                            </Avatar>
                        </div>
                        <div className="job-list-middle">
                            <div className="job-list-header">
                                <h3 className="job-title">{job.title}</h3>
                                {job.isNew && <Badge text="Mới" color="#52c41a" />}
                            </div>
                            <div className="company-name">
                                {job.companyName || 'Công ty cổ phần công nghệ tiện ích thông minh'}
                            </div>
                            <div className="job-meta-horizontal">
                                <div className="job-meta-item">
                                    <EnvironmentOutlined className="job-icon" />
                                    <span>{job.location}</span>
                                </div>
                                <div className="job-meta-item">
                                    <ClockCircleOutlined className="job-icon" />
                                    <span>{job.time || 'Full Time'}</span>
                                </div>
                                <div className="job-meta-item">
                                    <DollarOutlined className="job-icon" />
                                    <span>
                                        {job.minSalary && job.maxSalary
                                            ? `${formatCurrency(job.minSalary)} - ${formatCurrency(job.maxSalary)}`
                                            : 'Thỏa thuận'}
                                    </span>
                                </div>
                            </div>
                            {job.skills && job.skills.length > 0 && (
                                <div className="job-skills">
                                    {job.skills.slice(0, 4).map((skill, index) => (
                                        <Tag key={index} color="blue">
                                            {skill}
                                        </Tag>
                                    ))}
                                    {job.skills.length > 4 && <Tag color="default">+{job.skills.length - 4}</Tag>}
                                </div>
                            )}
                        </div>
                        <div className="job-list-right">
                            <Space direction="vertical" align="end">
                                <Button
                                    type="text"
                                    icon={
                                        favorites.includes(job._id) ? (
                                            <HeartFilled style={{ color: '#ff4d4f' }} />
                                        ) : (
                                            <HeartOutlined />
                                        )
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(job._id);
                                    }}
                                />
                                <Link
                                    to={`/chi-tiet-cong-viec/${formatName(job?.title)}`}
                                    onClick={() => localStorage.setItem('idJob', job._id)}
                                >
                                    <Button type="primary" ghost>
                                        Chi tiết
                                    </Button>
                                </Link>
                                {/* <Button type="primary">Ứng tuyển</Button> */}
                            </Space>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <>
            <Navigation />
            <div
                style={{
                    background: 'linear-gradient(135deg, #1a365d 0%, #2563eb 100%)',
                    color: 'white',
                    padding: '80px 0',
                    textAlign: 'center',
                    marginBottom: '40px',
                    borderRadius: '0 0 20px 20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        padding: '0 20px',
                    }}
                >
                    <Title
                        level={1}
                        style={{
                            fontSize: '2.8rem',
                            marginBottom: '16px',
                            color: 'white',
                        }}
                    >
                        Khám phá cơ hội nghề nghiệp
                    </Title>

                    <Paragraph
                        style={{
                            fontSize: '1.2rem',
                            marginBottom: '32px',
                            opacity: '0.9',
                            color: 'white',
                        }}
                    >
                        Tìm kiếm công việc phù hợp với kỹ năng và đam mê của bạn
                    </Paragraph>

                    <div
                        style={{
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                    >
                        <Search
                            placeholder="Tìm kiếm công việc "
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                borderRadius: '50px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="job-container">
                {/* Mobile Filter Button */}
                <Button icon={<FilterOutlined />} onClick={showDrawer} className="mobile-filter-btn" type="primary">
                    Bộ lọc
                </Button>

                {/* Sidebar - Filter Options */}
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h2>Bộ lọc tìm kiếm</h2>
                        <Button type="link" onClick={resetFilters}>
                            Đặt lại
                        </Button>
                    </div>

                    <Divider />

                    <div className="filter-section">
                        <h3>Vị trí</h3>
                        <Select
                            value={selectedLocation}
                            onChange={setSelectedLocation}
                            style={{ width: '100%' }}
                            placeholder="Chọn khu vực"
                            suffixIcon={<EnvironmentOutlined />}
                        >
                            <Option value="">Tất cả vị trí</Option>
                            <Option value="Hà Nội">Hà Nội</Option>
                            <Option value="Thành Phố Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                            {/* <Option value="Đà Nẵng">Đà Nẵng</Option> */}
                        </Select>
                    </div>

                    <div className="filter-section">
                        <h3>Loại công việc</h3>
                        <Select
                            value={jobType}
                            onChange={setJobType}
                            style={{ width: '100%' }}
                            placeholder="Loại công việc"
                            suffixIcon={<ClockCircleOutlined />}
                        >
                            <Option value="all">Tất cả loại</Option>
                            <Option value="Full-time">Toàn thời gian</Option>
                            <Option value="Part-time">Bán thời gian</Option>
                            <Option value="Internship">Thực tập sinh</Option>
                            {/* <Option value="Remote">Làm việc từ xa</Option>
                            <Option value="Freelance">Freelance</Option> */}
                        </Select>
                    </div>

                    <div className="filter-section">
                        <h3>Sắp xếp theo</h3>
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            style={{ width: '100%' }}
                            placeholder="Sắp xếp theo"
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="newest">Mới nhất</Option>
                            <Option value="oldest">Cũ nhất</Option>
                            <Option value="salary-high">Lương cao đến thấp</Option>
                            <Option value="salary-low">Lương thấp đến cao</Option>
                        </Select>
                    </div>

                    <div className="filter-section">
                        <h3>Khoảng lương (VNĐ)</h3>
                        <Slider
                            range
                            step={1000000}
                            min={0}
                            max={100000000}
                            value={salaryRange}
                            onChange={setSalaryRange}
                            tooltip={{
                                formatter: (value) => `${formatCurrency(value)} VNĐ`,
                            }}
                        />
                        <div className="salary-range-labels">
                            <span>{formatCurrency(salaryRange[0])} VNĐ</span> -{' '}
                            <span>{formatCurrency(salaryRange[1])} VNĐ</span>
                        </div>
                    </div>

                    <Divider />

                    <div className="sidebar-footer">
                        <Button type="primary" block>
                            Áp dụng bộ lọc
                        </Button>
                    </div>
                </div>

                {/* Mobile Filter Drawer */}
                <Drawer
                    title="Bộ lọc tìm kiếm"
                    placement="right"
                    onClose={closeDrawer}
                    visible={drawerVisible}
                    width={300}
                    footer={
                        <Space style={{ width: '100%' }}>
                            <Button onClick={resetFilters}>Đặt lại</Button>
                            <Button type="primary" block onClick={closeDrawer}>
                                Áp dụng
                            </Button>
                        </Space>
                    }
                >
                    <div className="filter-section">
                        <h3>Vị trí</h3>
                        <Select
                            value={selectedLocation}
                            onChange={setSelectedLocation}
                            style={{ width: '100%' }}
                            placeholder="Chọn khu vực"
                            suffixIcon={<EnvironmentOutlined />}
                        >
                            <Option value="">Tất cả vị trí</Option>
                            <Option value="Hà Nội">Hà Nội</Option>
                            <Option value="Thành Phố Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                            <Option value="Đà Nẵng">Đà Nẵng</Option>
                        </Select>
                    </div>

                    <div className="filter-section">
                        <h3>Loại công việc</h3>
                        <Select
                            value={jobType}
                            onChange={setJobType}
                            style={{ width: '100%' }}
                            placeholder="Loại công việc"
                            suffixIcon={<ClockCircleOutlined />}
                        >
                            <Option value="all">Tất cả loại</Option>
                            <Option value="Full-time">Toàn thời gian</Option>
                            <Option value="Part-time">Bán thời gian</Option>
                            <Option value="Remote">Làm việc từ xa</Option>
                            <Option value="Freelance">Freelance</Option>
                        </Select>
                    </div>

                    <div className="filter-section">
                        <h3>Sắp xếp theo</h3>
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            style={{ width: '100%' }}
                            placeholder="Sắp xếp theo"
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="newest">Mới nhất</Option>
                            <Option value="oldest">Cũ nhất</Option>
                            <Option value="salary-high">Lương cao đến thấp</Option>
                            <Option value="salary-low">Lương thấp đến cao</Option>
                        </Select>
                    </div>

                    <div className="filter-section">
                        <h3>Khoảng lương (VNĐ)</h3>
                        <Slider
                            range
                            step={1000000}
                            min={0}
                            max={100000000}
                            value={salaryRange}
                            onChange={setSalaryRange}
                            tooltip={{
                                formatter: (value) => `${formatCurrency(value)} VNĐ`,
                            }}
                        />
                        <div className="salary-range-labels">
                            <span>{formatCurrency(salaryRange[0])} VNĐ</span> -{' '}
                            <span>{formatCurrency(salaryRange[1])} VNĐ</span>
                        </div>
                    </div>
                </Drawer>

                {/* Main Content */}
                <div className="main-content">
                    <div className="results-header">
                        <div className="results-count">
                            Tìm thấy <span>{filteredJobs.length}</span> công việc phù hợp
                        </div>
                        <div className="view-controls">
                            <Button
                                type={viewMode === 'grid' ? 'primary' : 'default'}
                                icon={<AppstoreOutlined />}
                                onClick={() => setViewMode('grid')}
                            />
                            <Button
                                type={viewMode === 'list' ? 'primary' : 'default'}
                                icon={<BarsOutlined />}
                                onClick={() => setViewMode('list')}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <Spin size="large" />
                            <p>Đang tải danh sách công việc...</p>
                        </div>
                    ) : paginatedJobs.length > 0 ? (
                        viewMode === 'grid' ? (
                            renderGridView()
                        ) : (
                            renderListView()
                        )
                    ) : (
                        <Empty
                            description="Không tìm thấy công việc phù hợp"
                            className="empty-results"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    )}

                    {filteredJobs.length > 0 && (
                        <div className="pagination-container">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredJobs.length}
                                onChange={handlePageChange}
                                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} việc làm`}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Back to top button */}
            <Button
                className="back-to-top-btn"
                type="primary"
                shape="circle"
                icon={<ArrowUpOutlined />}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            <Contact data={landingPageData.Contact} />
        </>
    );
};

export default ListJob;
