import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Slider, Space } from 'antd';
import type { TableListDetail } from '../data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { blockIndexDetail, spectrumCharts } from '../service';
import { parseInt } from 'lodash';
import ChartsForm from './DetailChartsForm';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
};

const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const [sliderValue,setValue] = useState<any>();

  const [maxRT,setMaxRT] = useState<any>();
  const [minRT,setMintRT] = useState<any>();
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [smallRange, setSmallRange] = useState<boolean>(true);
  const [chartsData,setChartsData] = useState<any>();
  const [rtData,setRtData] = useState<any>();
  const [maxRange,setMaxRange] = useState<any>();
  const [minRange,setMinRange] = useState<any>();
  const [detailValue,setDetailValue] = useState<any>([0,0]);

  const onFinish = (values: any) => {
    console.log('Success:', values);
    setMaxRT(values.max)
    setMintRT(values.min)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '实验Id',
      dataIndex: 'expId',
    },
    {
      title: '等级',
      dataIndex: 'level',
    },
    {
      title: 'startPtr',
      dataIndex: 'startPtr',
    },
    {
      title: 'endPtr',
      dataIndex: 'endPtr',
    },
    {
      title: 'range',
      dataIndex: 'range',
      render: (dom: any, entity: any) => {
        if (entity.range) {
          return (
            <span>
              start:{entity?.range?.start}
              <br />
              end:{entity?.range?.end}
              <br />
              mz:{entity?.range?.mz}
              <br />
            </span>
          );
        }
        return false;
      },
    },
    {
      title: 'rts',
      dataIndex: 'rts',
      render: (dom: any, entity: any) => {
        return (
          <>
            {/* <Slider vertical reverse={true} dots onChange={setValue} value={sliderValue} style={{height: 400}}   range={{draggableTrack:true}}  max={entity.rts.length} min={0} /> */}
           
           <Space direction="vertical">
             <span>
             当前的rt时间范围为:{entity.rts[0]}~~{entity.rts[entity.rts.length-1]}
             </span>
             <span>
             当前的rt标签数目为:{entity.rts.length}
             </span>
           
           <Slider range={{draggableTrack:true}}   onChange={setValue} value={sliderValue} max={entity.rts.length} min={0} style={{width: 400}} />
           <Button onClick={async ()=>{
                 setMaxRange(sliderValue[1])
                 setMinRange(sliderValue[0])
                 setSmallRange(false)
                }}>大范围锁定</Button>
            <span hidden={smallRange}>
            <Slider  range={{draggableTrack:true}} onChange={setDetailValue} value={detailValue}  max={maxRange} min={minRange} style={{width: 400}} />
            </span>   
            <ul>
            {entity?.rts.map((item: any, index: any) => {
              if(index<parseInt(detailValue[1]) && index>parseInt(detailValue[0])){
                return <li key={index}>  
                <Button type="dashed" block onClick={async ()=>{
                  setShowCharts(true);
                  const msg = await spectrumCharts({ blockIndexId:entity.id,rt:item });
                  setChartsData(msg.data);
                  setRtData(item);
                }}>
                  {item}
                  </Button>
                  </li>;
              }
                return null;
            })}
           </ul> 
           </Space>
            
           
          
           
          </>
        );
      },
    },
   
  ];

  return (
    <Drawer width={800} visible={props.showDetail} onClose={props.onClose} closable={false}>
      <ProDescriptions<TableListDetail>
        column={1}
        title={props.currentRow}
        request={async () => {
          const msg = await blockIndexDetail({ id: props.currentRow });
          return Promise.resolve(msg);
        }}
        params={{
          id: props.currentRow,
        }}
        columns={columns as ProDescriptionsItemProps<TableListDetail>[]}
      />
      <ChartsForm 
        onCancel={{
          onCancel: () => {
            setShowCharts(false)
          },
        }}
        rtData={rtData}
        chartsData={chartsData}
        showCharts={showCharts}
      
      />
    </Drawer>
  );
};

export default DetailForm;
