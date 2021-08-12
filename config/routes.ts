export default [
  // 登陆界面
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
  // 字典界面
  // {
  //   path: '/dict',
  //   name: 'dict',
  //   icon: 'smile',
  //   component: './Dict',
  // },
  // 项目界面
  {
    name: 'project.table-list',
    icon: 'profile',
    path: '/project',
    component: './Project',
  },
  // 标准库界面
  {
    name: 'library',
    path: '/library',
    component: './Library',
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

  // 方法库界面
  {
    name: 'method',
    icon: 'profile',
    path: '/method',
    component: './Methods',
  },
  // 主界面
  { path: '/', component: './Library' },
  // 404
  {
    component: './404',
  },
];
