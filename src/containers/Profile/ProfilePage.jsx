import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useSelector } from 'react-redux'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleOnChangeName = (e) => {
        setName(e.target.value)
    }

    const handleOnChangePhone = (e) => {
        setPhone(e.target.value)
    }

    const handleOnChangeAddress = (e) => {
        setAddress(e.target.value)
    }

    const handleOnChangeAvatar = (e) => {
        setAvatar(e.target.value)
    }

    const handleUpdate = () => {
        // console.log('update', email, name, phone, address, avatar)
    }

    return (
        <div style={{ width: '1270px', margin: '0 auto' }}>
            <WrapperHeader>Information</WrapperHeader>
            <WrapperContentProfile>
                <WrapperInput>
                    <WrapperLabel htmlFor="email">Email</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="email" value={email} onChange={handleOnChangeEmail} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            border: '#42C8B7',
                            borderRadius: '4px',
                            padding: '2px 6px'
                        }}
                        textbutton={'Edit Information'}
                        styletextbutton={{ color: '#42C8B7', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor="name">Name</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="name" value={name} onChange={handleOnChangeName} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            border: '#42C8B7',
                            borderRadius: '4px',
                            padding: '2px 6px'
                        }}
                        textbutton={'Edit Information'}
                        styletextbutton={{ color: '#42C8B7', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="phone" value={email} onChange={handleOnChangePhone} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            border: '#42C8B7',
                            borderRadius: '4px',
                            padding: '2px 6px'
                        }}
                        textbutton={'Edit Information'}
                        styletextbutton={{ color: '#42C8B7', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="phone" value={email} onChange={handleOnChangePhone} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            border: '#42C8B7',
                            borderRadius: '4px',
                            padding: '2px 6px'
                        }}
                        textbutton={'Edit Information'}
                        styletextbutton={{ color: '#42C8B7', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor="address">Address</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="address" value={email} onChange={handleOnChangeAddress} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            border: '#42C8B7',
                            borderRadius: '4px',
                            padding: '2px 6px'
                        }}
                        textbutton={'Edit Information'}
                        styletextbutton={{ color: '#42C8B7', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>
                <WrapperInput>
                    <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
                    <InputForm style={{ width: '300px' }} id="avatar" value={email} onChange={handleOnChangeAvatar} />
                    <ButtonComponent
                        onClick={handleUpdate}
                        size={40}
                        styleButton={{
                            height: '30px',
                            width: 'fit-content',
                            border: '#42C8B7',
                            borderRadius: '4px',
                            padding: '2px 6px'
                        }}
                        textbutton={'Edit Information'}
                        styletextbutton={{ color: '#42C8B7', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                </WrapperInput>

            </WrapperContentProfile>

        </div>
    )
}

export default ProfilePage