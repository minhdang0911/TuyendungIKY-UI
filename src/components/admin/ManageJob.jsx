import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Space,
    Typography,
    Upload,
    message,
    Select,
    Popconfirm,
    Card,
    Divider,
    Image,
    Tag,
    Row,
    Col,
    notification,
    List,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined,
    InboxOutlined,
    UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import { apiCreateJob, apiDeleteJob, apiUpdateJob, apiGetAllJob } from '../../apis/Jobs';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getApplicationsByJob } from '../../apis/Applications';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const ManageJob = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [removedOldImages, setRemovedOldImages] = useState([]);
    const [description, setDescription] = useState('');
    const [isApplicationsModalVisible, setIsApplicationsModalVisible] = useState(false);
    const [applications, setApplications] = useState([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState('');

    // Time options for dropdown
    const timeOptions = ['Full-time', 'Part-time', 'Internship'];

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await apiGetAllJob();
            setJobs(response.data);
        } catch (error) {
            message.error('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentJob(null);
        form.resetFields();
        setFileList([]);
        setRemovedImages([]);
        setModalVisible(true);
    };

    const openEditModal = (job) => {
        setEditMode(true);
        setCurrentJob(job);
        setDescription(job.description); // <- thêm dòng này để CKEditor hiển thị mô tả
        form.setFieldsValue({
            title: job.title,
            description: job.description,
            minSalary: job.minSalary,
            maxSalary: job.maxSalary,
            location: job.location,
            deadline: job.deadline ? moment(job.deadline) : null,
            time: job.time,
        });
        setFileList([]);
        setRemovedImages([]);
        setModalVisible(true);
    };

    const openDetailsModal = (job) => {
        setCurrentJob(job);
        setDetailsModalVisible(true);
    };

    const handleSubmit = async (id, values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('location', values.location);
        formData.append('time', values.time);

        // Xử lý deadline
        if (values.deadline) {
            formData.append('deadline', values.deadline.format('DD-MM-YYYY'));
        }

        // Kiểm tra nếu không có minSalary và maxSalary thì gán salaryType là 'negotiable'
        if (!values.minSalary && !values.maxSalary) {
            formData.append('salaryType', 'negotiable');
        } else {
            // Nếu có minSalary và maxSalary thì thêm chúng vào formData
            formData.append('minSalary', values.minSalary);
            formData.append('maxSalary', values.maxSalary);
        }

        // Upload ảnh
        fileList.forEach((file) => {
            if (file.originFileObj) {
                formData.append('hinhanh', file.originFileObj);
            }
        });

        // Xử lý ảnh đã bị xóa (nếu có)
        if (editMode && removedImages.length > 0) {
            formData.append('removedImages', JSON.stringify(removedImages));
        }

        let hideLoadingMessage;

        try {
            setLoading(true);
            hideLoadingMessage = message.loading(`${editMode ? 'Đang cập nhật' : 'Đang thêm'} công việc...`, 0);

            let response;
            if (editMode) {
                response = await apiUpdateJob(id, formData);

                if (response.data.code === 200) {
                    notification.success({
                        message: 'Thành công',
                        description: 'Cập nhật công việc thành công!',
                        placement: 'topRight',
                    });
                }
            } else {
                response = await apiCreateJob(formData);
                if (response.data.code === 200) {
                    notification.success({
                        message: 'Thành công',
                        description: 'Thêm công việc mới thành công!',
                        placement: 'topRight',
                    });
                }
            }

            setModalVisible(false);
            fetchJobs(); // refresh list
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: `Không thể ${editMode ? 'cập nhật' : 'thêm'} công việc: ${error.message}`,
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
            hideLoadingMessage && hideLoadingMessage();
        }
    };

    const handleCloseModal = () => {
        form.resetFields(); // Reset tất cả các trường trong form
        setModalVisible(false); // Đóng modal
        setDescription(''); // Reset lại description nếu cần
    };

    const handleDelete = async (id) => {
        try {
            const response = await apiDeleteJob(id);

            if (response.data.success === true) {
                message.success('Xóa công việc thành công');
                fetchJobs();
            }
        } catch (error) {
            message.error('Failed to delete job');
        }
    };

    const handleImageRemove = (url) => {
        setRemovedImages([...removedImages, url]);
        message.success('Image marked for removal');
    };

    const openApplicationsModal = async (jobId, jobTitle) => {
        try {
            // Fetch applications for the job
            const response = await getApplicationsByJob(jobId);
            setApplications(response.data);
            setSelectedJobTitle(jobTitle);
            setIsApplicationsModalVisible(true);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        }
    };

    const closeApplicationsModal = () => {
        setIsApplicationsModalVisible(false);
        setApplications([]);
    };

    const columns = [
        {
            title: 'Tên công việc',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text, record) => <a onClick={() => openDetailsModal(record)}>{text}</a>,
        },
        {
            title: 'Khoảng Lương',
            key: 'salary',
            render: (_, record) => {
                const formatSalary = (salary) => {
                    return new Intl.NumberFormat('vi-VN').format(salary);
                };

                // Kiểm tra nếu minSalary hoặc maxSalary là NaN
                const minSalary = isNaN(record.minSalary) ? '0' : formatSalary(record.minSalary);
                const maxSalary = isNaN(record.maxSalary) ? '0' : formatSalary(record.maxSalary);

                return (
                    <span>
                        {minSalary} - {maxSalary}
                    </span>
                );
            },
            sorter: (a, b) => a.minSalary - b.minSalary,
        },
        {
            title: 'Loại Lương',
            dataIndex: 'salaryType',
            key: 'salaryType',
            render: (salaryType) => {
                return salaryType === 'negotiable' ? 'Thỏa thuận' : 'Lương cụ thể';
            },
        },

        {
            title: 'Địa điểm',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Hình thức',
            dataIndex: 'time',
            key: 'time',
            render: (time) => (
                <Tag
                    color={
                        time === 'Full-time'
                            ? 'green'
                            : time === 'Part-time'
                            ? 'blue'
                            : time === 'Internship'
                            ? 'orange'
                            : 'gray'
                    }
                >
                    {time}
                </Tag>
            ),
        },
        {
            title: 'Hạn nộp',
            dataIndex: 'deadline',
            key: 'deadline',
            render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'No deadline'),
            sorter: (a, b) => {
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return moment(a.deadline).diff(moment(b.deadline));
            },
        },

        {
            title: 'Ngày đăng tuyển',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'No deadline'),
            sorter: (a, b) => {
                if (!a.createdAt) return 1;
                if (!b.createdAt) return -1;
                return moment(a.createdAt).diff(moment(b.createdAt));
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => openDetailsModal(record)} size="small" />
                    <Button type="primary" icon={<EditOutlined />} onClick={() => openEditModal(record)} size="small" />
                    <Popconfirm
                        title="Bạn có muốn xóa công việc này ?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                    <Button
                        icon={<UserOutlined />}
                        onClick={() => openApplicationsModal(record._id, record.title)}
                        size="small"
                    >
                        Xem ứng viên
                    </Button>
                </Space>
            ),
        },
    ];

    // Hàm để xác định màu sắc của tag
    const getTagColor = (status) => {
        switch (status) {
            case 'pending':
                return 'orange';
            case 'interview':
                return 'blue';
            case 'review':
                return 'purple';
            case 'accepted':
                return 'green';
            case 'rejected':
                return 'red';
            default:
                return 'default';
        }
    };

    // Hàm để xác định label của tag
    const getTagLabel = (status) => {
        switch (status) {
            case 'pending':
                return 'Đang chờ';
            case 'interview':
                return 'Phỏng vấn';
            case 'review':
                return 'Đang xem xét';
            case 'accepted':
                return 'Đã phê duyệt';
            case 'rejected':
                return 'Đã từ chối';
            default:
                return 'Chưa rõ';
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col>
                    <Title level={2}>Quản lý công việc</Title>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                        Thêm công việc
                    </Button>
                </Col>
            </Row>

            <Divider />

            <Table columns={columns} dataSource={jobs} rowKey="_id" loading={loading} pagination={{ pageSize: 10 }} />

            {/* Create/Edit Job Modal */}
            <Modal
                title={editMode ? 'Cập nhật công việc' : ' Thêm công việc'}
                open={modalVisible}
                onCancel={() => handleCloseModal()}
                footer={null}
                width={800}
                bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => handleSubmit(editMode ? currentJob?._id : null, values)}
                    initialValues={{ time: 'Full-time' }}
                >
                    <Form.Item
                        name="title"
                        label="Tên công việc"
                        rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
                    >
                        <Input placeholder="Nhập tên công việc" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc' }]}
                    >
                        <CKEditor
                            editor={ClassicEditor}
                            data={description}
                            config={{
                                height: '5000px',
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setDescription(data);
                                form.setFieldsValue({ description: data }); // <- THÊM DÒNG NÀY
                            }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="minSalary" label="Lương tối thiểu">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="Nhập lương tối thiểu "
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="maxSalary" label="Lương tối đa">
                                <InputNumber
                                    style={{ width: '100%' }}
                                    min={0}
                                    placeholder="Nhập lương tối đa "
                                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="location"
                        label="Địa điểm"
                        rules={[{ required: true, message: 'Vui lòng chọn địa điểm' }]}
                    >
                        <Select placeholder="Chọn Tỉnh Thành" allowClear>
                            <Option value="Thành Phố Hồ Chí Minh">Thành Phố Hồ Chí Minh</Option>
                            <Option value="Hà Nội">Hà Nội</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="time"
                        label="Hình thức"
                        rules={[{ required: true, message: 'Vui lòng chọn hình thức' }]}
                    >
                        <Select placeholder="Chọn hình thức">
                            {timeOptions.map((option) => (
                                <Option key={option} value={option}>
                                    {option}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="deadline" label="Hạn nộp">
                        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
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

                    {editMode && currentJob && currentJob.hinhanh && currentJob.hinhanh.length > 0 && (
                        <Form.Item label="Current Images">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {currentJob.hinhanh
                                    .filter((url) => !removedImages.includes(url))
                                    .map((url, index) => (
                                        <div key={index} style={{ position: 'relative', width: '120px' }}>
                                            <Image
                                                src={url}
                                                alt={`Job image ${index + 1}`}
                                                style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                                            />
                                            <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleImageRemove(url)}
                                                style={{ position: 'absolute', top: 5, right: 5 }}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editMode ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={() => setModalVisible(false)} disabled={loading}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Job Details Modal */}
            <Modal
                title="Chi tiết công việc"
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailsModalVisible(false)}>
                        Close
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => {
                            setDetailsModalVisible(false);
                            openEditModal(currentJob);
                        }}
                    >
                        Edit
                    </Button>,
                ]}
                width={800}
                bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
            >
                {currentJob && (
                    <Card bordered={false}>
                        <Title level={3}>{currentJob.title}</Title>
                        <Divider />

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text strong>Khoảng Lương</Text>
                                <p>
                                    {currentJob.minSalary}₫ - {currentJob.maxSalary}₫
                                </p>
                            </Col>
                            <Col span={12}>
                                <Text strong>Địa điểm:</Text>
                                <p>{currentJob.location}</p>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Text strong>Hình thức</Text>
                                <p>
                                    <Tag
                                        color={
                                            currentJob.time === 'Full-time'
                                                ? 'green'
                                                : currentJob.time === 'Part-time'
                                                ? 'blue'
                                                : currentJob.time === 'Contract'
                                                ? 'orange'
                                                : currentJob.time === 'Freelance'
                                                ? 'purple'
                                                : 'cyan'
                                        }
                                    >
                                        {currentJob.time || 'Not specified'}
                                    </Tag>
                                </p>
                            </Col>
                            <Col span={12}>
                                <Text strong>Hạn nộp:</Text>
                                <p>
                                    {currentJob.deadline
                                        ? moment(currentJob.deadline).format('DD/MM/YYYY')
                                        : 'No deadline'}
                                </p>
                            </Col>
                        </Row>

                        <Divider />

                        <Text strong>Mô tả:</Text>
                        <div
                            style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                paddingRight: '8px',
                            }}
                            dangerouslySetInnerHTML={{ __html: currentJob.description }}
                        />

                        {currentJob.hinhanh && currentJob.hinhanh.length > 0 && (
                            <>
                                <Divider />
                                <Text strong>Images:</Text>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 16 }}>
                                    {currentJob.hinhanh.map((url, index) => (
                                        <Image
                                            key={index}
                                            src={url}
                                            alt={`Job image ${index + 1}`}
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </Card>
                )}
            </Modal>

            <Modal
                title={`Danh sách ứng viên cho công việc: ${selectedJobTitle}`}
                visible={isApplicationsModalVisible}
                onCancel={closeApplicationsModal}
                footer={null}
                width={800} // Mở rộng modal
            >
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {' '}
                    {/* Điều chỉnh chiều cao và cho phép cuộn */}
                    <List
                        itemLayout="vertical"
                        dataSource={applications}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    description={
                                        <>
                                            <p>
                                                <strong>Họ tên:</strong> {item?.userId?.hoten} |{' '}
                                                <Tag color={getTagColor(item.status)}>{getTagLabel(item.status)}</Tag>
                                            </p>
                                            <p>
                                                <strong>Email:</strong> {item.email} | <strong>Số điện thoại:</strong>{' '}
                                                {item.phone}
                                            </p>
                                            <p>
                                                <strong>Ngày sinh:</strong> {moment(item.birthday).format('DD/MM/YYYY')}
                                            </p>
                                            <p>
                                                <strong>Thời gian apply:</strong>{' '}
                                                {moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                            </p>
                                        </>
                                    }
                                />
                                <Space>
                                    <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer">
                                        <Button type="primary">Xem CV</Button>
                                    </a>
                                </Space>
                            </List.Item>
                        )}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default ManageJob;
