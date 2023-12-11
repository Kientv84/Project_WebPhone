import React from 'react'
import FooterComponent from '../FooterComponent/FooterComponent'

const DefautFooterComponent = ({ children }) => {
    return (
        <div>
            {children}
            <FooterComponent />
        </div>
    )
}

export default DefautFooterComponent
