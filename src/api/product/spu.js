import request from "@/utils/request";

export const reqSpuInfo = (page, limit, categoryId) => {
  return request({
    url: `/admin/product/${page}/${limit}/${categoryId}`,
    method: 'get'
  })
}
