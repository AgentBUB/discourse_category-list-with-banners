import { importModuleForTheme } from "discourse-common/lib/theme-functions";

export default {
  name: "load-category-filters",

  initialize() {
    importModuleForTheme("lib/category-filters").then((mod) => {
      mod.registerCategoryFilters();
    });
  },
};
