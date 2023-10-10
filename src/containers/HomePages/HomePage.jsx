import React from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style"
import  slider1 from "../../assets/images/slider1.webp"
import  slider2 from "../../assets/images/slider2.webp"
import  slider3 from "../../assets/images/slider3.webp"
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";

const HomePage = () => {
    const arr = ['TV', 'Phone', 'Airpod'];
    return (
        <>
            <div style={{ width: '1270px', margin: '0 auto'}}>
                <WrapperTypeProduct>
                {arr.map((item) => {
                    return (
                        <TypeProduct name={item} key={item}/>
                    )            
                })}
                </WrapperTypeProduct>
            </div> 
            <div className='body' style={{width: '100%', backgroundColor: '#efefef'}}>
                <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
                    <SliderComponent arrImages = {[slider1, slider2, slider3]} />
                    <WrapperProducts>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                        <CardComponent/>
                    </WrapperProducts>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
                        <WrapperButtonMore textButton="Xem thêm" type="outline" styleButton={{
                            border: '1px solid rgb(10, 104, 255)',
                            color: 'rgb(10, 104, 255)',
                            width: '240px',
                            height: '38px',
                            borderRadius: '4px',
                        }}
                        styleTextButton={{ fontWeight: 500}}/>
                    </div>

                    <NavbarComponent />
                </div>
            </div>
        </>
    )
}

export default HomePage;