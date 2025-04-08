import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("filter-core", (categories) =>
  categories.filter((a) => a.slug.match(/^bacta-/))
);

registerUnbound("filter-togr", (categories) =>
  categories.filter((a) => a.slug.match(/^togr-/i))
);

registerUnbound("filter-apps-appeals", (categories) =>
  categories.filter((a) => /^app-|^appeal-/.test(a.slug))
);

registerUnbound("filter-dev", (categories) =>
  categories.filter((a) => a.slug.match(/^dev-/))
);

registerUnbound("filter-private", (categories) =>
  categories.filter((a) => /^forums-staff|^staff-/.test(a.slug))
);

registerUnbound("filter-closed", (categories) =>
  categories.filter((a) => /^closed-|^scp-|^interstate-/.test(a.slug))
);
