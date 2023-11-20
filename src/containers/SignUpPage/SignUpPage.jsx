import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import imageLogo from '../../assets/images/SignIn.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'


const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');


  const mutation = useMutationHook(
    data => UserService.signupUser(data)
  )

  const { data, isLoading, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess) {
      message.success()
      handleNavigateSignIn()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])


  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }

  const handleEmailError = (value) => {
    // Kiểm tra định dạng email, bạn có thể thay đổi theo quy ước của bạn
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setErrorEmail('Email không hợp lệ');
    } else {
      setErrorEmail('');
    }
  };

  const handleOnChangePassword = (value) => {
    setPassword(value)
  }

  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }

  const handleSignUp = () => {
    if (errorEmail) {
      // Hiển thị thông báo lỗi hoặc thực hiện xử lý khác tùy vào yêu cầu của bạn
      message.error(errorEmail);
      return;
    }
    mutation.mutate({
      email,
      password,
      confirmPassword
    })

    console.log('sign-up', email, password, confirmPassword)
  }

  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
      <div style={{ width: '800px', height: '400px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1 style={{ fontSize: '30px', marginBottom: '8px' }}>Xin chào</h1>
          <p style={{ fontSize: '15px', marginBottom: '5px' }}>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: '10px' }}
            type="email"
            placeholder="abc@gmail.com"
            value={email} onChange={handleOnChangeEmail}
            onBlur={() => handleEmailError(email)} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
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
            <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} style={{ marginBottom: '10px' }}
              value={password} onChange={handleOnChangePassword} />

          </div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '3px',
                right: '8px',
                fontSize: '15px'
              }}>
              {
                isShowConfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="confirm password" type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword} onChange={handleOnChangeConfirmPassword} />
          </div>

          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: 'rgba(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textButton={'Đăng ký'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          <p style={{ fontSize: " 15px" }}>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt='image-logo' height="400px" width="300px" />
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage
