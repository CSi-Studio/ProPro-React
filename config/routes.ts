export default [
  { path: '/', component: './Library' },
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
  // {
  //   path: '/dict',
  //   name: 'dict',
  //   icon: 'smile',
  //   component: './Dict',
  // },
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
        path: '/library/peptide',
        name: 'peptide-list',
        icon: 'smile',
        component: './Library/Peptide',
      },
      {
        path: '/library/protein',
        name: 'protein-list',
        icon: 'smile',
        component: './Library/Protein',
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
    component: './404',
  },
];
