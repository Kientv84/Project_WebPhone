import { Button, Input } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
    const {
        size, 
        placeholder, 
        textButton, 
        bordered,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgba(13, 129, 115, 0.82)', 
        colorButton = '#fff'
    } = props
    return (
        <div style={{ display:'flex', backgroundColor:'#fff'}}>
            <InputComponent 
                size={size} 
                bordered = {bordered}
                placeholder={placeholder}  
                style={{backgroundColor: backgroundColorInput}}/>
            <ButtonComponent 
                    size={size} 
                    bordered = {false}
                    style={{backgroundColor: backgroundColorButton, 
                    border: !bordered && 'none', borderRadius: '0px'}}
                    icon={<SearchOutlined  style={{color: colorButton}}/>}> 
                 <span style={{color: colorButton}}>{textButton} </span>
            </ButtonComponent>
        </div>
    )
}

export default ButtonInputSearch
