import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ModalForm,
} from '@ant-design/pro-form';
import { Space } from 'antd';


export type selectFormValueType = {
  proteinName:string,
  projectId: string;
  range:any
};

export type UpdateFormProps = {
  onClose: () => void;
  proteinSelectVisible: boolean;
  values: any;
  onSubmit: (values: selectFormValueType) => Promise<void>;
};

let newData:any[]=[]

const ProteinSelectForm: React.FC<UpdateFormProps> = (props) => {
  console.log("values",props.values)
    // props?.values?.map((item:any,index:number)=>{
    //     newData.push({value:item,label:item})
    // })
  return (
    <ModalForm

      title="蛋白质选择界面"
      width={800}
      visible={props.proteinSelectVisible}
      modalProps={{
        maskClosable: false,
        onCancel:props.onClose,
        
      }}
      onFinish={props.onSubmit}
    >
    <ProForm.Group >
      <Space direction="vertical">
        <ProFormSelect
        options={newData}
        name={"proteinName"}
        showSearch
        width={500}
        label={"蛋白质名称"}
        />
        </Space>
        <ProFormText
        width="sm" name={"range"} label="mz范围" placeholder="请输入mz范围" 
        />
        
    </ProForm.Group>

    </ModalForm>

    
     
  );
};

export default ProteinSelectForm;
