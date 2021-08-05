import React from 'react';
import ReactECharts from 'echarts-for-react';

const Page: React.FC = () => {
  const option = {
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: [
          '0-20',
          '20-40',
          '40-60',
          '60-80',
          '80-100',
          '100-120',
          '120-140',
          '140-160',
          '160-180',
          '180-200',
        ],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        type: 'line',
        data: [6808, 7354, 7330, 6112, 4463, 2698, 817, 2, 0, 0],
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default Page;
