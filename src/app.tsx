import type { RunTimeLayoutConfig } from 'umi';
import { Link } from 'umi';
import RightContent from '@/components/RightContent';

import Footer from '@/components/Footer';
import { BookOutlined } from '@ant-design/icons';

// const isDoc = REACT_APP_ENV === 'doc';
const isDoc = process.env.REACT_APP_ENV === 'doc';
export const layout: RunTimeLayoutConfig = () => {
  return {
    footerRender: () => <Footer />,
    rightRender: () => <RightContent />,
    links: isDoc
      ? [
          <Link to="/~docs">
            <BookOutlined />
            <span>文档</span>
          </Link>,
        ]
      : [],
  };
};
