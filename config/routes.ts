export default [
  // 主界面
  { path: '/', redirect: './Project/list' },
  // 项目
  {
    key: 'project',
    name: 'project',
    icon: 'profile',
    path: '/project/list',
    component: './Project',
  },
  // 实验列表界面
  {
    key: 'experiment',
    name: 'experiment',
    icon: 'profile',
    path: '/experiment/list',
    component: './Experiment',
    hideInMenu: true,
  },
  // IRT界面
  {
    key: 'irt',
    name: 'IRT',
    icon: 'profile',
    path: '/irt/list',
    component: './Irt',
    hideInMenu: true,
  },
  //BlockIndex界面
  {
    key: 'blockIndex',
    name: 'blockIndex',
    path: '/blockIndex',
    icon: 'smile',
    component: './BlockIndex',
    hideInMenu: true,
  },
  // 蛋白库界面
  {
    key: 'protein',
    name: 'protein',
    icon: 'profile',
    path: '/protein/list',
    component: './Protein',
  },
  // 标准库
  {
    key: 'library',
    name: 'library',
    path: '/library/list',
    icon: 'hdd',
    component: './Library',
  },
  //overview
  {
    key: 'overview',
    name: 'overview',
    path: '/overview',
    icon: 'smile',
    component: './Overview',
    hideInMenu: true,
  },
  //肽段
  {
    path: '/peptide/list',
    name: 'peptide',
    icon: 'smile',
    component: './Peptide',
    hideInMenu: true,
  },
  // 方法库界面
  {
    key: 'method',
    name: 'method',
    icon: 'profile',
    path: '/method/list',
    component: './Method',
  },
  // 字典界面
  {
    key: 'dict',
    name: 'dict',
    path: '/dict',
    icon: 'ReadOutlined',
    component: './Dict',
  },
  // 任务界面
  {
    key: 'task',
    name: 'task',
    path: '/task/list',
    icon: 'UnorderedListOutlined',
    component: './Task',
  },
  // 鉴定结果界面
  {
    key: 'identify',
    name: 'identify',
    path: '/identify/list',
    icon: 'UnorderedListOutlined',
    component: './Identify',
  },
  // 蛋白诊所界面
  {
    key: 'ProteinClinic',
    name: 'ProteinClinic',
    path: '/clinic',
    icon: 'UnorderedListOutlined',
    component: './Clinic',
    hideInMenu: true,
    layout: {
      hideMenu: true,
      hideNav: false,
      hideFooter: false,
    },
  },
  {
    component: './404',
  },
];
