## question

| 字段名    | 类型    | 备注         |
| --------- | ------- | ------------ |
| isCorrect | Boolean | 回答是否正确 |
| createdAt | Date    | 创建日期     |
| question  | Array   | 问题         |
| gameplay  | String  | 类型         |

- `gameplay`取值：`SUI_BIAN_WAN_WAN`, `GUO_GUAN_ZHAN_JIANG`、`FENG_MIAO_BI_ZHENG`

## guo_guan_zhan_jiang

| 字段名    | 类型   | 备注     |
| --------- | ------ | -------- |
| userInfo  | Object | 用户信息 |
| createdAt | Date   | 创建日期 |
| record    | Number | 记录     |

## feng_miao_bi_zheng

| 字段名    | 类型   | 备注     |
| --------- | ------ | -------- |
| userInfo  | Object | 用户信息 |
| createdAt | Date   | 创建日期 |
| record    | Number | 记录     |
| totalTime | Number | 总用时   |

## points

| 字段名    | 类型   | 备注     |
| --------- | ------ | -------- |
| userInfo  | Object | 用户信息 |
| createdAt | Date   | 创建日期 |
| updatedAt | Date   | 更新日期 |
| points    | Number | 积分     |

答对一题 +1
过关斩将完成一把 +1
过关斩将加分规则 5 -> 5; 10 -> 15; 20 -> 40; 30 -> 90; 40 -> 160; 50 -> 250; 60 -> 360
