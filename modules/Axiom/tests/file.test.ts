import { FileNotFoundError, loadYamlFile } from "../file";

describe('loadYamlFile', () => {
  it('should return true for files that exist', () => {
    expect(loadYamlFile('./modules/Axiom/sample_config.yaml')).toStrictEqual({
      rules: [
        { match: 'evil.github.com', action: 'deny' },
        { match: '*.github.com', action: 'allow' },
        { match: '2001:db8::/32', action: 'deny' },
        { match: '1.0.0.0/8', action: 'deny' },
        { match: '*', action: 'allow' }
      ]
    });
  });

  it('should throw an error for files that do not exist', () => {
    const fileName = './doesNotExist.yaml'
    expect(() => loadYamlFile(fileName)).toThrow(new FileNotFoundError(fileName));
  });
});
