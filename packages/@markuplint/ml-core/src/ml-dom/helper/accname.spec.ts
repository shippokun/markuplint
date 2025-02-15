import type { MLDOMElement } from '../tokens';

import { parse } from '@markuplint/html-parser';

import { Document } from '../';
import { convertRuleset } from '../../';
import { dummySchemas } from '../../test';

import { getAccname } from './accname';
import { createNode } from './create-node';

function c(sourceCode: string) {
	const ast = parse(sourceCode);
	const astNode = ast.nodeList[0];
	const ruleset = convertRuleset({});
	const document = new Document(ast, ruleset, dummySchemas());
	const node = createNode(astNode, document);
	if (node.type === 'Element') {
		return node;
	}
	throw new Error();
}

test('Get accessible name', () => {
	expect(getAccname(c('<button>label</button>'))).toBe('label');
	expect(getAccname(c('<div>text</div>'))).toBe('');
	expect(getAccname(c('<div aria-label="label">text</div>'))).toBe('label');
	expect(getAccname(c('<span aria-label="label">text</span>'))).toBe('label');
	expect(getAccname(c('<img alt="alterative-text" />'))).toBe('alterative-text');
	expect(getAccname(c('<img title="title" />'))).toBe('title');
	expect(
		getAccname(c('<div><label for="a">label</label><input id="a" /></div>').children[1] as MLDOMElement<any, any>),
	).toBe('label');
});

test('Invisible element', () => {
	expect(getAccname(c('<button>label</button>'))).toBe('label');
	expect(getAccname(c('<button aria-disabled="true">label</button>'))).toBe('label');
	expect(getAccname(c('<button aria-hidden="true">label</button>'))).toBe('');
	expect(getAccname(c('<button hidden>label</button>'))).toBe('');
	expect(getAccname(c('<button style="display: none">label</button>'))).toBe('label'); // Unsupport the style attribute yet.
});

/**
 * @see https://www.w3.org/TR/accname-1.1/#ex-1-example-1-element1-id-el1-aria-labelledby-el3-element2-id-el2-aria-labelledby-el1-element3-id-el3-hello-element3
 */
test('accname-1.1 Expample 1', () => {
	const complex = c(`<div>
<input id="el1" aria-labelledby="el3" />
<input id="el2" aria-labelledby="el1" />
<h1 id="el3"> hello </h1>
</div>`);
	expect(getAccname(complex.children[0] as MLDOMElement<any, any>)).toBe('hello');
	expect(getAccname(complex.children[1] as MLDOMElement<any, any>)).toBe('');
	expect(getAccname(complex.children[2] as MLDOMElement<any, any>)).toBe('hello');
});

/**
 * https://www.w3.org/TR/accname-1.1/#ex-2-example-2-h1-files-h1-ul-li-a-id-file_row1-href-files-documentation-pdf-documentation-pdf-a-span-role-button-tabindex-0-id-del_row1-aria-label-delete-aria-labelledby-del_row1-file_row1-span-li-li-a-id-file_row2-href-files-holidayletter-pdf-holidayletter-pdf-a-span-role-button-tabindex-0-id-del_row2-aria-label-delete-aria-labelledby-del_row2-file_row2-span-li-ul
 */
test('accname-1.1 Expample 2', () => {
	const complex = c(`<ul>
	<li>
		<a id="file_row1" href="./files/Documentation.pdf">Documentation.pdf</a>
		<span role="button" tabindex="0" id="del_row1" aria-label="Delete" aria-labelledby="del_row1 file_row1"></span>
	</li>
	<li>
		<a id="file_row2" href="./files/HolidayLetter.pdf">HolidayLetter.pdf</a>
		<span role="button" tabindex="0" id="del_row2" aria-label="Delete" aria-labelledby="del_row2 file_row2"></span>
	</li>
</ul>`);
	const spans = complex.querySelectorAll('span');
	expect(getAccname(spans[0] as MLDOMElement<any, any>)).toBe('Delete Documentation.pdf');
	expect(getAccname(spans[1] as MLDOMElement<any, any>)).toBe('Delete HolidayLetter.pdf');
});

/**
 * https://www.w3.org/TR/accname-1.1/#ex-3-example-3-div-role-checkbox-aria-checked-false-flash-the-screen-span-role-textbox-aria-multiline-false-5-span-times-div
 */
test('accname-1.1 Expample 3', () => {
	const complex = c(
		'<div role="checkbox" aria-checked="false">Flash the screen <span role="textbox" aria-multiline="false"> 5 </span> times</div>',
	);
	expect(getAccname(complex)).toBe('Flash the screen 5 times');
});
