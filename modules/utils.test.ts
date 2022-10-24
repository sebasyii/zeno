import { isCIDR, isIPV4 } from './utils';

describe('isCIDR', () => {
  it('should return true for valid CIDR', () => {
    expect(isCIDR('81.241.226.135/24')).toBe(true);
    expect(isCIDR('192.168.129.235/32')).toBe(true);
  });

  // it('should return true for valid CIDR V6', () => {
  //   expect(isCIDR('2001:4860:4860::8888/32')).toBe(true);
  //   expect(isCIDR('4cce:f22c:80b1:3b93:6850:8a4e:eebd:abcc/64')).toBe(true);
  //   expect(isCIDR('bb14:3b5d:6736:c046:e43d:4e7d:3548:1789/64')).toBe(true);
  //   expect(isCIDR('113e:ed36:650a:1252:8323:db37:31fc:923c/32')).toBe(true);
  //   expect(isCIDR('e494:c200:2a09:cdb1:1aea:47d2:28b0:5fbc/64')).toBe(true);
  // });

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

describe('isIPV4', () => {
  it('should return true for valid IPV4', () => {
    expect(isIPV4('81.241.226.135')).toBe(true);
    expect(isIPV4('54.240.116.145')).toBe(true);
    expect(isIPV4('2.5.192.88')).toBe(true);
    expect(isIPV4('191.106.97.135')).toBe(true);
    expect(isIPV4('72.191.50.210')).toBe(true);
  });
});

describe('isIPV6', () => {
  it('should return true for valid IPV6', () => {
    expect(isCIDR('2001:4860:4860::8888')).toBe(true);
    expect(isCIDR('2001:4860:4860:0000:0000:0000:0000:8888')).toBe(true);
    expect(isCIDR('bb14:3b5d:6736:c046:e43d:4e7d:3548:1789')).toBe(true);
  });
});
