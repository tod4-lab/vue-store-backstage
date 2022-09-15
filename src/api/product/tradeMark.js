import request from '@/utils/request'
export const reqTradeMarkList = (page, limit) => {
    return request({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'
    })
}
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if(tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMark
    })
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

export const reqDeleteTradeMark = (id) => {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}
