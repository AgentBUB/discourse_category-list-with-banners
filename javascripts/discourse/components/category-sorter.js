import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class CategorySorter extends Component {
	constructor() {
		super(...arguments);
		scheduleOnce('afterRender', this, this.placeCategories);
	}

	@action
	placeCategories() {
		const categories = this.args.categories || [];

		const groupMapping = {
			core: 'bacta',
			togr: 'togr',
			'apps-appeals': ['app', 'appeal'],
			dev: 'dev',
			private: ['staff', 'forums-staff'],
			closed: ['closed', 'ban', 'blacklist'],
		};

		Object.keys(groupMapping).forEach((group) => {
			const container = document.querySelector(`.category-thing.${group}`);
			if (!container) return;

			container.innerHTML = '';

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

			const tbody = table.querySelector('tbody');

			const matches = Array.isArray(groupMapping[group])
				? (slug) => groupMapping[group].some((prefix) => slug.includes(prefix))
				: (slug) => slug.startsWith(groupMapping[group]);

			categories.forEach((category) => {
				if (matches(category.slug)) {
					const row = document.createElement('tr');
					row.innerHTML = `
						<td class="category">
						<a href="/c/${category.slug}/${category.id}">${category.name}</a>
						</td>
						<td class="topics">${category.topic_count}</td>
						<td class="latest">
						<a href="${category.topic_url}">View</a>
						</td>
					`;
					tbody.appendChild(row);
				}
			});

			// Only append table if we have rows
			if (tbody.children.length > 0) {
				container.appendChild(table);
			}
		});
	}
}
