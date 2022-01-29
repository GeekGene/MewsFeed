import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    { path: "/", component: () => import("./pages/HomePage.vue") },
    { path: "/profile", component: () => import("./pages/MyUser.vue") }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;