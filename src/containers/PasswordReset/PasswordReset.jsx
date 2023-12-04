import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import * as message from '../../components/Message/Message'



const PasswordReset = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const navigate = useNavigate()
    const [password, setPassword] = useState('');
    const { id, token } = useParams()



    const handleOnChangePassword = (value) => {
        setPassword(value)
    }

    const updatePassword = async () => {
        const res = await axios.post(`http://localhost:3000/api/user/reset-password/${id}/${token}`, { password });
        if (res?.data?.status === "Success") {
            message.success('Password changed successfully');
            handleNavigateSignIn();
        }

    };


    const handleNavigateSignIn = () => {
        navigate('/sign-in')
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc', height: '100vh' }}>
            <div style={{ width: '400px', height: '300px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1 style={{ fontSize: '30px', marginBottom: '8px', marginTop: '0px' }}>Enter Password</h1>
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '5px',
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
                        <InputForm placeholder="New password" type={isShowPassword ? "text" : "password"} style={{ marginBottom: '10px' }}
                            value={password} onChange={handleOnChangePassword} />
                    </div>
                    <ButtonComponent
                        onClick={updatePassword}
                        size={40}
                        styleButton={{
                            background: 'rgba(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textbutton={'Update'}
                        styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperContainerLeft>
            </div>
        </div>
    )
}

export default PasswordReset
