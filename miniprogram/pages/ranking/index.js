const app = getApp();
import { shareAppMessage } from '../../utils/index';

Page({
  data: {
    guoGuanZhanJiangList: [],
    fenMiaobiZhengList: [],
    myRankInfo1: null,
    myRankInfo2: null,
    myRank1: null,
    myRank2: null,
    tabIndex: 1,
  },

  onLoad: function () {
    this._setRanking();
  },

  onShareAppMessage: shareAppMessage,

  _showAndCloseLoading: function () {
    wx.showLoading({ title: '加载中' });
    setTimeout(function () {
      wx.hideLoading();
    }, 4000);
  },

  _handleClickTab: function (e) {
    const { tabindex } = e.currentTarget.dataset;
    if (tabindex !== this.data.tabIndex) {
      this.setData({ tabIndex: tabindex });
    }
  },

  _setRanking: function () {
    const db = wx.cloud.database();
    // GET_GGZJ_RANK_LIST
    db.collection('guo_guan_zhan_jiang')
      .where({
        record: db.command.gt(0),
      })
      .orderBy('record', 'desc')
      .limit(20)
      .get({
        success: (res) => {
          this.setData({
            guoGuanZhanJiangList: res.data,
          });
        },
      });

    // GET_FMBZ_RANK_LIST
    db.collection('feng_miao_bi_zheng')
      .where({
        record: db.command.gt(0),
      })
      .orderBy('record', 'desc')
      .limit(20)
      .get({
        success: (res) => {
          this.setData({
            fenMiaobiZhengList: res.data,
          });
        },
      });
  },
});
