import { useState } from 'react';
import emailjs from 'emailjs-com';
import React from 'react';
import { Input, Button, Form, Typography, Row, Col } from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    FacebookOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

const initialState = {
    name: '',
    email: '',
    message: '',
};

export const Contact = (props) => {
    const [{ name, email, message }, setState] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const clearState = () => setState({ ...initialState });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Replace with your own Service ID, Template ID, and Public Key from EmailJS
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_PUBLIC_KEY').then(
            (result) => {
                clearState();
            },
            (error) => {},
        );
    };

    return (
        <div>
            <div id="contact">
                <div className="container">
                    <Row gutter={24}>
                        <Col span={24} md={16}>
                            <div className="section-title">
                                <Title level={2}>Liên hệ</Title>
                                <p>
                                    Vui lòng điền vào biểu mẫu dưới đây để gửi email cho chúng tôi. Chúng tôi sẽ phản
                                    hồi bạn trong thời gian sớm nhất.
                                </p>
                            </div>
                            <Form
                                name="sentMessage"
                                onSubmit={handleSubmit}
                                layout="vertical"
                                validateTrigger="onSubmit"
                            >
                                <Row gutter={16}>
                                    <Col span={24} md={12}>
                                        <Form.Item label="Họ tên" required>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Họ tên"
                                                value={name}
                                                onChange={handleChange}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24} md={12}>
                                        <Form.Item label="Email" required>
                                            <Input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={handleChange}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item label="Nội dung" required>
                                    <TextArea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        placeholder="Nội dung"
                                        value={message}
                                        onChange={handleChange}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        Gửi tin nhắn
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={24} md={8}>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <Title level={3}>Thông tin liên hệ</Title>
                                    <p>
                                        <HomeOutlined /> Địa chỉ: {props.data ? props.data.address : 'loading'}
                                    </p>
                                    <p>
                                        <PhoneOutlined /> Số điện thoại: {props.data ? props.data.phone : 'loading'}
                                    </p>
                                    <p>
                                        <MailOutlined /> Email: {props.data ? props.data.email : 'loading'}
                                    </p>
                                </div>
                                <div className="social">
                                    <p>
                                        <a
                                            href={' https://www.facebook.com/tienichthongminh.iky/'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FacebookOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                                        </a>
                                        <a
                                            href={props.data ? props.data.twitter : '/'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <TwitterOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
                                        </a>
                                        <a
                                            href={' https://www.youtube.com/@ikychannel3424'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <YoutubeOutlined style={{ fontSize: '24px' }} />
                                        </a>
                                    </p>
                                </div>

                                <p>&copy; 2025. Design by </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};
