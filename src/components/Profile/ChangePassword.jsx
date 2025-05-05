import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { apiChangePassword } from '../../apis/staff';

const ChangePassword = () => {
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const { oldPassword, newPassword, confirmPassword } = values;
        if (newPassword !== confirmPassword) {
            message.error('Mật khẩu mới và xác nhận không khớp!');
            return;
        }

        try {
            await apiChangePassword({ oldPassword, newPassword, confirmPassword });
            message.success('Đổi mật khẩu thành công!');
            form.resetFields();
        } catch (error) {
            message.error(error.message || 'Đổi mật khẩu thất bại!');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 50 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Đổi mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
