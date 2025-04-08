import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class CategorySorter extends Component {
	@service siteSettings;

	constructor() {
		super(...arguments);
		scheduleOnce('afterRender', this, this.sortAndInject);
	}

	@action
	sortAndInject() {
		const categories = this.args.categories || [];

		// Load mapping from theme setting
		let groupMapping;
		try {
			groupMapping = JSON.parse(this.siteSettings.group_slug_mapping);
		} catch (e) {
			console.error('Invalid group_slug_mapping JSON:', e);
			groupMapping = {};
		}

		const originalRows = document.querySelectorAll(
			'div#ember22.ember-view table.category-list.with-topics tbody tr[data-category-id]'
		);

		const rowMap = new Map();
		originalRows.forEach((row) => {
			const id = parseInt(row.getAttribute('data-category-id'), 10);
			rowMap.set(id, row);
		});

		const containers = {};
		Object.keys(groupMapping).forEach((group) => {
			containers[group] = this.createTable(group);
		});
		containers.other = this.createTable('other');

		categories.forEach((category) => {
			const slug = category.slug;
			const row = rowMap.get(category.id);
			if (!row) return;

			let matchedGroup = 'other';

			for (const [group, matchRule] of Object.entries(groupMapping)) {
				const matchList = Array.isArray(matchRule) ? matchRule : [matchRule];
				if (matchList.some((prefix) => slug.includes(prefix))) {
					matchedGroup = group;
					break;
				}
			}

			containers[matchedGroup].tbody.appendChild(row);
		});

		for (const [group, { container, table }] of Object.entries(containers)) {
			if (table.querySelector('tbody').children.length > 0) {
				container.appendChild(table);
			}
		}

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
