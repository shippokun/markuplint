import { mlRuleTest } from 'markuplint';

import rule from './';

test('character-reference', async () => {
	const { violations } = await mlRuleTest(rule, '<div id="a"> > < & " \' &amp;</div>', { rule: true });
	expect(violations.length).toBe(4);
	expect(violations[0]).toStrictEqual({
		severity: 'error',
		message: 'Illegal characters must escape in character reference',
		line: 1,
		col: 14,
		raw: '>',
	});
	expect(violations[1].col).toBe(16);
	expect(violations[1].raw).toBe('<');
	expect(violations[2].col).toBe(18);
	expect(violations[2].raw).toBe('&');
	expect(violations[3].col).toBe(20);
	expect(violations[3].raw).toBe('"');
});

test('character-reference', async () => {
	const { violations } = await mlRuleTest(rule, '<img src="path/to?a=b&c=d">', { rule: true });
	expect(violations).toStrictEqual([
		{
			severity: 'error',
			message: 'Illegal characters must escape in character reference',
			line: 1,
			col: 22,
			raw: '&',
		},
	]);
});

test('character-reference', async () => {
	const { violations } = await mlRuleTest(rule, '<script>if (i < 0) console.log("<markuplint>");</script>', {
		rule: true,
	});
	expect(violations.length).toBe(0);
});

test('in Vue', async () => {
	const { violations } = await mlRuleTest(rule, '<template><div v-if="a < b"></div></template>', {
		rule: true,
		parser: {
			'.*': '@markuplint/vue-parser',
		},
	});
	expect(violations.length).toBe(0);
});

test('in EJS', async () => {
	const { violations } = await mlRuleTest(rule, '<title><%- "title" _%></title>', {
		rule: true,
		parser: {
			'.*': '@markuplint/ejs-parser',
		},
	});
	expect(violations.length).toBe(0);
});
