
import BlogCategories from "./BlogCategories/BlogCategories";
import BlogPost from "./BlogPost/BlogPost";
import BlogPostTag from "./BlogPostTag/BlogPostTag";
import BlogTag from "./BlogTag/BlogTag";

export const RoutesData = [
  {
    path: 'list',
    component: BlogPost,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'post-tag',
    component: BlogPostTag,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'tags',
    component: BlogTag,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'categories',
    component: BlogCategories,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'list',
    component: <BlogComment></BlogComment>,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  }

];
