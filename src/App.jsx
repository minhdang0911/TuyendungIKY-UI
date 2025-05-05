import React, { useState, useEffect } from 'react';
import { Navigation } from './components/navigation';
import { Header } from './components/header';
import { Features } from './components/features';
import { About } from './components/about';
import { Services } from './components/services';
import { Gallery } from './components/gallery';
import { Testimonials } from './components/testimonials';
import { Team } from './components/Team';
import { Contact } from './components/contact';
import JsonData from './data/data.json';
import SmoothScroll from 'smooth-scroll';
import DetailUser from './components/DetailStaff';
import Departments from './components/Departments';
import DepartmentsUi from './components/DepartMentUi';
import StaffDepartment from './components/StaffDepartment';
import Login from './components/Login/Login';
import { apiInfoUser } from './apis/staff';
import Staff from './components/Staff';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/admin/Layout';
import UserManagement from './components/admin/UserManagement';
import DepartmentManagement from './components/admin/DepartmentManagement';
import RewardManagement from './components/admin/RewardManagement';
import OverView from './components/admin/OverView';
import Manageachievements from './components/admin/Manageachievements';
import Reward from './components/Reward';
import NotFoundPage from './components/notfound';
import ProtectedRoute from './components/admin/ProtectedRoute';
import RoleManage from './components/admin/RoleManage';
import Profile from './components/Profile/Profile';
import AboutUs from './components/info';
import ListJob from './components/Jobs/ListJob';
import DetailJob from './components/Jobs/DetailJob';
import ManageJob from './components/admin/ManageJob';
import ManageApply from './components/admin/ManageApply';
import MyApplications from './components/Profile/MyApplications';
import ProfileLayout from './components/Profile/ProfileLayout';
import ChangePassword from './components/Profile/ChangePassword';
import { Button } from 'antd';
import { IoArrowUpOutline } from 'react-icons/io5';
import { apiHello } from './apis/Applications';

export const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 1000,
    speedAsDuration: true,
});

const App = () => {
    const [landingPageData, setLandingPageData] = useState({});
    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const [avatar, setAvatar] = useState('');
    const [helloResponse, setHelloResponse] = useState(null);

    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await apiHello(); // Gọi API /hello
                setHelloResponse(response); // Lưu dữ liệu trả về từ API
            } catch (error) {
                console.error('Lỗi khi gọi API /hello:', error.message);
            }
        }, 600000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchInfo = async () => {
            const response = await apiInfoUser();

            if (response.code === 200) {
                setUserName(response.data.hoten);
                setInfo(response.data);
                setRole(response.data?.role?.tenRole || '');
                setAvatar(response?.data?.avatar);
            } else {
                setIsLoggedIn(false);
                setRole('');
            }
        };
        fetchInfo();
    }, []);

    return (
        <Router>
            <Routes>
                {/* Trang chính */}
                <Route
                    path="/"
                    element={
                        <>
                            <Navigation data={info} userName={userName} info={info} />

                            <Header data={landingPageData.Header} />
                            <div className="main-homepage">
                                <Features data={landingPageData.Features} />
                                <About data={landingPageData.About} />
                                <Services data={landingPageData.Services} />
                                <Gallery data={landingPageData.Gallery} />
                                {/* <DepartmentsUi /> */}
                                <Testimonials data={landingPageData.Testimonials} />
                                <Team data={landingPageData.Team} />
                                <Contact data={landingPageData.Contact} />
                            </div>
                            {/* <Button
                                className="back-to-top-btn"
                                type="primary"
                                shape="circle"
                                icon={<IoArrowUpOutline />}
                                onClick={() => {
                                    console.log('Scroll button clicked');
                                    console.log('Current scroll position:', window.scrollY);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            /> */}
                        </>
                    }
                />
                {/* Các route khác */}
                <Route path="/nhansu/:userName" element={<DetailUser />} />
                <Route path="/phong-ban" element={<Departments />} />
                <Route path="/phongban/:name" element={<StaffDepartment />} />
                <Route path="/login" element={<Login />} />
                <Route path="/danh-sach-nhan-vien" element={<Staff />} />
                <Route path="/danh-sach-khen-thuong" element={<Reward />} />

                <Route path="/About-us" element={<AboutUs />} />
                <Route path="/co-hoi-nghe-nghiep" element={<ListJob />} />
                <Route path="/chi-tiet-cong-viec/:name" element={<DetailJob />} />

                <Route path="*" element={<NotFoundPage />} />

                <Route path="/profile" element={<ProfileLayout />}>
                    <Route index element={<Profile />} />
                    <Route path="danh-sach-cong-viec-da-ung-tuyen" element={<MyApplications />} />
                    <Route path="doi-mat-khau" element={<ChangePassword />} />
                </Route>

                {/* Trang admin */}
                <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} role={role} />}>
                    <Route path="/admin" element={<Layout />}>
                        <Route index element={<OverView />} />
                        <Route path="overview" element={<OverView />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="departments" element={<DepartmentManagement />} />
                        <Route path="rewards" element={<RewardManagement />} />
                        <Route path="achievements" element={<Manageachievements />} />
                        <Route path="roles" element={<RoleManage />} />
                        <Route path="job" element={<ManageJob />} />
                        <Route path="application" element={<ManageApply />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
