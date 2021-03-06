// 分秒必争

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
    countdown: 60,
    record: 0,
    totalTime: 0,
    gameOver: false,
    onThisPage: true,
  },

  onShareAppMessage: shareAppMessage,

  onUnload: function () {
    const { userInfo } = app.globalData;
    const { gameOver, record, totalTime } = this.data;

    if (!gameOver && record > 0) {
      const db = wx.cloud.database();
      db.collection('feng_miao_bi_zheng').add({
        data: {
          createdAt: new Date(),
          userInfo,
          totalTime,
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
        this.setData({ gameOver: true, isStart: false });
        const db = wx.cloud.database();
        db.collection('feng_miao_bi_zheng').add({
          data: {
            userInfo,
            createdAt: new Date(),
            record: this.data.record,
            totalTime: this.data.totalTime,
          },
        });
      }
    } else {
      this.setData({
        countdown: this.data.countdown - 1,
        totalTime: this.data.totalTime + 1,
      });

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
      countdown: 60,
      record: 0,
      totalTime: 0,
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
    const {
      cards,
      selectedOperator,
      selectedCard,
      record,
      countdown,
      initialCards,
    } = this.data;
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
        const awardTime = this._calculateAwardTime();
        this.showToast(`答对 +${awardTime}s`, 'success');
        this._skip();
        this.setData({
          record: record + 1,
          countdown: countdown + awardTime,
        });
      } else {
        this.showToast('答错 -5s', 'none');
        this.setData({
          countdown: countdown - 5,
        });
        this._skip();
      }

      // TODO:
      // post('increaseAnswersCount', {
      //   isCorrect,
      // }).then((res) => {
      //   this.setData({
      //     totalOfCorrectAnswers: res.totalOfCorrectAnswers,
      //     totalOfAnswers: res.totalOfAnswers,
      //   });
      // });
      const db = wx.cloud.database();
      db.collection('question').add({
        data: {
          isCorrect,
          createdAt: new Date(),
          question: initialCards.map((x) => x.value),
          gameplay: 'FENG_MIAO_BI_ZHENG',
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

  _calculateAwardTime: function () {
    const record = this.data.record + 1;

    if (record > 50) {
      return 5
    }
    if (record > 30) {
      return 6
    }
    if (record > 20) {
      return 7
    }
    if (record > 5) {
      return 8
    }
    return 10
  },

  showToast: function (title, icon) {
    wx.showToast({
      title,
      icon,
      duration: 800,
    });
  },

  _skip: function () {
    const newCards = generateCardsAndRecommendSolution();
    this.setData({
      cards: [...newCards.cards],
      initialCards: [...newCards.cards],
      recommendSolution: newCards.recommendSolution,
      selectedCard: null,
      selectedOperator: null,
    });
  },
});
