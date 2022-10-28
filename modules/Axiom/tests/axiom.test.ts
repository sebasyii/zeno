import { axiom } from '../../../';
import { InvalidACLRule } from '../axiom';

describe('validateDomainAcl', () => {
  const ax = axiom();

  it('should return true for valid domains', () => {
    const validDomains = ['*', 'example.com', '*.example.com']
    validDomains.forEach((validDomain) => expect(ax['validateDomainAcl'](validDomain)).toBe(true))
  });

  it('should return false for invalid domains', () => {
    const invalidDomains = ['**.example.com', 'example.*.com', '*.api.*.com', 'ex*ample.com', '*example.com', 'example.*']
    invalidDomains.forEach((invalidDomain) => expect(ax['validateDomainAcl'](invalidDomain)).toBe(false))
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
    const ipv4SpecialIPs = ['0.0.0.0', '127.0.0.2', '192.168.0.5', '169.254.0.0', '198.51.100.0', '255.255.255.255']
    ipv4SpecialIPs.forEach((ipv4SpecialIP) => expect(ax['checkACL'](ipv4SpecialIP)).toBe(false))
  })

  it('should return false for ipv6 special ranges', () => {
    const ipv6SpecialIPs = ['::1', '64:ff9b::', '100::', '2001:3::1', 'fc00::11:', 'fe80::',]
    ipv6SpecialIPs.forEach((ipv6SpecialIP) => expect(ax['checkACL'](ipv6SpecialIP)).toBe(false))
  })

  it('should return true for non-special IPs', () => {
    expect(ax['checkACL']('158.25.147.235', 'github.com')).toBe(true)
  })
});
