const app = getApp();
import { shareAppMessage } from '../../utils/index';
import { RULE, GAMEPLAY } from '../../constants/index.js';

Page({
  data: {
    isAuthorized: false,
    gamePlay: [
      {
        text: '随便玩玩',
        url: '/pages/gameplay-0/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '排行榜',
        url: '/pages/ranking/index',
        isReady: true,
        isHot: false,
      },
      // {
      //   text: '王者对战',
      //   url: '/pages/gameplay-3/index',
      //   isReady: true,
      //   isHot: false,
      // },
      {
        text: '过关斩将',
        url: '/pages/gameplay-2/index',
        isReady: true,
        isHot: false,
      },
      {
        text: '分秒必争',
        url: '/pages/gameplay-1/index',
        isReady: true,
        isHot: false,
      },
      // {
      //   text: '对战历史',
      //   url: '/pages/battle-list/index',
      //   isReady: true,
      //   isHot: false,
      // },
      {
        text: '我的战绩',
        url: '/pages/profile/index',
        isReady: true,
        isHot: true,
      },
    ],
  },

  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              app.globalData.userInfo = res.userInfo;
            },
          });
        }
      },
    });

    this._onGetOpenid();
  },

  onShareAppMessage: shareAppMessage,

  // 获取openid
  _onGetOpenid: function () {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: (res) => {
        app.globalData.openid = res.result.openid;
      },
    });
  },

  // 显示规则
  _showRule: function () {
    wx.showModal({
      showCancel: false,
      title: '规则',
      content: RULE,
      success: function (res) {},
    });
  },

  // 显示玩法
  _showGameplay: function () {
    wx.showModal({
      showCancel: false,
      title: '玩法',
      content: GAMEPLAY,
    });
  },

  // 跳转到新页面
  _goNewPage: function (e) {
    const { url, ready } = e.currentTarget.dataset;

    if (ready) {
      wx.navigateTo({ url });
    }
  },
});
