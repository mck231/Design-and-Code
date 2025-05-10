import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("events", "routes/events.tsx"),
      route("events/:slug", "routes/events.$slug.tsx"), // New dynamic route for event details
    route("blog", "routes/blog.tsx"),
    route("about", "routes/about.tsx")
    
] satisfies RouteConfig;
