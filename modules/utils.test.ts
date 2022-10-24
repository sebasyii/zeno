import { isCIDR } from './utils';

describe('isCIDR', () => {
  it('should return true for valid CIDR', () => {
    expect(isCIDR('192.168.129.23/17')).toBe(true);
  });

  it('should return false for string (Invalid CIDR)', () => {
    expect(isCIDR('hello')).toBe(false);
  });

  it('should return false for invalid CIDR V4', () => {
    expect(isCIDR('192.168.129.23')).toBe(false);
    expect(isCIDR('192.168.129.23/33')).toBe(false);
    expect(isCIDR('192.168.129.23/500')).toBe(false);
    expect(isCIDR('192.168.129.0/1204')).toBe(false);
  });
});
