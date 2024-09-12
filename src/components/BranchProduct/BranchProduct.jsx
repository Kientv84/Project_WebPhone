import React from 'react'
import { WrapperBranch } from './styled'
import { useNavigate } from 'react-router-dom';

const BranchProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigateType = (branch) => {
    navigate(`/product/${branch.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: branch })
  }
  return (
    <>
      <WrapperBranch onClick={() => handleNavigateType(name)}>{name}</WrapperBranch>
    </>
  )
}

export default BranchProduct