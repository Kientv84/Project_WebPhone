import React, { useState } from "react";
import "./NotFoundPage.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleReturnHome = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/");
      setLoading(false);
    }, 500); // 2 giây trì hoãn
  };

  return (
    <Loading isLoading={loading}>
      <div className="error-content">
        <div className="container">
          <div className="notfound">ERROR 404</div>
          <p>We are sorry, the page you've requested is not available.</p>
          <div onClick={handleReturnHome} className="btn_home">
            <span>BACK TO HOMEPAGE</span>
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default NotFoundPage;
