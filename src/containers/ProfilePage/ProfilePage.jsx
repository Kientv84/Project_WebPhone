import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slice/userslide'
import { Button, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils'


const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const [errorPhone, setErrorPhone] = useState('');
    const [hasError, setHasError] = useState(false);

    const mutation = useMutationHook(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )
    const dispatch = useDispatch()
    const { data, isLoading, isSuccess, isError } = mutation
    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])
    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
        // console.log('res', res)
    }

    const handleOnChangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnChangeName = (value) => {
        setName(value)
    }

    const handleOnChangePhone = (value) => {
        const formattedValue = value.replace(/\D/g, '').slice(0, 10);
        setPhone(formattedValue)
        handlePhoneError(formattedValue);
    }

    const handleOnChangeAddress = (value) => {
        setAddress(value)

    }

    const handlePhoneError = (value) => {
        // Kiểm tra định dạng số điện thoại, có thể thay đổi theo quy ước của bạn
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(value)) {
            setErrorPhone('Số điện thoại không hợp lệ');
        } else {
            setErrorPhone('');
        }
    }

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }
    const handleUpdate = () => {
        if (errorPhone) {
            // Hiển thị thông báo lỗi hoặc thực hiện xử lý khác tùy vào yêu cầu của bạn
            message.error(errorPhone);
            return;
        }
        mutation.mutate({ id: user?.id, email, name, phone, address, avatar, access_token: user?.access_token })
    }

    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor='name'>Name</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id='name' value={name} onChange={handleOnChangeName} />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id='email' value={email} onChange={handleOnChangeEmail} readOnly />
                    </WrapperInput>
                    <WrapperInput >
                        <WrapperLabel htmlFor='phone'>Phone</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id='phone' value={phone} onChange={handleOnChangePhone} onBlur={() => handlePhoneError(phone)} />

                    </WrapperInput>
                    {errorPhone && <span style={{
                        color: 'red',
                        marginTop: '-5px',
                        marginLeft: '83px',
                        height: '0'
                    }}>{errorPhone}</span>}
                    <WrapperInput>
                        <WrapperLabel htmlFor='address'>Address</WrapperLabel>
                        <InputForm style={{ width: '300px' }} id='address' value={address} onChange={handleOnChangeAddress} />
                    </WrapperInput>

                    <WrapperInput>
                        <WrapperLabel htmlFor='avatar'>Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar" />
                        )}
                        {/* <InputForm style={{ width: '300px' }} id='avatar' value={avatar} onChange={handleOnChangeAvatar} /> */}
                    </WrapperInput>
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            borderRadius: '4px',
                            padding: '2px 6px 6px',
                            marginLeft: 'auto'
                        }}
                        textButton={'Cập nhật'}
                        styleTextButton={{ color: '#42C8B7', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperContentProfile>

            </Loading>

        </div>
    )
}

export default ProfilePage
