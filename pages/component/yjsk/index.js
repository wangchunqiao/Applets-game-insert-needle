var app = getApp()
Component({
  /**
   * 组件的属性列表
   * 此组件包含回调事件
   * startGameFun 点击开始游戏回调
   * insertFun 箭矢射击成功事件回调
   * showDialog 打开父组件弹窗事件回调
   * endGameFun 游戏结束事件回调
   */
  properties: {
    // 超时时间，单位秒
    outtime: {
      type: Number,
      value: 25
    },
    // 转盘背景图片
    turntable_back: {
      type: String,
      value: ''
    },
    // 转盘图片
    turntable_img: {
      type: String,
      value: ''
    },
    // 提示箭矢路径的图片
    image_Tips: {
      type: String,
      value: ''
    },
    // 文字的列表 请将左侧图片的名字和文字列表和箭矢的图片等名称对应，方便使用
    textList: {
      type: Array,
      value: []
    },
    // 开始游戏按钮图片
    startImg: {
      type: String,
      value: ''
    },
    // 整体距离顶部距离
    marginTop: {
      type: String,
      value: ''
    },
    // 转盘转速，根据等级自己调整即可，原理是每speed[level]毫秒转一度，也就是说最快一秒三圈多
    speed: {
      type: Array,
      value: [20, 15, 12, 10, 8, 5, 3, 1]
    },
    // 图片服务器地址
    image_url: {
      type: String,
      value: ''
    },
    // 获取奖励最小等级
    minLevel: {
      type: Number,
      value: 0
    },
    // 左侧图片变色前缀名
    image_prefix: {
      type: String,
      value: ''
    },
    // 箭矢图片前缀名
    arrow_prefix: {
      type: String,
      value: ''
    }
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: {
    angle: 0, // 转盘转动角度
    arrows: [], // 当前箭头数量
    isStart: !1, // 游戏开始开关
    surplusNum: 0, // 剩余游戏次数
    level: 1, // 游戏等级
  },
  attached: function () {
    // 获取游戏次数
    this.getGameNun()
  },
  /**
   * 组件的方法列表 
   * 更新属性和数据的方法与更新页面数据的方法类似 
   */
  methods: {
    getGameNun () {
      // 这里写你的获取次数方法
      this.setData({
        surplusNum: this.data.surplusNum + 1
      })
    },
    // 开始游戏
    startGame() {
      // 检查是否还有次数，没有了就弹窗告知
      if (this.data.surplusNum <= 0) {
        this.triggerEvent('showDialog', 2)
        wx.showToast({
          title: '您没机会了啊~',
          icon: 'none'
        })
        return
      }
      // 先清空转动计时任务防止意外bug
      clearInterval(this.data.setInter)
      // 开始游戏时间计时
      this.gameTime()
      // 开始转动转盘
      this.turntableTurn()
      // 设置开始并减少次数
      this.setData({
        isStart: !0,
        surplusNum: this.data.surplusNum - 1
      })
      this.triggerEvent('startGameFun')
    },
    // 结束游戏
    endGame() {
      // 清理计时任务
      clearInterval(this.data.setInterGame)
      clearInterval(this.data.setInter)
      // 如果等级为3则为
      if (this.data.level <= this.data.minLevel) {
        this.triggerEvent('showDialog', 1)
        wx.showToast({
          title: '没有达到奖励条件呢~',
          icon: 'none'
        })
      } else {
        this.triggerEvent('endGameFun', this.data.level)
      }
      // 重置游戏参数
      this.setData({
        level: 1,
        outtime: 25,
        isStart: !1,
        arrows: [],
      })
    },
    
    // 游戏时间计时
    gameTime() {
      // 设置计时任务
      this.data.setInterGame = setInterval(() => {
        // 每秒倒计时减一
        this.setData({
          outtime: this.data.outtime - 1
        })
        // 如果时间结束
        if (this.data.outtime == 0) {
          // 立即结束游戏
          this.endGame()
        }
      }, 1000);
    },
  
    // 转动转盘
    turntableTurn() {
      var that = this
      var level = this.data.level // 当前游戏等级
      var speed = this.data.speed[level - 1] // 当前等级转动速度
      // 设置计时任务, speed越低转动加减时间越少，转动越快
      that.data.setInter = setInterval(() => {
        // 获取当前旋转角度
        var angle = this.data.angle
        // 等级为奇数时轮盘逆时针，偶数顺时针，所以根据奇偶判断方向并将旋转角度保持在0-360之间
        if (angle == 360 && level % 2 == 0) angle = 0
        if (angle == 0 && level % 2 == 1) angle = 360
        // 根据当前等级来旋转轮盘，顺时针加，逆时针减
        if (level % 2 == 0) {
          that.setData({
            angle: angle + 1
          })
        } else {
          that.setData({
            angle: angle - 1
          })
        }
      }, speed);
    },
  
    // 插入箭矢
    insert() {
      var arrows = this.data.arrows // 获取当前插入的箭矢数组
      var level = this.data.level // 获取当前等级
      var angle = this.data.angle // 获取轮盘转动角度
      var imageText = this.data.textList[level - 1] // 根据等级获取箭矢图片的名字
      // 生成箭矢参数
      arrows.push({
        dushu: 360 - angle, // 箭矢旋转角度（此处有一点，箭矢图片与轮盘的接触点，也就是箭头，一定是在箭矢图片的上方，不然图片插进去就反了）
        arrow_img: this.data.image_url + this.data.arrow_prefix + imageText + '.png', // 箭矢图片路径
      })
      // 加入箭矢数组
      this.setData({
        arrows
      })
      // 是否中箭开关，默认未中
      var yes = false
      // 根据等级和轮盘旋转的角度判断箭矢是否命中（注意，轮盘旋转角度为0时箭矢命中的角度是180，而非0，如无法理解请自己射两箭试试即可）
      switch (level) {
        case 1:
          if (angle > 225 && angle < 270) yes = true
          break;
        case 2:
          if (angle > 180 && angle < 225) yes = true
          break;
        case 3:
          if (angle > 135 && angle < 180) yes = true
          break;
        case 4:
          if (angle > 90 && angle < 135) yes = true
          break;
        case 5:
          if (angle > 45 && angle < 90) yes = true
          break;
        case 6:
          if (angle > 0 && angle < 45) yes = true
          break;
        case 7:
          if (angle > 315 && angle < 360) yes = true
          break;
        case 8:
          if (angle > 270 && angle < 315) yes = true
          break;
      }
      // 判断命中
      if (yes) {
        // 通关最高级结束游戏
        if (level == 8) {
          this.endGame()
          this.triggerEvent('endGameFun')
          return
        }
        // 结束之前的计时任务,否则多个任务会互相冲突
        clearInterval(this.data.setInter)
        // 然后增加等级
        this.setData({
          level: level + 1
        })
        // 插入成功回调父组件
        this.triggerEvent('insertFun', level + 1)
        // 最后再开始重新转动轮盘
        this.turntableTurn()
      } else {
        // 未命中直接结束游戏即可
        this.endGame()
      }
    },
  
    clearTime () {
      clearInterval(this.data.setInterGame)
      clearInterval(this.data.setInter)
    },

  },
})