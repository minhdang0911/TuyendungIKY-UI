import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, notification, Card, Typography, Layout, Row, Col, Alert, Space, Divider } from 'antd';
import { LockOutlined, SafetyOutlined, EyeTwoTone, EyeInvisibleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { apiResetPassword } from '../apis/staff';

const { Title, Text, Paragraph, Link } = Typography;
const { Content } = Layout;

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // If password reset successful, redirect after countdown
        if (success && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (success && countdown === 0) {
            navigate('/login');
        }
    }, [success, countdown, navigate]);

    const handleResetPassword = async (values) => {
        const { newPassword } = values;
        setLoading(true);
        setError('');

        try {
            const response = await apiResetPassword(token, newPassword);
            if (response.code === 200) {
                notification.success({
                    message: 'Thành công!',
                    description: 'Mật khẩu đã được thay đổi thành công!',
                    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
                });
                setSuccess(true);
                // Redirect handled by useEffect and countdown
            } else {
                setError(response.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Đã có lỗi xảy ra hoặc liên kết đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.');
        } finally {
            setLoading(false);
        }
    };

    // Password strength indicator
    const checkPasswordStrength = (password) => {
        if (!password) return { level: 0, text: '', color: '' };

        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const length = password.length;

        let strength = 0;
        if (length >= 8) strength += 1;
        if (hasLowerCase && hasUpperCase) strength += 1;
        if (hasNumbers) strength += 1;
        if (hasSpecialChars) strength += 1;

        const strengthMap = {
            0: { level: 0, text: 'Rất yếu', color: '#ff4d4f' },
            1: { level: 1, text: 'Yếu', color: '#faad14' },
            2: { level: 2, text: 'Trung bình', color: '#1890ff' },
            3: { level: 3, text: 'Mạnh', color: '#52c41a' },
            4: { level: 4, text: 'Rất mạnh', color: '#389e0d' },
        };

        return strengthMap[strength];
    };

    const renderPasswordStrength = () => {
        const password = form.getFieldValue('newPassword');
        if (!password) return null;

        const strength = checkPasswordStrength(password);

        return (
            <div style={{ marginTop: 8, marginBottom: 16 }}>
                <Text>
                    Độ mạnh mật khẩu:{' '}
                    <Text strong style={{ color: strength.color }}>
                        {strength.text}
                    </Text>
                </Text>
                <div style={{ display: 'flex', marginTop: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            style={{
                                height: 4,
                                width: '25%',
                                backgroundColor: i <= strength.level ? strength.color : '#f0f0f0',
                                marginRight: i < 4 ? 2 : 0,
                                transition: 'all 0.3s',
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // const renderPasswordTips = () => (
    //     <Card size="small" style={{ marginBottom: 24, backgroundColor: '#f9f9f9' }}>
    //         <Title level={5}>Mật khẩu mạnh nên có:</Title>
    //         <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
    //             <li>Ít nhất 8 ký tự</li>
    //             <li>Kết hợp chữ hoa và chữ thường</li>
    //             <li>Ít nhất một chữ số</li>
    //             <li>Ít nhất một ký tự đặc biệt (!, @, #, $, %...)</li>
    //         </ul>
    //     </Card>
    // );

    if (success) {
        return (
            <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
                <Content>
                    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                        <Col xs={22} sm={18} md={14} lg={8} xl={6}>
                            <Card
                                style={{
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    textAlign: 'center',
                                    padding: '24px 12px',
                                }}
                            >
                                <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 24 }} />
                                <Title level={3}>Mật khẩu đã được đặt lại!</Title>
                                <Paragraph>
                                    Bạn sẽ được chuyển hướng đến trang đăng nhập sau {countdown} giây.
                                </Paragraph>
                                <Button type="primary" onClick={() => navigate('/login')} style={{ marginTop: 16 }}>
                                    Đăng nhập ngay
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content>
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Col xs={22} sm={18} md={14} lg={8} xl={6}>
                        <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <SafetyOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                                <Title level={3} style={{ margin: 0 }}>
                                    Đặt lại mật khẩu
                                </Title>
                                <Text type="secondary">Tạo mật khẩu mới cho tài khoản của bạn</Text>
                            </div>

                            {error && (
                                <Alert
                                    message="Lỗi"
                                    description={error}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 24 }}
                                />
                            )}

                            {/* {renderPasswordTips()} */}

                            <Form form={form} layout="vertical" onFinish={handleResetPassword} requiredMark={false}>
                                <Form.Item
                                    name="newPassword"
                                    label="Mật khẩu mới"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                        { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        placeholder="Nhập mật khẩu mới"
                                        size="large"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        onChange={() => form.validateFields(['confirmPassword'])}
                                    />
                                </Form.Item>

                                {renderPasswordStrength()}

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
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        placeholder="Xác nhận mật khẩu mới"
                                        size="large"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                                        Đặt lại mật khẩu
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider />

                            <div style={{ textAlign: 'center' }}>
                                <Space>
                                    <Link onClick={() => navigate('/login')}>Quay lại đăng nhập</Link>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default ResetPasswordPage;
