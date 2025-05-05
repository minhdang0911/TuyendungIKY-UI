import React from 'react';

export const Services = (props) => {
    return (
        <div id="services" className="text-center">
            <div className="container">
                <div className="section-title">
                    <h2>Dịch Vụ Chúng Tôi Cung Cấp</h2>
                    <p>
                        Chúng tôi cung cấp các giải pháp tiên tiến giúp nâng cao tiện ích và hiệu quả trong cuộc sống và
                        công việc.
                    </p>
                </div>
                <div className="row">
                    {props.data
                        ? props.data.map((d, i) => (
                              <div key={`${d.name}-${i}`} className="col-md-4">
                                  <div className="service-card">
                                      <i className={`${d.icon} service-icon`}></i>
                                      <div className="service-desc">
                                          <h3>{d.name}</h3>
                                          <p>{d.text}</p>
                                      </div>
                                  </div>
                              </div>
                          ))
                        : 'Đang tải dữ liệu...'}
                </div>
            </div>
        </div>
    );
};
