import { Input } from 'antd'
import React, { useState } from 'react'

const InputForm = ({props}) => {
    const [valueInput, setValueInput] = useState('')
  return (
    <Input placeholder ={"Nhập text"} valueInput = {valueInput} />
  )
}

export default InputForm
