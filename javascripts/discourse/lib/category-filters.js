import { registerUnbound } from "discourse-common/lib/helpers";

export function registerCategoryFilters() {
  registerUnbound("filter-core", (categories) =>
    categories?.filter((a) => a.slug?.match(/^bacta-/))
  );

  registerUnbound("filter-togr", (categories) =>
    categories?.filter((a) => a.slug?.match(/^togr-/i))
  );

  registerUnbound("filter-apps-appeals", (categories) =>
    categories?.filter(
      (a) => a.slug?.match(/^app-/) || a.slug?.match(/^appeal-/)
    )
  );

  registerUnbound("filter-dev", (categories) =>
    categories?.filter((a) => a.slug?.match(/^dev-/))
  );

  registerUnbound("filter-private", (categories) =>
    categories?.filter(
      (a) => a.slug?.match(/^forums-staff/) || a.slug?.match(/^staff-/)
    )
  );

  registerUnbound("filter-closed", (categories) =>
    categories?.filter(
      (a) =>
        a.slug?.match(/^closed-/i) ||
        a.slug?.match(/^scp-/) ||
        a.slug?.match(/^interstate-/)
    )
  );
}
