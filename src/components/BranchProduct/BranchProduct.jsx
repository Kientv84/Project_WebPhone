import React from 'react'
import { WrapperBranch } from './styled'
import { useNavigate } from 'react-router-dom';

const BranchProduct = ({ name }) => {
  const navigate = useNavigate();
  const handleNavigateBranch = (branch) => {
    navigate(`/product/branch/${branch.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: branch })
  }
  return (
    <>
      <WrapperBranch onClick={() => handleNavigateBranch(name)}>{name}</WrapperBranch>
    </>
  )
}
export default BranchProduct  