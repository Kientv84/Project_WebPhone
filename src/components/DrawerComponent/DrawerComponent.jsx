import { Modal } from 'antd'
import React from 'react'

const DrawerComponent = ({ title = 'Drawer', okType, isOpen = false, children, ...rests }) => {
    return (
        <>
            <Modal title={title} open={isOpen} {...rests}>
                {children}
            </Modal>
        </>
    )
}

export default DrawerComponent
