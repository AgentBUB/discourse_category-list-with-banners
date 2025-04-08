import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CategorySorter extends Component {
	@service router;

	constructor() {
		super(...arguments);
		requestAnimationFrame(() => this.sortAndInject());

		this.router.on('routeDidChange', () => {
			if (this.router.currentRouteName === 'discovery.categories') {
				setTimeout(() => this.sortAndInject(), 50);
			}
		});
	}

	@action
	sortAndInject() {
		console.log('Running sortAndInject');

		const categories = this.args.categories || [];
		const mappingRaw = this.args.mapping || '';
		const mappingList =
			typeof mappingRaw === 'string' ? mappingRaw.split('|') : mappingRaw;

		const groupMapping = {};
		mappingList.forEach((entry) => {
			const [group, ruleRaw] = entry.split(';');
			if (!group || !ruleRaw) return;

			let rule = ruleRaw.trim();
			try {
				if (rule.startsWith('[') || rule.startsWith('{')) {
					rule = JSON.parse(rule);
				}
			} catch {
				// fallback to string
			}

			groupMapping[group.trim()] = rule;
		});

		const original = document.querySelector('div#ember22.ember-view');
		console.log('📦 original element:', original);
		if (!original) return console.warn('❌ Original category table not found');

		const originalRows = original.querySelectorAll(
			'tbody tr[data-category-id]'
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

			for (const [group, rule] of Object.entries(groupMapping)) {
				const rules = Array.isArray(rule) ? rule : [rule];
				if (rules.some((prefix) => slug.includes(prefix))) {
					matchedGroup = group;
					break;
				}
			}

			containers[matchedGroup].tbody.appendChild(row);
		});

		for (const { container, table } of Object.values(containers)) {
			if (table.querySelector('tbody').children.length > 0) {
				container.appendChild(table);
			}
		}

		original.remove();
	}

	createTable(groupKey) {
		const container = document.querySelector(`.category-thing.${groupKey}`);
		if (!container) {
			console.warn(`⚠️ No container found for group: ${groupKey}`);
		}

		const table = document.createElement('table');
		table.className = 'category-list with-topics';
		table.innerHTML = `
		<thead>
			<tr>
			<th class="category">
				<span role="heading" aria-level="2" id="categories-only-category-${groupKey}">
				Category
				</span>
			</th>
			<th class="topics">Topics</th>
			<th class="latest">Latest</th>
			</tr>
		</thead>
		<tbody aria-labelledby="categories-only-category-${groupKey}"></tbody>
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
