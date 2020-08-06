<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list />

    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
  import NavBar from 'components/common/navBar/NavBar'

  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'

  import {mapGetters} from 'vuex'

  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      //将getters中的内容转换为计算属性
      //mapGetters将store中的getter映射到局部计算属性
      ...mapGetters(['cartLength','cartList'])
      //...mapGetters({length:'cartLength',list:'cartList'})
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--colro-tint);
    color: #fff;
    font-weight: 700;
  }
</style>
