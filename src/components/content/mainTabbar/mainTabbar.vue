<template>
  <tab-bar>
    <tab-bar-item path="/home" active-color="deepPink">
      <img src="~assets/img/tabbar/oa-t-house.png" alt="" slot="icon">
      <img src="~assets/img/tabbar/oa-t-house-active.png" alt="" slot="iconActive">
      <div slot="text">首页</div>
    </tab-bar-item>
    <tab-bar-item path="/category" active-color="deepPink">
      <img src="~assets/img/tabbar/oa-t-list.png" alt="" slot="icon">
      <img src="~assets/img/tabbar/oa-t-list-active.png" alt="" slot="iconActive">
      <div slot="text">分类</div>
    </tab-bar-item>
    <tab-bar-item path="/cart" active-color="deepPink">
      <img src="~assets/img/tabbar/oa-shop.png" alt="" slot="icon">
      <img src="~assets/img/tabbar/oa-shop-active.png" alt="" slot="iconActive">
      <div slot="text">购物车</div>
    </tab-bar-item>
    <tab-bar-item path="/profile" active-color="deepPink">
      <img src="~assets/img/tabbar/oa-person.png" alt="" slot="icon">
      <img src="~assets/img/tabbar/oa-person-active.png" alt="" slot="iconActive">
      <div slot="text">我的</div>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
  import TabBar from '../../common/tabber/TabBar'
  import TabBarItem from '../../common/tabber/TabBarItem'

  export default {
    name: 'mainTabbar',
    components: {
      TabBar,
      TabBarItem
    }
  }
</script>

<style scoped>

</style>
