import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CategorySorter extends Component {
	@action
	sortAndInject() {
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
				// Leave as string
			}

			groupMapping[group.trim()] = rule;
		});

		// Get original rows
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

		const emberRoot = document.querySelector('div#ember22.ember-view');
		if (emberRoot) {
			emberRoot.remove();
		}
	}
}
