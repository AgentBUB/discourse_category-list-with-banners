import Component from '@glimmer/component';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class CategorySorter extends Component {
	constructor() {
		super(...arguments);
		scheduleOnce('afterRender', this, this.insertCategories);
	}

	@action
	insertCategories() {
		const categories = this.args.categories || [];

		document.querySelectorAll('.category-thing').forEach((div) => {
			div.innerHTML = '';
		});

		categories.forEach((category) => {
			const slug = category.slug;
			console.log(slug);
			let targetClass = '';

			if (slug.startsWith('bacta')) {
				targetClass = 'core';
			} else if (slug.startsWith('togr')) {
				targetClass = 'togr';
			} else if (slug.startsWith('app')) {
				targetClass = 'apps-appeals';
			} else if (slug.startsWith('dev')) {
				targetClass = 'dev';
			} else if (slug.startsWith('staff')) {
				targetClass = 'private';
			} else if (slug.startsWith('closed')) {
				targetClass = 'closed';
			}

			if (targetClass) {
				const container = document.querySelector(
					`.category-thing.${targetClass}`
				);
				if (container) {
					container.innerHTML += `
                        <div class="custom-category-item">
                        <a href="/c/${slug}/${category.id}">${category.name}</a>
                        </div>
                    `;
				}
			}
		});
	}
}
