import { PageContainer } from '@ant-design/pro-layout';
import { option } from './service';
import React from 'react';
import './index.less';
import ReactECharts from 'echarts-for-react';


const TableList: React.FC = () => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();


  return (
    <PageContainer>
      <ReactECharts option={option} style={{width:1200, height: 800 }} />
    </PageContainer>
  );
};

export default TableList;
