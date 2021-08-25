import { irtList } from './service';
import { IrtOption } from './charts';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';
import { Button } from 'antd';
import { Link } from 'umi';

// 每行grid的个数
const gridNumberInRow = 4;
// 横坐标
const xName = `LibTime`;
// 纵坐标
const yName = `RealTime/s`;
// 单张高度（单位px）
const gridHeight = 160;
// 行间间隔高度（单位px）
const gridPaddingHeight = 80;
let Height = 0;
const TableList: React.FC = (props) => {

  const [handleOption, setHandleOption] = useState({});
  useEffect(() => {
    const op = async () => {
      const result = await irtList(props?.location?.query.expList)
      const irt = new IrtOption(result.data, gridNumberInRow, xName, yName, gridHeight, gridPaddingHeight);
      const option = irt.getIrtOption();
      // console.log("option ",option);   
      Height = Math.ceil(result.data.length / gridNumberInRow) * (gridHeight+gridPaddingHeight);
      setHandleOption(option);
    };
    op();
  }, []);
  return (
    <ProCard
      title={props?.location?.state?.expNum + '个实验的IRT结果'}
      extra={
        <Link
          to={{
            pathname: '/experiment/list',
            search: `?projectId=${props?.location?.state?.projectId}`,
          }}
        >
          <Button type="primary">返回实验列表</Button>
        </Link>
      }
    >
      <ReactECharts
        option={handleOption}
        style={{ width: `100%` , height: Height}}
        lazyUpdate={true}
      />
    </ProCard>
  );
};

export default TableList;
