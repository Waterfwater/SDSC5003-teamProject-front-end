<template>
    <div class="no-permission">
      <h1>无权限</h1>
      <p>Sorry, you may not have previlege to get access to this page抱歉，您没有访问该页面的权限。</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NoPermission',
    mounted() {
      document.body.style.fontSize = '24px'; // 设置页面字体大小
    }
  };
  </script>
  
  <style>
  .no-permission {
    text-align: center;
    padding: 50px;
    font-size: 24px;
  }
  </style>