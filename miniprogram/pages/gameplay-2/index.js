// 过关斩将

const app = getApp();
import {
  generateCardsAndRecommendSolution,
  noDecimal,
  calculate,
  shareAppMessage,
} from '../../utils/index.js';
import { OPERATORS, OPERATORS_HASH } from '../../constants/index.js';
const cardsAndRecommendSolution = generateCardsAndRecommendSolution();

Page({
  data: {
    operators: OPERATORS,
    OPERATORS_HASH,
    selectedOperator: null,
    selectedCard: null,
    cards: cardsAndRecommendSolution.cards,
    initialCards: [...cardsAndRecommendSolution.cards],
    recommendSolution: cardsAndRecommendSolution.recommendSolution,
    totalOfAnswers: 0,
    totalOfCorrectAnswers: 0,
    isStart: false,
    countdown: 30,
    record: 0,
    gameOver: false,
    onThisPage: true,
  },

  onShareAppMessage: shareAppMessage,

  onUnload: function () {
    const { userInfo } = app.globalData;
    const { gameOver, record } = this.data;

    if (!gameOver && record > 0) {
      const db = wx.cloud.database();
      // ADD_GGZJ
      db.collection('guo_guan_zhan_jiang').add({
        data: {
          createdAt: new Date(),
          userInfo,
          record,
        },
      });
    }

    this.setData({ onThisPage: false });
  },

  onLoad: function () {
    this._handleStart();
  },

  _countdown: function () {
    if (!this.data.onThisPage || this.data.gameOver) return;

    const that = this;
    const { userInfo } = app.globalData;

    if (this.data.countdown < 2) {
      if (this.data.isStart) {
        this.openAlert(this.data.record);
        const db = wx.cloud.database();
        // ADD_GGZJ
        db.collection('guo_guan_zhan_jiang').add({
          data: {
            createdAt: new Date(),
            userInfo,
            record: this.data.record,
          },
        });
      }
    } else {
      this.setData({ countdown: this.data.countdown - 1 });

      setTimeout(function () {
        that._countdown();
      }, 1000);
    }
  },

  _handleStart: function () {
    const newCards = generateCardsAndRecommendSolution();
    this.setData({
      isStart: true,
      gameOver: false,
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 30,
      record: 0,
    });
    this._countdown();
  },

  _selectOperator: function (e) {
    const { value } = e.currentTarget.dataset;
    const { selectedOperator } = this.data;

    this.setData({
      selectedOperator: selectedOperator !== value ? value : null,
    });
  },

  _selectCard: function (e) {
    const { value, index } = e.currentTarget.dataset;
    const { cards, selectedOperator, selectedCard, initialCards } = this.data;
    if (cards[index].state === 'disable') return;

    const nextState = {
      cards,
      selectedCard: { value: cards[index].value, position: index },
    };
    nextState.cards[index].state = 'active';

    if (selectedCard !== null) {
      Object.assign(nextState, { selectedCard: null });
      nextState.cards[selectedCard.position].state = 'normal';

      if (selectedCard.position !== index) {
        Object.assign(nextState, {
          selectedCard: { value: cards[index].value, position: index },
        });
        nextState.cards[selectedCard.position].state = 'normal';

        if (selectedOperator !== null) {
          const answer = calculate(
            selectedCard.value,
            cards[index].value,
            selectedOperator
          );

          Object.assign(nextState, {
            selectedOperator: null,
            selectedCard: { value: answer, position: index },
          });

          nextState.cards[selectedCard.position].state = 'disable';
          nextState.cards[index] = {
            value: answer,
            state: 'active',
            alias: noDecimal(
              nextState.cards[selectedCard.position].alias,
              nextState.cards[index].alias,
              selectedOperator
            ),
          };
        }
      }
    }
    const isFinish =
      nextState.cards.filter(({ state }) => state === 'disable').length === 3;

    if (isFinish) {
      const isCorrect = nextState.selectedCard.value === 24;
      if (isCorrect) {
        this._skip();
        this.setData({ record: this.data.record + 1 });
      } else {
        this.openAlert(this.data.record);
        const db = wx.cloud.database();
        // ADD_GGZJ
        db.collection('guo_guan_zhan_jiang').add({
          data: {
            createdAt: new Date(),
            userInfo: app.globalData.userInfo,
            record: this.data.record,
          },
        });

        this.setData({ isStart: false, gameOver: true });
      }

      // TODO:
      // post('increaseAnswersCount', { openid, isCorrect }).then((res) => {
      //   this.setData({
      //     totalOfCorrectAnswers: res.totalOfCorrectAnswers,
      //     totalOfAnswers: res.totalOfAnswers,
      //   });
      // });
      const db = wx.cloud.database();
      // ADD_QUESTION
      db.collection('question').add({
        data: {
          createdAt: new Date(),
          isCorrect,
          question: initialCards.map((x) => x.value),
          gameplay: 'GUO_GUAN_ZHAN_JIANG',
        },
      });
    } else {
      this.setData({
        ...nextState,
      });
    }
  },

  _reset: function (e) {
    const resetCards = this.data.initialCards.map((x) => ({
      value: x.value,
      alias: [x.value],
      state: 'normal',
    }));

    this.setData({
      cards: resetCards,
      selectedCard: null,
      selectedOperator: null,
    });
  },

  _skip: function (e) {
    const newCards = generateCardsAndRecommendSolution();
    this.setData({
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
      countdown: 30,
    });
  },

  openAlert: function (record) {
    this.setData({
      gameOver: true,
      isStart: false,
    });
  },
});
