import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Checkbox,
    Divider,
    Typography,
    Space,
    Alert,
    Card,
    Layout,
    Row,
    Col,
    notification,
    Upload,
    DatePicker,
    Select,
} from 'antd';
import {
    UserOutlined,
    LockOutlined,
    EyeTwoTone,
    EyeInvisibleOutlined,
    UploadOutlined,
    MailOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { apiLoginUser, apiRegister, apiForgotPassword, apiResetPassword } from '../../apis/staff';
import Cookies from 'js-cookie';

const { Title, Text, Link } = Typography;
const { Content } = Layout;
const { Option } = Select;

const AuthForm = () => {
    const [form] = Form.useForm();
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams(); // For reset password route

    // Check if we're on the reset password page
    const isResetPassword = !!token;

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail && !isResetPassword) {
            form.setFieldsValue({ email: savedEmail, remember: true });
        }
    }, [form, isResetPassword]);

    const toggleForm = () => {
        setIsRegister(!isRegister);
        setIsForgotPassword(false);
        setError('');
        form.resetFields();
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(!isForgotPassword);
        setIsRegister(false);
        setError('');
        form.resetFields();
    };

    const handleLogin = async (values) => {
        const { email, password, remember } = values;
        setLoading(true);
        setError('');

        try {
            const response = await apiLoginUser(email, password);
            if (response.code === 200) {
                const token = response.token;

                // 👇 Lưu token vào cookies
                Cookies.set('accessToken', token, {
                    expires: 1, // 1 ngày
                    secure: true, // bắt buộc nếu HTTPS
                    sameSite: 'Lax',
                });

                if (remember) localStorage.setItem('savedEmail', email);
                else localStorage.removeItem('savedEmail');

                notification.success({ message: 'Đăng nhập thành công' });
                setTimeout(() => navigate('/'), 500);
            }
        } catch {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin');
        } finally {
            setLoading(false);
        }
    };
    const handleRegister = async (values) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key === 'avatar') return;

            if (key === 'ngaysinh') {
                formData.append('ngaysinh', value.format('DD-MM-YYYY'));
            } else {
                formData.append(key, value);
            }
        });

        if (values.avatar && values.avatar[0]?.originFileObj) {
            formData.append('avatar', values.avatar[0].originFileObj);
        }

        setLoading(true);
        try {
            const response = await apiRegister(formData);
            if (response.data.code === 201) {
                notification.success({ message: 'Đăng ký thành công', description: 'Bạn có thể đăng nhập ngay!' });
                setIsRegister(false);
                form.resetFields();
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (values) => {
        const { email } = values;
        setLoading(true);
        setError('');

        try {
            const response = await apiForgotPassword(email);
            if (response.code === 200) {
                notification.success({
                    message: 'Gửi email thành công',
                    description: 'Vui lòng kiểm tra email để nhận hướng dẫn đặt lại mật khẩu.',
                });
                setIsForgotPassword(false);
                form.resetFields();
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'email không tồn tại trong hệ thống');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (values) => {
        const { newPassword } = values;
        setLoading(true);
        setError('');

        try {
            const response = await apiResetPassword(token, newPassword);

            if (response.code === 200) {
                notification.success({
                    message: 'Đặt lại mật khẩu thành công',
                    description: 'Bạn có thể đăng nhập bằng mật khẩu mới.',
                });
                setTimeout(() => navigate('/login'), 1500);
            } else {
                // Nếu response code không phải 200, hiển thị thông báo lỗi
                notification.error({
                    message: 'Lỗi',
                    description: response.message || 'Có lỗi xảy ra, vui lòng thử lại.',
                });
            }
        } catch (err) {
            // Log lỗi để xem chi tiết và đảm bảo err.response là có sẵn
            console.error('Error in handleResetPassword:', err);

            // Nếu lỗi có response và message, hiển thị thông báo lỗi từ response
            notification.error({
                message: 'Lỗi',
                description: err?.response?.data?.message || 'Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn.',
            });
        } finally {
            setLoading(false);
        }
    };

    const onFinish = (values) => {
        if (isResetPassword) {
            handleResetPassword(values);
        } else if (isForgotPassword) {
            handleForgotPassword(values);
        } else if (isRegister) {
            handleRegister(values);
        } else {
            handleLogin(values);
        }
    };

    // Render the appropriate form based on the current state
    const renderFormContent = () => {
        if (isResetPassword) {
            return (
                <>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2}>Đặt lại mật khẩu</Title>
                        <Text type="secondary">Nhập mật khẩu mới của bạn</Text>
                    </div>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                        ]}
                    >
                        <Input.Password
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                            placeholder="Mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                            placeholder="Xác nhận mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            Đặt lại mật khẩu
                        </Button>
                    </Form.Item>
                </>
            );
        } else if (isForgotPassword) {
            return (
                <>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2}>Quên mật khẩu</Title>
                        <Text type="secondary">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</Text>
                    </div>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input prefix={<MailOutlined />} size="large" placeholder="Email" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            Gửi email khôi phục
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Link onClick={toggleForgotPassword}>Quay lại đăng nhập</Link>
                    </div>
                </>
            );
        } else if (isRegister) {
            return (
                <>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2}>Đăng ký</Title>
                        <Text type="secondary">Tạo tài khoản mới</Text>
                    </div>

                    <Form.Item
                        name="hoten"
                        label="Họ tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input size="large" placeholder="Họ tên" />
                    </Form.Item>

                    <Form.Item
                        name="gioitinh"
                        label="Giới tính"
                        rules={[{ required: true, message: 'Chọn giới tính' }]}
                    >
                        <Select size="large" placeholder="Chọn giới tính">
                            <Option value="Nam">Nam</Option>
                            <Option value="Nữ">Nữ</Option>
                            <Option value="Khác">Khác</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ngaysinh"
                        label="Ngày sinh"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                        <DatePicker format="DD-MM-YYYY" size="large" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="Ảnh đại diện (không bắt buộc)"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload beforeUpload={() => false} listType="picture">
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true }, { type: 'email', message: 'Email không hợp lệ' }]}
                    >
                        <Input size="large" placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <Divider plain />
                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary">
                            Đã có tài khoản? <Link onClick={toggleForm}>Đăng nhập</Link>
                        </Text>
                    </div>
                </>
            );
        } else {
            // Default login form
            return (
                <>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={2}>Đăng nhập</Title>
                        <Text type="secondary">Chào mừng bạn quay trở lại</Text>
                    </div>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true }, { type: 'email', message: 'Email không hợp lệ' }]}
                    >
                        <Input size="large" placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    >
                        <Input.Password
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Row justify="space-between" align="middle">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Nhớ đăng nhập</Checkbox>
                        </Form.Item>
                        <Link onClick={toggleForgotPassword}>Quên mật khẩu?</Link>
                    </Row>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <Divider plain />
                    <div style={{ textAlign: 'center' }}>
                        <Text type="secondary">
                            Chưa có tài khoản? <Link onClick={toggleForm}>Đăng ký ngay</Link>
                        </Text>
                    </div>
                </>
            );
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content>
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Col xs={22} sm={20} md={16} lg={10} xl={8}>
                        <Card variant={false} style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.2)' }}>
                            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                {renderFormContent()}
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default AuthForm;
