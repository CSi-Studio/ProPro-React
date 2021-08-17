export default [
  // 主界面
  { path: '/', component: './Project' },
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
    hidden: true
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
  //肽段
  {
    path: '/peptide/list',
    name: 'peptide',
    icon: 'smile',
    component: './Peptide',
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
    icon: 'smile',
    component: './Dict',
  },
  // 404
  {
    component: './404',
  },
];
