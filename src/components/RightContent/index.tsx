import { Space } from 'antd';
import React from 'react';
import { SelectLang } from 'umi';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  return (
    <Space>
      <SelectLang className={styles.action} />
    </Space>
  );
};

export default GlobalHeaderRight;
