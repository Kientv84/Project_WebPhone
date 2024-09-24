import { Modal } from 'antd'
import React from 'react'
import { wrapperQRcode, QRCodeImage, QRCodeContainer } from './style'

const ModalQRcode = ({ title , isOpen = false, children , amount, bank, user, ...rests }) => {
    
    const MY_BANK = {
        BANK_ID: 970422,
        ACCOUNT_NO: "0968727900"
    }
    const QR = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${amount}`;

    //    const QR = `https://img.vietqr.io/image/${MY_BANK.MY_BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${productName}&accountName=${user}`;

    console.log('QR', QR)
  return (
    <div>
      <Modal title={title} open={isOpen} {...rests}>
        <wrapperQRcode> 
                 <QRCodeImage  src={QR} alt="QR Code" className="qr-image" />
        </wrapperQRcode>
      </Modal>
    </div>
  )
}

export default ModalQRcode;