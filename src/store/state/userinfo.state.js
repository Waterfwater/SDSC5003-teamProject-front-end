export default{
    state:{
        userInfo:(localStorage.getItem("loginData")&&JSON.parse(localStorage.getItem("loginData")))||{}
    },
    getters:{
        getUserId(state){
            return state.userInfo.id;
        }
    },
    mutations:{
        setUserInfo(state,uInfo){
            state.userInfo=uInfo
            localStorage.setItem("loginData", JSON.stringify(uInfo));
        }
        
    },
    
}