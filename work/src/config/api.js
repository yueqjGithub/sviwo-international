// const host = 'http://admin.sviwo.ltd'

// const host = 'http://192.168.0.188:8904'
const host = 'http://47.244.143.245:8904'
// 图片前缀--打包到正式服时，切换到pro-sviwo-oss
// const imgUrl = ' http://192.168.0.193:8090/'
const imgUrl = ' http://47.244.133.165:8090'
// const imgUrl = 'http://pro-sviwo-oss.oss-cn-beijing.aliyuncs.com/'

const urlList = {
  imgHost: imgUrl,
  uploadImage: host + '/admin/file/upload',
  login: host + '/admin/login',
  logout: host + '/admin/logout',
  // 验证码
  vercode: host + '/admin/sysUser/vercode',
  // 获取菜单
  getMenuByloginUser: host + '/admin/menu/getMenuByloginUser',
  // 获取账户列表
  getUser: host + '/admin/sysUser/getUser',
  // 根据用户id获取已有权限
  findRoleIdBySysUserId: host + '/admin/sysUser/findRoleIdBySysUserId',
  // 用户添加修改
  saveOrUpdateUser: host + '/admin/sysUser/saveOrUpdate',
  // 验证用户名是否重复
  validateUsername: host + '/admin/sysUser/validateUsername',
  // 验证国家是否被冻结
  validateCountry: host + '/admin/sysUser/validateCountry',
  // 解冻用户
  unFreezeUser: host + '/admin/sysUser/unFreezeUser',
  // 冻结用户
  freezeUser: host + '/admin/sysUser/freezeUser',
  // 重置密码
  resetPassword: host + '/admin/sysUser/resetPassword',
  // 系统用户设置角色
  saveUserRole: host + '/admin/sysUser/saveUserRole',
  // 获取角色列表
  getRole: host + '/admin/role/getRole',
  // 角色页面拉取权限
  permRoleConfig: host + '/admin/permission/permRoleConfig',
  // 冻结角色
  freezeRole: host + '/admin/role/freezeRole',
  // 解冻角色
  unFreezeRole: host + '/admin/role/unFreezeRole',
  // 添加或修改角色
  saveOrUpdateRole: host + '/admin/role/saveOrUpdateRole',
  // 获取权限列表
  getPermission: host + '/admin/permission/getPermission',
  // 添加或修改权限
  saveOrUpdatePermis: host + '/admin/permission/saveOrUpdatePermis',
  // 删除权限
  deletePermission: host + '/admin/permission/deletePermission',
  // 获取角色已有权限
  findPermisIdByRoleId: host + '/admin/role/findPermisIdByRoleId',
  // 添加权限到角色
  saveRolePermission: host + '/admin/role/savePermRole',
  // 获取司机列表
  getDriver: host + '/admin/driver/getDriver',
  // 获取国家列表数据
  getCountry: host + '/admin/country/getCountryConfigList',
  // 冻结国家
  freezeCountry: host + '/admin/country/freezeCountry',
  // 解冻国家
  unFreezeCountry: host + '/admin/country/unFreezeCountry',
  // 添加或修改国家
  saveOrUpdateCountry: host + '/admin/country/saveOrUpdate',
  // 车辆列表
  getCarList: host + '/admin/car/getCarList',
  // 添加修改车辆
  saveOrUpdateCar: host + '/admin/car/saveOrUpdate',
  // 获取乘客列表
  getPassengerList: host + '/admin/passenger/getPassengerList',
  // 冻结乘客
  freezePassenger: host + '/admin/passenger/freezePassenger',
  // 乘客解冻
  unFreezePassenger: host + '/admin/passenger/unFreezePassenger',
  // 司机列表
  getDriverList: host + '/admin/driver/getDriverList',
  // 冻结司机
  freezeDriver: host + '/admin/driver/freezeDriver',
  // 解冻司机
  unFreezeDriver: host + '/admin/driver/unFreezeDriver',
  // 添加司机
  saveDriver: host + '/admin/driver/saveDriver',
  // 修改司机
  updateDriver: host + '/admin/driver/updateDriver',
  // 待审核列表
  getDriverAuditList: host + '/admin/driver/getDriverAuditList',
  // 审核司机
  examineDriver: host + '/admin/driver/examineDriver',
  // 订单列表
  getOrderList: host + '/admin/order/getOrderList',
  // 关闭订单
  closeOrder: host + '/admin/order/closeOrder',
  // 查看订单评价
  getComplaintByOrderId: host + '/admin/comment/getComplaintByOrderId',
  // 获取菜单树
  getMenuTree: host + '/admin/menu/getMenuTree',
  // 获取单个菜单信息
  getMenu: host + '/admin/menu/getMenu',
  // 删除菜单
  deleteMenu: host + '/admin/menu/delete',
  // 添加或修改菜单
  saveOrUpdateMenu: host + '/admin/menu/saveOrUpdateMenu',
  // 获取跟菜单相关的权限
  queryPermMenu: host + '/admin/permission/queryPermMenu',
  // 根据菜单Id获取该菜单现有资源
  findPermIdByMenuId: host + '/admin/permission/findPermIdByMenuId',
  // 菜单绑定权限
  menuBindingPerm: host + '/admin/permission/menuBindingPerm',
  // 系统参数配置
  getDicType: host + '/admin/dicType/getDicType'
}

export default urlList
