const searchbarReducer = (state=null, action) => {
    switch (action.type) {
        case 'CHANGE_STATE':
            return action.payload;
        default:
            console.log("going into default")
            return state;
    }
};

export default searchbarReducer
