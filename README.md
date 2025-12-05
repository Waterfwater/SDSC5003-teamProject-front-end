# SDSC5003 Team Project - Frontend

## 1. Project Overview
This is the frontend part of the SDSC5003 team project, built with **Vue.js**.  
It handles the user interface, data display, and communicates with the backend APIs.

---

## 2. Project Structure

src/
├─ assets/ # Static resources (images, styles)
├─ components/ # Reusable components
├─ views/ # Page views
├─ router/ # Routing configuration
├─ store/ # Vuex state management
├─ App.vue # Root component
└─ main.js # Entry file
public/ # Public assets
index.html # HTML entry

---

## 3. Dependencies

- Node.js >= 16
- npm >= 8 or yarn
- Vue.js 3
- Vite
- ElementPlus
- Axios

Install dependencies:

```bash
npm install
# or
yarn install
```
---


## 4. Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
##Connecting to Backend

API calls are located in \src\util\service.js

Update baseURL to your backend server address, e.g.:
const Service = axios.create({
    timeout:8000,
    baseURL:"http://localhost:8080",
    headers:{
        // "Content-type":"application/json;charset=utf-8",
        "Authorization":store.state.uInfo.userInfo.token
    }
})

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
