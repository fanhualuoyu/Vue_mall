<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
            @tabClick="tabClick" 
            ref="tabControl1" 
            class="tab-control" 
            v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll" 
            :pull-up-load="true" 
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recomment-view :recommends="recommends"/>
      <home-feature/>
      <tab-control :titles="['流行','新款','精选']" 
                  @tabClick="tabClick" 
                  ref="tabControl2"/>
      <good-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>        
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodList from 'components/content/goods/GoodList'
  import BackTop from 'components/content/backTop/BackTop'  

  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecomment from './childComps/HomeRecommend'
  import HomeFeature from './childComps/HomeFeature'

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  import {itemListenerMixin} from 'common/mixin'

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
        isShowBackTop: false,
        tapOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null
      }
    },
    mixins: [itemListenerMixin],
    components: {
      NavBar,
      Scroll,
      TabControl,
      GoodList,
      BackTop,

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
      this.getHomeGoods('sell')

      //第一次点击
      this.tabClick(0)
    },
    mounted() {
      //1.监听item中图片的加载
      // const refresh = debounce(this.$refs.scroll.refresh,200)
      // this.itemImgListener = ()=>{refresh()}
      // this.$bus.$on('itemImageLoad',this.itemImgListener)
      //2.获取tabControl的offsetTop
      //所以的组件都有一个属性$el：用来获取组件中的元素
      //this.$refs.tabControl.$el.offsetTop
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()

      this.$bus.$off('itemImageLoad',this.itemImgListener)
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
        if(currentIndex !== undefined){
          this.$refs.TabControl1.currentIndex = index
          this.$refs.tabControl2.currentIndex = index
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
      /**
       * 获取商品的数据
       */
      getHomeGoods(type) {
        const page = this.goods[type].page +1
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page + 1

          this.$refs.scroll.finishPullUp()
        })
      },
      /**
       * 返回到顶部
       */
      backClick() {
        this.$refs.scroll.scrollTo(0,0,500)
      },
      /**
       * 返回顶部按钮的显示与隐藏
       */
      contentScroll(position) {
        //1.判断BackTop是否显示
       this.isShowBackTop = (-position.y) > 1000

       //2.决定tabControl是否吸顶
       this.isTabFixed = (-position.y) > this.tapOffsetTop
      },
      /**
       * 加载更多
       */
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      /**
       * 监听图片的加载
       */
      swiperImageLoad() {
        this.tapOffsetTop = this.$refs.tabControl2.$el.offsetTop
      }
    },
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    height: 100vh;  /*视口的高度*/
    position: relative;
  }
  
  .home-nav {
    background-color: var(--color-tint);
    /* position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    z-index: 9; */
  }

  /* .content {
    height: calc(100%-93px);
    overflow: hidden;
    margin-top: 44px;
  } */

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0px;
    right: 0px;
  }

  .tab-control {
    position: relative;
    z-index: 9
  }

  /* .fixed {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 44px;
  } */
</style>
