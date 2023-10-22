import { Image } from 'antd';
import React from 'react'
import Slider from 'react-slick';

const SilderComponent = ({arrImages}) => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };

  return (
    <Slider settings={settings}>
        {arrImages.map((image) => {
            return (
                <Image src={image} alt="silder" />
            )
        })}
    </Slider>
  )
}

export default SilderComponent
