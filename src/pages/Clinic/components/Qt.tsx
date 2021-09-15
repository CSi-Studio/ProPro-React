import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';
import { getPeptideRatio } from '../service';
import { Spin } from 'antd';

// // 每行grid的个数
// const gridNumberInRow = 4;
// // 横坐标
// const xName = `LibTime`;
// // 纵坐标
// const yName = `RealTime/s`;
// // 单张高度（单位px）
// const gridHeight = 160;
// // 行间间隔高度（单位px）
// const gridPaddingHeight = 80;
// let Height = 0;

export type QtChartsProps = {
  values: any[];
};

const QtCharts: React.FC<QtChartsProps> = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const op = async () => {
      const result = await getPeptideRatio({ projectId: props.values });
      // const ecoliData: any[][] = [];
      const ecoliData = result.data.ecoli.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      const humanData = result.data.human.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      const yeastData = result.data.yeast.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      setLoading(false);
      const option = {
        xAxis: {
          scale: true,
        },
        yAxis: {
          scale: true,
        },
        series: [
          {
            type: 'scatter',
            name: 'ecoli',
            symbolSize: 5,
            color: 'tomato',
            data: ecoliData,
          },
          {
            type: 'scatter',
            name: 'human',
            symbolSize: 5,
            color: '#60B077',
            data: humanData,
          },
          {
            type: 'scatter',
            name: 'yeast',
            symbolSize: 5,
            color: '#1890ff',
            data: yeastData,
          },
        ],
      };
      // const irt = new IrtOption(
      //   result.data,
      //   gridNumberInRow,
      //   xName,
      //   yName,
      //   gridHeight,
      //   gridPaddingHeight,
      // );
      // const option = irt.getIrtOption();
      // Height = Math.ceil(result.data.length / gridNumberInRow) * (gridHeight + gridPaddingHeight);
      setHandleOption(option);
    };
    op();
  }, []);

  return (
    <ProCard>
      <Spin spinning={loading}>
        <ReactECharts
          option={handleOption}
          style={{ width: `100%`, height: '70vh' }}
          lazyUpdate={true}
        />
      </Spin>
    </ProCard>
  );
};

export default QtCharts;
