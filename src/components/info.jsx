import React from 'react';
import { Typography, Row, Col, Card, Button, Timeline } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import './AboutUs.css'; // Assuming you'd create a separate CSS file
import { Navigation } from './navigation';
import { Contact } from './contact';
import { useState } from 'react';
import { useEffect } from 'react';
import JsonData from '../data/data.json';

const { Title, Paragraph, Text } = Typography;

export default function AboutUs() {
    const [landingPageData, setLandingPageData] = useState({});
    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);
    return (
        <div className="about-container">
            {/* Hero Banner */}

            <Navigation />

            <div className="content-container" style={{ marginTop: '8%' }}>
                {/* Company History */}
                <div className="section">
                    <Title level={2} className="section-title1">
                        LỊCH SỬ HÌNH THÀNH
                    </Title>
                    <Row gutter={32}>
                        <Col xs={24} md={16}>
                            <Paragraph className="history-text">
                                IKY từ những ngày đầu thành lập vào năm 2014 đã xác định tầm nhìn dài hạn trở thành công
                                ty thiết bị điện tử thông minh và thiết bị chống trộm xe máy hàng đầu Việt Nam.
                            </Paragraph>
                            <Paragraph className="history-text">
                                Đến nay, IKY đã phát triển thành thương hiệu uy tín trong lĩnh vực thiết bị điện tử
                                thông minh và thiết bị chống trộm xe máy, với các sản phẩm chất lượng cao, công nghệ
                                tiên tiến, đáp ứng nhu cầu ngày càng đa dạng của khách hàng Việt Nam.
                            </Paragraph>
                            <Paragraph className="history-text">
                                Với đội ngũ nhân viên tận tâm và giàu kinh nghiệm, chúng tôi luôn nỗ lực mang đến cho
                                khách hàng những sản phẩm và dịch vụ tốt nhất.
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card variant={false} className="image-card">
                                <img
                                    src="https://theme.hstatic.net/200000863565/1001224143/14/home_banner_2_img.jpg?v=135"
                                    alt="Nha Xinh Anniversary"
                                    className="full-width-image"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                <div className="history-stats">
                    <div className="stat-item">
                        <div className="stat-number">10+</div>
                        <div className="stat-label">Năm kinh nghiệm</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">15K+</div>
                        <div className="stat-label">Khách hàng</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">30+</div>
                        <div className="stat-label">Sản phẩm</div>
                    </div>
                </div>

                {/* Timeline Section */}
                <Row className="section">
                    <Col span={24}>
                        <Card variant={false} className="timeline-card">
                            <Timeline
                                mode="left"
                                items={[
                                    {
                                        label: '2014',
                                        children:
                                            'IKY chính thức thành lập, định hướng phát triển thiết bị điện tử thông minh và chống trộm xe máy',
                                    },
                                    {
                                        label: '2015',
                                        children:
                                            'Bắt đầu nghiên cứu và phát triển các thiết bị chống trộm thông minh cho xe máy tại Việt Nam',
                                    },
                                    {
                                        label: '2016',
                                        children: 'Ra mắt sản phẩm chống trộm IKY Bike đầu tiên trên thị trường',
                                    },
                                    {
                                        label: '2018',
                                        children: 'Mở rộng hệ thống phân phối tại các tỉnh thành lớn trên toàn quốc',
                                    },
                                    {
                                        label: '2020',
                                        children:
                                            'Nâng cấp công nghệ sản phẩm với tính năng định vị GPS và điều khiển từ xa',
                                    },
                                    {
                                        label: '2022',
                                        children:
                                            'Phát triển thêm các dòng sản phẩm thiết bị điện tử thông minh hỗ trợ phương tiện cá nhân',
                                    },
                                    {
                                        label: '2022',
                                        children:
                                            'Phát triển các ứng dụng hỗ trợ các head trong quy trình tiếp nhận khách hàng',
                                    },
                                    {
                                        label: '2024',
                                        children: 'Đẩy mạnh xuất khẩu thiết bị điện tử sang thị trường Đông Nam Á',
                                    },
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Leadership Section */}
                <div className="section">
                    <Title level={2} className="section-title1">
                        LÃNH ĐẠO
                    </Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Card variant={false} className="leader-card">
                                <div className="leader-content">
                                    {/* <img src="/api/placeholder/200/200" alt="CEO Portrait" className="leader-image" /> */}
                                    <div className="leader-info">
                                        <Title level={4}>Ông Nguyễn Đình Hùng</Title>
                                        <Text type="secondary" className="leader-title">
                                            Tổng giám đốc công ty
                                        </Text>
                                        <Paragraph>
                                            Với kinh nghiệm trong lĩnh vực thiết bị điện tử và công nghệ, ông Nguyễn
                                            Đình Hùng đã dẫn dắt IKY phát triển từ những ngày đầu thành lập trở thành
                                            thương hiệu hàng đầu về thiết bị điện tử thông minh và chống trộm xe máy tại
                                            Việt Nam.
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card variant={false} className="team-card">
                                <div className="team-content">
                                    <Title level={4}>ĐỘI NGŨ LÃNH ĐẠO</Title>
                                    <Paragraph>
                                        IKY tự hào với đội ngũ lãnh đạo giàu kinh nghiệm và tầm nhìn chiến lược. Các
                                        thành viên trong ban điều hành đều là những chuyên gia trong lĩnh vực công nghệ,
                                        kỹ thuật điện tử và kinh doanh thiết bị điện tử thông minh, thiết bị chống trộm
                                        xe máy.
                                    </Paragraph>
                                    <Button type="primary">
                                        Tìm hiểu thêm <RightOutlined />
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Design Philosophy */}
                <div className="section" style={{ marginTop: '5%' }}>
                    <Title level={2} className="section-title1">
                        GIÁ TRỊ CỐT LÕI CỦA IKY
                    </Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Card variant={false} className="value-card">
                                <img
                                    src="https://theme.hstatic.net/200000863565/1001224143/14/home_banner_1_img.jpg?v=135"
                                    alt="Smart Technology"
                                    className="full-width-image"
                                />
                                <Title level={4} className="value-title">
                                    CÔNG NGHỆ HIỆN ĐẠI
                                </Title>
                                <Paragraph>
                                    Chúng tôi luôn đề cao việc ứng dụng công nghệ tiên tiến trong từng sản phẩm. Các
                                    thiết bị điện tử thông minh và hệ thống chống trộm xe máy của IKY không chỉ đảm bảo
                                    hiệu quả cao trong việc bảo vệ tài sản mà còn mang lại trải nghiệm sử dụng tiện lợi,
                                    hiện đại cho khách hàng.
                                </Paragraph>
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card variant={false} className="value-card">
                                <Paragraph>
                                    IKY cam kết sử dụng các linh kiện chất lượng cao, được kiểm định chặt chẽ về độ bền
                                    và độ an toàn. Chúng tôi không ngừng cải tiến sản phẩm, kết hợp công nghệ mới nhằm
                                    tối ưu hiệu suất và độ tin cậy cho người dùng.
                                </Paragraph>
                                <Paragraph>
                                    Mỗi thiết bị trước khi đưa ra thị trường đều trải qua quy trình kiểm tra chất lượng
                                    nghiêm ngặt để đảm bảo sự an tâm tuyệt đối cho khách hàng.
                                </Paragraph>
                                <Title level={4} className="value-title">
                                    CHẤT LƯỢNG HÀNG ĐẦU
                                </Title>
                                <img
                                    src="https://product.hstatic.net/200000863565/product/iky--gps-1_89d52e61d4014154b6ff8351ade73ceb_master.jpg"
                                    alt="Top Quality Technology"
                                    className="full-width-image"
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* Case Studies Section */}
                {/* <div style={{ marginTop: '23%' }}>
                    <Title level={2} className="section-title">
                        CHUYỆN NHÀ XINH
                    </Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <Card
                                hoverable
                                cover={<img alt="Modern Living Room" src="/api/placeholder/320/200" />}
                                className="story-card"
                            >
                                <Title level={5}>KẾ HOẠCH THIẾT KẾ CĂN HỘ 57M² TRỌN VẸN VỚI MỌI CHỨC NĂNG</Title>
                                <Text type="secondary">12/04/2025</Text>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                hoverable
                                cover={<img alt="Interior Design" src="/api/placeholder/320/200" />}
                                className="story-card"
                            >
                                <Title level={5}>CẢM HỨNG SÁNG TẠO CỦA NHÀ THIẾT KẾ</Title>
                                <Text type="secondary">05/04/2025</Text>
                            </Card>
                        </Col>
                        <Col xs={24} md={8}>
                            <Card
                                hoverable
                                cover={<img alt="Living Space" src="/api/placeholder/320/200" />}
                                className="story-card"
                            >
                                <Title level={5}>
                                    KHÔNG GIAN SỐNG LÝ TƯỞNG - KẾT HỢP PHONG CÁCH Á ĐÔNG VÀ HIỆN ĐẠI
                                </Title>
                                <Text type="secondary">28/03/2025</Text>
                            </Card>
                        </Col>
                    </Row>
                    <div className="view-more">
                        <Button type="primary" size="large">
                            Xem thêm bài viết
                        </Button>
                    </div>
                </div> */}
            </div>

            <Contact data={landingPageData.Contact} />
        </div>
    );
}
