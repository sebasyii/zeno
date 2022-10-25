import { axiom } from '../../../';
import { InvalidACLRule } from '../axiom';

describe('#validateDomainAcl', () => {
  const ax = axiom([]);

  it('valid domains', () => {
    expect(ax['validateDomainAcl']('*')).toBe(true);
    expect(ax['validateDomainAcl']('example.com')).toBe(true);
    expect(ax['validateDomainAcl']('*.example.com')).toBe(true);
  });

  it('invalid domains', () => {
    expect(ax['validateDomainAcl']('**.example.com')).toBe(false);
    expect(ax['validateDomainAcl']('example.*.com')).toBe(false);
    expect(ax['validateDomainAcl']('*.api.*.com')).toBe(false);
    expect(ax['validateDomainAcl']('ex*ample.com')).toBe(false);
    expect(ax['validateDomainAcl']('*example.com')).toBe(false);
    expect(ax['validateDomainAcl']('example.*')).toBe(false);
  });
});

describe('#InvalidACLRule', () => {
  const badAxiomConstructor = () => {
    axiom([{ match: 'example.*', action: 'allow' }]);
  };

  it('invalid ACL rules', () => {
    expect(badAxiomConstructor).toThrow(new InvalidACLRule('example.*'));
  });
});
