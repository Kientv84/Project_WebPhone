import React from "react";
import { Box, Typography, Button  } from "@mui/material";
import notComplete from  "../../assets/images/notComplete.jpg"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotCompletePage() {

    const { t } = useTranslation();
    
    const navigate = useNavigate(); 


    const handleGoHome = () => {
    navigate("/"); // Điều hướng về trang chủ
    };

    return (
    <Box textAlign="center" padding={5}>
    {/* Hiển thị hình ảnh */}
      <Box>
        <img src={notComplete} alt="Xin lỗi" style={{ width: '300px',  height: '300px', marginBottom: '20px' }} />
      </Box>
      
      {/* Dòng text xin lỗi */}
      <Typography variant="h4" color="error">
         {t('NOTCOMPLELTE.SORRY_CLIENT')}
      </Typography>

       {/* Nút quay về trang chủ */}
      <Button
        variant="contained"
        color="error"
        onClick={handleGoHome}
        sx={{ margin: 4 }}
      >
         {t('NOTCOMPLELTE.BACK_HOMEPAGE')}
      </Button>
      <Typography variant="h6" color="textSecondary">
        {t('NOTCOMPLELTE.TEXT_SORRY')}
      </Typography>
    </Box>
  );
};


export default NotCompletePage;