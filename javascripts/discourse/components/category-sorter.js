import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class CategorySorter extends Component {
	constructor() {
		super(...arguments);
		scheduleOnce('afterRender', this, this.sortAndInject);
	}

	@action
	sortAndInject() {
		const categories = this.args.categories || [];
		const originalRows = document.querySelectorAll(
			'div#ember22.ember-view table.category-list.with-topics tbody tr[data-category-id]'
		);

		const rowMap = new Map();
		originalRows.forEach((row) => {
			const id = parseInt(row.getAttribute('data-category-id'), 10);
			rowMap.set(id, row);
		});

		const groupMapping = {
			core: 'bacta',
			togr: 'togr',
			'apps-appeals': ['app', 'appeal'],
			dev: 'dev',
			private: ['staff', 'forums-staff'],
			closed: ['closed', 'ban', 'blacklist'],
		};

		const containers = {};

		// Build group tables first
		Object.keys(groupMapping).forEach((group) => {
			containers[group] = this.createTable(group);
		});

		// Default "other" group
		containers.other = this.createTable('other');

		// Group categories into matching tables
		categories.forEach((category) => {
			const slug = category.slug;
			const row = rowMap.get(category.id);
			if (!row) return;

			let matchedGroup = 'other';

			for (const [group, matchRule] of Object.entries(groupMapping)) {
				const matches = Array.isArray(matchRule)
					? matchRule.some((prefix) => slug.includes(prefix))
					: slug.startsWith(matchRule);

				if (matches) {
					matchedGroup = group;
					break;
				}
			}

			containers[matchedGroup].tbody.appendChild(row);
		});

		// Append built tables to their divs
		for (const [group, { container, table }] of Object.entries(containers)) {
			if (table.querySelector('tbody').children.length > 0) {
				container.appendChild(table);
			}
		}

		// Clean up original category list
		const emberRoot = document.querySelector('div#ember22.ember-view');
		if (emberRoot) {
			emberRoot.remove();
		}
	}

	createTable(groupKey) {
		const container = document.querySelector(`.category-thing.${groupKey}`);
		if (!container) {
			console.warn(`No container div found for group: ${groupKey}`);
		}

		const table = document.createElement('table');
		table.className = 'category-list with-topics';
		table.innerHTML = `
		<thead>
			<tr>
			<th class="category">
				<span role="heading" aria-level="2" id="categories-only-category">
				Category
				</span>
			</th>
			<th class="topics">Topics</th>
			<th class="latest">Latest</th>
			</tr>
		</thead>
		<tbody aria-labelledby="categories-only-category"></tbody>
		`;

		return {
			table,
			tbody: table.querySelector('tbody'),
			container: container || this.createFallbackDiv(groupKey),
		};
	}

	createFallbackDiv(groupKey) {
		const fallback = document.createElement('div');
		fallback.className = `category-thing ${groupKey}`;
		document.body.appendChild(fallback);
		return fallback;
	}
}
