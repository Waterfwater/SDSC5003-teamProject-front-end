import {post,get,put,del} from "./service"

export const loginApi=data=>{ 
    return post({
        url:"/login",
        data
    })
}
//
export const DocschedualApi=data=>{ 
    return post({
        url:'/doctorSchedule',
        data
    })
} 

//老师的学生查找
export const TstudentApi=data=>{ 
    return get({
        url:'/getStudentByTeacher',
        data
    })
} 

//增加预约
export const insertAppoApi=data=>{ 
    return post({
        url:'/InsertAppo',
        data
    })
} 

//获取学生报告
export const studentRepApi=data=>{ 
    return post({
        url:'/getReport',
        data
    })
} 
//写报告
export const writeRepApi=data=>{ 
    return post({
        url:'/updateReportForm',
        data
    })
} 

//获取病历
export const getcaseApi=data=>{ 
    return get({
        url:'/getCases',
        data
    })
} 
//写病历
export const writeCaseApi=data=>{ 
    return post({
        url:'/updateCases',
        data
    })
} 


//获取报告
export const RepApi=data=>{ 
    return post({
        url:'/idSelect',
        data
    })
} 

//删除医生

export const DoctorDeleteApi=data=>{ 
    return post({
        url:'/deleteDoc',
        data
    })
} 

//获取预约医生表
export const getYuyuelistApi=data=>{
    return get({
        url:"/doctorSchedule",
        data
    })
}

//获取值班表
export const dutyListApi=data=>{
    return get({
        url:"/Schedules",
        data
    })
}

//获取预约表
export const appointListApi=data=>{
    return post({
        url:"/appointmentSearch",
        data
    })
}

//新建医生
export const addDocApi=data=>{
    return post({
        url:"/registerDoc",
        data
    })
}

//修改医生

export const UpDocApi=data=>{
    return post({
        url:"/updateDoc",
        data
    })
}
//获取医生列表

export const DocListApi=data=>{
    return post({
        url:"/getDoctorList",
        data
    })
}

//获取老师列表

export const teacherListApi=data=>{
    return get({
        url:"/getTeacherList",
        data
    })
}

//获取学生账户列表
export const studentListApi=data=>{
    return get({
        url:"/getStudentList",
        data
    })
}

//删除学生用户

export const StudentDeleteApi=data=>{ 
    return post({
        url:'/deleteStu',
        data
    })
} 

//增加学生用户

export const StudentAddApi=data=>{
    return post({
        url:'/registerStu',
        data
    })
}

//修改学生用户

export const UpStudentApi=data=>{
    return post({
        url:'/updateStu',
        data
    })
}











// 获取用户列表
export const userListApi=data=>{ 
    return get({
        url:"/users",
        data
    })
} 

// 新增用户列表
export const userAddApi=data=>{ 
    return post({
        url:"/users",
        data
    })
} 
//  用户列表更改状态
export const userChangeStateApi=data=>{ 
    return put({
        url:`users/${data.id}/state/${data.mg_state}`,
        data
    })
} 
// 更改用户信息
export const userChangeInfoApi=data=>{ 
    return put({
        url:`users/${data.id}`,
        data
    })
} 
// 删除用户


export const userDeleteApi=data=>{ 
    return del({
        url:`users/${data.id}`
    })
} 

// 获取角色


export const getRolesApi=data=>{ 
    return get({
        url:`roles`,
        data
    })
} 
// 新建角色
export const addRolesApi=data=>{ 
    return post({
        url:`roles`,
        data
    })
} 
// 编辑角色
export const editRolesApi=data=>{ 
    return put({
        url:`roles/${data.id}`,
        data
    })
} 

export const rolesDeleteApi=data=>{ 
    return del({
        url:`roles/${data.id}`
    })
}

export const goodsListApi=data=>{ 
    return get({
        url:`goods`,
        data
    })
} 


