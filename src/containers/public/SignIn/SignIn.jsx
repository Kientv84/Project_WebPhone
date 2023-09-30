import React from 'react'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import InputForm from '../../../componets/InputForm/InputForm'
import ButtonComponent from '../../../componets/ButtonComponent/ButtonComponent'

const SignIn = () => {
  return (
    <div style={{display : 'flex' , alignItems: 'center', justifyContent:'center', background:'#ccc'}}>
      <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff' }}>
        <WrapperContainerLeft>
          <h1>Xin Chào</h1>
          <p>Đăng nhập vào tạo tài khoản</p>
          <InputForm />
          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: 'rgb(255, 57,69)',
              height: '48px',
              width: '220px',
              border: 'none',
            }}
            textButton={'Đăng nhập'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
        </WrapperContainerLeft>
        
        <WrapperContainerRight></WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignIn
