import React from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type deleteFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RuleListItem>;
};

const deleteForm: React.FC<deleteFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      title="删除一个项目"
      width={530}
      visible={props.deleteModalVisible}
      footer={submitter}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <ProForm.Group>
        <ProFormText
          rules={[
            {
              required: true,
              message: <FormattedMessage id="project_ruleName" defaultMessage="项目名字不能为空" />,
            },
          ]}
          width="sm"
          name="name"
          label={intl.formatMessage({
            id: 'label_project_name',
            defaultMessage: '项目名称',
          })}
          tooltip={intl.formatMessage({
            id: 'label_project_name_must_be_unique',
            defaultMessage: '项目名称必须唯一',
          })}
          placeholder={intl.formatMessage({
            id: 'label_enter_projectName',
            defaultMessage: '请输入项目名称',
          })}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage id="experiment_ruleName" defaultMessage="实验类型不能为空" />
              ),
            },
          ]}
          options={[
            {
              value: 'DIA_SWATH',
              label: 'DIA_SWATH',
            },
            {
              value: 'PRM',
              label: 'PRM',
            },
          ]}
          width="sm"
          name="type"
          label={intl.formatMessage({
            id: 'label_exp_type',
            defaultMessage: '实验类型',
          })}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          options={[
            {
              value: 'test',
              label: 'test',
            },
          ]}
          width="sm"
          name="irtLibraryName"
          label={intl.formatMessage({
            id: 'label_default_irt_library',
            defaultMessage: '默认IRT校准库',
          })}
        />
        <ProFormSelect
          options={[
            {
              value: 'test',
              label: 'test',
            },
          ]}
          width="sm"
          name="LibraryName"
          label={intl.formatMessage({
            id: 'label_default_library',
            defaultMessage: '默认校准库',
          })}
        />
      </ProForm.Group>
      <ProFormTextArea
        label={intl.formatMessage({
          id: 'label_detail_description',
          defaultMessage: '详情描述',
        })}
        name="remark"
      />
    </ModalForm>
  );
};

export default deleteForm;
