import { mlRuleTest } from 'markuplint';

import rule from './';

const ruleOn = { rule: true };

describe('verify', () => {
	test('a', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<a><div></div><span></span><em></em></a>', ruleOn);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(rule, '<a><h1></h1></a>', ruleOn);
		expect(violations2).toStrictEqual([]);

		const { violations: violations3 } = await mlRuleTest(rule, '<div><a><option></option></a><div>', ruleOn);
		expect(violations3).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 6,
				raw: '<a>',
				message: 'The content of the "a" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations4 } = await mlRuleTest(rule, '<a><button></button></a>', ruleOn);
		expect(violations4).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<a>',
				message: 'The content of the "a" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations5 } = await mlRuleTest(
			rule,
			'<a><div><div><button></button></div></div></a>',
			ruleOn,
		);
		expect(violations5).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<a>',
				message: 'The content of the "a" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations6 } = await mlRuleTest(rule, '<span><a><div></div></a></span>', ruleOn);
		expect(violations6).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 7,
				raw: '<a>',
				message: 'The content of the "a" element is invalid according to the HTML specification',
			},
		]);
	});

	test('address', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<address><address></address></address>', ruleOn);
		expect(violations1).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<address>',
				message: 'The content of the "address" element is invalid according to the HTML specification',
			},
		]);
	});

	test('audio', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			'<div><audio src="path/to"><source></audio></div>',
			ruleOn,
		);
		expect(violations1).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 6,
				raw: '<audio src="path/to">',
				message: 'The content of the "audio" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			'<div><audio><source><div></div></audio></div>',
			ruleOn,
		);
		expect(violations2).toStrictEqual([]);

		const { violations: violations3 } = await mlRuleTest(rule, '<div><audio><source></audio></div>', ruleOn);
		expect(violations3).toStrictEqual([]);
	});

	test('dl', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<dl>
				<dt></dt>
				<dd></dd>
			</dl>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			`<dl>
				<dt></dt>
				<dd></dd>
				<div></div>
			</dl>`,
			ruleOn,
		);
		expect(violations2).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<dl>',
				message: 'The content of the "dl" element is invalid according to the HTML specification',
			},
			{
				severity: 'error',
				line: 4,
				col: 5,
				raw: '<div>',
				message: 'The content of the "div" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations3 } = await mlRuleTest(
			rule,
			`<dl>
				<dt></dt>
				<div></div>
				<dd></dd>
				<div></div>
			</dl>`,
			ruleOn,
		);
		expect(violations3).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<dl>',
				message: 'The content of the "dl" element is invalid according to the HTML specification',
			},
			{
				severity: 'error',
				line: 3,
				col: 5,
				raw: '<div>',
				message: 'The content of the "div" element is invalid according to the HTML specification',
			},
			{
				severity: 'error',
				line: 5,
				col: 5,
				raw: '<div>',
				message: 'The content of the "div" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations4 } = await mlRuleTest(
			rule,
			`<dl>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</dl>`,
			ruleOn,
		);
		expect(violations4.length).toStrictEqual(4);

		const { violations: violations5 } = await mlRuleTest(
			rule,
			`<dl>
				<div>
					<dt></dt>
					<dd></dd>
				</div>
			</dl>`,
			ruleOn,
		);
		expect(violations5).toStrictEqual([]);

		const { violations: violations6 } = await mlRuleTest(
			rule,
			`<div>
				<dt></dt>
				<dd></dd>
			</div>`,
			ruleOn,
		);
		expect(violations6).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<div>',
				message: 'The content of the "div" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations7 } = await mlRuleTest(
			rule,
			`<dl>
				<div>
					<span></span>
				</div>
			</dl>`,
			ruleOn,
		);
		expect(violations7).toStrictEqual([
			{
				severity: 'error',
				line: 2,
				col: 5,
				raw: '<div>',
				message: 'The content of the "div" element is invalid according to the HTML specification',
			},
		]);
	});

	test('table', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<table>
			<thead></thead>
			<tr>
				<td>cell</td>
			</tr>
		</table>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			`<table>
			<tbody>
				<tr>
					<td>cell</td>
				</tr>
			</tbody>
			<thead></thead>
		</table>`,
			ruleOn,
		);
		expect(violations2).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<table>',
				message: 'The content of the "table" element is invalid according to the HTML specification',
			},
		]);
	});

	test('ruby', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<ruby>
			<span>漢字</span>
			<rp>(</rp>
			<rt>かんじ</rt>
			<rp>)</rp>
		</ruby>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			`<ruby>
			<span>漢字</span>
			<rp>(</rp>
			<rt>かんじ</rt>
		</ruby>`,
			ruleOn,
		);
		expect(violations2).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<ruby>',
				message: 'The content of the "ruby" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations3 } = await mlRuleTest(
			rule,
			`<ruby>
				♥ <rt> Heart <rt lang=fr> Cœur </rt>
				☘ <rt> Shamrock <rt lang=fr> Trèfle </rt>
				✶ <rt> Star <rt lang=fr> Étoile </rt>
			</ruby>`,
			ruleOn,
		);
		expect(violations3).toStrictEqual([]);
	});

	test('ul', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<ul><div></div></ul>', ruleOn);
		expect(violations1).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<ul>',
				message: 'The content of the "ul" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations2 } = await mlRuleTest(rule, '<ul><li></li></ul>', ruleOn);
		expect(violations2).toStrictEqual([]);

		const { violations: violations3 } = await mlRuleTest(rule, '<ul><li></li><li></li><li></li></ul>', ruleOn);
		expect(violations3).toStrictEqual([]);
	});

	test('area', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<div><area></div>', ruleOn);
		expect(violations1).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 6,
				raw: '<area>',
				message: 'The "area" element must be descendant of the "map" element',
			},
		]);

		const { violations: violations2 } = await mlRuleTest(rule, '<map><area></map>', ruleOn);
		expect(violations2).toStrictEqual([]);

		const { violations: violations3 } = await mlRuleTest(rule, '<map><div><area></div></map>', ruleOn);
		expect(violations3).toStrictEqual([]);
	});

	test('meta', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<ol>
				<li>
					<span>Award winners</span>
					<meta content="3" />
				</li>
			</ol>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([
			{
				severity: 'error',
				line: 2,
				col: 5,
				raw: '<li>',
				message: 'The content of the "li" element is invalid according to the HTML specification',
			},
		]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			`<ol itemscope itemtype="https://schema.org/BreadcrumbList">
				<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
					<a itemprop="item" href="https://example.com/books">
						<span itemprop="name">Books</span>
					</a>
					<meta itemprop="position" content="1" />
				</li>
				<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
					<a itemscope itemtype="https://schema.org/WebPage" itemprop="item" itemid="https://example.com/books/sciencefiction" href="https://example.com/books/sciencefiction">
						<span itemprop="name">Science Fiction</span>
					</a>
					<meta itemprop="position" content="2" />
				</li>
				<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
					<span itemprop="name">Award winners</span>
					<meta itemprop="position" content="3" />
				</li>
			</ol>`,
			ruleOn,
		);
		expect(violations2).toStrictEqual([]);
	});

	test('hgroup', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<hgroup>
				<h1>Heading</h1>
			</hgroup>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			`<hgroup>
				<h1>Heading</h1>
				<h2>Sub</h2>
				<h2>Sub2</h2>
			</hgroup>`,
			ruleOn,
		);
		expect(violations2).toStrictEqual([]);

		const { violations: violations3 } = await mlRuleTest(
			rule,
			`<hgroup>
				<template></template>
				<h1>Heading</h1>
				<template></template>
				<h2>Sub</h2>
				<template></template>
				<h2>Sub2</h2>
				<template></template>
			</hgroup>`,
			ruleOn,
		);
		expect(violations3).toStrictEqual([]);

		const { violations: violations4 } = await mlRuleTest(
			rule,
			`<hgroup>
				<template></template>
			</hgroup>`,
			ruleOn,
		);
		expect(violations4).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<hgroup>',
				message: 'The content of the "hgroup" element is invalid according to the HTML specification',
			},
		]);
	});

	test('select', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<select>
			</select>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			`<select>
				<option>1</option>
			</select>`,
			ruleOn,
		);
		expect(violations2).toStrictEqual([]);

		const { violations: violations3 } = await mlRuleTest(
			rule,
			`<select>
				<option>1</option>
				<option>2</option>
				<option>3</option>
			</select>`,
			ruleOn,
		);
		expect(violations3).toStrictEqual([]);

		const { violations: violations4 } = await mlRuleTest(
			rule,
			`<select>
				<optgroup>
				</optgroup>
			</select>`,
			ruleOn,
		);
		expect(violations4).toStrictEqual([]);

		const { violations: violations5 } = await mlRuleTest(
			rule,
			`<select>
				<optgroup>
					<option>1</option>
				</optgroup>
			</select>`,
			ruleOn,
		);
		expect(violations5).toStrictEqual([]);

		const { violations: violations6 } = await mlRuleTest(
			rule,
			`<select>
				<optgroup>
					<option>1</option>
					<option>2</option>
					<option>3</option>
				</optgroup>
			</select>`,
			ruleOn,
		);
		expect(violations6).toStrictEqual([]);

		const { violations: violations7 } = await mlRuleTest(
			rule,
			`<select>
				<div>1</div>
			</select>`,
			ruleOn,
		);
		expect(violations7).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				message: 'The content of the "select" element is invalid according to the HTML specification',
				raw: '<select>',
			},
		]);

		const { violations: violations8 } = await mlRuleTest(
			rule,
			`<select>
				<optgroup>
					<div>1</div>
				</optgroup>
			</select>`,
			ruleOn,
		);
		expect(violations8).toStrictEqual([
			{
				severity: 'error',
				line: 2,
				col: 5,
				message: 'The content of the "optgroup" element is invalid according to the HTML specification',
				raw: '<optgroup>',
			},
		]);
	});

	test('script', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<script>
				alert("checking");
			</script>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);
	});

	test('style', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<style>
				#id {
					prop: value;
				}
			</style>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);
	});

	test('template', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			`<div>
				<a href="path/to">
					<template>
						<span>tmpl</span>
					</template>
				</a>
			</div>`,
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			`<div>
				<a href="path/to">
					<template>
						<button>tmpl</button>
					</template>
				</a>
			</div>`,
			ruleOn,
		);
		expect(violations2).toStrictEqual([
			{
				severity: 'error',
				line: 2,
				col: 5,
				raw: '<a href="path/to">',
				message: 'The content of the "a" element is invalid according to the HTML specification',
			},
			{
				severity: 'error',
				line: 3,
				col: 6,
				raw: '<template>',
				message: 'The content of the "template" element is invalid according to the HTML specification',
			},
		]);
	});

	test('Dep exp named capture in interleave', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<figure><img><figcaption></figure>', ruleOn);
		expect(violations1).toStrictEqual([]);
	});

	test('Custom element', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<div><x-item></x-item></div>', ruleOn);
		expect(violations1).toStrictEqual([]);
	});

	test('svg:a', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<svg><a><text>text</text></a></svg>', ruleOn);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(rule, '<svg><a><feBlend /></a></svg>', ruleOn);
		expect(violations2).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 6,
				message: 'The content of the "a" element is invalid according to the SVG specification',
				raw: '<a>',
			},
		]);
	});

	test('svg:foreignObject', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			'<svg><foreignObject><div>text</div></foreignObject></svg>',
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			'<svg><foreignObject><rect /></foreignObject></svg>',
			ruleOn,
		);
		expect(violations2).toStrictEqual([]);

		const { violations: violations3 } = await mlRuleTest(
			rule,
			'<svg><foreignObject><div><rect /></div></foreignObject></svg>',
			ruleOn,
		);
		expect(violations3).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 21,
				message: 'The content of the "div" element is invalid according to the HTML specification',
				raw: '<div>',
			},
		]);
	});

	test('Interactive Element in SVG', async () => {
		const { violations: violations1 } = await mlRuleTest(rule, '<svg><video></video></svg>', ruleOn);
		expect(violations1).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				message: 'The content of the "svg" element is invalid according to the SVG specification',
				raw: '<svg>',
			},
		]);

		const { violations: violations2 } = await mlRuleTest(rule, '<svg><html:video></html:video></svg>', ruleOn);
		expect(violations2).toStrictEqual([]);
	});

	test('with namespace', async () => {
		const { violations: violations1 } = await mlRuleTest(
			rule,
			'<html:div><svg:svg><svg:a><svg:text>text</svg:text></svg:a></svg:svg><html:div>',
			ruleOn,
		);
		expect(violations1).toStrictEqual([]);

		const { violations: violations2 } = await mlRuleTest(
			rule,
			'<html:div><svg:svg><svg:a><svg:feBlend /></svg:a></svg:svg><html:div>',
			ruleOn,
		);
		expect(violations2).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 20,
				message: 'The content of the "svg:a" element is invalid according to the SVG specification',
				raw: '<svg:a>',
			},
		]);
	});

	test('Custom element', async () => {
		const o = {
			rule: [
				{
					tag: 'x-container',
					contents: [
						{
							require: 'x-item',
							min: 2,
							max: 5,
						},
					],
				},
			],
		};

		const { violations: violations1 } = await mlRuleTest(rule, '<x-container></x-container>', o);
		const { violations: violations2 } = await mlRuleTest(rule, '<x-container><x-item>0</x-item></x-container>', o);
		const { violations: violations3 } = await mlRuleTest(
			rule,
			'<x-container><x-item>0</x-item><x-item>1</x-item><x-item>2</x-item></x-container>',
			o,
		);
		const { violations: violations4 } = await mlRuleTest(
			rule,
			`<x-container>
					<x-item>0</x-item>
					<x-item>1</x-item>
					<x-item>2</x-item>
					<x-item>3</x-item>
					<x-item>4</x-item>
				</x-container>`,
			o,
		);
		const { violations: violations5 } = await mlRuleTest(
			rule,
			`<x-container>
					<x-item>0</x-item>
					<x-item>1</x-item>
					<x-item>2</x-item>
					<x-item>3</x-item>
					<x-item>4</x-item>
					<x-item>5</x-item>
					<x-item>6</x-item>
				</x-container>`,
			o,
		);
		expect(violations1).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<x-container>',
				message: 'The content of the "x-container" element is invalid',
			},
		]);
		expect(violations2).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<x-container>',
				message: 'The content of the "x-container" element is invalid',
			},
		]);
		expect(violations3).toStrictEqual([]);
		expect(violations4).toStrictEqual([]);
		expect(violations5).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				raw: '<x-container>',
				message: 'The content of the "x-container" element is invalid',
			},
		]);
	});
});

describe('React', () => {
	const jsxRuleOn = {
		...ruleOn,
		parser: {
			'.*': '@markuplint/jsx-parser',
		},
	};

	test('case-sensitive', async () => {
		expect((await mlRuleTest(rule, '<A><button></button></A>', ruleOn)).violations).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				message: 'The content of the "A" element is invalid according to the HTML specification',
				raw: '<A>',
			},
		]);

		expect((await mlRuleTest(rule, '<a><button></button></a>', jsxRuleOn)).violations).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 1,
				message: 'The content of the "a" element is invalid according to the HTML specification',
				raw: '<a>',
			},
		]);

		expect((await mlRuleTest(rule, '<A><button></button></A>', jsxRuleOn)).violations).toStrictEqual([]);
	});

	test('Components', async () => {
		expect(
			(
				await mlRuleTest(
					rule,
					'<Html><Head /><body><p><Link href="path/to">SPA Link</Link></p></body></Html>',
					jsxRuleOn,
				)
			).violations,
		).toStrictEqual([]);
	});

	test('Expect to contain a text node', async () => {
		expect((await mlRuleTest(rule, '<head><title>{variable}</title></head>', ruleOn)).violations).toStrictEqual([]);
		expect((await mlRuleTest(rule, '<head><title>\n</title></head>', ruleOn)).violations).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 7,
				message: 'The content of the "title" element is invalid according to the HTML specification',
				raw: '<title>',
			},
		]);
		expect((await mlRuleTest(rule, '<head><title>\n</title></head>', jsxRuleOn)).violations).toStrictEqual([
			{
				severity: 'error',
				line: 1,
				col: 7,
				message: 'The content of the "title" element is invalid according to the HTML specification',
				raw: '<title>',
			},
		]);
		expect((await mlRuleTest(rule, '<head><title>_variable_</title></head>', jsxRuleOn)).violations).toStrictEqual(
			[],
		);
		expect((await mlRuleTest(rule, '<head><title>{variable}</title></head>', jsxRuleOn)).violations).toStrictEqual(
			[],
		);
	});

	test('Element has only custom components', async () => {
		expect((await mlRuleTest(rule, '<div><Component/></div>', jsxRuleOn)).violations).toStrictEqual([]);
		expect((await mlRuleTest(rule, '<ul><Component/></ul>', jsxRuleOn)).violations).toStrictEqual([]);
		expect((await mlRuleTest(rule, '<svg><Component/></svg>', jsxRuleOn)).violations).toStrictEqual([]);
	});
});

describe('Vue', () => {
	const vueRuleOn = {
		...ruleOn,
		parser: {
			'.*': '@markuplint/vue-parser',
		},
	};

	test('Element has only custom components', async () => {
		expect(
			(await mlRuleTest(rule, '<template><div><x-component/></div></template>', vueRuleOn)).violations,
		).toStrictEqual([]);
		expect(
			(await mlRuleTest(rule, '<template><ul><x-component/></ul></template>', vueRuleOn)).violations,
		).toStrictEqual([]);
		expect(
			(await mlRuleTest(rule, '<template><svg><x-component/></svg></template>', vueRuleOn)).violations,
		).toStrictEqual([]);
	});
});

describe('EJS', () => {
	const ejsRuleOn = {
		...ruleOn,
		parser: {
			'.*': '@markuplint/ejs-parser',
		},
	};

	test('PSBlock', async () => {
		expect(
			(
				await mlRuleTest(
					rule,
					`<!DOCTYPE html>
<html lang="en">
	<head>
		<%- include('path/to') _%>
	</head>
	<body>
		<ul><%- include('path/to') _%></ul>
		<ul><li>item</li></ul>
		<ul><span>item</span></ul>
	</body>
</html>
`,
					ejsRuleOn,
				)
			).violations,
		).toStrictEqual([
			{
				severity: 'error',
				line: 9,
				col: 3,
				message: 'The content of the "ul" element is invalid according to the HTML specification',
				raw: '<ul>',
			},
		]);
	});

	test('PSBlock', async () => {
		expect((await mlRuleTest(rule, '<title><%- "title" _%></title>', ejsRuleOn)).violations).toStrictEqual([]);
	});
});

describe('Issues', () => {
	test('#396', async () => {
		expect(
			(
				await mlRuleTest(
					rule,
					`
					<table>
						<tbody>
						<tr>
							<td></td>
						</tr>
						</tbody>
						<tbody>
						<tr>
							<td></td>
						</tr>
						</tbody>
					</table>`,
					ruleOn,
				)
			).violations,
		).toStrictEqual([]);
	});

	test('#398', async () => {
		expect(
			(
				await mlRuleTest(
					rule,
					`<table>
						<colgroup></colgroup><!-- ← error -->
						<colgroup><col /></colgroup><!-- ← no errors -->
						<colgroup span="1"></colgroup><!-- ← no errors -->
						<tbody>
							<tr>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>`,
					ruleOn,
				)
			).violations,
		).toStrictEqual([]);
	});
});
