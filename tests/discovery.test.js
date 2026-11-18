import test from 'node:test';
import assert from 'node:assert/strict';
import { CASES, LEVELS, missionKey, evaluateMission, safeAchievements, earnedTitle } from '../src/discovery.js';

test('every Discovery Engine task has a numeric validated answer and meaningful feedback',()=>{
  for(const [world, levels] of Object.entries(CASES)){
    for(const level of LEVELS){
      const item=levels[level];
      assert.ok(item.prompt && item.hint && item.explanation);
      assert.equal(evaluateMission(world,level,item.answer).correct,true);
      assert.equal(evaluateMission(world,level,item.answer+1).correct,false);
      assert.equal(missionKey(world,level),world+':'+level);
    }
  }
});
test('invalid, empty and impossible inputs never award achievements',()=>{
  assert.equal(evaluateMission('circuit','starter','').valid,false);
  assert.equal(evaluateMission('eco','starter','abc').valid,false);
  assert.equal(evaluateMission('fractions','master',-1).valid,false);
  assert.equal(evaluateMission('oops','master',7).valid,false);
});
test('local achievement data rejects malformed or unrecognized entries',()=>{
  assert.deepEqual(safeAchievements('garbage'),[]);
  assert.deepEqual(safeAchievements('{"fractions":true}'),[]);
  assert.deepEqual(safeAchievements('["fractions:starter","fractions:starter","bad:master"]'),['fractions:starter']);
  assert.equal(earnedTitle([]),'New Explorer');
  assert.equal(earnedTitle(Array(9).fill('fractions:starter')),'Master of Discovery');
});
