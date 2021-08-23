import type { RunTimeLayoutConfig } from 'umi';
import Footer from '@/components/Footer';

export const layout: RunTimeLayoutConfig = ({}) => {
  return {
    footerRender: () => <Footer />,
  };
};
