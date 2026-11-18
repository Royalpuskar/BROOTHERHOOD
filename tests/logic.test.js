import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp, fractionModel, circuitModel, ecoModel, safeProgress, progressCount } from '../src/logic.js';

test('clamp rejects invalid numbers and respects bounds', () => {
  assert.equal(clamp('broken', 0, 4), 0);
  assert.equal(clamp(8, 0, 4), 4);
  assert.equal(clamp(-4, 0, 4), 0);
});
test('fractions are equal parts and half detection is exact', () => {
  assert.deepEqual(fractionModel(3, 4), {numerator:3,denominator:4,fraction:'3/4',percent:75,isHalf:false});
  assert.equal(fractionModel(3,6).isHalf, true);
  assert.equal(fractionModel(4,6).isHalf, false);
  assert.equal(fractionModel(100, 4).numerator, 4);
});
test('Ohms law gives correct values and valid solution', () => {
  assert.equal(circuitModel(6,10).currentLabel, '0.60 A');
  assert.equal(circuitModel(10,10).isOneAmp, true);
  assert.equal(circuitModel(3,2).current, 1.5);
  assert.equal(circuitModel(12,0).resistance,2);
});
test('illustrative ecology totals and goal boundaries', () => {
  assert.equal(ecoModel(4,0).kg, 12);
  assert.equal(ecoModel(1,2).kg, 5);
  assert.equal(ecoModel(1,2).reachedGoal, true);
  assert.equal(ecoModel(2,0).reachedGoal, false);
});
test('progress handling is strict and tolerant of corrupted storage', () => {
  assert.equal(progressCount(safeProgress('{')),0);
  assert.equal(progressCount(safeProgress('{"fractions":true,"circuit":false,"eco":true}')),2);
  assert.equal(progressCount(safeProgress('{"fractions":"true"}')),0);
});
