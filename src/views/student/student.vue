<template>
    <div class="common-layout">
      <el-container class="container">
        <el-header class="header">Console</el-header>
        <el-main class="main">
            <!-- 标签页组件 -->
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="view available appointments" name="appointment" class="lab">
                  <el-date-picker
                    v-model="selectedDate"
                    type="date"
                    :picker-options="pickerOptions"
                    placeholder="choose a date"
                  ></el-date-picker>

                  <!-- 确认按键 -->
                  <el-button type="primary" @click="onConfirm">confirm</el-button>
                  <!-- 医生选择 -->
                  <div class="doctor-list">
                    <el-table class="table" :data="paginatedData1" style="width: 100%">
                      <el-table-column prop="doctor_id" label="doctorid"  />
                        <el-table-column prop="doctor_name" label="doctor's name"  />
                        <el-table-column prop="title" label="title" />
                        <el-table-column prop="schedule_date" label="date" />
                        <el-table-column prop="schedule_time" label="time" />
                        <el-table-column   label="option" > 
                            <template #default="people">
                                <el-button type="primary" @click="editRow(people.row)">make a appointment</el-button>
                            </template>
                        </el-table-column>
                        <!-- mg_state 状态 -->
                    </el-table>
                    <el-pagination
                    :current-page="table1.currentPage"
                    :page-size="pageSize"
                    :total="table1.total"
                    :small="small"  
                    layout="total, prev, pager, next, jumper"
                    @current-change="handleCurrentChange"
                    />
                  </div>
                  <!-- 预约按键 -->
                </el-tab-pane>
                <el-tab-pane label="view your appointment" @click="searchapp" name="viewAppointment" class="lab"  @tab-click="handleTabClick">
                  <el-table class="table" :data="paginatedData2" style="width: 100%">
                        <el-table-column prop="doctor_name" label="doctor's name"  />
                        <el-table-column prop="appointment_date" label="date" />
                        <el-table-column prop="appointment_time" label="time" />
                        <!-- mg_state 状态 -->
                    </el-table>
                    <el-pagination
                    :current-page="table2.currentPage"
                    :page-size="pageSize"
                    :total="table2.total"
                    :small="small"  
                    layout="total, prev, pager, next, jumper"
                    @current-change="handleCurrentChange2"
                    />
                   <!-- 列表 -->
                </el-tab-pane>
                <el-tab-pane label="view report" name="viewReport" class="lab"  @tab-click="handleTabClick">
                  <!-- 列表显示报告内容？报告时间，点击查看报告内容 -->
                  <el-table class="table" :data="paginatedData3" style="width: 100%">
                    <el-table-column prop="case_description" label="your condition" />
                        <el-table-column prop="diagnose_Message" label="suggestions" />
                        <el-table-column prop="teacher_name" label="teacher's name"  />
                        <el-table-column prop="phone" label="teacher's phone" />
                        
                        <!-- <el-table-column   label="操作" > 
                            <template #default="people">
                                <el-button type="primary" @click="">view report</el-button>
                            </template>
                        </el-table-column> -->
                        <!-- mg_state 状态 -->
                    </el-table>
                    <el-pagination
                    :current-page="table3.currentPage"
                    :page-size="pageSize"
                    :total="table3.total"
                    :small="small"  
                    layout="total, prev, pager, next, jumper"
                    @current-change="handleCurrentChange3"
                    />
                </el-tab-pane>
            </el-tabs>
        </el-main>
        <el-footer class="footer">Best wishes for you</el-footer>
      </el-container>
    </div>
</template>
  
<script>
import { ref,computed,watch } from 'vue';
import { reactive, toRefs,onMounted } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { appointListApi,getYuyuelistApi,DocschedualApi,insertAppoApi,studentRepApi } from "@/util/request";
import { ElMessage } from 'element-plus';

export default {
  name: "studentS",
  setup() {

    const activeName = ref("appointment")
    const small = ref(true)

    const store=useStore()

    // ------------ 统一管理 data ----------
    const data=reactive({
      table1:{ currentPage:1, total:0, list:[] },
      table2:{ currentPage:1, total:0, list:[] },
      table3:{ currentPage:1, total:0, list:[] },
      pageSize:8,
      selectedDate: new Date()
    })

    // -------- disabledDate 修复 ----------
    const disabledDate = (time) => {
      const today = new Date()
      return time.getTime() < today.getTime()
    }

    // -------- 日期格式 ----------
    const formattedDate = computed(() => {
      const date = data.selectedDate
      const y = date.getFullYear()
      const m = `${date.getMonth()+1}`.padStart(2,'0')
      const d = `${date.getDate()}`.padStart(2,'0')
      return `${y}-${m}-${d}`
    })

    // -------- 分页 ----------
    const paginatedData1 = computed(() => {
      const s=(data.table1.currentPage-1)*data.pageSize
      return data.table1.list.slice(s, s+data.pageSize)
    })
    const paginatedData2 = computed(() => {
      const s=(data.table2.currentPage-1)*data.pageSize
      return data.table2.list.slice(s, s+data.pageSize)
    })
    const paginatedData3 = computed(() => {
      const s=(data.table3.currentPage-1)*data.pageSize
      return data.table3.list.slice(s, s+data.pageSize)
    })

    const handleCurrentChange = v => data.table1.currentPage = v
    const handleCurrentChange2 = v => data.table2.currentPage = v
    const handleCurrentChange3 = v => data.table3.currentPage = v

    // ---------- 查询医生排班 ----------
    const onConfirm = () => {
      const form = new URLSearchParams()
      form.append("date", formattedDate.value)
      
      DocschedualApi(form).then(res=>{
        data.table1.list = res.data
        data.table1.total = res.totalNum
        if(res.totalNum>0) ElMessage.success("显示成功")
        else ElMessage("no data")
      })
    }

    // ---------- 预约 ----------
    const editRow = (row)=>{
      const form = new URLSearchParams()
      const login = JSON.parse(localStorage.getItem("loginData"))

      form.append("studentId", login.id)
      form.append("doctorId", row.doctor_id)
      form.append("appointmentDate", row.schedule_date)
      form.append("appointmentTime", row.schedule_time)

      insertAppoApi(form).then(()=>{
        ElMessage.success("appointment is successful")
      })
    }

    // ---------- 初始医生列表 ----------
    const searchDoc = ()=>{
      getYuyuelistApi().then(res=>{
        data.table1.list = res.data
        data.table1.total = res.data.length     // 修复 total
      })
    }

    // ---------- 查看预约 ----------
    const searchapp=()=>{
      const form=new URLSearchParams()
      const login = JSON.parse(localStorage.getItem("loginData"))
      form.append("type","student")
      form.append("id_data",login.id)

      appointListApi(form).then(res=>{
        data.table2.list=res.data
        data.table2.total=res.totalNum
      })
    }

    // ---------- 查看报告 ----------
    const searchRep=()=>{
      const form=new URLSearchParams()
      const login = JSON.parse(localStorage.getItem("loginData"))
      form.append("student_id",login.id)

      studentRepApi(form).then(res=>{
        data.table3.list=res.data
        data.table3.total=res.data.length   // 修复 total
      })
    }

    onMounted(()=>{
      searchDoc()
      searchapp()
      searchRep()
    })

    return {
      ...toRefs(data),
      activeName,
      small,
      disabledDate,
      formattedDate,
      paginatedData1,paginatedData2,paginatedData3,
      handleCurrentChange,handleCurrentChange2,handleCurrentChange3,
      searchDoc,searchapp,searchRep,onConfirm,editRow
    }
  }
}
</script>

  
  <style scoped>
  .demo-tabs {
    width: 66.67%;
    height: 100%;
    
  }
  
  .common-layout {
    background-size: cover;
    background-position: center;
    height: 100vh;
    font-size: 16px;
  }
  
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background-color: rgb(255, 255, 255);
    padding: 0;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
  }
  
  .main {
    background-color: rgb(255, 255, 255);
    display: flex;
    align-items: start;
    justify-content: center;
    flex: 7;
    padding-top: 0;
    width: 100%;
  }

  .lab{
    padding: 1rem;
  cursor: pointer;
  font-size: 1.25rem; /* 修改标签字体大小 */
  }
  .lab {
    cursor: pointer;
  }

  .appointment-tab {
    font-size: 1.5rem;
  }

  .view-appointment-tab {
    font-size: 1.2rem;
  }

  .view-report-tab {
    font-size: 1.3rem;
  }
  
  .footer {
    background-color: rgb(255, 255, 255);
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }
  </style>