import { ProFormSelect } from '@ant-design/pro-form';
import { getDict } from '@/pages/Dict/service';
import { useState } from 'react';
export type dictProps = {
  dictName: string;
  initialValue?:string;
  name?:string
  label?:string
  placeholder?:string
};





const newData:any[]=[]

const PSelect: React.FC<dictProps> = (props) => {
  const data=JSON.parse(sessionStorage.getItem(props.dictName))
  data.map((item:any,index:string)=>{
    newData.push({value:item.key,label:item.value})
  })
  console.log("newData",newData)
  return (
    <ProFormSelect
    options={newData}
    width="sm"
    name={props.name}
    label={props.label}
    placeholder={props.placeholder}
    initialValue={props.initialValue}
  />
  );
};

export default PSelect;
