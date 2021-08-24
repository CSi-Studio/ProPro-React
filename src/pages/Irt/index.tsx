import { irtList } from './service';
import { IrtOption } from './charts';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import ProCard from '@ant-design/pro-card';
import { Button, Tag, Tooltip } from 'antd';
import { Link } from 'umi';

// 每行grid的个数
const gridNumberInRow = 4;
const xName = `LibTime`;
const yName = `RealTime/s`;
const TableList: React.FC = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  useEffect(() => {
    const aa = async () => {
      const result = await irtList(props?.location?.query.expList);
      const irt = new IrtOption(result.data, gridNumberInRow, xName, yName);
      const option = irt.getIrtOption();
      console.log('option ', option);
      setHandleOption(option);
    };
    aa();
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
        // loadingOption={loadingOption}
        // showLoading={true}
        option={handleOption}
        style={{ width: '100%', height: `90vh` }}
      />
    </ProCard>
  );
};

export default TableList;
