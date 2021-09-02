import { handle } from '@/components/Commons/CRUD';
import { UploadOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-form';
import { Button, Input, Modal, Space } from 'antd';
import { color, dataTool } from 'echarts';
import ReactECharts from 'echarts-for-react';
import { random } from 'lodash';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

export type ChartsFormProps = {
  showCharts: any;
  chartsData: any;
  onCancel: () => void;
  proteinName: string;
};
// const [options,setOptions] = useState<any>();
const ProteinFixedChartsForm: React.FC<ChartsFormProps> = (props) => {
  const [rangeNumber, setRangeNumber] = useState<any>(10);
  const [inputNumber, setInputNumber] = useState<any>(10);
  const [handleOption, setHandleOption] = useState({});
  const [disturbNumber, setDisturbNumber] = useState<any>(10);
  const [disturbInputNumber, setDisturbInputNumber] = useState<any>(10);
  const [intensityInputNumber,setIntensityInputNumber] = useState<any>(0.5);
  const [intenityNumber,setIntensityNumber] =useState<any>(0.5);
  const [keyNumber,setKeyNumber] =useState<any>("new date");
  const data = props?.chartsData;
   console.log("data",data)
  data?.nodes?.forEach(function (node: any) {
    (node.label = {
      show: node.symbolSize > 22,
    }),
    (node.tooltip = {
        formatter: 'peptide:{b} <br /> mz&rt:{c0}',
    }),
    (node.itemStyle = {
        
     }),
    data?.count?.forEach(function (link:any){
      if(link.name===node.id && link.number>=disturbNumber ){
       node.itemStyle={
         color:'#FFF'
       },
       (node.label = {
        show: true,
        formatter:link.number+'',
        position: 'inside',
        color:'#000',
        fontWeight :'bolder'
      })
      }
    })
  });
  data?.links?.forEach((link: any,index:number)=> {
    link.lineStyle = null;
    if (link.value < rangeNumber && link.target.indexOf("-")!==-1 && link.source.indexOf("-")!=-1) {    
      data?.intensity?.forEach((intensity: any,index2:number)=>{
        if(intensity.source==link.source && intensity.target==link.target){
          if(intensity.value<=intenityNumber){
            console.log('进入')
            link.lineStyle = {
              color: '#E20618',
              width:1.5
            };
          }
          else{
            link.lineStyle = {
            color: '#E2061857',
          };
          }       
        }
      }
      )
    }
  });
  const getOption = () => {
    const option = {
      title: {
        text: props.proteinName,
        subtext: 'Default layout',
        top: 'bottom',
        left: 'right',
      },
      tooltip: {

      },
      legend: [
        {
          selectedMode: 'multiple',
          data: data?.categories?.map(function (a: any) {
            return a.name;
          }),
        },
      ],
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          draggable:true,
          name: props?.proteinName,
          type: 'graph',
          layout: 'force',
          coordinateSystem: false,
          data: data?.nodes,
          edges: data?.links,
          categories: data?.categories,
          roam: true,
          legendHoverLink: true,
          force: {
            edgeLength: [100, 0],
            initLayout: 'circular',
            repulsion: 100,
          },
          label: {
            position: 'right',
            formatter: '{b}',
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 10,
            },
          },
        },
      ],
    }
    return option;
  };
  getOption()
  const option = getOption();
  console.log("option",option)

  return (
    <Modal
      visible={props.showCharts}
      width={1200}
      afterClose={()=>{
        setDisturbNumber(10)
        setRangeNumber(10)
        setIntensityNumber(0.5)
        setDisturbInputNumber(10)
        setInputNumber(10)
        setIntensityInputNumber(0.5)
        setHandleOption({})
        setKeyNumber(new Date())
      }}
      onCancel={props.onCancel}
        
    
    >
       <Space direction="horizontal">
        <Input
          style={{ height: '30px', width: '100px' }}
          defaultValue="10"
          onChange={(e) => setInputNumber(e.target.value)}
          addonBefore="rt范围"
        />
        {/* <Button
          style={{
            backgroundColor: '#0D93F7',
            color: 'white',
            marginBottom: '10px',
            height: '30px',
          }}
          onClick={() => {
            setRangeNumber(inputNumber);
            setHandleOption(option)
            setKeyNumber(new Date())
          }}
        >
          Rt范围抓取
        </Button> */}
   
        
        <Input
          style={{ height: '30px', width: '120px' }}
          defaultValue="10"
          onChange={(e) => setDisturbInputNumber(e.target.value)}
          addonBefore="干扰数目"
          
        ></Input>
        {/* <Button
          style={{
            backgroundColor: '#0D93F7',
            color: 'white',
            marginBottom: '10px',
            height: '30px',
          }}
          onClick={() => {
            setDisturbNumber(disturbInputNumber)
            setHandleOption(option)
            setKeyNumber(new Date())
          }}
        >
          干扰数目抓取
        </Button> */}
    
     
        <Input
          style={{ height: '30px', width: '120px' }}
          defaultValue="0.5"
          onChange={(e) => setIntensityInputNumber(e.target.value)}
          addonBefore="强度倍率"
        />
        {/* <Button
          style={{
            backgroundColor: '#0D93F7',
            color: 'white',
            marginBottom: '10px',
            height: '30px',
          }}
          onClick={() => {
            setIntensityNumber(intensityInputNumber)
            setHandleOption(option)
            setKeyNumber(new Date())
          }}
        >
          强度抓取
        </Button> */}
        <Button
          style={{
            backgroundColor: '#0D93F7',
            color: 'white',
            // marginBottom: '10px',
            height: '31px',
          }}
          onClick={() => {
            setIntensityNumber(intensityInputNumber)
            setHandleOption(option)
            setRangeNumber(inputNumber);
            setDisturbNumber(disturbInputNumber)
            setKeyNumber(new Date())
          }}
        >
          提交
        </Button>
        </Space>
      <ReactECharts option={handleOption} key={keyNumber} style={{ height: 600 }} 
      ></ReactECharts>
    </Modal>
  );
};

export default ProteinFixedChartsForm;
