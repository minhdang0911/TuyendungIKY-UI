import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Empty, Statistic, DatePicker, Tabs, Tooltip, Button, Badge, Radio } from 'antd';
import {
    MoneyCollectOutlined,
    TeamOutlined,
    BankOutlined,
    TrophyOutlined,
    RiseOutlined,
    FallOutlined,
    CalendarOutlined,
    FireOutlined,
    ReloadOutlined,
    PieChartOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip as ChartTooltip,
    Legend,
    Title,
    Filler,
} from 'chart.js';

import { apiGetAllPhongBan } from '../../apis/Department';
import { apiGetAllThanhTich } from '../../apis/Thanhtich';
import { apiGetAllUser } from '../../apis/staff';
import { apiGetKhenthuongs } from '../../apis/khenthuong';

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartTooltip,
    Legend,
    Title,
    Filler,
);

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const OverView = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [countUser, setCountUser] = useState(0);
    const [countDepartment, setCountDepartment] = useState(0);
    const [countReward, setCountReward] = useState(0);
    const [countAchievement, setCountAchievement] = useState(0);
    const [countMoney, setCountMoney] = useState(0);
    const [rewardChartData, setRewardChartData] = useState({});
    const [monthlyRewardData, setMonthlyRewardData] = useState({});
    const [achievementBreakdown, setAchievementBreakdown] = useState({});
    const [topDepartments, setTopDepartments] = useState([]);
    const [topUsers, setTopUsers] = useState([]);
    const [trendData, setTrendData] = useState({});
    const [chartHeight, setChartHeight] = useState(300);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [dateRange, setDateRange] = useState(null);
    const [timeFilter, setTimeFilter] = useState('all');

    // New chart type states
    const [deptChartType, setDeptChartType] = useState('bar');
    const [achievementChartType, setAchievementChartType] = useState('pie');

    // Color palette for charts
    const colorPalette = [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(78, 166, 134, 0.8)',
        'rgba(255, 99, 71, 0.8)',
    ];

    // Border colors (slightly darker versions)
    const borderColorPalette = [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(169, 169, 169, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(78, 166, 134, 1)',
        'rgba(255, 99, 71, 1)',
    ];

    useEffect(() => {
        fetchAllStats();

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            // Adjust chart height based on screen width
            if (window.innerWidth < 576) {
                setChartHeight(250);
            } else if (window.innerWidth < 992) {
                setChartHeight(275);
            } else {
                setChartHeight(300);
            }
        };

        handleResize(); // Initialize with current window size
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Effect to re-fetch when date range or time filter changes
    useEffect(() => {
        fetchAllStats();
    }, [dateRange, timeFilter]);

    const getFilteredDateRange = () => {
        if (dateRange) {
            return { start: dateRange[0].toISOString(), end: dateRange[1].toISOString() };
        }

        const now = new Date();
        let startDate = new Date();

        switch (timeFilter) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                // For 'all', return null to indicate no filter
                return null;
        }

        return timeFilter === 'all' ? null : { start: startDate.toISOString(), end: now.toISOString() };
    };

    const fetchAllStats = async () => {
        try {
            setLoading(refreshing ? false : true);
            if (refreshing) setRefreshing(true);

            const [userRes, deptRes, achRes, rewardRes] = await Promise.all([
                apiGetAllUser(),
                apiGetAllPhongBan(),
                apiGetAllThanhTich(),
                apiGetKhenthuongs(),
            ]);

            if (userRes.code === 200) setCountUser(userRes.data.length);
            if (deptRes.code === 200) setCountDepartment(deptRes.data.length);
            if (achRes.code === 200) {
                setCountAchievement(achRes.data.length);

                // Process achievement data for breakdown chart
                const achievementTypes = {};
                achRes.data.forEach((ach) => {
                    const achType = ach.loai || 'Khác';
                    achievementTypes[achType] = (achievementTypes[achType] || 0) + 1;
                });

                const achBreakdownData = {
                    labels: Object.keys(achievementTypes),
                    datasets: [
                        {
                            data: Object.values(achievementTypes),
                            backgroundColor: colorPalette.slice(0, Object.keys(achievementTypes).length),
                            borderColor: borderColorPalette.slice(0, Object.keys(achievementTypes).length),
                            borderWidth: 1,
                        },
                    ],
                };

                setAchievementBreakdown(achBreakdownData);
            }

            if (rewardRes.code === 200) {
                let rewards = rewardRes.data;

                // Apply date filtering if needed
                const dateFilter = getFilteredDateRange();
                if (dateFilter) {
                    rewards = rewards.filter((reward) => {
                        const rewardDate = new Date(reward.ngaykhenthuong || reward.createdAt);
                        return rewardDate >= new Date(dateFilter.start) && rewardDate <= new Date(dateFilter.end);
                    });
                }

                setCountReward(rewards.length);

                // Tổng tiền khen thưởng
                const totalMoney = rewards.reduce((sum, item) => sum + item.sotien, 0);
                setCountMoney(totalMoney);

                // Dữ liệu biểu đồ khen thưởng theo phòng ban
                const rewardByPhongBan = {};
                const moneyByPhongBan = {};

                rewards.forEach((item) => {
                    const tenphong = item?.tenphong || 'Không rõ';
                    rewardByPhongBan[tenphong] = (rewardByPhongBan[tenphong] || 0) + 1;
                    moneyByPhongBan[tenphong] = (moneyByPhongBan[tenphong] || 0) + item.sotien;
                });

                // Lấy top 5 phòng ban có nhiều khen thưởng nhất
                const sortedDepartments = Object.entries(rewardByPhongBan)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => ({
                        name,
                        count,
                        money: moneyByPhongBan[name],
                    }));

                setTopDepartments(sortedDepartments);

                // Top users with most rewards
                const rewardByUser = {};
                rewards.forEach((reward) => {
                    const userName = reward?.hoten || 'Không rõ';
                    rewardByUser[userName] = (rewardByUser[userName] || 0) + 1;
                });

                const sortedUsers = Object.entries(rewardByUser)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([name, count]) => ({ name, count }));

                setTopUsers(sortedUsers);

                // Dữ liệu biểu đồ chính
                const chartData = {
                    labels: Object.keys(rewardByPhongBan),
                    datasets: [
                        {
                            label: 'Lượt khen thưởng',
                            data: Object.values(rewardByPhongBan),
                            backgroundColor: colorPalette.slice(0, Object.keys(rewardByPhongBan).length),
                            borderColor: borderColorPalette.slice(0, Object.keys(rewardByPhongBan).length),
                            borderWidth: 1,
                            borderRadius: 5,
                        },
                        {
                            label: 'Tiền thưởng (triệu VNĐ)',
                            data: Object.values(moneyByPhongBan).map(
                                (value) => Math.round((value / 1000000) * 10) / 10,
                            ),
                            backgroundColor: 'rgba(255, 159, 64, 0.8)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                            borderRadius: 5,
                            // Only show in bar chart mode
                            hidden: deptChartType !== 'bar',
                        },
                    ],
                };
                setRewardChartData(chartData);

                // Thống kê theo tháng
                const monthlyStats = {};
                const currentYear = new Date().getFullYear();

                // Initialize all months
                for (let i = 0; i < 12; i++) {
                    monthlyStats[i] = { count: 0, money: 0 };
                }

                rewards.forEach((reward) => {
                    const rewardDate = new Date(reward.ngaykhenthuong || reward.createdAt);
                    if (rewardDate.getFullYear() === currentYear) {
                        const month = rewardDate.getMonth();
                        monthlyStats[month].count = (monthlyStats[month].count || 0) + 1;
                        monthlyStats[month].money = (monthlyStats[month].money || 0) + reward.sotien;
                    }
                });

                const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

                const monthlyData = {
                    labels: monthLabels,
                    datasets: [
                        {
                            label: 'Lượt khen thưởng',
                            data: monthLabels.map((_, idx) => monthlyStats[idx].count),
                            backgroundColor: 'rgba(75, 192, 192, 0.8)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            borderRadius: 5,
                            type: 'bar',
                            yAxisID: 'y',
                        },
                        {
                            label: 'Tổng tiền (triệu VNĐ)',
                            data: monthLabels.map(
                                (_, idx) => Math.round((monthlyStats[idx].money / 1000000) * 10) / 10,
                            ),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 2,
                            type: 'line',
                            fill: true,
                            tension: 0.4,
                            yAxisID: 'y1',
                            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                            pointRadius: 4,
                        },
                    ],
                };
                setMonthlyRewardData(monthlyData);

                // Performance trend data (quarter by quarter)
                const quarterlyData = [0, 0, 0, 0]; // Q1, Q2, Q3, Q4
                rewards.forEach((reward) => {
                    const rewardDate = new Date(reward.ngaykhenthuong || reward.createdAt);
                    const year = rewardDate.getFullYear();
                    const month = rewardDate.getMonth(); // 0 - 11
                    const quarter = Math.floor(month / 3);

                    if (year === currentYear) {
                        quarterlyData[quarter]++;
                    } else if (year === previousYear) {
                        prevYearQuarterlyData[quarter]++;
                    }
                });

                const previousYear = currentYear - 1;
                // Mock data for previous year for trend comparison (in a real app, fetch this from API)

                const prevYearQuarterlyData = [0, 0, 0, 0];

                const trendsData = {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [
                        {
                            label: `${currentYear}`,
                            data: quarterlyData,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                        },
                        {
                            label: `${previousYear}`,
                            data: prevYearQuarterlyData,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: 'rgba(153, 102, 255, 1)',
                            pointRadius: 6,
                            pointHoverRadius: 8,
                        },
                    ],
                };

                setTrendData(trendsData);
            }
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchAllStats();
    };

    const handleDateRangeChange = (dates) => {
        if (dates) {
            setDateRange(dates);
            setTimeFilter('custom');
        } else {
            setDateRange(null);
            setTimeFilter('all');
        }
    };

    const handleTimeFilterChange = (value) => {
        setTimeFilter(value);
        if (value !== 'custom') {
            setDateRange(null);
        }
    };

    const stats = [
        {
            title: 'Tổng tiền khen thưởng',
            value: countMoney,
            prefix: '',
            suffix: ' VNĐ',
            icon: <MoneyCollectOutlined />,
            color: '#52c41a',
            formatter: (value) => value.toLocaleString('vi-VN'),
            trend:
                timeFilter !== 'all'
                    ? {
                          value: 12.5,
                          isUp: true,
                          icon: <RiseOutlined />,
                          text: 'so với kỳ trước',
                      }
                    : null,
        },
        {
            title: 'Nhân viên',
            value: countUser,
            prefix: '',
            suffix: '',
            icon: <TeamOutlined />,
            color: '#1890ff',
            trend:
                timeFilter !== 'all'
                    ? {
                          value: 3.2,
                          isUp: true,
                          icon: <RiseOutlined />,
                          text: 'so với kỳ trước',
                      }
                    : null,
        },
        {
            title: 'Phòng ban',
            value: countDepartment,
            prefix: '',
            suffix: '',
            icon: <BankOutlined />,
            color: '#722ed1',
            trend: null, // No change expected in departments
        },
        {
            title: 'Lượt khen thưởng',
            value: countReward,
            prefix: '',
            suffix: '',
            icon: <TrophyOutlined />,
            color: '#faad14',
            trend:
                timeFilter !== 'all'
                    ? {
                          value: 5.3,
                          isUp: false,
                          icon: <FallOutlined />,
                          text: 'so với kỳ trước',
                      }
                    : null,
        },
    ];

    // Chart options with responsive configurations
    const getBarChartOptions = (title, yLabel) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: windowWidth < 576 ? 'bottom' : 'top',
                labels: {
                    boxWidth: windowWidth < 576 ? 12 : 20,
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y !== null ? context.parsed.y : context.parsed;
                        return `${label}: ${value}`;
                    },
                },
            },
            title: {
                display: windowWidth < 768 ? false : true,
                text: title,
                font: {
                    size: 14,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                },
                title: {
                    display: windowWidth < 576 ? false : true,
                    text: yLabel,
                    font: {
                        size: windowWidth < 768 ? 12 : 14,
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                    maxRotation: windowWidth < 576 ? 90 : 0,
                    minRotation: windowWidth < 576 ? 90 : 0,
                },
                title: {
                    display: windowWidth < 576 ? false : true,
                    text: windowWidth < 992 ? '' : 'Phòng ban',
                    font: {
                        size: windowWidth < 768 ? 12 : 14,
                    },
                },
            },
        },
    });

    const getPieChartOptions = (title) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: windowWidth < 576 ? 'bottom' : 'right',
                labels: {
                    boxWidth: windowWidth < 576 ? 12 : 20,
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
            title: {
                display: windowWidth < 768 ? false : true,
                text: title,
                font: {
                    size: 14,
                },
            },
        },
    });

    const getMonthlyChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: windowWidth < 576 ? 'bottom' : 'top',
                labels: {
                    boxWidth: windowWidth < 576 ? 12 : 20,
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    title: (context) => {
                        const monthNames = [
                            'Tháng 1',
                            'Tháng 2',
                            'Tháng 3',
                            'Tháng 4',
                            'Tháng 5',
                            'Tháng 6',
                            'Tháng 7',
                            'Tháng 8',
                            'Tháng 9',
                            'Tháng 10',
                            'Tháng 11',
                            'Tháng 12',
                        ];
                        return monthNames[parseInt(context[0].label.replace('T', '')) - 1];
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                },
                title: {
                    display: windowWidth < 576 ? false : true,
                    text: 'Số lượt khen thưởng',
                    font: {
                        size: windowWidth < 768 ? 12 : 14,
                    },
                },
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                },
                title: {
                    display: windowWidth < 576 ? false : true,
                    text: 'Tổng tiền (triệu VNĐ)',
                    font: {
                        size: windowWidth < 768 ? 12 : 14,
                    },
                },
            },
            x: {
                ticks: {
                    font: {
                        size: windowWidth < 576 ? 10 : 12,
                    },
                },
                title: {
                    display: windowWidth < 576 ? false : true,
                    text: windowWidth < 992 ? '' : 'Tháng',
                    font: {
                        size: windowWidth < 768 ? 12 : 14,
                    },
                },
            },
        },
    };

    const getTrendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            title: {
                display: true,
                text: 'So sánh khen thưởng theo quý',
                font: {
                    size: 14,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                },
                title: {
                    display: true,
                    text: 'Số lượt khen thưởng',
                },
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
    };

    // Custom card style based on screen size
    const getCardStyle = (color) => ({
        background: `linear-gradient(135deg, white, ${color}10)`,
        height: '100%',
        borderRadius: '0.5rem',
    });

    // Get control bar styles
    const getControlBarStyle = () => ({
        background: '#fff',
        padding: windowWidth < 576 ? '8px' : '12px',
        marginBottom: windowWidth < 576 ? '8px' : '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    });

    if (error) {
        return (
            <div className="p-4 sm:p-6 text-center">
                <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                <Button onClick={() => fetchAllStats()} className="mt-4" type="primary" icon={<ReloadOutlined />}>
                    Thử lại
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                    Tổng quan hệ thống khen thưởng
                </h1>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Tooltip title="Tải xuống báo cáo PDF">
                        {/* <Button icon={<DownloadOutlined />} onClick={exportToPDF}>
                            {windowWidth > 576 ? 'Xuất báo cáo' : ''}
                        </Button> */}
                    </Tooltip>

                    <Tooltip title="Làm mới dữ liệu">
                        <Button
                            icon={<ReloadOutlined spin={refreshing} />}
                            onClick={handleRefresh}
                            loading={refreshing}
                            style={{ marginLeft: '10px' }}
                        >
                            {windowWidth > 576 ? 'Làm mới' : ''}
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* Time Filter Controls */}
            <div
                style={getControlBarStyle()}
                className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between"
            >
                <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-blue-500" />
                    <span className="mr-2 text-sm sm:text-base font-medium">Thời gian:</span>
                </div>

                <div className="flex flex-wrap gap-2 flex-1">
                    <Radio.Group
                        value={timeFilter}
                        onChange={(e) => handleTimeFilterChange(e.target.value)}
                        size={windowWidth < 576 ? 'small' : 'middle'}
                        buttonStyle="solid"
                    >
                        <Radio.Button value="all">Tất cả</Radio.Button>
                        <Radio.Button value="today">Hôm nay</Radio.Button>
                        <Radio.Button value="week">7 ngày</Radio.Button>
                        <Radio.Button value="month">30 ngày</Radio.Button>
                        <Radio.Button value="quarter">Quý</Radio.Button>
                        <Radio.Button value="year">Năm</Radio.Button>
                        <Radio.Button value="custom">Tùy chọn</Radio.Button>
                    </Radio.Group>

                    {timeFilter === 'custom' && (
                        <RangePicker
                            onChange={handleDateRangeChange}
                            value={dateRange}
                            size={windowWidth < 576 ? 'small' : 'middle'}
                            format="DD/MM/YYYY"
                            className="ml-0 sm:ml-2"
                            style={{ marginLeft: '10px' }}
                        />
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin size={windowWidth < 576 ? 'default' : 'large'} tip="Đang tải dữ liệu..." />
                </div>
            ) : (
                <>
                    {/* Stats Cards - 1 column on mobile, 2 on tablet, 4 on desktop */}
                    <Row
                        gutter={[
                            { xs: 8, sm: 12, md: 16 },
                            { xs: 8, sm: 12, md: 16 },
                        ]}
                    >
                        {stats.map((item, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card
                                    variant={false}
                                    hoverable
                                    className="shadow-md"
                                    style={getCardStyle(item.color)}
                                    bodyStyle={{ padding: windowWidth < 576 ? '12px' : '24px' }}
                                >
                                    <Statistic
                                        title={
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="flex items-center justify-center p-1 sm:p-2 rounded-lg"
                                                    style={{ backgroundColor: `${item.color}20` }}
                                                >
                                                    <span
                                                        style={{
                                                            color: item.color,
                                                            fontSize: windowWidth < 576 ? '1.25rem' : '1.5rem',
                                                        }}
                                                    >
                                                        {item.icon}
                                                    </span>
                                                </span>
                                                <span className="text-gray-600 text-sm sm:text-base">{item.title}</span>
                                            </div>
                                        }
                                        value={item.value}
                                        formatter={item.formatter}
                                        prefix={item.prefix}
                                        suffix={item.suffix}
                                        valueStyle={{
                                            color: item.color,
                                            fontWeight: 'bold',
                                            fontSize: windowWidth < 576 ? '18px' : '24px',
                                        }}
                                    />
                                    {/* Trend indicator */}
                                    {item.trend && (
                                        <div className="mt-2 flex items-center text-xs">
                                            <span
                                                className={item.trend.isUp ? 'text-green-500' : 'text-red-500'}
                                                style={{ fontSize: '12px' }}
                                            >
                                                {item.trend.icon} {item.trend.isUp ? '+' : '-'}
                                                {Math.abs(item.trend.value).toFixed(1)}%
                                            </span>
                                            <span className="ml-1 text-gray-500">{item.trend.text}</span>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Main Dashboard Content with Tabs */}
                    <Tabs
                        defaultActiveKey="overview"
                        className="mt-4 sm:mt-6 bg-white rounded-lg shadow-md"
                        tabBarStyle={{
                            padding: windowWidth < 576 ? '0 12px' : '0 16px',
                            marginBottom: 0,
                        }}
                    >
                        {/* Overview Tab */}
                        <TabPane
                            tab={
                                <span className="flex items-center">
                                    <BarChartOutlined className="mr-1" />
                                    Tổng quan
                                </span>
                            }
                            key="overview"
                        >
                            <div className="p-2 sm:p-4">
                                <Row
                                    gutter={[
                                        { xs: 8, sm: 12, md: 16 },
                                        { xs: 12, sm: 16, md: 16 },
                                    ]}
                                >
                                    {/* Monthly chart - Full width on mobile/tablet, 2/3 on desktop */}
                                    <Col xs={24} lg={16}>
                                        <Card
                                            variant={false}
                                            className="shadow-sm"
                                            title="Khen thưởng theo tháng trong năm"
                                            headStyle={{
                                                borderBottom: '1px solid #f0f0f0',
                                                padding: windowWidth < 576 ? '8px 16px' : '16px 24px',
                                                fontSize: windowWidth < 576 ? '14px' : '16px',
                                            }}
                                            bodyStyle={{
                                                padding: windowWidth < 576 ? '12px' : '24px',
                                                height:
                                                    windowWidth < 576 ? '250px' : windowWidth < 992 ? '300px' : '350px',
                                            }}
                                            extra={
                                                <Badge
                                                    count="Mới"
                                                    style={{
                                                        backgroundColor: '#52c41a',
                                                        fontSize: '10px',
                                                        marginLeft: '8px',
                                                    }}
                                                />
                                            }
                                        >
                                            {monthlyRewardData.labels ? (
                                                <Bar
                                                    data={monthlyRewardData}
                                                    options={getMonthlyChartOptions}
                                                    height={chartHeight}
                                                />
                                            ) : (
                                                <Empty
                                                    description="Không có dữ liệu"
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    imageStyle={{ height: windowWidth < 576 ? 40 : 60 }}
                                                />
                                            )}
                                        </Card>
                                    </Col>

                                    {/* Top departments - Full width on mobile/tablet, 1/3 on desktop */}
                                    <Col xs={24} lg={8}>
                                        <Card
                                            variant={false}
                                            className="shadow-sm h-full"
                                            title="Top phòng ban được khen thưởng"
                                            headStyle={{
                                                borderBottom: '1px solid #f0f0f0',
                                                padding: windowWidth < 576 ? '8px 16px' : '16px 24px',
                                                fontSize: windowWidth < 576 ? '14px' : '16px',
                                            }}
                                            bodyStyle={{
                                                padding: windowWidth < 576 ? '12px' : '24px',
                                            }}
                                        >
                                            {topDepartments.length > 0 ? (
                                                <ul className="space-y-3 sm:space-y-4">
                                                    {topDepartments.map((dept, index) => (
                                                        <li key={index} className="flex items-center">
                                                            <div
                                                                className="flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 rounded-full mr-2 sm:mr-3 text-white font-medium text-sm sm:text-base"
                                                                style={{
                                                                    backgroundColor:
                                                                        index === 0
                                                                            ? '#f5222d'
                                                                            : index === 1
                                                                            ? '#fa8c16'
                                                                            : index === 2
                                                                            ? '#52c41a'
                                                                            : index === 3
                                                                            ? '#1890ff'
                                                                            : '#722ed1',
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between text-sm sm:text-base">
                                                                    <span
                                                                        className="text-gray-800 font-medium truncate mr-2"
                                                                        title={dept.name}
                                                                    >
                                                                        {dept.name.length >
                                                                        (windowWidth < 576 ? 15 : 20)
                                                                            ? `${dept.name.slice(
                                                                                  0,
                                                                                  windowWidth < 576 ? 15 : 20,
                                                                              )}...`
                                                                            : dept.name}
                                                                        :
                                                                    </span>
                                                                    <span
                                                                        className="text-gray-600 whitespace-nowrap"
                                                                        style={{ marginLeft: '5px' }}
                                                                    >
                                                                        {dept.count} lượt
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1">
                                                                    <div
                                                                        className="h-1.5 sm:h-2 rounded-full"
                                                                        style={{
                                                                            width: `${
                                                                                (dept.count / topDepartments[0].count) *
                                                                                100
                                                                            }%`,
                                                                            backgroundColor:
                                                                                index === 0
                                                                                    ? '#f5222d'
                                                                                    : index === 1
                                                                                    ? '#fa8c16'
                                                                                    : index === 2
                                                                                    ? '#52c41a'
                                                                                    : index === 3
                                                                                    ? '#1890ff'
                                                                                    : '#722ed1',
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <div className="mt-1 text-xs text-gray-500">
                                                                    Tổng tiền: {dept.money.toLocaleString('vi-VN')} VNĐ
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <Empty
                                                    description="Không có dữ liệu"
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    imageStyle={{ height: windowWidth < 576 ? 40 : 60 }}
                                                />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Department Distribution Chart */}
                                <Row
                                    gutter={[
                                        { xs: 8, sm: 12, md: 16 },
                                        { xs: 8, sm: 12, md: 16 },
                                    ]}
                                    className="mt-4"
                                >
                                    <Col xs={24}>
                                        <Card
                                            variant={false}
                                            className="shadow-sm"
                                            title="Phân bố khen thưởng theo phòng ban"
                                            headStyle={{
                                                borderBottom: '1px solid #f0f0f0',
                                                padding: windowWidth < 576 ? '8px 16px' : '16px 24px',
                                                fontSize: windowWidth < 576 ? '14px' : '16px',
                                            }}
                                            bodyStyle={{
                                                padding: windowWidth < 576 ? '12px' : '24px',
                                                height:
                                                    windowWidth < 576 ? '300px' : windowWidth < 992 ? '350px' : '400px',
                                            }}
                                            extra={
                                                <Radio.Group
                                                    value={deptChartType}
                                                    onChange={(e) => setDeptChartType(e.target.value)}
                                                    size="small"
                                                    buttonStyle="solid"
                                                >
                                                    <Radio.Button value="bar">
                                                        <BarChartOutlined />
                                                    </Radio.Button>
                                                    <Radio.Button value="pie">
                                                        <PieChartOutlined />
                                                    </Radio.Button>
                                                </Radio.Group>
                                            }
                                        >
                                            {rewardChartData.labels && rewardChartData.labels.length > 0 ? (
                                                deptChartType === 'bar' ? (
                                                    <Bar
                                                        data={rewardChartData}
                                                        options={getBarChartOptions(
                                                            'Phân bố khen thưởng',
                                                            'Số lượt khen thưởng',
                                                        )}
                                                        height={chartHeight + 50}
                                                    />
                                                ) : (
                                                    <Pie
                                                        data={{
                                                            labels: rewardChartData.labels,
                                                            datasets: [rewardChartData.datasets[0]],
                                                        }}
                                                        options={getPieChartOptions(
                                                            'Phân bố khen thưởng theo phòng ban',
                                                        )}
                                                        height={chartHeight + 50}
                                                    />
                                                )
                                            ) : (
                                                <Empty
                                                    description="Không có dữ liệu"
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    imageStyle={{ height: windowWidth < 576 ? 40 : 60 }}
                                                />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>

                        {/* Performance Tab */}
                        <TabPane
                            tab={
                                <span className="flex items-center">
                                    <RiseOutlined className="mr-1" />
                                    Hiệu suất
                                </span>
                            }
                            key="performance"
                        >
                            <div className="p-2 sm:p-4">
                                <Row
                                    gutter={[
                                        { xs: 8, sm: 12, md: 16 },
                                        { xs: 12, sm: 16, md: 16 },
                                    ]}
                                >
                                    {/* Performance Trend Chart */}
                                    <Col xs={24} lg={16}>
                                        <Card
                                            variant={false}
                                            className="shadow-sm"
                                            title="So sánh khen thưởng theo quý"
                                            headStyle={{
                                                borderBottom: '1px solid #f0f0f0',
                                                padding: windowWidth < 576 ? '8px 16px' : '16px 24px',
                                                fontSize: windowWidth < 576 ? '14px' : '16px',
                                            }}
                                            bodyStyle={{
                                                padding: windowWidth < 576 ? '12px' : '24px',
                                                height:
                                                    windowWidth < 576 ? '250px' : windowWidth < 992 ? '300px' : '350px',
                                            }}
                                            extra={
                                                <Badge
                                                    count="Mới"
                                                    style={{
                                                        backgroundColor: '#722ed1',
                                                        fontSize: '10px',
                                                    }}
                                                />
                                            }
                                        >
                                            {trendData.labels ? (
                                                <Line
                                                    data={trendData}
                                                    options={getTrendChartOptions}
                                                    height={chartHeight}
                                                />
                                            ) : (
                                                <Empty
                                                    description="Không có dữ liệu"
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    imageStyle={{ height: windowWidth < 576 ? 40 : 60 }}
                                                />
                                            )}
                                        </Card>
                                    </Col>

                                    {/* Top Employees */}
                                    <Col xs={24} lg={8}>
                                        <Card
                                            variant={false}
                                            className="shadow-sm h-full"
                                            title="Top nhân viên được khen thưởng"
                                            headStyle={{
                                                borderBottom: '1px solid #f0f0f0',
                                                padding: windowWidth < 576 ? '8px 16px' : '16px 24px',
                                                fontSize: windowWidth < 576 ? '14px' : '16px',
                                            }}
                                            bodyStyle={{
                                                padding: windowWidth < 576 ? '12px' : '24px',
                                            }}
                                            extra={
                                                <Badge
                                                    count="Mới"
                                                    style={{
                                                        backgroundColor: '#722ed1',
                                                        fontSize: '10px',
                                                    }}
                                                />
                                            }
                                        >
                                            {topUsers.length > 0 ? (
                                                <ul className="space-y-3 sm:space-y-4">
                                                    {topUsers.map((user, index) => (
                                                        <li key={index} className="flex items-center">
                                                            <div
                                                                className="flex items-center justify-center h-8 w-8 rounded-full mr-3 text-white font-medium"
                                                                style={{
                                                                    backgroundColor:
                                                                        index === 0
                                                                            ? '#f5222d'
                                                                            : index === 1
                                                                            ? '#fa8c16'
                                                                            : index === 2
                                                                            ? '#52c41a'
                                                                            : index === 3
                                                                            ? '#1890ff'
                                                                            : '#722ed1',
                                                                }}
                                                            >
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex justify-between">
                                                                    <span
                                                                        className="text-gray-800 font-medium truncate mr-2"
                                                                        title={user.name}
                                                                    >
                                                                        {user.name.length >
                                                                        (windowWidth < 576 ? 15 : 20)
                                                                            ? `${user.name.slice(
                                                                                  0,
                                                                                  windowWidth < 576 ? 15 : 20,
                                                                              )}...`
                                                                            : user.name}
                                                                        :
                                                                    </span>
                                                                    <span
                                                                        className="text-gray-600 whitespace-nowrap "
                                                                        style={{ marginLeft: '5px' }}
                                                                    >
                                                                        {user.count} lượt
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                                    <div
                                                                        className="h-2 rounded-full"
                                                                        style={{
                                                                            width: `${
                                                                                (user.count / topUsers[0].count) * 100
                                                                            }%`,
                                                                            backgroundColor:
                                                                                index === 0
                                                                                    ? '#f5222d'
                                                                                    : index === 1
                                                                                    ? '#fa8c16'
                                                                                    : index === 2
                                                                                    ? '#52c41a'
                                                                                    : index === 3
                                                                                    ? '#1890ff'
                                                                                    : '#722ed1',
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                                <div className="flex items-center mt-1">
                                                                    {index === 0 && (
                                                                        <span className="text-xs text-yellow-500 flex items-center">
                                                                            <FireOutlined className="mr-1" /> Xuất sắc
                                                                            nhất
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <Empty
                                                    description="Không có dữ liệu"
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    imageStyle={{ height: windowWidth < 576 ? 40 : 60 }}
                                                />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Achievement Types Breakdown */}
                                <Row
                                    gutter={[
                                        { xs: 8, sm: 12, md: 16 },
                                        { xs: 8, sm: 12, md: 16 },
                                    ]}
                                    className="mt-4"
                                >
                                    <Col xs={24}>
                                        <Card
                                            variant={false}
                                            className="shadow-sm"
                                            title="Phân loại thành tích"
                                            headStyle={{
                                                borderBottom: '1px solid #f0f0f0',
                                                padding: windowWidth < 576 ? '8px 16px' : '16px 24px',
                                                fontSize: windowWidth < 576 ? '14px' : '16px',
                                            }}
                                            bodyStyle={{
                                                padding: windowWidth < 576 ? '12px' : '24px',
                                                height:
                                                    windowWidth < 576 ? '300px' : windowWidth < 992 ? '350px' : '400px',
                                            }}
                                            extra={
                                                <Radio.Group
                                                    value={achievementChartType}
                                                    onChange={(e) => setAchievementChartType(e.target.value)}
                                                    size="small"
                                                    buttonStyle="solid"
                                                >
                                                    <Radio.Button value="pie">
                                                        <PieChartOutlined />
                                                    </Radio.Button>
                                                    <Radio.Button value="donut">Donut</Radio.Button>
                                                </Radio.Group>
                                            }
                                        >
                                            {achievementBreakdown.labels && achievementBreakdown.labels.length > 0 ? (
                                                <Pie
                                                    data={achievementBreakdown}
                                                    options={{
                                                        ...getPieChartOptions('Phân loại thành tích'),
                                                        cutout: achievementChartType === 'donut' ? '50%' : 0,
                                                    }}
                                                    height={chartHeight + 50}
                                                />
                                            ) : (
                                                <Empty
                                                    description="Không có dữ liệu"
                                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                    imageStyle={{ height: windowWidth < 576 ? 40 : 60 }}
                                                />
                                            )}
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </TabPane>

                        {/* Analytics Tab (For future expansion) */}
                        {/* <TabPane
                            tab={
                                <span className="flex items-center">
                                    <TeamOutlined className="mr-1" />
                                    Phân tích nhân sự
                                </span>
                            }
                            key="analytics"
                            disabled
                        >
                            <div className="p-4">
                                <Empty
                                    description="Tính năng này sẽ được phát triển trong phiên bản tới"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </div>
                        </TabPane> */}
                    </Tabs>
                </>
            )}
        </div>
    );
};

export default OverView;
