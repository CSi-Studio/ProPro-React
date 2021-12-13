import { ModalForm } from '@ant-design/pro-form';
import { Switch } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { spectrumGauss } from '../service';
import { FormattedMessage } from 'umi';

export type ChartsFormProps = {
  showCharts: boolean;
  blockIndexId: any;
  rtData: any;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
};

const ChartsForm: React.FC<ChartsFormProps> = (props) => {
  const [xAxisData, setX] = useState<any>();
  const [yAxisData, setY] = useState<any>();
  const [yAxisData2, setY2] = useState<any>();
  const [gaussFit, setGaussFit] = useState(false);
  const rts = props.rtData;

  useEffect(() => {
    if (props.blockIndexId) {
      const getData = async () => {
        try {
          const msg = await spectrumGauss({
            blockIndexId: props.blockIndexId,
            rt: props.rtData,
            pointNum: 5,
          });
          setX(() => {
            return msg.data.x.map((item: any) => {
              return item.toFixed(4);
            });
          });
          setY(() => {
            return msg.data.y;
          });
          setY2(() => {
            return msg.data.z;
          });
        } catch (err) {
          return false;
        }
      };
      getData();
    }
  }, [props]);
  const original = {
    toolbox: {
      left: '90%',
      feature: {
        saveAsImage: {},
      },
    },
    title: {
      text: `RT: ${rts}`,
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
    },
  };
  const gaussion = {
    toolbox: {
      left: '90%',
      feature: {
        saveAsImage: {},
      },
    },
    title: {
      text: `${(<FormattedMessage id="component.rtTime" />)}: ${rts}`,
    },
    legend: {
      data: ['Original', 'Gaussion', 'GaussionLine'],
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
          type: 'solid',
        },
      },
    ],
  };

  function onChange(checked: boolean) {
    setGaussFit(() => {
      return checked;
    });
  }

  useMemo(() => {
    setOption();
  }, [gaussFit]);

  function setOption() {
    return gaussFit ? gaussion : original;
  }
  return (
    <ModalForm
      visible={props.showCharts}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          setGaussFit(false);
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <ReactECharts option={setOption()} key={gaussFit ? 0 : 1} style={{ height: 400 }} />
      <Switch onChange={onChange} />
      &nbsp;&nbsp;
      <FormattedMessage id="component.gaussSmooth" />
    </ModalForm>
  );
};
export default ChartsForm;
