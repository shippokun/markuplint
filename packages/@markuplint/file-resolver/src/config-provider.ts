import type { MLFile } from './ml-file';
import type { ConfigSet, Nullable } from './types';
import type { Config } from '@markuplint/ml-config';

import path from 'path';

import { mergeConfig } from '@markuplint/ml-config';
import { configs } from '@markuplint/ml-core';

import { load as loadConfig, search } from './cosmiconfig';
import { resolvePlugins } from './resolve-plugins';
import { fileExists, nonNullableFilter, uuid } from './utils';

const KEY_SEPARATOR = '__ML_CONFIG_MERGE__';

export class ConfigProvider {
	#store = new Map<string, Config>();
	#cache = new Map<string, ConfigSet>();
	#held = new Set<string>();
	#recursiveLoadKeyAndDepth = new Map<string, number>();
	#watch: boolean;

	constructor(watch: boolean) {
		this.#watch = true;
	}

	set(config: Config, key?: string) {
		key = key || uuid();
		this.#store.set(key, config);
		return key;
	}

	async search(targetFile: MLFile) {
		if (!(await targetFile.dirExists())) {
			return null;
		}
		const res = await search<Config>(targetFile.path, this.#watch);
		if (!res) {
			return null;
		}
		const { filePath, config } = res;
		const pathResolvedConfig = this._pathResolve(config, filePath);
		this.#store.set(filePath, pathResolvedConfig);
		return filePath;
	}

	async resolve(names: Nullable<string>[], remerge = false): Promise<ConfigSet> {
		const keys = names.filter(nonNullableFilter);
		const key = keys.join(KEY_SEPARATOR);
		const currentConfig = this.#cache.get(key);
		if (!remerge && currentConfig) {
			return currentConfig;
		}
		let configSet = await this._mergeConfigs(keys);

		const plugins = await resolvePlugins(configSet.config.plugins);

		if (this.#held.size) {
			const extendHelds = Array.from(this.#held.values());
			extendHelds.forEach(held => {
				const [, prefix, namespace, name] = held.match(/^([a-z]+:)([^/]+)(?:\/(.+))?$/) || [];

				switch (prefix) {
					case 'plugin:': {
						const plugin = plugins.find(plugin => plugin.name === namespace);
						const config = plugin?.configs?.[name];
						if (config) {
							this.set(config, held);
						}
						break;
					}
					case 'markuplint:': {
						const config = configs[namespace];
						if (config) {
							this.set(config, held);
						}
						break;
					}
				}
			});

			configSet = await this._mergeConfigs([...keys, ...extendHelds]);

			this.#held.clear();
		}

		const result = {
			...configSet,
			plugins,
		};

		this.#cache.set(key, result);
		return result;
	}

	private async _mergeConfigs(keys: string[]) {
		const resolvedKeys = new Set<string>();
		const errs: Error[] = [];
		for (const key of keys) {
			this.#recursiveLoadKeyAndDepth.clear();
			const keySet = await this._recursiveLoad(key);
			for (const k of keySet.stack) {
				resolvedKeys.add(k);
			}
			if (keySet.errs) {
				errs.push(...keySet.errs);
			}
		}
		const configs = Array.from(resolvedKeys)
			.map(name => this.#store.get(name))
			.filter(nonNullableFilter);
		let resultConfig: Config = {};
		for (const config of configs) {
			resultConfig = mergeConfig(resultConfig, config);
		}
		return {
			config: resultConfig,
			files: resolvedKeys,
			errs,
		};
	}

	private async _recursiveLoad(
		key: string,
		depth = 1,
	): Promise<{ stack: Set<string>; errs: CircularReferenceError[] | null }> {
		const stack = new Set<string>();
		const errs: CircularReferenceError[] = [];

		const ancestorDepth = this.#recursiveLoadKeyAndDepth.get(key);
		if (ancestorDepth != null && ancestorDepth < depth) {
			return {
				stack,
				errs: [new CircularReferenceError(`Circular reference detected: ${key}`)],
			};
		}

		this.#recursiveLoadKeyAndDepth.set(key, depth);

		let config = this.#store.get(key) || null;
		if (!config) {
			config = await this._load(key);
		}

		if (!config) {
			return { stack, errs: null };
		}

		const depKeys = config.extends ? (Array.isArray(config.extends) ? config.extends : [config.extends]) : null;
		if (depKeys) {
			for (const depKey of depKeys) {
				const keys = await this._recursiveLoad(depKey, depth + 1);
				for (const key of keys.stack) {
					stack.add(key);
				}
				if (keys.errs) {
					errs.push(...keys.errs);
				}
			}
		}

		stack.add(key);
		return { stack, errs };
	}

	private async _load(filePath: string) {
		const entity = this.#store.get(filePath);
		if (entity) {
			return entity;
		}

		if (isPrefixedName(filePath)) {
			this.#held.add(filePath);
			return null;
		}

		if (!moduleExists(filePath) && !path.isAbsolute(filePath)) {
			throw new TypeError(`${filePath} is not an absolute path`);
		}

		const config = await load(filePath, this.#watch);
		if (!config) {
			return null;
		}

		const pathResolvedConfig = this._pathResolve(config, filePath);

		this.#store.set(filePath, pathResolvedConfig);
		return pathResolvedConfig;
	}

	private _pathResolve(config: Config, filePath: string): Config {
		const dir = path.dirname(filePath);
		return {
			...config,
			extends: pathResolve(dir, config.extends),
			plugins: pathResolve(dir, config.plugins, ['name']),
			parser: pathResolve(dir, config.parser),
			specs: pathResolve(dir, config.specs),
			excludeFiles: pathResolve(dir, config.excludeFiles),
		};
	}
}

async function load(filePath: string, watch: boolean) {
	if (!fileExists(filePath) && moduleExists(filePath)) {
		const mod = await import(filePath);
		const config: Config | null = mod?.default || null;
		return config;
	}
	const res = await loadConfig<Config>(filePath, watch);
	if (!res) {
		return null;
	}
	return res.config;
}

function pathResolve<T extends string | (string | Record<string, unknown>)[] | Record<string, unknown> | undefined>(
	dir: string,
	filePath?: T,
	resolveProps?: string[],
): T {
	if (filePath == null) {
		// @ts-ignore
		return undefined;
	}
	if (typeof filePath === 'string') {
		// @ts-ignore
		return resolve(dir, filePath);
	}
	if (Array.isArray(filePath)) {
		// @ts-ignore
		return filePath.map(fp => pathResolve(dir, fp, resolveProps));
	}
	const res: Record<string, unknown> = {};
	for (const [key, fp] of Object.entries(filePath)) {
		if (typeof fp === 'string') {
			if (!resolveProps) {
				res[key] = resolve(dir, fp);
			} else if (resolveProps.includes(key)) {
				res[key] = resolve(dir, fp);
			} else {
				res[key] = fp;
			}
		} else {
			res[key] = fp;
		}
	}
	// @ts-ignore
	return res;
}

function resolve(dir: string, pathOrModName: string) {
	if (isPrefixedName(pathOrModName)) {
		return pathOrModName;
	}
	if (moduleExists(pathOrModName)) {
		return pathOrModName;
	}
	return path.resolve(dir, pathOrModName);
}

function moduleExists(name: string) {
	try {
		require.resolve(name);
	} catch (err) {
		if (
			// @ts-ignore
			'code' in err &&
			// @ts-ignore
			err.code === 'MODULE_NOT_FOUND'
		) {
			return false;
		}
		throw err;
	}

	return true;
}

function isPrefixedName(name: string) {
	return /^(?:markuplint|plugin):/.test(name);
}

class CircularReferenceError extends ReferenceError {
	name = 'CircularReferenceError';
}
