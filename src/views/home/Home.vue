<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <home-recomment-view :recommends="recommends"/>
    <home-feature/>
    <tab-control :class="tab-control" 
                :titles="['流行','新款','精选']" 
                @tabClick="tabClick"/>
    <good-list :goods="showGoods"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodList'

  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecomment from './childComps/HomeRecommend'
  import HomeFeature from './childComps/HomeFeature'

  import {getHomeMultidata,getHomeGoods} from 'network/home'

  export default {
    name: 'Home',
    data(){
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0,list: []},
          'news': {page: 0,list: []},
          'sell': {page: 0,list: []},
        },
        currentType: 'pop',
      }
    },
    components: {
      NavBar,
      TabControl,
      GoodList,

      HomeSwiper,
      HomeRecomment,
      HomeFeature,      
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata(),
      //2.请求商品数据
      this.getHomeGoods('pop'),
      this.getHomeGoods('news'),
      this.getHomeGoods('sell'),
    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index){
        switch(index){
          case 0 : 
            this.currentType = 'pop' 
            break
          case 1 : 
            this.currentType = 'news' 
            break
          case 2 : 
            this.currentType = 'sell' 
            break
        }
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page +1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page + 1
        })
      },
    },
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
  }
  
  .home-nav {
    background-color: var(--color-tint);
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 9;
  }

  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
</style>
