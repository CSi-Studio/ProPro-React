import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';
import { irtList } from '../../Irt/service';
import { IrtOption } from '../../Irt/charts';

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

export type IrtChartsProps = {
  values: any[];
};

const IrtCharts: React.FC<IrtChartsProps> = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  useEffect(() => {
    const op = async () => {
      const result = await irtList(props.values);
      const irt = new IrtOption(
        result.data,
        gridNumberInRow,
        xName,
        yName,
        gridHeight,
        gridPaddingHeight,
      );
      const option = irt.getIrtOption();
      Height = Math.ceil(result.data.length / gridNumberInRow) * (gridHeight + gridPaddingHeight);
      setHandleOption(option);
    };
    op();
  }, []);

  return (
    <ProCard
    // title: <>{props.values.length}个实验的IRT结果</>,
    >
      <ReactECharts
        option={handleOption}
        style={{ width: `100%`, height: Height }}
        lazyUpdate={true}
      />
    </ProCard>
  );
};

export default IrtCharts;
