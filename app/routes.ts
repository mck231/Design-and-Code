import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
    index("routes/home.tsx"),
    route("events", "routes/events.tsx"),
    route("events/:slug", "routes/events.$slug.tsx"),
    route("about", "routes/about.tsx"),
    route("duck-hall-of-fame", "routes/duck-hall-of-fame.tsx"),
];

// Conditionally add development-only routes
if (import.meta.env.DEV) {
  routes.push(
    route("blog", "routes/blog.tsx", [
      index("routes/blog.home.tsx"),
      route("create", "routes/blog.create.tsx"),
      route("admin/dashboard", "routes/admin.dashboard.tsx"),
      route(":slug", "routes/blog.$slug.tsx"),
    ]),
    route("login", "routes/auth.tsx"),
    route("admin", "routes/admin.tsx")
  );
}

export default routes satisfies RouteConfig;