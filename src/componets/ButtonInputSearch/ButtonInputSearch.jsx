import { Button, Input } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons';

const ButtonInputSearch = (props) => {
    const {
        size, 
        placeholder, 
        textButton, 
        bordered,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(13, 92, 182)', 
        colorButton = '#fff'
    } = props
    return (
        <div style={{ display:'flex', backgroundColor:'#fff'}}>
            <Input 
                size={size} 
                bordered = {bordered}
                placeholder={placeholder}  
                style={{backgroundColor: backgroundColorInput}}/>
            <Button 
                    size={size} 
                    bordered = {false}
                    style={{backgroundColor: backgroundColorButton, 
                    border: !bordered && 'none', borderRadius: '0'}}
                    icon={<SearchOutlined  style={{color: colorButton}}/>}> 
                 <span style={{color: colorButton}}>{textButton} </span>
            </Button>
        </div>
    )
}

export default ButtonInputSearch
