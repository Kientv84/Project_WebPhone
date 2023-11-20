import React, { useEffect, useState } from 'react'
import { WrapperBackground, WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogo from '../../assets/images/SignIn.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slice/userslide'
import tenlua3 from './tenlua3.png';

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const [errorEmail, setErrorEmail] = useState('');

  const navigate = useNavigate()

  const mutation = useMutationHook(
    data => UserService.loginUser(data)
  )

  const { data, isLoading, isSuccess } = mutation

  useEffect(() => {
    if (isSuccess) {
      if (location?.state) {      //nếu mà có cái location này thì sẽ quay về trang có cái state
        navigate(location?.state)
      } else {                    //còn không thì nó sẽ quay về trang home
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token)
        // console.log('decoded', decoded)
        if (decoded?.id) {
          handleGetDetailsUser(decoded.id, data?.access_token)
        }
      }
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
    // console.log('res', res)
  }


  console.log('mutation', mutation)

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

  const handleSignIn = () => {
    if (errorEmail) {
      // Hiển thị thông báo lỗi hoặc thực hiện xử lý khác tùy vào yêu cầu của bạn
      message.error(errorEmail);
      return;
    }
    mutation.mutate({
      email,
      password
    })
  }

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }

  return (

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: `url(${tenlua3}) center/cover no-repeat`, height: '100vh' }}>
      <div style={{ width: '800px', height: '400px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1 style={{ fontSize: '30px', marginBottom: '5px' }}>Xin chào</h1>
          <p style={{ fontSize: '15px', marginBottom: '10px' }}>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnChangeEmail}
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
            <InputForm placeholder="password" type={isShowPassword ? "text" : "password"}
              value={password} onChange={handleOnChangePassword} />
          </div>

          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isLoading} >
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: 'rgba(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px'
              }}
              textButton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          <p style={{ marginBottom: '-10px' }}><WrapperTextLight >Quên mật khẩu?</WrapperTextLight></p>
          <p style={{ fontSize: " 15px" }}>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt='image-logo' height="400px" width="300px" />
        </WrapperContainerRight>
      </div>
    </div>

  )
}

export default SignInPage
