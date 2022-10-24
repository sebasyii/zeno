import { axiom } from '../../../';

describe('Axiom', () => {
  const ax = axiom([]);

  it('#validateDomainAcl - valid domains', () => {
    expect(ax['validateDomainAcl']('*')).toBe(true);
    expect(ax['validateDomainAcl']('example.com')).toBe(true);
    expect(ax['validateDomainAcl']('*.example.com')).toBe(true);
  });

  it('#validateDomainAcl - invalid domains', () => {
    expect(ax['validateDomainAcl']('**.example.com')).toBe(false);
    expect(ax['validateDomainAcl']('example.*.com')).toBe(false);
    expect(ax['validateDomainAcl']('*.api.*.com')).toBe(false);
    expect(ax['validateDomainAcl']('ex*ample.com')).toBe(false);
    expect(ax['validateDomainAcl']('*example.com')).toBe(false);
    expect(ax['validateDomainAcl']('example.*')).toBe(false);
  });
});
