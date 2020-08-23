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

  _setRanking: function () {
    const db = wx.cloud.database()
    db.collection('guo_guan_zhan_jiang').where({
      record: db.command.gt(0)
    }).orderBy('record', 'desc').limit(20).get({
      success: res => {
        this.setData({
          guoGuanZhanJiangList: res.data
        })
      }
    })

    db.collection('feng_miao_bi_zheng').where({
      record: db.command.gt(0)
    }).orderBy('record', 'desc').limit(20).get({
      success: res => {
        this.setData({
          fenMiaobiZhengList: res.data
        })
      }
    })

    // const { guoGuanZhanJiangList, fenMiaobiZhengList, openid } = app.globalData;

    // const myRankInfo1 = guoGuanZhanJiangList.find(x => x.openid === openid) || null;
    // const myRankInfo2 = fenMiaobiZhengList.find(x => x.openid === openid) || null;
    // const myRank1 = guoGuanZhanJiangList.findIndex(x => x.openid === openid) || null;
    // const myRank2 = fenMiaobiZhengList.findIndex(x => x.openid === openid) || null;

    // this.setData({
    //   guoGuanZhanJiangList: guoGuanZhanJiangList.slice(0, 100),
    //   fenMiaobiZhengList: fenMiaobiZhengList.slice(0, 100),
    //   myRankInfo1,
    //   myRankInfo2,
    //   myRank1,
    //   myRank2,
    // });
  },

  onLoad: function () {
    const { guoGuanZhanJiangList, fenMiaobiZhengList } = this.data;
    this._setRanking()
    // if (guoGuanZhanJiangList.length === 0 || fenMiaobiZhengList.length === 0) {
    //   this._showAndCloseLoading();

    //   setTimeout(() => this._setRanking(), 1000);
    // } else {
    //   this._setRanking();
    // }
  },

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

  onShareAppMessage: shareAppMessage,
});
