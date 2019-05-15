<template>
  <div class="tips">
    <div class="tip">
      <h1>404 NOT FOUND</h1>
      <p>{{$t('errorPage.404')}}</p>
      <a-button type="primary" size="large">
        <router-link to="/index">{{$t('errorPage.goBack')}}</router-link>
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
  }
}
</script>

<style scoped>
  .tips{
    position: relative;
    height: 100vh;
  }
  .tip{
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>
