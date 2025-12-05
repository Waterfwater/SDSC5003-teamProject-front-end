import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login/login.vue'
import store from "../store/index.js"
const routes = [
  {
    path:"/",
    name:"login",
    component: login
  },
  {
    path:"/register",
    name:"register",
    component:()=>import("../views/login/register.vue")
  },
  {
    path:"/manage",
    name:"manage",
    redirect:"/homeM",
    component:()=>import("../views/manage/Manager.vue"),
    children:[
      {
        path:"/appoint",
        name:"appoint",
        component:()=>import("../views/manage/pages/appoint.vue"),
      },
      {
        path:"/caseM",
        name:"caseM",
        component:()=>import("../views/manage/pages/case.vue"),
      },
      {
        path:"/Studentuser",
        name:"Suser",
        component:()=>import("../views/manage/pages/Suser.vue"),
      },
      {
        path:"/Teacheruser",
        name:"Tuser",
        component:()=>import("../views/manage/pages/Tuser.vue"),
      },
      {
        path:"/Doctoruser",
        name:"Duser",
        component:()=>import("../views/manage/pages/Duser.vue"),
      },
      {
        path:"/homeM",
        name:"homeM",
        component:()=>import("../views/manage/pages/homem.vue"),
      },
    ]
  },
  {
    path:"/teacher",
    name:"teacher",
    redirect:"/homet",
    component:()=>import("../views/teacher/Teacher.vue"),
    children:[
      {
        path:"/homet",
        name:"homett",
        component:()=>import("../views/teacher/pages/homet.vue"),
      },
      {
        path:"/studentT",
        name:"stuT",
        component:()=>import("../views/teacher/pages/student.vue"),
      },
    ]
  },
  {
    path:"/doctor",
    name:"doctor",
    redirect:"/homeD",
    component:()=>import("../views/doctor/Doctor.vue"),
    children:[
      {
        path:"/homeD",
        name:"homeD",
        component:()=>import("../views/doctor/pages/homed.vue"),
      },
      {
        path:"/appointD",
        name:"appointD",
        component:()=>import("../views/doctor/pages/appoint.vue"),
      },
      {
        path:"/caseD",
        name:"caseD",
        component:()=>import("../views/doctor/pages/case.vue"),
      },
      {
        path:"/reportD",
        name:"reportD",
        component:()=>import("../views/doctor/pages/report.vue"),
      },
      {
        path:"/dutyD",
        name:"dutyD",
        component:()=>import("../views/doctor/pages/duty.vue"),
      },
    ]
  },
  {
    path:"/student",
    name:"student",
    // redirect:"/homeM",
    component:()=>import("../views/student/student.vue")
    
  },
  {
    path:"/error",
    name:"error",
    component:()=>import("../views/login/error.vue")
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   // 判断用户是否登录
//   const data = JSON.parse(localStorage.getItem("loginData"));
  
//   if (!data){
    
//     if (to.path === "/register" || to.path === "/" || to.path === "/error") {
//       next();
//     } else {
//       next("/");
//     }
//   } else {
//     // 已登录，继续判断权限
//     const userId = data.id;

//     if (userId.startsWith('A-')) {
//       if (to.path.startsWith('/manage')) {
//         next();
//       } else {
//         next('/error'); 
//       }
//     } else if (userId.startsWith('D-')) {
//       if (to.path.startsWith('/doctor')) {
//         next();
//       } else {
//         next('/error'); // 无访问权限，重定向到错误页面
//       }
//     } else if (userId.startsWith('S-')) {
//       if (to.path.startsWith('/student')) {
//         next();
//       } else {
//         next('/error'); // 无访问权限，重定向到错误页面
//       }
//     } else if (userId.startsWith('T-')) {
//       if (to.path.startsWith('/teacher')) {
//         next();
//       } else {
//         next('/error'); // 无访问权限，重定向到错误页面
//       }
//     } else {
//       next('/error'); // 无效权限，重定向到错误页面
//     }
//   }
// });
export default router
