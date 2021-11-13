import { mlRuleTest } from 'markuplint';

import rule from './';

describe('verify', () => {
	test('lower case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-lowercase></div>', { rule: true });
		expect(violations).toStrictEqual([]);
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<DIV data-lowercase></DIV>', { rule: true });
		expect(violations[0].severity).toBe('warning');
		expect(violations[0].message).toBe('Tag names of HTML elements should be lowercase');
		expect(violations[0].raw).toBe('DIV');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-UPPERCASE="value"></div>', {
			rule: {
				severity: 'error',
				value: 'upper',
			},
		});
		expect(violations[0].severity).toBe('error');
		expect(violations[0].message).toBe('Tag names of HTML elements must be uppercase');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<DIV data-uppercase="value"></DIV>', {
			rule: {
				severity: 'error',
				value: 'upper',
			},
		});
		expect(violations.length).toBe(0);
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<DIV DATA-UPPERCASE="value"></div>', {
			rule: {
				severity: 'error',
				value: 'upper',
			},
		});
		expect(violations.length).toBe(1);
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div DATA-UPPERCASE="value"></DIV>', {
			rule: {
				severity: 'error',
				value: 'upper',
			},
		});
		expect(violations.length).toBe(1);
	});

	test('svg', async () => {
		const { violations } = await mlRuleTest(rule, '<svg viewBox="0 0 100 100"><textPath></textPath></svg>', {
			rule: true,
		});
		expect(violations.length).toBe(0);
	});

	test('custom elements', async () => {
		const { violations } = await mlRuleTest(rule, '<xxx-hoge>lorem</xxx-hoge>', { rule: true });
		expect(violations.length).toBe(0);
	});

	test('custom elements', async () => {
		const { violations } = await mlRuleTest(rule, '<XXX-hoge>lorem</XXX-hoge>', { rule: true });
		expect(violations.length).toBe(0);
	});
});

describe('fix', () => {
	test('upper case', async () => {
		const { fixedCode } = await mlRuleTest(rule, '<DIV data-lowercase></DIV>', { rule: true }, true);
		expect(fixedCode).toBe('<div data-lowercase></div>');
	});
});
