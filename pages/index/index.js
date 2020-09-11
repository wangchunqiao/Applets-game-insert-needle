Page({

  /**
   * 页面的初始数据
   */
  data: {
    turntable_img: 'http://store.boyaokj.cn/fc/yanjishoukuai/dazhuanpan.png', // 转盘图片路径
    turntable_back: 'http://store.boyaokj.cn/fc/yanjishoukuai/zhuanpan-back.png', // 转盘背景图片
    image_Tips: 'http://store.boyaokj.cn/fc/yanjishoukuai/jiantou.png', // 提示路径的图片
    startImg: 'http://store.boyaokj.cn/fc/yanjishoukuai/kaishiyouxi.png', // 开始游戏按钮图片
    level: 1, // 转盘等级
    speed: [20, 15, 12, 10, 8, 5, 3, 1], // 转盘转动速度，根据等级变化
    arrows: [], // 当前箭头数量
    outtime: 25, // 超时时间，单位秒
    textList: ['guo', 'feng', 'wen', 'zhai', 'sheng', 'shi', 'qi', 'mu'], // 左边的文字，图片的名字啥的都要一致，方便循环
    minLevel: 3, // 最小通关数
    dialogShow: 5, // 弹窗，1为未中奖，2为没机会了，3为积分奖励，4为商品奖励，5为玩法说明，6为获奖记录， 0为无弹窗 每次进入页面先是玩法说明
    reward: {}, // 获得的奖励
    recordList: [], // 累计获奖记录
    image_prefix: 'hong-', // 前缀名
    arrow_prefix: 'jian-', // 箭矢前缀名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.yjsk = this.selectComponent('#yjsk')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 未登录先登录
    if (!wx.getStorageSync('member')) {
      // 这里写你的登录方法
    } else {
      // 这里写你的页面加载事件
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 离开页面要结束游戏的计时任务
    this.yjsk.clearTime()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 离开页面要结束游戏的计时任务
    this.yjsk.clearTime()
  },

  /**
   * 用户点击分享
   */
  onShareAppMessage: function () {},

  // 开始游戏组件回调
  startGame(e) {
  },

  // 箭矢插入回调
  insertFun (e) {
  },

  // 游戏结束回调
  endGameFun (e) {
  },

  // 打开获奖记录弹窗
  showRecord () {
  },

  // 打开弹窗回调
  showDialog (e) {
    this.setData({
      dialogShow: e.detail
    })
  },

  // 关闭弹窗
  closeDialog() {
    this.setData({
      dialogShow: 0
    })
  },

  // 跳转页面
  toUrl (e) {
    var url = e.currentTarget.dataset.url;
    if (!url) return
    wx.navigateTo({
      url: url,
    })
  },
})