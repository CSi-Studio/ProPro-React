export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'test',
    icon: 'table',
    path: '/test',
    component: './Test',
  },
  {
    name: 'project.table-list',
    icon: 'smile',
    path: '/project',
    component: './Project',
  },
  {
    name: 'library.table-list',
    icon: 'smile',
    path: '/library',
    component: './Library',
  },
  {
    name: 'list.card-list',
    icon: 'table',
    path: '/libraryCard',
    component: './Card',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
