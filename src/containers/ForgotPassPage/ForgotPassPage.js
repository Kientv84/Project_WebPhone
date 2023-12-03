import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import imageLogo from '../../assets/images/SignIn.png'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'

const ForgotPassPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const mutation = useMutationHook(
        data => UserService.forgotPassword(data),

    )

    const { data, isLoading, isSuccess, isError } = mutation

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }


    const handleSignUp = () => {
        mutation.mutate({
            email,
        })
    }

    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
            <div style={{ width: '400px', height: '300px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h4 style={{ fontSize: '30px', marginBottom: '8px', marginTop: '0px' }}>Forgot Password</h4>
                    <InputForm style={{ marginBottom: '8px' }} placeholder="Enter Email" value={email} onChange={handleOnChangeEmail} />
                    {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                    <Loading isLoading={isLoading}>
                        <ButtonComponent
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
                            textButton={'Send'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        ></ButtonComponent>
                    </Loading>
                </WrapperContainerLeft>

                {/* <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt='image-logo' height="400px" width="300px" />
                </WrapperContainerRight> */}
            </div>
        </div>
    )
}

export default ForgotPassPage
