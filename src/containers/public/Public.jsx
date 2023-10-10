import React  from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer } from "../../componets";

 

const Public = () => {
    return (
        <div className="w-full">
            <div className="">
                <Header />
            </div>           
            <div>
                <Outlet />
            </div>         
            <div>
                <Footer />
            </div>
        </div>
    )
} 

export default Public