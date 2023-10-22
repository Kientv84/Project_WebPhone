import React from 'react'
import { WrapperContentProfile, WrapperHeader } from './style'

const ProfilePage = () => {
    return (
        <div style={{ width: '127px', margin: '0 auto'}}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <WrapperContentProfile></WrapperContentProfile>
        </div>
    )
}

export default ProfilePage
