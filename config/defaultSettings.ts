import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'realDark',
  logo: 'https://gitee.com/command-s/images/raw/master/uPic/Component 1.png',
  // 拂晓蓝
  primaryColor: '#ffffff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'CSi ProPro',
  pwa: false,
  iconfontUrl: '',
  splitMenus: false,
};

export default Settings;
