// Create test

import { axiom } from '../../../';

describe('Axiom', () => {
  it('#validateDomainAcl - Validating * domain ACL', () => {
    const ax = axiom([]);
    // const axObject = Object.getPrototypeOf(ax);
    expect(ax['validateDomainAcl']('*')).toBe(true);
  });
});
