import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class CategorySorter extends Component {
	constructor() {
		super(...arguments);
		console.log('CategorySorter loaded', this.args.categories);
		scheduleOnce('afterRender', this, this.placeCategories);
	}

	@action
	placeCategories() {
		const categories = this.args.categories || [];

		// Clear divs before inserting new content
		document
			.querySelectorAll('.category-thing')
			.forEach((div) => (div.innerHTML = ''));

		categories.forEach((category) => {
			const slug = category.slug;
			let targetClass = null;

			if (slug.startsWith('bacta')) {
				targetClass = 'core';
			} else if (slug.startsWith('togr')) {
				targetClass = 'togr';
			} else if (slug.startsWith('app') || slug.includes('appeal')) {
				targetClass = 'apps-appeals';
			} else if (slug.includes('dev') || slug.includes('developer')) {
				targetClass = 'dev';
			} else if (slug.startsWith('pri')) {
				targetClass = 'private';
			} else if (
				slug.startsWith('closed') ||
				slug.includes('blacklist') ||
				slug.includes('ban')
			) {
				targetClass = 'closed';
			}

			if (targetClass) {
				const container = document.querySelector(
					`.category-thing.${targetClass}`
				);
				if (container) {
					container.innerHTML += `
						<div class="custom-category">
						<a href="/c/${slug}/${category.id}">${category.name}</a>
						</div>
					`;
				}
			}
		});
	}
}
