import React from 'react';
import { Row, Col, Typography, Card, List, Divider, Image, Space, Spin } from 'antd';
import { CheckCircleFilled, LoadingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const About = (props) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    return (
        <div id="about" style={{ padding: '80px 0', backgroundColor: '#f8f9fa' }}>
            <Row justify="center">
                <Col xs={22} md={20} lg={18}>
                    <Card variant={false} style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                        <Row gutter={[48, 48]} align="middle">
                            <Col xs={24} md={12}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}
                                >
                                    <Image
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk6i1YvxT8gFWyAwk3tW8MjzQJocD3SUZ64A&s"
                                        alt="About Us"
                                        style={{
                                            borderRadius: '8px',
                                            width: '100%',
                                            maxHeight: '400px',
                                            objectFit: 'cover',
                                        }}
                                        preview={true}
                                        placeholder={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    height: '300px',
                                                }}
                                            >
                                                <Spin indicator={antIcon} />
                                            </div>
                                        }
                                    />
                                </div>
                            </Col>

                            <Col xs={24} md={12}>
                                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                    <Title level={2} style={{ marginBottom: '16px', color: '#1890ff' }}>
                                        Giới thiệu về chúng tôi
                                    </Title>

                                    {props.data ? (
                                        <Paragraph style={{ fontSize: '16px', color: '#555' }}>
                                            {props.data.paragraph}
                                        </Paragraph>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <Spin indicator={antIcon} />
                                        </div>
                                    )}

                                    <Divider style={{ margin: '24px 0' }} />

                                    <Title level={3} style={{ marginBottom: '16px', color: '#1890ff' }}>
                                        Tại sao lại chọn chúng tôi?
                                    </Title>

                                    {props.data ? (
                                        <Row gutter={[24, 0]}>
                                            <Col xs={24} sm={12}>
                                                <List
                                                    dataSource={props.data.Why}
                                                    renderItem={(item) => (
                                                        <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                                                            <Space>
                                                                <CheckCircleFilled style={{ color: '#52c41a' }} />
                                                                <span>{item}</span>
                                                            </Space>
                                                        </List.Item>
                                                    )}
                                                />
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <List
                                                    dataSource={props.data.Why2}
                                                    renderItem={(item) => (
                                                        <List.Item style={{ borderBottom: 'none', padding: '8px 0' }}>
                                                            <Space>
                                                                <CheckCircleFilled style={{ color: '#52c41a' }} />
                                                                <span>{item}</span>
                                                            </Space>
                                                        </List.Item>
                                                    )}
                                                />
                                            </Col>
                                        </Row>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            <Spin indicator={antIcon} />
                                        </div>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
