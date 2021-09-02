import React from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-form';
import { values } from 'lodash';

export type selectFormValueType = {
  proteinName:string,
  LibraryId: string;
};

export type UpdateFormProps = {
  onClose: () => void;
  proteinSelectVisible: boolean;
  values: any;
  onSubmit: (values: selectFormValueType) => Promise<void>;
};


const ProteinFixedForm: React.FC<UpdateFormProps> = (props) => {
  
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
    

    </ModalForm>

    
     
  );
};

export default ProteinFixedForm;