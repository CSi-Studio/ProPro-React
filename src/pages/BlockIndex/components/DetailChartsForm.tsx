import { ModalForm } from "@ant-design/pro-form";
import { Spin } from "antd";
import ReactECharts from 'echarts-for-react';



  export type ChartsFormProps = {
    showCharts:any;
    chartsData:any;
    onCancel: Record<string, () => void>;
    rtData:any;
    onSubmit: Record<string, () => void>;
  };
  


  const ChartsForm: React.FC<ChartsFormProps> = (props) => {
    const xAxisData = props.chartsData?.x
    const yAxisData = props.chartsData?.y
    const rts = props.rtData
    const option = {
      toolbox: {
        left:"middle",
        show: true,
        feature: {
            saveAsImage: {}
        }
    },
      legend: {},
      tooltip: {},
      dataset: {
        source: [],
      },
  
      title: {
        text:"RT时间:"+ rts,
        
      },
      dataZoom:{
        type:"inside"
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          data: yAxisData,
        },
      ],
    };
    return (
      <ModalForm visible={props.showCharts} modalProps={props.onCancel} onFinish={props.onSubmit}  >
        
        <ReactECharts option={option} style={{ height: 400 }} />
    
  
      </ModalForm>
    );
  };

  export default ChartsForm;