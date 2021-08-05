import { Icon } from '@iconify/react';
import { Button, message, Tag, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableDropdown } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import { rule, addRule } from './service';
import type { TableListItem, TableListPagination } from './data';
// import deleteForm from './components/DeleteForm';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 删除窗口的弹窗 */
  // const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const tableListDataSource: TableListItem[] = [];
  for (let i = 0; i < 5; i += 1) {
    tableListDataSource.push({
      id: i,
      name: 'AppName',
      type: 'qweqweqwe',
      repoProjectName: 'asdasadasdadfdsfsdfsdfsdfsdsdfsdfsdf',
      creator: 'lihua',
      irtLibraryName: 'asdffsasdasdasdsdasdasdasdasd',
      libraryName: 'asdffsasdasdasdasdsadasdadasd',
      createDate: Date(),
      irtLibraryId: `${i}`,
      libraryId: `${i}`,
      description: 'asdasd',
      totalSize: 5,
      lastModifiedDate: Date(),
      labels: ['cool', 'teacher'],
    });
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: <FormattedMessage id="label_project_name" defaultMessage="项目名称" />,
      dataIndex: 'name',
      sorter: true,
      render: (dom) => {
        return <a>{dom}</a>;
      },
    },
    {
      title: <FormattedMessage id="label_exp_type" defaultMessage="实验类型" />,
      dataIndex: 'type',
      sorter: true,
    },
    {
      title: <FormattedMessage id="label_project_repository" defaultMessage="项目仓库" />,
      dataIndex: 'repoProjectName',
      sorter: true,
      renderText: (val: string) => `${val}`,
    },
    {
      title: <FormattedMessage id="label_owner" defaultMessage="负责人" />,
      dataIndex: 'creator',
      sorter: true,
    },
    {
      title: <FormattedMessage id="label_default_irt_library" defaultMessage="默认IRT标准库" />,
      sorter: true,
      dataIndex: 'irtLibraryName',
    },
    {
      title: <FormattedMessage id="label_default_library" defaultMessage="默认标准库" />,
      dataIndex: 'libraryName',
      sorter: true,
    },
    {
      title: <FormattedMessage id="label_create_date" defaultMessage="创建时间" />,
      dataIndex: 'createDate',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: <FormattedMessage id="label_labels" defaultMessage="标签" />,
      dataIndex: 'labels',
      render: (dom) => {
        // eslint-disable-next-line array-callback-return
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="label_operation" defaultMessage="操作" />,
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (text, record, index, action) => [
        <Tooltip title={'扫描并更新'} key="91">
          <a href={'https://commands.top'} target="_blank" rel="noopener noreferrer" key="1">
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-search" />{' '}
          </a>
        </Tooltip>,
        <Tooltip title={'编辑'} key="92">
          <a
            key="2"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-edit" />
          </a>
        </Tooltip>,
        <Tooltip title={'批量IRT计算'} key="93">
          <a href={'https://commands.top'} target="_blank" rel="noopener noreferrer" key="3">
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:calculator" />
          </a>
        </Tooltip>,
        <Tooltip title={'批量执行完整流程'} key="94">
          <a href={'https://commands.top'} target="_blank" rel="noopener noreferrer" key="4">
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:connection" />
          </a>
        </Tooltip>,
        <TableDropdown
          key="95"
          onSelect={(e) => {
            if (e === '96') {
              console.log('我是查看结果');
            }
            if (e === '97') {
              console.log('我是导出');
            }
            if (e === '98') {
              console.log('我是删除');
              // handleDeleteModalVisible(true);
            }
          }}
          menus={[
            {
              key: '96',
              name: '查看结果总览',
              icon: (
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                  icon="mdi:file-eye"
                />
              ),
            },
            {
              key: '97',
              name: '导出',
              icon: (
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                  icon="mdi:file-export"
                />
              ),
            },
            {
              key: '98',
              name: '删除',
              icon: (
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px', color: '#0D93F7' }}
                  icon="mdi:delete"
                />
              ),
            },
          ]}
        />,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={''}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />{' '}
            {intl.formatMessage({
              id: 'create_project',
              defaultMessage: '创建项目',
            })}
          </Button>,
        ]}
        request={rule}
        // dataSource={tableListDataSource}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        ></FooterToolbar>
      )}
      {/* 新建列表 */}
      <ModalForm
        title={intl.formatMessage({
          id: 'label_create_project',
          defaultMessage: '创建一个项目',
        })}
        width={530}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProForm.Group>
          <ProFormText
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage id="project_ruleName" defaultMessage="项目名字不能为空" />
                ),
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
          name="description"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
