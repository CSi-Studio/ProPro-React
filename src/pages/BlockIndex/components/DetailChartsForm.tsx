import { ModalForm } from "@ant-design/pro-form";
import ReactECharts from 'echarts-for-react';



  export type ChartsFormProps = {
    showCharts:any;
    chartsData:any;
    onCancel: Record<string, () => void>;
    rtData:any;
  };
  


  const ChartsForm: React.FC<ChartsFormProps> = (props) => {
    const xAxisData = props.chartsData?.x
    const yAxisData = props.chartsData?.y
    const rtData = props.rtData
    const option = {

      toolbox: {
        left:"right",
        show: true,
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
      legend: {},
      tooltip: {},
      dataset: {
        source: [],
      },
  
      title: {
        text: 'Rt时间:'+{rtData},
        
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
      <ModalForm visible={props.showCharts} modalProps={props.onCancel}  >
        <ReactECharts option={option} style={{ height: 400 }} />
 
   
  
      </ModalForm>
    );
  };

  export default ChartsForm;