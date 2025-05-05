import { Image } from './image';
import React from 'react';

export const Gallery = (props) => {
    return (
        <div id="portfolio" className="text-center">
            <div className="container">
                <div className="section-title">
                    <h2>Thư Viện Hình Ảnh</h2>
                    <p>Một bộ sưu tập hình ảnh đa dạng, giúp bạn khám phá những tác phẩm độc đáo.</p>
                </div>
                <div className="row">
                    <div className="portfolio-items">
                        {props.data
                            ? props.data.map((d, i) => (
                                  <div key={`${d.title}-${i}`} className="col-sm-6 col-md-4 col-lg-4">
                                      <Image title={d.title} largeImage={d.largeImage} smallImage={d.smallImage} />
                                  </div>
                              ))
                            : 'Đang tải...'}
                    </div>
                </div>
            </div>
        </div>
    );
};
