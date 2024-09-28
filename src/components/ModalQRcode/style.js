import styled from "styled-components";

export const wrapperQRcode = styled.div`
    display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh; /* Đảm bảo chiều cao tối thiểu toàn màn hình */
  min-width: 600px;
`

export const QRCodeImage = styled.img`
  width: 100%;
  height: auto; /* Đảm bảo hình ảnh QR code giữ nguyên tỷ lệ */
`;