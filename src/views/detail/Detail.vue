<template>
  <div id="detail">
    <!-- 上部导航栏 -->
    <detail-nav-bar class="detail-nav"></detail-nav-bar>
    <scroll class="content" ref="scroll">
      <!-- 轮播图 -->
      <detail-swiper :topImages="topImages"></detail-swiper>
      <!-- 商品的信息 -->
      <detail-base-info :goods="goods"></detail-base-info>
      <!-- 商户的信息 -->
      <detail-shop-info :shop="shop"></detail-shop-info>
      <!-- 商品的图片信息 -->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <!-- 商品的参数信息 -->
      <detail-param-info :paramInfo="paramInfo"></detail-param-info>
    </scroll>    
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwipper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'

  import Scroll from 'components/commom/scroll/Scroll'

  import {getDetail,Goods,Shop,GoodsParam} from 'network/detail.js'

  export default {
    name: Detail,
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {}
      }
    },
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo
    },
    created() {
      //获取id
      this.iid = this.$route.params.id
      //根据id获取商品的详细信息
      getDetail(this.iid).then(res => {
        const data = res.result
        //1.获取轮播图的图片信息
        this.topImages = data.itemInfo.topImages
        //2.获取商品的信息
        this.goods = new Goods(data.itemInfo,data.columns,data,data.shopInfo.services)
        //3.店铺的信息
        this.shop = new Shop(data.shopInfo)
        //4.商品的图片信息
        this.detailInfo = data.detailInfo
        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
      })
    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    height: 100vh;
    z-index: 9;
    background-color: #ffffff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>