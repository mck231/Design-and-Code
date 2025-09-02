import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
    index("routes/home.tsx"),
    route("events", "routes/events.tsx"),
    route("events/:slug", "routes/events.$slug.tsx"),
    route("blog", "routes/blog.tsx"),
    route("about", "routes/about.tsx"),
    route("duck-hall-of-fame", "routes/duck-hall-of-fame.tsx")
];

// Conditionally add the admin route ONLY in development mode
if (import.meta.env.DEV) {
  routes.push(route("admin", "routes/admin.tsx"));
}

export default routes satisfies RouteConfig;