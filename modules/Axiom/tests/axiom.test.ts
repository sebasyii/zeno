import { axiom } from '../../../';
import { InvalidACLRule } from '../axiom';

describe('validateDomainAcl', () => {
  const ax = axiom([]);

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

  it ('should return false for denied ipv6 networks', () => {
    expect(ax['checkACL']('2001:db8::1')).toBe(false);
  })
});
