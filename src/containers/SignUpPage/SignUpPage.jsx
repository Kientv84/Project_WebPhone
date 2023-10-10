import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import imageLogo from '../../assets/images/SignIn.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  return (
    <div style={{display : 'flex' , alignItems: 'center', justifyContent:'center', background:'#ccc', height:'100vh'}}>
      <div style={{ width: '800px', height: '400px', borderRadius: '6px', background: '#fff', display : 'flex' }}>
        <WrapperContainerLeft>
          <h1 style={{fontSize: '30px', marginBottom: '8px'}}>Xin chào</h1>
          <p style={{fontSize: '15px', marginBottom: '5px'}}>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm style={{marginBottom: '10px'}} placeholder="abc@gmail.com"/>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '3px',
                right: '8px',
                fontSize: '15px'
              }}>
              {
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} style={{marginBottom: '10px'}} />

          </div>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '3px',
                right: '8px',
                fontSize: '15px'
              }}>
              {
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="confirm password" type={isShowPassword ? "text" : "password"}  />
            </div>
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: 'rgba(13, 129, 115, 0.82)',
              height: '48px',
              width: '100%',
              border: 'none',
              margin: '26px 0 10px'
            }}
            textButton={'Đăng nhập'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          <p style={{fontSize: " 15px"}}>Bạn đã có tài khoản? <WrapperTextLight> Đăng ký</WrapperTextLight></p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src ={imageLogo} preview={false} alt='image-logo' height="400px" width="300px"/>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage
