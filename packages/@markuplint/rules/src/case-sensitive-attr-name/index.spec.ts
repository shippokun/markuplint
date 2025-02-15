import { mlRuleTest } from 'markuplint';

import rule from './';

describe('verify', () => {
	test('lower case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-lowercase></div>', { rule: true });
		expect(violations).toStrictEqual([]);
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-UPPERCASE="value"></div>', { rule: true });
		expect(violations[0].severity).toBe('warning');
		expect(violations[0].message).toBe('Attribute names of HTML elements should be lowercase');
		expect(violations[0].raw).toBe('data-UPPERCASE');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-UPPERCASE="value"></div>', {
			rule: {
				severity: 'error',
				value: 'upper',
				option: null,
			},
		});
		expect(violations[0].severity).toBe('error');
		expect(violations[0].message).toBe('Attribute names of HTML elements must be uppercase');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-uppercase="value"></div>', {
			rule: {
				severity: 'error',
				value: 'upper',
				option: null,
			},
		});
		expect(violations[0].severity).toBe('error');
		expect(violations[0].message).toBe('Attribute names of HTML elements must be uppercase');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div DATA-UPPERCASE="value"></div>', {
			rule: { severity: 'error', value: 'upper' },
		});
		expect(violations.length).toBe(0);
	});

	test('svg', async () => {
		const { violations } = await mlRuleTest(rule, '<svg viewBox="0 0 100 100"></svg>', { rule: true });
		expect(violations.length).toBe(0);
	});
});

describe('fix', () => {
	test('upper case', async () => {
		const { fixedCode } = await mlRuleTest(rule, '<DIV DATA-LOWERCASE></DIV>', { rule: true }, true);
		expect(fixedCode).toBe('<DIV data-lowercase></DIV>');
	});

	test('upper case', async () => {
		const { fixedCode } = await mlRuleTest(rule, '<DIV data-lowercase></DIV>', { rule: 'upper' }, true);
		expect(fixedCode).toBe('<DIV DATA-LOWERCASE></DIV>');
	});
});

describe('verify v1', () => {
	test('lower case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-lowercase></div>', { rule: true });
		expect(violations).toStrictEqual([]);
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-UPPERCASE="value"></div>', { rule: true });
		expect(violations[0].severity).toBe('warning');
		expect(violations[0].message).toBe('Attribute names of HTML elements should be lowercase');
		expect(violations[0].raw).toBe('data-UPPERCASE');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-UPPERCASE="value"></div>', {
			rule: {
				severity: 'error',
				value: 'no-lower',
				option: null,
			},
		});
		expect(violations[0].severity).toBe('error');
		expect(violations[0].message).toBe('Attribute names of HTML elements must be uppercase');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div data-uppercase="value"></div>', {
			rule: {
				severity: 'error',
				value: 'no-lower',
				option: null,
			},
		});
		expect(violations[0].severity).toBe('error');
		expect(violations[0].message).toBe('Attribute names of HTML elements must be uppercase');
	});

	test('upper case', async () => {
		const { violations } = await mlRuleTest(rule, '<div DATA-UPPERCASE="value"></div>', {
			rule: { severity: 'error', value: 'no-lower' },
		});
		expect(violations.length).toBe(0);
	});

	test('svg', async () => {
		const { violations } = await mlRuleTest(rule, '<svg viewBox="0 0 100 100"></svg>', { rule: true });
		expect(violations.length).toBe(0);
	});
});

describe('fix v1', () => {
	test('upper case', async () => {
		const { fixedCode } = await mlRuleTest(rule, '<DIV DATA-LOWERCASE></DIV>', { rule: true }, true);
		expect(fixedCode).toBe('<DIV data-lowercase></DIV>');
	});

	test('upper case', async () => {
		const { fixedCode } = await mlRuleTest(rule, '<DIV data-lowercase></DIV>', { rule: 'no-lower' }, true);
		expect(fixedCode).toBe('<DIV DATA-LOWERCASE></DIV>');
	});
});
