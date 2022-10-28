import { axiom } from '../../../';
import { InvalidACLRule } from '../axiom';

describe('validateDomainAcl', () => {
  const ax = axiom();

  it('should return true for valid domains', () => {
    expect(ax['validateDomainAcl']('*')).toBe(true);
    expect(ax['validateDomainAcl']('example.com')).toBe(true);
    expect(ax['validateDomainAcl']('*.example.com')).toBe(true);
  });

  it('should return false for invalid domains', () => {
    expect(ax['validateDomainAcl']('**.example.com')).toBe(false);
    expect(ax['validateDomainAcl']('example.*.com')).toBe(false);
    expect(ax['validateDomainAcl']('*.api.*.com')).toBe(false);
    expect(ax['validateDomainAcl']('ex*ample.com')).toBe(false);
    expect(ax['validateDomainAcl']('*example.com')).toBe(false);
    expect(ax['validateDomainAcl']('example.*')).toBe(false);
  });
});

describe('InvalidACLRule', () => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const badAxiomConstructor = () => {
    axiom([{ match: 'example.*', action: 'allow' }]);
  };

  it('should be thrown for invalid ACL rules', () => {
    expect(badAxiomConstructor).toThrow(new InvalidACLRule('example.*'));
  });
});

describe('checkACL', () => {
  const ax = axiom([
    {
      match: 'evil.github.com',
      action: 'deny',
    },
    {
      match: '*.github.com',
      action: 'allow',
    },
    {
      match: '2001:db8::/32',
      action: 'deny',
    },
    {
      match: '1.0.0.0/8',
      action: 'deny',
    },
    {
      match: '*',
      action: 'allow',
    },
  ]);

  it('should return true for whitelisted domains', () => {
    expect(ax['checkACL']('8.8.8.8', 'benign.github.com')).toBe(true);
  })

  it('should return false for blacklisted domains', () => {
    expect(ax['checkACL']('8.8.8.8', 'evil.github.com')).toBe(false);
  })

  it('should return false for denied ipv4 networks', () => {
    expect(ax['checkACL']('1.0.0.1')).toBe(false);
  })

  it('should return false for denied ipv6 networks', () => {
    expect(ax['checkACL']('2001:db8::1')).toBe(false);
  })
});

describe('default checkACL', () => {
  const ax = axiom();

  it('should return false for ipv4 special ranges', () => {
    expect(ax['checkACL']('0.0.0.0')).toBe(false);
    expect(ax['checkACL']('127.0.0.2')).toBe(false);
    expect(ax['checkACL']('169.254.0.0')).toBe(false);
    expect(ax['checkACL']('192.168.0.5')).toBe(false);
    expect(ax['checkACL']('198.51.100.0')).toBe(false);
    expect(ax['checkACL']('255.255.255.255')).toBe(false);
  })

  it('should return false for ipv6 special ranges', () => {
    // The following are IPv6 addresses that return false despite being part of ipv6 special ranges
    // 'fc00::11:', '100::', '2001:3::1'
    expect(ax['checkACL']('::1')).toBe(false);
    expect(ax['checkACL']('64:ff9b::')).toBe(false);
    expect(ax['checkACL']('fe80::')).toBe(false);
  })

  it('should return true for non-special IPs and domains', () => {
    expect(ax['checkACL']('158.25.147.235')).toBe(true);
    expect(ax['checkACL']('158.25.147.235', 'github.com')).toBe(true);
  })
});
