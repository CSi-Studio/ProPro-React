import { irtList } from './service';
import { IrtOption } from './charts';
import React, { useEffect, useState } from 'react';
// import './index.less';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';

// 每行grid的个数
const gridNumberInRow = 5;
const xName = `LibTime`;
const yName = `RealTime/s`;
const TableList: React.FC = (props) => {

  const [handleOption, setHandleOption] = useState({});
  useEffect(() => {
    const aa = async () => {
      const result = await irtList(props?.location?.query.expList)
      const irt = new IrtOption(result.data, gridNumberInRow, xName, yName);
      const option = irt.getIrtOption();
       console.log("option ",option);   
      setHandleOption(option);
    };
    aa();
  }, []);
  return (
    <ProCard>
      <ReactECharts
        // loadingOption={loadingOption}
        // showLoading={true}
        option={handleOption}
        style={{ width: '100%', height: `90vh`}}
      />
    </ProCard>
  );
};

export default TableList;
