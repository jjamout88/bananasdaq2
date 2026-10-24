// 바나나스닥2 — all tunable numbers live here.
window.CFG={
 CANDLE_MS:2000, VOL_X:1.05, N_NORMAL:30, N_BOSS:45, MINBET:50,
 FEE_FLAT:2, FEE_PCT:0.0005, PV_DIV:3,
 START_BAL:[10000,20000,40000,70000,100000],
 TARGET:[[12,12,18],[24,24,36],[42,42,66],[66,66,102],[84,84,132]],
 VOL_MIN_RATIO:0.7, BOSS_TOP:0.10,
 WAGE_PCT:0.30, WAGE_CAP0:1500,
 NEGO:{base:500,maxOver:2,moods:[[.25,1.5],[.50,1],[.20,.5],[.05,'bonus']]},
 INTEREST:{pct:.10,round:10,cap:500,capPiggy:1000,piggyStage:200},
 LEV:[[1,0],[2,300],[5,4000],[10,20000]],
 BET:[[10,0],[30,500],[50,2000]],
 SHELF:2, SHELF_BONUS_X:2, TIER_ODDS:[.70,.25,.05], TIER_PRICE:[700,1225,1925], PRICE_JITTER:.10,
 REROLL:300, REROLL_STEP:150, SLOTS:3, SLOT4_PRICE:15000, SELL_PCT:.3, DISC:.30,
 GIMMICK:{count:4,minGap:5,warn:2,dur:{witch:3,cpi:1,fomc:1,earn:3,limit:3},hidePct:.4},
 COMBO_STEP:.15, HOLD_BARS:4, TREND_X:2, COUNTER_X:2, HOLD_X:2, LONG_X:1.2, SHORT_X:1.2, FIRST_X:2, ALLIN_X:1.3, SCALP_X:1.5, SCALP_BARS:3, BAIT_N:3, BAIT_LOSS:.5, COMPOUND_STEP:.004,
 // 강화 (확률·수치는 시뮬 후 확정): lv1..3 비용/성공률, boost=레벨당 보너스 부분 강화율
 UPG:{max:3,cost:[1500,3000,6000],p:[.7,.5,.3],boost:.25,
  // 바나나별 강화 효과 (레벨당)
  combo:.05, bait:1, coupon:1, piggyStage:100, piggyCap:250, compound:.0025, disc:.05, feeRebate:10, nana:1},
 SAVE_KEY:'bnsq2_run_v1', META_KEY:'bnsq2_meta_v1'
};
// id, name, tier(0 common/1 rare/2 legend), short desc
window.BANANAS=[
 ['trend','추세',0,'최근 3봉 방향으로 진입해 익절 시 ×2'],['counter','역추세',0,'최근 3봉 반대로 진입해 익절 시 ×2'],
 ['hold','존버',0,'4봉 이상 들고 수익으로 끝내면 수익 ×2'],['fee','수수료',0,'수수료 0'],['piggy','저금통',0,'이자 한도 $1000, 스테이지당 +$200'],
 ['coupon','쿠폰',0,'리롤 1회 무료'],['long','긴',0,'롱 수익 ×1.2'],['short','짧은',0,'숏 수익 ×1.2'],
 ['disc','할인',0,'상점 전부 -30%'],['first','첫끗',0,'첫 거래 ×2'],
 ['combo','콤보',1,'연승마다 +15%'],['bait','미끼',1,'청산 3회 방어 (베팅 50% 손실)'],['allin','한방',1,'베팅 100% 강제, 수익 ×1.3'],
 ['scalp','단타',2,'3봉 안에 익절 ×1.5'],['nana','나나바',2,'스테이지당 1회 손실 포지션을 같은 금액 수익으로'],['compound','복리',2,'이긴 거래마다 런 내내 +0.4% (마지막에 더함)']
];
