<template>
  <div id="app">
    <div v-if="$route.meta.layout">
      <a-layout>
        <a-layout-header>
          <top></top>
        </a-layout-header>
        <a-layout>
          <a-layout-sider style="background: #fff;" class="admin-sider">
            <adminNav></adminNav>
          </a-layout-sider>
          <a-layout-content class="admin-content">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
      <div class="preImgMain" v-if="showPreImg" @click="closePreImg">
        <img :src="imgSrc" alt="" class="seePreImg">
      </div>
    </div>
    <div v-else>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import top from '@/components/head'
import adminNav from '@/components/nav'
export default {
  name: 'App',
  components: {
    top,
    adminNav
  },
  methods: {
    closePreImg: function () {
      this.$store.commit('admin/nSeePic')
    }
  },
  computed: {
    showPreImg: function () {
      return this.$store.state.admin.preImg
    },
    imgSrc: function () {
      return this.$store.state.admin.imgSrc
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: auto;
}
.admin-sider{
  height: calc(100vmin - 64px);
  overflow: hidden;
}
.admin-content{
  padding: 8px;
}
.preImgMain{
  width: 100vw;
  height:100vh;
  background: rgba(0,0,0,0.7);
  position: fixed;
  top:0;
  left: 0;
  z-index: 3000;
  zoom: 1;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.seePreImg{
  max-width:40vw;
  max-height:70vh;
}
</style>
