import React from "react";
import { Box, Typography } from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";


const FooterComponent = () => {

  const { t } = useTranslation();

  const navigate = useNavigate();


  const handleClick = () => {
    navigate('/notcomplete');
  }

  return (
    <Box
      bgcolor={"rgb(66, 200, 183)"}
      color={"#fff"}
      padding={2}
      width={"100%"}
      textAlign={"center"}
      position={"relative"}
      bottom={0}
    >
      {/* Phần 1: Địa chỉ và thông tin liên hệ */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box flex={1} textAlign="left" paddingRight={4}>
        <Typography  fontSize={18} paddingBottom={3}>
           {t('FOOTER.ADDRESS_CONTACT')}
          </Typography>
          <Typography fontSize={14}  paddingBottom={0.5}>
             {t('FOOTER.TEXT_1_COL_1')}
          </Typography>
          <Typography fontSize={14}  paddingBottom={0.5}>
             {t('FOOTER.TEXT_2_COL_1')}
          </Typography>
          <Typography fontSize={14}  paddingBottom={0.5}>
             {t('FOOTER.TEXT_3_COL_1')}
          </Typography>
          <Typography fontSize={14}  paddingBottom={0.5}>{t('FOOTER.TEXT_4_COL_1')}</Typography>
          <Typography fontSize={14}  paddingBottom={0.5}>E-mail: khdcnnt2023@gmail.com</Typography>
        </Box>

         <Box flex={1} paddingLeft={4} textAlign="left">
          <Typography fontSize={18} paddingBottom={3}>
            {t('FOOTER.INFO_POLICY')}
          </Typography>
          <Typography fontSize={14}  paddingBottom={0.5} 
            onClick={handleClick}
            style={{
              cursor: 'pointer',
              color: '#ff',
              textDecoration: 'none' // ban đầu không gạch chân
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} 
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            {t('FOOTER.TEXT_1_COL2')}
          </Typography>
          <Typography fontSize={14} paddingBottom={0.5}
             onClick={handleClick}
             style={{
              cursor: 'pointer',
              color: '#ff',
              textDecoration: 'none' // ban đầu không gạch chân
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} 
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
           {t('FOOTER.TEXT_2_COL2')}
          </Typography>
          <Typography fontSize={14}  paddingBottom={0.5}
             onClick={handleClick}
            style={{
              cursor: 'pointer',
              color: '#ff',
              textDecoration: 'none' // ban đầu không gạch chân
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} 
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
          {t('FOOTER.TEXT_3_COL2')}
          </Typography>
          <Typography fontSize={14} paddingBottom={0.5}
             onClick={handleClick}
            style={{
              cursor: 'pointer',
              color: '#ff',
              textDecoration: 'none' // ban đầu không gạch chân
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} 
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
           {t('FOOTER.TEXT_4_COL2')}
          </Typography>
          <Typography fontSize={14} paddingBottom={0.5}
             onClick={handleClick}
            style={{
              cursor: 'pointer',
              color: '#ff',
              textDecoration: 'none' // ban đầu không gạch chân
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} 
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
            {t('FOOTER.TEXT_5_COL2')}
          </Typography>
          <Typography fontSize={14} paddingBottom={0.5}
             onClick={handleClick}
            style={{
              cursor: 'pointer',
              color: '#ff',
              textDecoration: 'none' // ban đầu không gạch chân
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} 
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
          {t('FOOTER.TEXT_6_COL2')}
          </Typography>
          <Typography fontSize={14} paddingBottom={0.5}
             onClick={handleClick}
            style={{
              cursor: 'pointer',
              color: '#ff',
              textDecoration: 'none' // ban đầu không gạch chân
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')} 
            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
          >
          {t('FOOTER.TEXT_7_COL2')}
          </Typography>
        </Box>


        {/* Phần 2: Biểu tượng mạng xã hội */}
        <Box flex={1} textAlign="center">
          <Typography fontSize={18} mb={1} paddingBottom={3}> {t('FOOTER.FOLLOW_US')}</Typography>
          <FacebookIcon 
             sx={{
                fontSize: 40,
                color: "#fff",
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.1)"
                }
              }}
          />
          <InstagramIcon
              sx={{
                fontSize: 40,
                marginLeft: 2,
                cursor: "pointer",
                background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.1)"
                }
              }}
          />
          <LinkedInIcon 
             sx={{
                fontSize: 40,
                marginLeft: 2,
                color: "#fff",
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.1)"
                }
              }}
          />
        </Box>

        {/* Phần 3: Google Map */}
        <Box flex={1} textAlign="center" paddingRight={3}>
          <Typography fontSize={18} mb={1} paddingBottom={3}>
            {t('FOOTER.ADDRESS_GGMAP')}
          </Typography>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.480932362391!2d106.76908467583884!3d10.850978357812489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527754ee4d977%3A0x5742b474cb638d8d!2zMSDEkC4gVsO1IFbEg24gTmfDom4sIExpbmggQ2hp4buDdSwgVGjhu6cgxJDhu6ljLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1728911970275!5m2!1svi!2s"
            width="500"
            height="300"
            style={{ borderRadius: "10px", border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </Box>
      </Box>
    </Box>
  );
};

export default FooterComponent;
