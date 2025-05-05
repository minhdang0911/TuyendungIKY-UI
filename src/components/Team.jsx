import React, { useEffect, useState } from 'react';
import { apiGetAllUser } from '../apis/staff';
import { Link } from 'react-router-dom';
import { formatName } from '../utils/Function';

export const Team = () => {
    const [team, setTeam] = useState([]);

    useEffect(() => {
        const getAllUser = async () => {
            const response = await apiGetAllUser();
            if (response.code === 200) {
                // Filter users who have both 'chucvu' and 'phongban_id'
                const filteredUsers = response.data.filter((user) => user.chucvu && user.phongban_id);

                // Shuffle the filtered users
                const shuffled = filteredUsers.sort(() => 0.5 - Math.random());

                // Select up to 8 team members
                const selected = shuffled.slice(0, 8);
                setTeam(selected);
            }
        };

        getAllUser();
    }, []);

    return (
        <div id="team" className="text-center" style={{ marginTop: '-5%' }}>
            <div className="container">
                <div className="col-md-8 col-md-offset-2 section-title">
                    <h2>Đội ngũ nhân viên của chúng tôi</h2>
                    <p>
                        Chúng tôi tự hào sở hữu đội ngũ nhân viên chuyên nghiệp, tận tâm và giàu kinh nghiệm, luôn sẵn
                        sàng đồng hành cùng khách hàng trong mọi giải pháp công nghệ.
                    </p>
                </div>
                <div id="row">
                    {team &&
                        team.length > 0 &&
                        team.map((member, index) => (
                            <Link
                                to={`/nhansu/${formatName(member.hoten)}`}
                                key={member._id || index}
                                onClick={() => localStorage.setItem('userId', member._id)} // Lưu id vào localStorage
                            >
                                <div className="col-md-3 col-sm-6 team">
                                    <div className="thumbnail">
                                        <img
                                            src={member?.avatar}
                                            alt="..."
                                            className="team-img w-[180px] h-[180px] object-cover rounded-md mx-auto mb-2"
                                        />
                                        <div className="caption">
                                            <h4>{member.hoten}</h4>
                                            <p>{member.chucvu}</p>
                                            <p>{member?.phongban_id?.tenphong}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
};
