import { ModalForm } from '@ant-design/pro-form';
import { dataTool } from 'echarts';
import ReactECharts from 'echarts-for-react';

export type ChartsFormProps = {
  showCharts: any;
  chartsData: any;
  onCancel: () => void;
//   rtData: any;
//   onSubmit: () => void;
  proteinName:string;
};

const ProteinFixedChartsForm: React.FC<ChartsFormProps> = (props) => {

   const data = props?.chartsData

   data?.nodes?.forEach(function (node:any) {
    node.label = {
        show:node.symbolSize > 10
    };
   });
  const  option = {
    title: {
        text:props.proteinName,
        subtext: 'Default layout',
        top: 'bottom',
        left: 'right'
    },
    tooltip: {},
    // legend: [{
    //     selectedMode: 'single',
    //     data: data?.categories?.map(function (a:any) {
    //         return a.name;
    //     })
    // }],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            name: props?.proteinName,
            type: 'graph',
            layout: 'force',
            coordinateSystem:false,
            data:data?.nodes,
            // links: data?.links,
            edges:data?.links,
            categories:data?.categories,
            roam: true,
            draggable: true,
            // force: {
            //     edgeLength: 10,
            //     repulsion: 10,
            //     gravity: 0.2
            // },
            label: {
                position: 'right',
                formatter: '{b}'
            },
            lineStyle: {
                color: 'source',
                curveness: 0.3
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                    width: 10
                }
            }
        }
    ]
};
  return (
    <ModalForm
      visible={props.showCharts}
      width={1000}
      
      modalProps={{
        maskClosable: false,
        onCancel:props.onCancel
      }}
     
    >
      <ReactECharts option={option} style={{height:1000}}/>
    </ModalForm>
  );
};

export default ProteinFixedChartsForm;
