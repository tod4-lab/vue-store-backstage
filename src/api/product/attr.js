import request from "@/utils/request";

export const reqCategoryInfo = (id) => {
  return request({
    url: `/admin/product/categoryInfoList/${id}`,
    method: 'get'
  })
}

export const reqAttrList = (categoryId) => {
  return request({
    url: `/admin/product/getAttrList/${categoryId}`,
    method: 'get'
  })
}

export const reqSaveAttrInfo = (attrInfo) => {
  return request({
    url: `/admin/product/saveAttrInfo`,
    method: 'post',
    data: attrInfo
  })
}

export const reqDeleteAttrInfo = (attrId) => {
  return request({
    url: `/admin/product/deleteAttr/${attrId}`,
    method: 'delete'
  })
}
