<template>
  <div id="detail">
    <!-- 上部导航栏 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" 
            @scroll="contentScroll" :probe-type="3">
      <!-- 轮播图 -->
      <detail-swiper :topImages="topImages"></detail-swiper>
      <!-- 商品的信息 -->
      <detail-base-info :goods="goods"></detail-base-info>
      <!-- 商户的信息 -->
      <detail-shop-info :shop="shop"></detail-shop-info>
      <!-- 商品的图片信息 -->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <!-- 商品的参数信息 -->
      <detail-param-info :paramInfo="paramInfo" ref="params"></detail-param-info>
      <!-- 评论信息 -->
      <detail-comment-info :comment-info="commentInfo" ref="comments"></detail-comment-info>
      <!-- 商品的推荐信息 -->
      <good-list :goods="recommends" ref="recommends"></good-list>
    </scroll>
    <detail-bottom-bar :add-cart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <toast/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwipper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/commom/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'

  import {getDetail,getRecommend,Goods,Shop,GoodsParam} from 'network/detail'
  import {debounce} from 'common/utils'
  import {itemListenerMixin} from 'common/mixin'

  import {mapActions} from 'vuex'

  //import Toast from 'components/common/toast/Toast'

  export default {
    name: Detail,
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        itemImgListener: null,
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        isShowBackTop: false,
        message: '',
        show: false
      }
    },
    mixins: [itemListenerMixin],
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      Scroll,
      BackTop,
      // Toast
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
        //6.获取评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
        
        // this.$nextTick(() => {
        //   //根据最新的数据，对应的DOM是已经渲染出来了
        //   //但是图片依然没有加载完（图片还没有加载完）
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        // })
      })
      //获取商品的推荐信息
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
      //给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comments.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      },500)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],500)
      },
      contentScroll(position) {
        //获取y值
        const positionY = -position.y
        
        //和主题中的值进行对比
        let length = this.themeTopYs.length
        for(let i = 0;i < length;i++) {
          if(this.currentIndex!==i && (i<length-1 && positionY>this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || 
          (i===length-1 && positionY > this.themeTopYs[i])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        //是否显示回到顶部
        this.isShowBackTop = -positionY > 1000
      },
      backClick() {
        this.$refs.scroll.scrollTo(0,0,500)
      },
      addToCart() {
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        
        //2.将商品添加到购物车当中
        // this.$store.dispatch('addCart',product).then(res => {
        //   //3.添加购物车成功

        // })
        this.addCart(product).then(res => {
          // this.show = true
          // this.message = res

          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)
          this.$toast.show(res,2000)
        })
      }
    },
    mounted () {
      // const refresh = debounce(this.$refs.scroll.refresh,200)
      // this.itemImgListener = () => {refresh()}
      // this.$bus.$on('itemImageLoad',this.itemImgListener)

      
    },
    destroyed () {
      this.$bus.$off('itemImageLoad',this.itemImgListener)
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
    height: calc(100% - 93px);
  }
</style>