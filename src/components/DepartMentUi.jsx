import React, { useEffect, useState } from 'react';
import { apiGetAllPhongBan } from '../apis/Department';

import './DepartmentUi.css';
import { Link } from 'react-router';
import { apiInfoUser } from '../apis/staff';
import { Navigation } from './navigation';

// Component to display departments

const DepartmentsUi = () => {
    const [phongBan, setPhongBan] = useState([]);

    useEffect(() => {
        const getAllPhongBan = async () => {
            const response = await apiGetAllPhongBan();
            setPhongBan(response?.data || []);
        };
        getAllPhongBan();
    }, []);

    // Hàm chuyển đổi tên phòng ban thành URL-friendly
    const convertToSlug = (text) => {
        return text
            .toLowerCase() // Chuyển thành chữ thường
            .replace(/á|à|ạ|ả|ã|à|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a') // Chuyển các ký tự có dấu thành không dấu
            .replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ể|ễ|ệ/g, 'e')
            .replace(/i|í|ì|ị|ỉ|ĩ/g, 'i')
            .replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ổ|ỗ|ộ/g, 'o')
            .replace(/ú|ù|ụ|ủ|ũ|ư|ứ|ừ|ử|ữ|ự/g, 'u')
            .replace(/ý|ỳ|ỵ|ỷ|ỹ/g, 'y')
            .replace(/đ/g, 'd') // Chuyển "đ" thành "d"
            .replace(/[^a-z0-9]/g, '-') // Thay các ký tự không phải chữ cái hoặc số thành dấu gạch ngang
            .replace(/-+/g, '-') // Loại bỏ các dấu gạch ngang dư thừa
            .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
    };

    const [userName, setUserName] = useState('');
    const [info, setInfo] = useState([]);

    useEffect(() => {
        const fetchInfo = async () => {
            const response = await apiInfoUser();

            if (response.code === 200) {
                setUserName(response.data.hoten);
                setInfo(response.data);
            }
        };
        fetchInfo();
    }, []);

    return (
        <>
            <Navigation data={info} userName={userName} />
            <div className="section-title text-center name-department">
                <h2>Phòng Ban</h2>
                <p>Danh Sách Các Phòng Ban Của Công Ty</p>
            </div>

            <div className="department-container">
                {phongBan.map((pb) => (
                    <Link
                        key={pb._id}
                        to={`/phongban/${convertToSlug(pb.tenphong)}`}
                        onClick={() => localStorage.setItem('maphong', pb._id)}
                    >
                        <div className="department-card">
                            <h3>{pb.tenphong}</h3>
                            <p>
                                <strong>Mã phòng:</strong> {pb.maphong}
                            </p>
                            <p>
                                <strong>Mô tả:</strong> {pb.mota}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

export default DepartmentsUi;
