import { irtList } from './service';
import { IrtOption } from './charts';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';

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
const IrtCharts: React.FC = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  useEffect(() => {
    const op = async () => {
      const result = await irtList(props?.location?.query.runList);

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
    <PageContainer
      header={{
        onBack: () => {
          window.history.back();
        },
        title: (
          <>
            {props?.location?.state?.runNum}
            <FormattedMessage id="table.irtNum" />
          </>
        ),
        ghost: true,
      }}
    >
      <ProCard>
        <ReactECharts
          option={handleOption}
          style={{ width: `100%`, height: Height }}
          lazyUpdate={true}
        />
      </ProCard>
    </PageContainer>
  );
};

export default IrtCharts;
