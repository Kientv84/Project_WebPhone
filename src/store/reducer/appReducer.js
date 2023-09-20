import actionType from "../action/actionType";

const initState = {
    homeData: []
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionType.GET_HOME:
            return state
            
    
        default:
            return state;
    }
} 


export default appReducer