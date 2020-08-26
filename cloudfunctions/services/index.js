const cloud = require('wx-server-sdk');

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
});

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const action = event.data.action;
  const payload = event.data.payload;
  const _ = db.command;

  const db = wx.cloud.database();
  const GGZJ_DB = db.collection('guo_guan_zhan_jiang'); // 过关斩将
  const FMBZ_DB = db.collection('feng_miao_bi_zheng'); // 分秒必争
  const QUESTION_DB = db.collection('question'); // 答题记录
  const POINTS_DB = db.collection('points'); // 积分

  // --------------------------------------------------

  // 获取过关斩将排名列表
  if (action === 'GET_GGZJ_RANK_LIST') {
    return await GGZJ_DB.where({
      record: db.command.gt(0),
    })
      .orderBy('record', 'desc')
      .limit(20)
      .get();
  }

  // 添加过关斩将记录
  if (action === 'ADD_GGZJ') {
    return await GGZJ_DB.add({
      data: {
        createdAt: new Date(),
        userInfo: payload.userInfo,
        record: payload.record,
      },
    });
  }

  // -----------------------------------------------------------

  // 获取分秒必争排名列表
  if (action === 'GET_FMBZ_RANK_LIST') {
    return await FMBZ_DB.where({
      record: db.command.gt(0),
    })
      .orderBy('record', 'desc')
      .limit(20)
      .get();
  }

  // 添加分秒必争记录
  if (action === 'ADD_FMBZ') {
    return await FMBZ_DB.add({
      data: {
        createdAt: new Date(),
        userInfo: payload.userInfo,
        totalTime: payload.totalTime,
        record: payload.record,
      },
    });
  }

  // ------------------------------------------------------

  // 添加答题记录
  if (action === 'ADD_QUESTION') {
    return await QUESTION_DB.add({
      data: {
        isCorrect: payload.isCorrect,
        createdAt: new Date(),
        question: payload.question,
        gameplay: payload.gameplay,
      },
    });
  }

  // --------------------------------------------------------------
  // 添加或更新积分记录
  if (action === 'UPDATE_POINTS') {
    const res = await POINTS_DB.where({ _openid: wxContext.OPENID }).count();
    if (res.total === 0) {
      POINTS_DB.add({
        data: {
          userInfo: payload.userInfo,
          points: payload.points,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return await POINTS_DB.where({ _openid: wxContext.OPENID }).update({
      data: {
        points: _.inc(payload.points),
      },
    });
  }

  // 查询积分
  if (action === 'GET_POINTS') {
    return await POINTS_DB.where({ _openid: wxContext.OPENID }).get();
  }

  // 查询积分排名
  if (action === 'GET_POINTS_RANK') {
    const res = await POINTS_DB.where({ _openid: wxContext.OPENID }).get();
    const points = res.points;
    return await POINTS_DB.where({ points: _.gt(points) }).count();
  }
};
