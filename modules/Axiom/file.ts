import * as fs from 'fs';
import * as yaml from 'js-yaml';

type axiomYaml = {
  rules: { match: string; action: 'allow' | 'deny' }[];
};

export class FileNotFoundError extends Error {
  readonly filename: string;

  constructor(filename: string) {
    super(`File provided ${filename} does not exist`);
    this.filename = filename;
  }
}

export const loadYamlFile = (fileName: string): axiomYaml => {
  if (fs.existsSync(fileName)) {
    return yaml.load(fs.readFileSync(fileName, 'utf8')) as axiomYaml;
  } else {
    throw new FileNotFoundError(fileName);
  }
};
