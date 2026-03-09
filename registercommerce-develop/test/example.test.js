function sum(a, b) {
  return a + b;
}

describe('Example test with jest', () => {
  test('Suma 1 + 1', (done) => {
    expect(sum(1, 1)).toBe(2);
    done();
  });
});
