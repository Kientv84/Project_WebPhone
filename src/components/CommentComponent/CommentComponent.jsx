import React from 'react'

const CommentComponent = (props) => {
    const { datahref, width } = props
    return (
        < div style={{ margin: '-10px -12px 0', marginTop: '30px' }
        } >
            <div className="fb-comments" data-href={datahref} data-width={width} data-numposts="5"></div>
        </div >
    )
}

export default CommentComponent