import React from 'react'
// import { Box, Columns, Columns1, Footer, FooterContainer, StoreTitle, Title } from './style'
import { Box, Typography } from "@mui/material";
import "./footer.css"

const FooterComponent = () => {
    return (
        // <Footer>
        //     <FooterContainer>
        //         <Columns>
        //             <Columns1>
        //                 <Box>
        //                     <Title>Tổng đài hỗ trợ miễn phí</Title>
        //                 </Box>
        //             </Columns1>
        //         </Columns>
        //     </FooterContainer>
        // </Footer>

        // <>
        //     <footer>
        //         <div className='container'>
        //             <div className='box'>
        //                 <ul className='flex'>
        //                     <li>Terms of Use</li>
        //                     <li>Privacy-Policy</li>
        //                     <li>Blog</li>
        //                     <li>FAQ</li>
        //                     <li>Watch List</li>
        //                 </ul>
        //                 <p>© 2022 STREAMIT. All Rights Reserved. All videos and shows on this platform are trademarks of, and all related images and content are the property of, Streamit Inc. Duplication and copy of this is strictly prohibited. All rights reserved.</p>
        //             </div>
        //             <div className='box'>
        //                 <h3>Follow Us</h3>
        //                 <i className='fab fa-facebook-f'></i>
        //                 <i className='fab fa-twitter'></i>
        //                 <i className='fab fa-github'></i>
        //                 <i className='fab fa-instagram'></i>
        //             </div>
        //             <div className='box'>
        //                 <h3>Streamit App</h3>
        //                 <div className='img flexSB'>
        //                     <img src='https://img.icons8.com/color/48/000000/apple-app-store--v3.png' />
        //                     <span>App Store</span>
        //                     <img src='https://img.icons8.com/fluency/48/000000/google-play.png' />
        //                     <span>Google Play Store</span>
        //                 </div>
        //             </div>
        //         </div>
        //     </footer>
        // </>

        <>
            <Box
                bgcolor={"rgb(66, 200, 183)"}
                color={"#fff"}
                padding={2}
                width={"100%"}
                textAlign={"center"}
            >
                <Box mt={1}>
                    <Typography fontSize={12}>
                        Địa chỉ: 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành
                        phố Hồ Chí Minh.
                    </Typography>
                    <Typography fontSize={12}>
                        Điện thoại: (+84 - 028) 38968641 - (+84 -028) 38961333 - (+84 -028)
                        37221223
                    </Typography>
                    <Typography fontSize={12}>
                        Hotline Tư vấn : (+84 - 028) 37222764
                    </Typography>
                    <Typography fontSize={12}> Fax: (+84 - 028) 38964922</Typography>
                    <Typography fontSize={12}> E-mail: ptchc@hcmute.edu.vn</Typography>
                </Box>
            </Box>
        </>
    )
}

export default FooterComponent
