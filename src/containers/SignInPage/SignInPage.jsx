import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
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

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const location = useLocation()
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const mutation = useMutationHook(
    data => UserService.loginUser(data)
  )

  const { data, isLoading, isSuccess } = mutation

  useEffect(() => {
    // console.log('location', location)
    if (isSuccess) {
      if (location?.state) {
        navigate(location?.state)
      } else {
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


  // console.log('mutation', mutation)

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnChangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
  }

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
      <div style={{ width: '800px', height: '400px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1 style={{ fontSize: '30px', marginBottom: '5px' }}>Hello</h1>
          <p style={{ fontSize: '15px', marginBottom: '10px' }}>Sign-In</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnChangeEmail} />
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
              textbutton={'Sign-In'}
              styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </Loading>
          <p style={{ marginBottom: '-10px' }}><WrapperTextLight >Forgot Password</WrapperTextLight></p>
          <p style={{ fontSize: " 15px" }}>Don't have an account yet? <WrapperTextLight onClick={handleNavigateSignUp}> Register</WrapperTextLight></p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt='image-logo' height="400px" width="300px" />
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage
