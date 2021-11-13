import AttrDuplication from './attr-duplication';
import AttrEqualSpaceAfter from './attr-equal-space-after';
import AttrEqualSpaceBefore from './attr-equal-space-before';
import AttrSpacing from './attr-spacing';
import AttrValueQuotes from './attr-value-quotes';
import CaseSensitiveAttrName from './case-sensitive-attr-name';
import CaseSensitiveTagName from './case-sensitive-tag-name';
import CharacterReference from './character-reference';
import ClassNaming from './class-naming';
import DeprecatedAttr from './deprecated-attr';
import DeprecatedElement from './deprecated-element';
import Doctype from './doctype';
import IdDuplication from './id-duplication';
import Indentation from './indentation';
import InvalidAttr from './invalid-attr';
import LandmarkRoles from './landmark-roles';
import PermittedContents from './permitted-contents';
import RequiredAttr from './required-attr';
import RequiredH1 from './required-h1';
import WaiAria from './wai-aria';

export default {
	'attr-duplication': AttrDuplication,
	'attr-equal-space-after': AttrEqualSpaceAfter,
	'attr-equal-space-before': AttrEqualSpaceBefore,
	'attr-spacing': AttrSpacing,
	'attr-value-quotes': AttrValueQuotes,
	'case-sensitive-attr-name': CaseSensitiveAttrName,
	'case-sensitive-tag-name': CaseSensitiveTagName,
	'character-reference': CharacterReference,
	'class-naming': ClassNaming,
	'deprecated-attr': DeprecatedAttr,
	'deprecated-element': DeprecatedElement,
	doctype: Doctype,
	'id-duplication': IdDuplication,
	indentation: Indentation,
	'invalid-attr': InvalidAttr,
	'landmark-roles': LandmarkRoles,
	'permitted-contents': PermittedContents,
	'required-attr': RequiredAttr,
	'required-h1': RequiredH1,
	'wai-aria': WaiAria,
};
