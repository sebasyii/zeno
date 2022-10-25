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
