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
    path: '/dict',
    name: 'dict',
    icon: 'smile',
    component: './Dict',
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
    icon: 'profile',
    path: '/project',
    component: './Project',
  },
  {
    name: 'library',
    icon: 'hdd',
    routes: [
      {
        path: '/library/list',
        name: 'table-list',
        icon: 'hdd',
        component: './Library',
      },
      {
        path: '/library/peptide:name',
        name: 'peptide-list',
        icon: 'smile',
        component: './Library/Peptide',
      },
      {
        component: './404',
      },
    ],
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
