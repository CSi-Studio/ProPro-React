import type { RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';

import Footer from '@/components/Footer';

export const layout: RunTimeLayoutConfig = () => {
  return {
    footerRender: () => <Footer />,
    rightRender: () => <RightContent />,
  };
};

