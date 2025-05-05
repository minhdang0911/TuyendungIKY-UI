import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const NotFoundPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    // Đếm ngược 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        if (countdown === 0) {
            navigate('/');
        }

        return () => clearInterval(interval);
    }, [countdown, navigate]);

    return (
        <section
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#f0f2f5',
                fontFamily: 'Arvo, serif',
            }}
        >
            <div
                style={{
                    backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
                    height: '400px',
                    width: '100%',
                    maxWidth: '600px',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            ></div>

            <div style={{ textAlign: 'center', marginTop: '-50px' }}>
                <Title
                    style={{
                        fontSize: '5rem',
                        color: '#ff4d4f',
                        marginBottom: '10px',
                        animation: 'shake 0.5s',
                        animationIterationCount: 'infinite',
                    }}
                >
                    404
                </Title>

                <style>
                    {`
                @keyframes shake {
                    0% { transform: translate(1px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(3px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(3px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(1px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                `}
                </style>
                <Title level={2} style={{ color: '#595959', marginBottom: '20px' }}>
                    Có vẻ như bạn đang bị lạc!
                </Title>
                <Paragraph style={{ fontSize: '1.2rem' }}>
                    Trang bạn tìm kiếm không khả dụng. Bạn sẽ được tự động chuyển về trang chủ trong{' '}
                    <b>{countdown} giây</b>.
                </Paragraph>

                <Button
                    type="primary"
                    size="large"
                    style={{
                        background: '#39ac31',
                        borderColor: '#39ac31',
                        marginTop: '20px',
                    }}
                    onClick={() => navigate('/')}
                >
                    Trở lại trang chủ ngay
                </Button>
            </div>
        </section>
    );
};

export default NotFoundPage;
