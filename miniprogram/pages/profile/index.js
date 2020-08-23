const app = getApp();
import { shareAppMessage } from '../../utils/index';

Page({
  data: {
    isAuthorized: false,
    totalOfAnswers: '--',
    totalOfCorrectAnswers: '--',
    accuracy: '100%',
    rank: '-',
    avatarUrl:
      'https://wx.qlogo.cn/mmopen/vi_32/eXrWeb45sjCs0Z0teC8WDU5VFdYGt5BAbYZOf0JicOSlK94BOWj6NgjUbCE1Adx6Kria0FVLxya3JkLn2DQicDpPA/132',
  },

  onShareAppMessage: shareAppMessage,

  onLoad: function () {
    this._refreshUserInfo()
  },

  _refreshUserInfo() {
    const that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({ isAuthorized: true });
          wx.getUserInfo({
            success: function (res2) {
              that.setData({
                avatarUrl: res2.userInfo.avatarUrl
              })
            },
          });
        }
      },
    });
  },

  bindGetUserInfo: function () {
    this._refreshUserInfo()
  },

  onPullDownRefresh() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this._refreshUserInfo();
        }
      },
    });
    wx.stopPullDownRefresh();
  },
});
