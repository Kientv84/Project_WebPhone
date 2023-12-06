import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
    const {
        size,
        placeholder,
        textbutton,
        bordered,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgba(13, 129, 115, 0.82)',
        colorButton = '#fff',
    } = props
    return (
        <div style={{ display: 'flex', backgroundColor: '#fff' }}>
            <InputComponent
                size={size}
                bordered={bordered}
                placeholder={placeholder}
                style={{ backgroundColor: backgroundColorInput, borderRadius: '0px' }}
                {...props}
            />
            <ButtonComponent
                size={size}
                style={{
                    backgroundColor: backgroundColorButton,
                    border: !bordered && 'none', borderRadius: '0px'
                }}

                icon={<SearchOutlined style={{ color: colorButton }} />}
                textbutton={textbutton}
                styletextbutton={{ color: colorButton }}
            />
        </div>
    )
}

export default ButtonInputSearch
