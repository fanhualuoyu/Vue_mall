import {ADD_COUNTER,ADD_TO_CART} from './mutations-types'

export default{
  addCart(context,payload) {
    return new Promise((resolve,reject) => {
      let oldProduct = null
      let oldPorduct = context.state.cartlist.find(item => item.iid === payload.iid)
      if(oldProduct){
        oldPorduct.count +=1
        context.commit(ADD_COUNTER,oldPorduct)
        resolve('当前的商品数量+1')
      }else{
        payload.count == 1
        context.commit(ADD_TO_CART,payload)
        resolve('添加购物车成功')
      } 
    })     
  }
}