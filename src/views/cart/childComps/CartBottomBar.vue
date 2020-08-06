<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button  
                  class="check-button" 
                  :is-checked="isSelectAll" 
                  @click="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计:{{totalPrice}}
    </div>

    <div class="calculate">
      去计算:({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  export default {
    neme: 'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      totalPrice() {
        return this.$store.getters.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)//保留两位小数
      },
      checkLength() {
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if(this.$store.state.cartList.length === 0) {
          return false
        }
        return !(this.$store.state.cartList.filter(item => !item.checked).length)
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) {//全部选中的情况下
          this.$store.state.cartList.foreach(item => item.checked = false)
        }else {//有部分没选中的情况
          this.$store.state.cartList.foreach(item => item.checked = true)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    line-height: 40px;
    position: relative;
    background-color: #eee;
    display: flex;
    font-size: 40px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    text-align: center;
    background-color: red;
  }
</style>