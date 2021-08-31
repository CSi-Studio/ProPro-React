import { ModalForm } from '@ant-design/pro-form';
import { Switch } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';

export type ChartsFormProps = {
  showCharts: any;
  chartsData: any;
  rtData: any;
  onCancel: () => void;
  onSubmit: () => void;
};

const ChartsForm: React.FC<ChartsFormProps> = (props) => {
  const xAxisData = props.chartsData?.x;
  const yAxisData = props.chartsData?.y;
  const yAxisData2 = props.chartsData?.z;
  const rts = props.rtData;
  const [gaussFit, setGaussFit] = useState(false);
  const original = {
    toolbox: {
      left: '90%',
      feature: {
        saveAsImage: {},
      }
    },
    title: {
      text: 'RT时间: ' + rts,
    },
    dataZoom: {
      type: 'inside',
    },
    xAxis: {
      name: 'mz',
      type: 'category',
      data: xAxisData,
    },
    yAxis: {},
    series: {
      type: 'bar',
      data: yAxisData,
    }
  };
  const gaussion = {
    toolbox: {
      left: '90%',
      feature: {
        saveAsImage: {},
      }
    },
    title: {
      text: 'RT时间: ' + rts,
    },
    legend: {
      data: ['Original', 'Gaussion', 'GaussionLine']
    },
    dataZoom: {
      type: 'inside',
    },
    xAxis: {
      name: 'mz',
      type: 'category',
      data: xAxisData,
    },
    yAxis: {},
    series: [
      {
        name: 'Original',
        type: 'bar',
        data: yAxisData,
      },
      {
        name: 'Gaussion',
        type: 'bar',
        data: yAxisData2,
      },
      {
        name: 'GaussionLine',
        type: 'line',
        data: yAxisData2,
        smooth: 0.5,
        showSymbol: false,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      }
    ]
  };
  function onChange(checked: boolean) {
    setGaussFit(() => { return checked })
    console.log(`show gaussion fit: ${checked}`);
  }
  return (
    <ModalForm
      visible={props.showCharts}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          setGaussFit(false)
          props.onCancel()
        }
      }}
    // onFinish={
    //   props.onSubmit
    // }
    >
      <ReactECharts
        option={gaussFit ? gaussion : original}
        key={gaussFit ? 0 : 1}
        style={{ height: 400 }}
      />
      <Switch onChange={onChange} />
      <text>{'  显示高斯平滑'}</text>
    </ModalForm>
  );
};
export default ChartsForm;