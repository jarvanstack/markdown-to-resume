import { defaultSchema, type Options as MarkdownHtmlSchema } from 'rehype-sanitize';

export const GITHUB_ALIGNMENT_VALUES = ['left', 'center', 'right'] as const;

const defaultAttributes = defaultSchema.attributes ?? {};
const globalAttributes = defaultAttributes['*'] ?? [];
const alignmentAttribute: [string, ...string[]] = ['align', ...GITHUB_ALIGNMENT_VALUES];

export const githubMarkdownHtmlSchema: MarkdownHtmlSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultAttributes,
    '*': [
      ...globalAttributes.filter((definition) => (
        typeof definition === 'string' ? definition !== 'align' : definition[0] !== 'align'
      )),
      alignmentAttribute,
    ],
  },
};
