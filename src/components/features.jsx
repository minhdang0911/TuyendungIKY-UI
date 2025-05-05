import React from 'react';
import { Row, Col, Typography, Space, Card } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './feature.css';
const { Title, Paragraph } = Typography;

export const Features = (props) => {
    return (
        <div id="features" style={{ marginTop: '20px' }}>
            <Row justify="center" style={{ textAlign: 'center' }}>
                <Col xs={24} md={20}>
                    <Typography>
                        <Title level={2}>Features</Title>
                    </Typography>

                    {props.data ? (
                        <Row gutter={[24, 24]}>
                            {props.data.map((d, i) => (
                                <Col key={`${d.title}-${i}`} xs={12} md={6}>
                                    <Card
                                        variant={false}
                                        style={{
                                            textAlign: 'center',
                                            height: '100%', // Card chiếm toàn bộ chiều cao có sẵn
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                        bodyStyle={{
                                            flex: 1, // Body card sẽ mở rộng để lấp đầy không gian
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <div style={{ fontSize: '40px', margin: '20px 0' }}>
                                            <i className={d.icon}></i>
                                        </div>
                                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                            <Title level={4}>{d.title}</Title>
                                            <Paragraph ellipsis={{ rows: 3 }}>{d.text}</Paragraph>
                                        </Space>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div style={{ padding: '50px 0' }}>
                            <LoadingOutlined style={{ fontSize: 24 }} spin />
                            <Paragraph>Loading...</Paragraph>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    );
};
