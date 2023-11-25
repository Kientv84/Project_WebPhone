import React  from "react";
import Typeproduct from "../../../componets/Typeproduct/Typeproduct";
import { WrapperTypePoduct } from "./style";
import SilderComponent from "../../../componets/SilderComponent/SilderComponent";
import  slider2 from '../../../assets/images/slider2.png.webp'
import  slider1 from '../../../assets/images/silder1.png.webp'
import  slider3 from '../../../assets/images/silder3.jpg.webp'

const Home = () => {
    const arr = ['TV', 'Tu Lanh', 'LapTop', 'Thiet bi dien tu']
    return (
        <div style={{padding: ' 0 120px'}}>
            <WrapperTypePoduct>
                {arr.map((item) => {
                    return (
                        <Typeproduct name={item} key={item} />
                    )
                })}
            </WrapperTypePoduct>
            <SilderComponent arrImages = {[slider1, slider2, slider3]} />
            Home page  
        </div>
    )
} 

export default Home