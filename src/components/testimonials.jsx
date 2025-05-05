import React from 'react';
import { Card, Avatar, Typography, Row, Col, Carousel } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export const Testimonials = (props) => {
    // Responsive settings for different screen sizes
    const responsive = [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ];

    const renderTestimonials = () => {
        if (!props.data) return <div>Loading testimonials...</div>;

        return (
            <Row gutter={[16, 16]}>
                {props.data.map((testimonial, index) => (
                    <Col xs={24} sm={12} md={8} key={`${testimonial.name}-${index}`}>
                        <Card hoverable className="testimonial-card" style={{ height: '100%' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <Avatar
                                    src={testimonial.img}
                                    size={64}
                                    icon={<UserOutlined />}
                                    style={{ marginBottom: 16 }}
                                />
                                <Paragraph
                                    style={{
                                        fontSize: 16,
                                        fontStyle: 'italic',
                                        marginBottom: 16,
                                    }}
                                >
                                    "{testimonial.text}"
                                </Paragraph>
                                <Text strong>- {testimonial.name}</Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    // For mobile view, we can also offer a carousel option
    const renderMobileCarousel = () => {
        if (!props.data) return <div>Loading testimonials...</div>;

        return (
            <Carousel autoplay className="testimonial-carousel" dots={true} responsive={responsive}>
                {props.data.map((testimonial, index) => (
                    <div key={`${testimonial.name}-${index}`}>
                        <Card className="testimonial-card" style={{ margin: '0 8px', height: '100%' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <Avatar
                                    src={testimonial.img}
                                    size={64}
                                    icon={<UserOutlined />}
                                    style={{ marginBottom: 16 }}
                                />
                                <Paragraph
                                    style={{
                                        fontSize: 16,
                                        fontStyle: 'italic',
                                        marginBottom: 16,
                                    }}
                                >
                                    "{testimonial.text}"
                                </Paragraph>
                                <Text strong>- {testimonial.name}</Text>
                            </div>
                        </Card>
                    </div>
                ))}
            </Carousel>
        );
    };

    return (
        <div id="testimonials" style={{ padding: '60px 0' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 15px' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={2}>What our clients say</Title>
                </div>

                {/* Desktop and tablet view */}
                <div className="desktop-view">{renderTestimonials()}</div>

                {/* Mobile view with carousel - visible only on small screens using CSS */}
                {/* <div className="mobile-view">
                    {renderMobileCarousel()}
                </div> */}
            </div>
        </div>
    );
};
