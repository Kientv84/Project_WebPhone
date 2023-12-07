import React from 'react'
import { WrapperType } from './styled'
import { useNavigate } from 'react-router-dom';

const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigateType = (type) => {
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: type })
  }
  return (
    <>
      <WrapperType onClick={() => handleNavigateType(name)}>{name}</WrapperType>
    </>
  )
}

export default TypeProduct