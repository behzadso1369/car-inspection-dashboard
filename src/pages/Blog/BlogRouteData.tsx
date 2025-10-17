
import BlogCategories from "./BlogCategories/BlogCategories";
import BlogPost from "./BlogPost/BlogPost";
import CreateBlogPost from "./BlogPost/CreateBlogPost";
import BlogPostTag from "./BlogPostTag/BlogPostTag";
import BlogTag from "./BlogTag/BlogTag";

export const RoutesData = [
  {
    path: 'posts',
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
    path: 'blog-categories',
    component: BlogCategories,
    ID: 1,
    permission: ['MANAGER', 'SUPERVISE'],
  },
  {
    path: 'posts/create',
    component: CreateBlogPost,
    ID: 5,
    permission: ['MANAGER', 'SUPERVISE'],
  },

];
