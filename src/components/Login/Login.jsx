import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { apiLoginUser, apiRegister } from '../../apis/staff';

const { Title, Text, Link } = Typography;
const { Content } = Layout;
const { Option } = Select;

const AuthForm = () => {
    const [form] = Form.useForm();
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            form.setFieldsValue({ email: savedEmail, remember: true });
        }
    }, [form]);

    const toggleForm = () => {
        setIsRegister(!isRegister);
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

    const onFinish = (values) => {
        isRegister ? handleRegister(values) : handleLogin(values);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Content>
                <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                    <Col xs={22} sm={20} md={16} lg={10} xl={8}>
                        <Card variant={false} style={{ boxShadow: '0 3px 6px rgba(0,0,0,0.2)' }}>
                            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                <Title level={2}>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</Title>
                                <Text type="secondary">
                                    {isRegister ? 'Tạo tài khoản mới' : 'Chào mừng bạn quay trở lại'}
                                </Text>
                            </div>

                            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                {isRegister && (
                                    <>
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
                                    </>
                                )}

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

                                {!isRegister && (
                                    <Form.Item name="remember" valuePropName="checked">
                                        <Checkbox>Nhớ đăng nhập</Checkbox>
                                    </Form.Item>
                                )}

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                                        {isRegister ? 'Đăng ký' : 'Đăng nhập'}
                                    </Button>
                                </Form.Item>
                            </Form>

                            <Divider plain />
                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">
                                    {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                                    <Link onClick={toggleForm}>{isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}</Link>
                                </Text>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default AuthForm;
