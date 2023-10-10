import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextValue, WrapperTextPrice } from './style'
import { Checkbox, Rate } from 'antd'
import { render } from '@testing-library/react';

const NavbarComponent = () => {
    const onChange =() => {};
    const renderContent = (type, options) => {
        switch(type) {
            case 'text':
                return options.map((option) =>{
                    return <WrapperTextValue>{option}</WrapperTextValue>
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection:'column', gap:'12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{marginLeft: 0}} value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                        <Checkbox value="A">A</Checkbox>
                        <Checkbox value="B">B</Checkbox>
                    </Checkbox.Group>
                )
            case 'star':
                return options.map((option) => {
                        return (
                            <div style={{display: 'flex', gap: '4px'}}>
                                <Rate style={{fontSize: '12px'}} disabled defaultValue={option}/>
                                <span> {`tu ${option} sao`}</span>
                            </div>
                        )
                    })
            case 'price':
                return options.map((option) => {
                        return <WrapperTextPrice>{option}</WrapperTextPrice>
                    })
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLableText>Label</WrapperLableText>
            <WrapperContent>
                {renderContent('text',  ['Iphone 15', 'Xiaomi 12', 'Samsung A5'])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('checkbox',  [
                    { value: 'a', label: 'A' },
                    { value: 'b', label: 'B' }
                ])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('star', [2, 3, 4])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('price', ['Duoi 40.000', 'Tren 50.000'])}
            </WrapperContent>
            
        </div>
    )
}

export default NavbarComponent