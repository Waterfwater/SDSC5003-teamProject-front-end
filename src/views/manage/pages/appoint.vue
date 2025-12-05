<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预约列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容区域 -->
    <div class="page_content">
      <div class="flex">
        <div class="input_box">
          <el-input
            v-model="searchParams.query"
            placeholder="搜索学生名 / 医生名"
            class="input-with-select"
          >
            <template #append>
              <el-button @click="filter">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        class="table"
        :data="paginatedData"
        height="600"
        empty-text="暂无预约记录"
        style="width: 100%"
      >
        <el-table-column prop="student_name" label="学生姓名" width="150" />
        <el-table-column prop="doctor_name" label="医生姓名" width="150" />
        <el-table-column prop="appointment_date" label="预约日期" width="140" />
        <el-table-column prop="appointment_time" label="预约时间" width="140" />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { toRefs,reactive,ref,onMounted,watch,computed } from 'vue'
import { appointListApi } from '@/util/request'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name:"Suser",
    setup(){
        const data=reactive({
            searchParams:{
                query:"",
                // pagenum:2,
                // pagesize:7,
            },
            StudentList:[],
            filteredStudentList:[],
            total:0,
            currentPage: 1, // 当前页
            pageSize: 11,
           
        })
        const handleCurrentChange = newVal => {
            data.currentPage = newVal;
        }

        // 分页器数据
        const paginatedData = computed(() => {
            const start = (data.currentPage - 1) * data.pageSize;
            const end = start + data.pageSize;
            return data.filteredStudentList.slice(start, end);
        });

        const filter = () => {
            const query = data.searchParams.query.trim().toLowerCase();
            if (!query) {
                data.filteredStudentList = data.StudentList;
                data.total = data.filteredStudentList.length; // 更新总数据量
                data.currentPage = 1; // 搜索后重置到第一页
                return;
            }
            data.filteredStudentList = data.StudentList.filter(student => {
                
                return (
                    (student.student_name && student.student_name.toLowerCase().includes(query)) ||
                    (student.teacher_name && student.teacher_name.toString().toLowerCase().includes(query)) ||
                    (student.appointment_date && student.appointment_date.toLowerCase().includes(query)) ||
                    (student.appointment_time && student.appointment_time.toString().toLowerCase().includes(query))
                    // 注意所有的字段现在都进行了存在性检查
                );
            });
            data.total = data.filteredStudentList.length; // 更新总数据量
            data.currentPage = 1; // 搜索后重置到第一页
        }
        const searchList=()=>{
            const formData=new URLSearchParams()
            formData.append('type','admin')
            appointListApi(formData).then(res=>{
                data.total=res.totalNum
                data.StudentList=res.data
                data.filteredStudentList=data.StudentList
            }).catch(error=>{
                ElMessage.error("服务器错误")
            })
        }
        watch(paginatedData, (newData) => {
            // 当分页数据改变时，更新表格内容
            // 这里不需要处理任何逻辑，因为视图会自动与 paginatedData 保持同步
        });

        onMounted(() => {
            searchList(); // 组件挂载后立即执行 searchList
        });



        return{
            ... toRefs(data),
            watch,
            filter,
            searchList,
            computed,
            paginatedData,
            handleCurrentChange,
            computed
        }
    }
}
</script>
<style scoped>
.flex{
    margin-top: 16px;
}
.table{
    margin-top: 10px;
}
</style>