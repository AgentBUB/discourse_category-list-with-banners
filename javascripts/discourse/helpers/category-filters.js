import { registerUnbound } from "discourse-common/lib/helpers";

registerUnbound("filter-core", (categories) => {
  return categories?.filter((a) => a.slug?.match(/^bacta-/));
});

registerUnbound("filter-togr", (categories) => {
  return categories?.filter((a) => a.slug?.match(/^togr-/i));
});

registerUnbound("filter-apps-appeals", (categories) => {
  return categories?.filter((a) =>
    a.slug?.match(/^app-/) || a.slug?.match(/^appeal-/)
  );
});

registerUnbound("filter-dev", (categories) => {
  return categories?.filter((a) => a.slug?.match(/^dev-/));
});

registerUnbound("filter-private", (categories) => {
  return categories?.filter((a) =>
    a.slug?.match(/^forums-staff/) || a.slug?.match(/^staff-/)
  );
});

registerUnbound("filter-closed", (categories) => {
  return categories?.filter((a) =>
    a.slug?.match(/^closed-/i) ||
    a.slug?.match(/^scp-/) ||
    a.slug?.match(/^interstate-/)
  );
});
