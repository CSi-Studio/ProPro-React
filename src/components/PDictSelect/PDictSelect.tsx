import { ProFormSelect } from '@ant-design/pro-form';
export type dictProps = {
  dictName: string;
  initialValue?: string;
  name?: string;
  label?: string;
  placeholder?: string;
};

let newData: any[] = [];

const PSelect: React.FC<dictProps> = (props) => {
  const data = JSON.parse(sessionStorage.getItem(props.dictName));
  newData = [];
  data.forEach((item: any) => {
    newData.push({ value: item.key, label: item.value });
  });
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
