import React, { useEffect, useState } from 'react';
import { apiGetJobById } from '../../apis/Jobs';
import {
    Row,
    Col,
    Card,
    Button,
    Typography,
    Divider,
    Tag,
    Modal,
    Form,
    Input,
    DatePicker,
    InputNumber,
    Upload,
    message,
    Spin,
    Empty,
    List,
    Avatar,
    Tooltip,
    Affix,
} from 'antd';
import {
    EnvironmentOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    DollarOutlined,
    UploadOutlined,
    MailOutlined,
    UserOutlined,
    TeamOutlined,
    BulbOutlined,
    CheckCircleOutlined,
    FilePdfOutlined,
    ShareAltOutlined,
    BookOutlined,
    TrophyOutlined,
    SafetyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './DetailJob.css';
import { apiInfoUser } from '../../apis/staff';
import { apiApplyJob } from '../../apis/Applications';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../navigation';
import { Contact } from '../contact';
import JsonData from '../../data/data.json';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const DetailJob = () => {
    // State
    const [landingPageData, setLandingPageData] = useState({});
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [info, setInfo] = useState([]);
    const [userId, setUserId] = useState('');
    const [loadingJob, setLoadingJob] = useState(false);
    const [activeSection, setActiveSection] = useState('description');

    // Get job ID from localStorage
    const idJob = localStorage.getItem('idJob');
    const navigate = useNavigate();

    // Fetch job details
    useEffect(() => {
        const getJob = async () => {
            try {
                setLoading(true);
                const response = await apiGetJobById(idJob);
                if (response.code === 200) {
                    setJob(response.data);
                } else {
                    message.error('Không thể tải thông tin công việc');
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
                message.error('Đã xảy ra lỗi khi tải thông tin công việc');
            } finally {
                setLoading(false);
            }
        };

        if (idJob) {
            getJob();
        }
    }, []);

    useEffect(() => {
        const fetchInfo = async () => {
            const response = await apiInfoUser();

            if (response.code === 200) {
                setInfo(response.data);
                setUserId(response?.data?._id);
            }
        };
        fetchInfo();
    }, []);

    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    // Modal handlers
    const showModal = () => {
        if (!info || Object.keys(info).length === 0) {
            message.error('Bạn cần đăng nhập trước khi ứng tuyển!');
            setTimeout(() => {
                navigate('/login');
            }, 1000);
            return;
        }

        // Tự động đổ dữ liệu vào form
        form.setFieldsValue({
            fullName: info.hoten,
            email: info.email,
            gender: info.gioitinh,
            birthday: info.ngaysinh ? dayjs(info.ngaysinh) : null,
            position: info.chucvu,
            department: info.phongban_id?.tenphong,
            role: info.role?.tenRole,
            phone: info?.sdt,
        });

        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
    };

    const formatCurrencyVND = (value) => {
        return `${Number(value).toLocaleString('vi-VN')} VNĐ`;
    };

    const onFinish = async (values) => {
        if (!fileList || fileList.length === 0) {
            return message.error('Vui lòng tải lên CV của bạn!');
        }

        const formData = new FormData();
        formData.append('jobId', idJob);
        formData.append('userId', userId);
        formData.append('fullName', values.fullName);
        formData.append('email', values.email);
        formData.append('phone', values.phone);

        if (values.birthday) {
            formData.append('birthday', values.birthday.format('DD-MM-YYYY'));
        }

        formData.append('expectedSalary', values.salary);
        formData.append('resumeUrl', fileList[0]);

        setLoadingJob(true); // Bắt đầu loading

        try {
            const response = await apiApplyJob(formData);
            const resumeUrl = response?.data?.resumeUrl || '';
            const formattedSalary = formatCurrencyVND(values.salary);

            const templateParams = {
                subject: `Ứng viên ${values.fullName} ứng tuyển vị trí ${job?.title || 'Không xác định'}`,
                fullName: values.fullName,
                email: 'minhdang9a8@gmail.com',
                emailcandidate: values.email,
                phone: values.phone,
                birthday: values.birthday ? values.birthday.format('DD-MM-YYYY') : 'Không cung cấp',
                expectedSalary: formattedSalary,
                resumeFileName: resumeUrl,
                message: `
                    <p><strong>Họ và tên:</strong> ${values.fullName}</p>
                    <p><strong>Email:</strong> ${values.email}</p>
                    <p><strong>Số điện thoại:</strong> ${values.phone}</p>
                    <p><strong>Ngày sinh:</strong> ${
                        values.birthday ? values.birthday.format('DD-MM-YYYY') : 'Không cung cấp'
                    }</p>
                    <p><strong>Mức lương mong muốn:</strong> ${formattedSalary}</p>
                    <p><strong>CV:</strong> ${resumeUrl}</p>
                `,
            };

            await emailjs.send('service_a1ycr3i', 'template_oo4pwpi', templateParams, 'NQPNi0D_pNK3IspwZ');

            if (response?.success === true) {
                message.success('Đã gửi hồ sơ ứng tuyển thành công!');
                setIsModalOpen(false);
                form.resetFields();
                setFileList([]);
            }
        } catch (error) {
            message.error('Ứng tuyển thất bại. Vui lòng thử lại sau!');
            console.error(error);
        } finally {
            setLoadingJob(false); // Dừng loading
        }
    };

    // File upload props
    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

            if (!isPDF && !isDocx) {
                message.error('Chỉ chấp nhận file PDF');
                return Upload.LIST_IGNORE;
            }

            if (file.size > 5 * 1024 * 1024) {
                message.error('File phải nhỏ hơn 5MB!');
                return Upload.LIST_IGNORE;
            }

            setFileList([file]);
            return false;
        },
        fileList,
    };

    // Format salary
    const formatSalary = (min, max) => {
        const formatNumber = (num) => {
            return new Intl.NumberFormat('vi-VN').format(num);
        };

        if (min && max) {
            return `${formatNumber(min)} - ${formatNumber(max)} VNĐ`;
        } else if (min) {
            return `Từ ${formatNumber(min)} VNĐ`;
        } else if (max) {
            return `Đến ${formatNumber(max)} VNĐ`;
        }
        return 'Thỏa thuận';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Không xác định';
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    const copyJobLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        message.success('Đã sao chép đường dẫn vào clipboard!');
    };

    // Fake benefits data - có thể thay bằng dữ liệu thực từ API nếu có
    const benefits = [
        { icon: <SafetyOutlined />, title: 'Bảo hiểm', description: 'Bảo hiểm đầy đủ theo quy định' },
        { icon: <BookOutlined />, title: 'Đào tạo', description: 'Chương trình đào tạo chuyên nghiệp' },
        { icon: <TrophyOutlined />, title: 'Thưởng', description: 'Thưởng theo hiệu suất công việc' },
    ];

    // Fake company data - có thể thay bằng dữ liệu thực từ API nếu có
    const companyInfo = {
        name: job?.company || 'Công ty cổ phần công nghệ tiện ích thông minh',
        logo:
            job?.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk6i1YvxT8gFWyAwk3tW8MjzQJocD3SUZ64A&s',
        description:
            job?.companyDescription ||
            'Công ty  chuyên R&D các giải pháp, sản phẩm điện tử công nghệ cao. Cung cấp dịch vụ sản xuất OEM',
        employees: job?.employees || '50-100',
        website: job?.website || 'https://iky.vn',
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
                <div className="loading-text">Đang tải thông tin công việc...</div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="empty-container">
                <Empty description="Không tìm thấy thông tin công việc" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <Button type="primary" href="/jobs">
                    Quay lại danh sách công việc
                </Button>
            </div>
        );
    }

    return (
        <>
            <Navigation />
            <div className="job-detail-container">
                {/* Header Banner */}
                <div className="job-banner">
                    <div className="banner-content">
                        <div className="job-title-section">
                            <Title level={2}>{job.title}</Title>
                            <div className="job-company">
                                <Avatar src={companyInfo.logo} size={50} />
                                <Text strong>{companyInfo.name}</Text>
                            </div>
                        </div>
                        <div className="job-quick-info">
                            <Tag icon={<EnvironmentOutlined />} color="blue">
                                {job.location}
                            </Tag>
                            <Tag icon={<ClockCircleOutlined />} color="green">
                                {job.time || 'Full Time'}
                            </Tag>
                            <Tag icon={<DollarOutlined />} color="gold">
                                {formatSalary(job.minSalary, job.maxSalary)}
                            </Tag>
                            <Tag icon={<CalendarOutlined />} color="volcano">
                                Hạn nộp: {formatDate(job.deadline)}
                            </Tag>
                        </div>
                    </div>
                </div>

                <Row gutter={[32, 20]} className="job-detail-content">
                    {/* Left Column */}
                    <Col xs={24} lg={16} className="left-column">
                        {/* Navigation Tabs */}
                        <div className="job-nav-tabs">
                            <div
                                className={`tab-item ${activeSection === 'description' ? 'active' : ''}`}
                                onClick={() => setActiveSection('description')}
                            >
                                <BookOutlined /> Mô tả công việc
                            </div>
                            <div
                                className={`tab-item ${activeSection === 'company' ? 'active' : ''}`}
                                onClick={() => setActiveSection('company')}
                            >
                                <TeamOutlined /> Công ty
                            </div>
                            <div
                                className={`tab-item ${activeSection === 'benefits' ? 'active' : ''}`}
                                onClick={() => setActiveSection('benefits')}
                            >
                                <TrophyOutlined /> Phúc lợi
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="job-content-sections">
                            {/* Job Description Section */}
                            <div className={`content-section ${activeSection === 'description' ? 'active' : ''}`}>
                                <Card bordered={false} className="content-card">
                                    <Title level={4}>
                                        <BookOutlined /> Mô tả công việc
                                    </Title>
                                    <Divider />
                                    {job.description ? (
                                        <div
                                            className="job-description"
                                            dangerouslySetInnerHTML={{ __html: job.description }}
                                        />
                                    ) : (
                                        <Paragraph className="job-description empty-description">
                                            Chưa có mô tả chi tiết cho vị trí này.
                                        </Paragraph>
                                    )}

                                    {/* Image Gallery */}
                                    {/* {job.hinhanh && job.hinhanh.length > 0 && (
                                        <div className="job-image-gallery">
                                            <Divider orientation="left">Hình ảnh</Divider>
                                            <Row gutter={[16, 16]}>
                                                {job.hinhanh.map((image, index) => (
                                                    <Col xs={24} sm={12} md={8} key={index}>
                                                        <Card
                                                            hoverable
                                                            cover={<img alt={`Job image ${index}`} src={image} />}
                                                            bodyStyle={{ padding: 0 }}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                    )} */}
                                </Card>
                            </div>

                            {/* Company Info Section */}
                            <div className={`content-section ${activeSection === 'company' ? 'active' : ''}`}>
                                <Card bordered={false} className="content-card">
                                    <Title level={4}>
                                        <TeamOutlined /> Thông tin công ty
                                    </Title>
                                    <Divider />
                                    <div className="company-info-details">
                                        <div className="company-header">
                                            <Avatar src={companyInfo.logo} size={80} shape="square" />
                                            <div className="company-name-container">
                                                <Title level={3}>{companyInfo.name}</Title>
                                                <Text type="secondary">{companyInfo.website}</Text>
                                            </div>
                                        </div>

                                        <Divider />

                                        <div className="company-details">
                                            <Row gutter={[24, 24]}>
                                                <Col xs={24} md={12}>
                                                    <div className="company-detail-item">
                                                        <TeamOutlined className="detail-icon" />
                                                        <div>
                                                            <Text type="secondary">Quy mô công ty:</Text>
                                                            <div>{companyInfo.employees} nhân viên</div>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col xs={24} md={12}>
                                                    <div className="company-detail-item">
                                                        <EnvironmentOutlined className="detail-icon" />
                                                        <div>
                                                            <Text type="secondary">Địa điểm:</Text>
                                                            <div>{job.location}</div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Divider dashed />

                                            <div className="company-description">
                                                <Title level={5}>Giới thiệu công ty</Title>
                                                <Paragraph>{companyInfo.description}</Paragraph>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Benefits Section */}
                            <div className={`content-section ${activeSection === 'benefits' ? 'active' : ''}`}>
                                <Card bordered={false} className="content-card">
                                    <Title level={4}>
                                        <TrophyOutlined /> Phúc lợi
                                    </Title>
                                    <Divider />

                                    <List
                                        itemLayout="horizontal"
                                        dataSource={benefits}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={item.icon} className="benefit-icon" />}
                                                    title={item.title}
                                                    description={item.description}
                                                />
                                            </List.Item>
                                        )}
                                    />

                                    <Divider dashed />

                                    <div className="application-hint">
                                        <BulbOutlined className="hint-icon" />
                                        <div>
                                            <Text strong>Mẹo ứng tuyển:</Text>
                                            <Paragraph>
                                                Chuẩn bị CV nổi bật và đề cập đến các kỹ năng phù hợp với vị trí này.
                                                Nhấn mạnh kinh nghiệm liên quan để tăng cơ hội được chọn.
                                            </Paragraph>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Col>

                    {/* Right Column */}
                    <Col xs={24} lg={8} className="right-column">
                        <Affix offsetTop={20}>
                            <div className="right-column-content">
                                {/* Action Card */}
                                <Card className="job-action-card">
                                    <div className="card-content">
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            onClick={showModal}
                                            icon={<CheckCircleOutlined />}
                                            className="apply-button"
                                        >
                                            Ứng tuyển ngay
                                        </Button>

                                        <Divider>hoặc</Divider>

                                        <div className="email-apply">
                                            <Text type="secondary">Gửi CV đến email:</Text>
                                            <Button
                                                type="link"
                                                icon={<MailOutlined />}
                                                href="mailto:iky.hcns@gmail.com"
                                            >
                                                iky.hcns@gmail.com
                                            </Button>
                                        </div>

                                        <Button
                                            icon={<ShareAltOutlined />}
                                            block
                                            className="share-button"
                                            onClick={copyJobLink}
                                        >
                                            Chia sẻ vị trí này
                                        </Button>
                                    </div>
                                </Card>

                                {/* Job Summary Card */}
                                <Card className="job-summary-card" title="Thông tin công việc">
                                    <div className="job-summary-content">
                                        <div className="summary-item">
                                            <DollarOutlined className="summary-icon" />
                                            <div>
                                                <Text type="secondary">Mức lương:</Text>
                                                <div className="summary-value">
                                                    {formatSalary(job.minSalary, job.maxSalary)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="summary-item">
                                            <EnvironmentOutlined className="summary-icon" />
                                            <div>
                                                <Text type="secondary">Địa điểm:</Text>
                                                <div className="summary-value">{job.location}</div>
                                            </div>
                                        </div>

                                        <div className="summary-item">
                                            <ClockCircleOutlined className="summary-icon" />
                                            <div>
                                                <Text type="secondary">Hình thức:</Text>
                                                <div className="summary-value">
                                                    <Tag color="blue">{job.time || 'Full Time'}</Tag>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="summary-item">
                                            <CalendarOutlined className="summary-icon" />
                                            <div>
                                                <Text type="secondary">Hạn nộp hồ sơ:</Text>
                                                <div className="summary-value">{formatDate(job.deadline)}</div>
                                            </div>
                                        </div>

                                        <div className="summary-item">
                                            <UserOutlined className="summary-icon" />
                                            <div>
                                                <Text type="secondary">Vị trí:</Text>
                                                <div className="summary-value">{job.position || job.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Similar Jobs Card */}
                                {/* <Card className="similar-jobs-card" title="Công việc tương tự">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={[
                                            { title: 'Frontend Developer', company: 'ABC Corp', location: 'Hà Nội' },
                                            { title: 'UX/UI Designer', company: 'XYZ Tech', location: 'Hồ Chí Minh' },
                                            {
                                                title: 'Product Manager',
                                                company: 'Tech Solutions',
                                                location: 'Đà Nẵng',
                                            },
                                        ]}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={<BulbOutlined />} />}
                                                    title={<a href="#">{item.title}</a>}
                                                    description={`${item.company} • ${item.location}`}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card> */}
                            </div>
                        </Affix>
                    </Col>
                </Row>
            </div>

            {/* Application Modal */}
            <Modal
                title={<Title level={4}>Ứng tuyển vị trí {job.title}</Title>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={700}
                className="application-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        salary: undefined,
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên của bạn" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="example@email.com" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 số!' },
                                ]}
                            >
                                <Input placeholder="0xxxxxxxxx" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="birthday" label="Ngày sinh">
                                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="salary"
                                label="Mức lương mong muốn (VNĐ)"
                                rules={[{ required: true, message: 'Vui lòng nhập mức lương mong muốn!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    placeholder="Nhập mức lương mong muốn"
                                    min={0}
                                    prefix={<DollarOutlined />}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                name="cv"
                                label={
                                    <span>
                                        Tải lên CV của bạn
                                        <Tooltip title="Chỉ chấp nhận file PDF, dung lượng tối đa 5MB">
                                            <span className="upload-tooltip"> (?) </span>
                                        </Tooltip>
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng tải lên CV của bạn!' }]}
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                        return e;
                                    }
                                    return e && e.fileList;
                                }}
                            >
                                <Upload {...uploadProps} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Chọn file CV (PDF)</Button>
                                    {fileList.length === 0 && (
                                        <Text type="secondary" className="upload-hint">
                                            Chỉ chấp nhận file PDF, tối đa 5MB
                                        </Text>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={24} className="form-actions">
                            <Button type="default" onClick={handleCancel} style={{ marginRight: 16 }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loadingJob} icon={<FilePdfOutlined />}>
                                Gửi hồ sơ ứng tuyển
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Contact data={landingPageData.Contact} />
        </>
    );
};

export default DetailJob;
