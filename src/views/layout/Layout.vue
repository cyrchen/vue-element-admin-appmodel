<template>
  <div :class="classObj" class="app-wrapper">
    <div class="page_header">
      <router-link to='/dashboard' class="left">首页</router-link>
      <el-menu :default-active="active_router_index" class="el-menu-1" mode="horizontal" @select="handleSelect">
        <el-menu-item index="test1">测试1</el-menu-item>
        <el-menu-item index="test2" >测试2</el-menu-item>
        <el-menu-item index="test3" >测试3</el-menu-item>
        <el-menu-item index="test4">系统管理</el-menu-item>
      </el-menu>
    </div>

    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <div class="page-content">
      <sidebar class="sidebar-container"/>
      <div class="main-container">
        <navbar/>
        <tags-view/>
        <app-main/>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import { mapGetters } from "vuex";
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapGetters([
      "active_router_index"
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  data() {
    return {
      
    };
  },
  created(){
    let currentRoutePath = this.$router.currentRoute.name
    this.$store.dispatch('setDefaultActiveIndex', { currentRoutePath })
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    handleSelect(key){
      console.log(key)
      this.$store.dispatch('GenerateActiveRouterIndex', { key })

      // this.$router.addRoutes(this.$store.getters.addRouters) // 根据roles权限生成可访问的路由表
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .page-content{
    .sidebar-container{
      top: 60px !important;
    }
    .main-container{
      margin-top: 60px;
      position: relative;
    }
  }
 .page_header{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 11;
    background: #f1f1f1;
    display: flex;
    flex-direction: row;
    .left{
      width: 120px;
      text-align: center;
      line-height: 60px;
      background: #ffffff;
    }
    .el-menu-1{
      flex: 1
    }
  }
</style>
