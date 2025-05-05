import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Skeleton, Badge, Layout, Breadcrumb, Button } from 'antd';
import { TeamOutlined, IdcardOutlined, FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { apiGetAllPhongBan } from '../apis/Department';
import { apiInfoUser } from '../apis/staff';
import { Navigation } from './navigation';
import { useNavigate } from 'react-router-dom';

import './Department.css';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Component to display departments
const Departments = () => {
    const [phongBan, setPhongBan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllPhongBan = async () => {
            try {
                setLoading(true);
                const response = await apiGetAllPhongBan();
                setPhongBan(response?.data || []);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu phòng ban:', error);
            } finally {
                setLoading(false);
            }
        };
        getAllPhongBan();
    }, []);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await apiInfoUser();

                if (response.code === 200) {
                    setUserName(response.data.hoten);
                    setInfo(response.data);
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin người dùng:', error);
            }
        };
        fetchInfo();
    }, []);

    // Hàm chuyển đổi tên phòng ban thành URL-friendly
    const convertToSlug = (text) => {
        return text
            .toLowerCase()
            .replace(/á|à|ạ|ả|ã|à|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
            .replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ể|ễ|ệ/g, 'e')
            .replace(/i|í|ì|ị|ỉ|ĩ/g, 'i')
            .replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ổ|ỗ|ộ/g, 'o')
            .replace(/ú|ù|ụ|ủ|ũ|ư|ứ|ừ|ử|ữ|ự/g, 'u')
            .replace(/ý|ỳ|ỵ|ỷ|ỹ/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    return (
        <Layout className="department-layout">
            <Navigation data={info} userName={userName} />
            <Content className="department-content">
                <div className="department-header">
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/')}
                        className="back-button"
                        style={{ color: 'black' }}
                    >
                        Quay lại
                    </Button>
                    <Breadcrumb
                        className="department-breadcrumb"
                        items={[{ title: 'Trang chủ', href: '/' }, { title: 'Phòng Ban' }]}
                    />

                    <div className="section-title">
                        <Title level={2}>Phòng Ban</Title>
                        <Paragraph className="subtitle">Danh Sách Các Phòng Ban Của Công Ty</Paragraph>
                    </div>
                </div>

                <Row gutter={[24, 24]} className="department-row">
                    {loading
                        ? // Skeleton loading states when data is loading
                          Array(8)
                              .fill()
                              .map((_, index) => (
                                  <Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
                                      <Card className="department-card skeleton-card">
                                          <Skeleton active paragraph={{ rows: 2 }} />
                                      </Card>
                                  </Col>
                              ))
                        : // Real data once loaded
                          phongBan.map((pb) => (
                              <Col xs={24} sm={12} md={8} lg={6} key={pb._id}>
                                  <Link
                                      to={`/phongban/${convertToSlug(pb.tenphong)}`}
                                      onClick={() => localStorage.setItem('maphong', pb._id)}
                                      className="department-link"
                                  >
                                      <Card className="department-card" hoverable>
                                          <Badge.Ribbon text="Phòng Ban" color="#1890ff" className="department-ribbon">
                                              <div className="department-icon">
                                                  <TeamOutlined />
                                              </div>
                                              <Title level={4} className="department-title">
                                                  {pb.tenphong}
                                              </Title>
                                              <div className="department-info">
                                                  <p>
                                                      <IdcardOutlined /> <Text strong>Mã phòng:</Text> {pb.maphong}
                                                  </p>
                                                  <p>
                                                      <FileTextOutlined /> <Text strong>Mô tả:</Text>{' '}
                                                      {pb.mota || 'Chưa có mô tả'}
                                                  </p>
                                              </div>
                                          </Badge.Ribbon>
                                      </Card>
                                  </Link>
                              </Col>
                          ))}
                </Row>
            </Content>
        </Layout>
    );
};

export default Departments;
