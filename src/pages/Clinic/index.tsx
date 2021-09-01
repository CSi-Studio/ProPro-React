import { Tag, Button, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ReactECharts from 'echarts-for-react';
import { experimentList } from '../Experiment/service';
import { ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
const { TabPane } = Tabs;
const { CheckableTag } = Tag;

const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [tags, setTags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [handleOption, setHandleOption] = useState({});
  useEffect(() => {
    /* 实验列表 从Promise中拿值*/
    const tagsData = async () => {
      try {
        const dataSource = await experimentList({ projectId });
        setTags(
          dataSource.data.map((item: any) => {
            return item.name;
          }),
        );
        setSelectedTags(
          tags?.map((item: string) => {
            return item;
          }),
        );
      } catch (err) {
        console.log(err);
      }
    };
    tagsData();
  }, []);

  const handleChange = (item: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, item]
      : selectedTags.filter((t: string) => t !== item);
    setSelectedTags(nextSelectedTags);
  };
  return (
    <PageContainer
      header={{
        onBack: () => {
          window.history.back();
        },
        title: '蛋白诊所',
        ghost: true,
        tags: [<Tag color="blue">开发中...</Tag>],
        subTitle: '这是一个蛋白诊所，分析处理各种蛋白',
        extra: [
          <Button
            key="3"
            type="primary"
            onClick={() => {
              console.log(selectedTags);
            }}
          >
            主要按钮
          </Button>,
        ],
      }}
    >
      <ProCard>
        <Tabs size="small" defaultActiveKey="1">
          <TabPane tab="实验列表" key="1">
            <ProCard direction="column" gutter={[0, 16]}>
              {tags.length > 0 &&
                tags?.map((item: string) => (
                  <CheckableTag
                    key={item}
                    checked={selectedTags?.indexOf(item) > -1}
                    onChange={(checked) => {
                      handleChange(item, checked);
                    }}
                  >
                    {item}
                  </CheckableTag>
                ))}
            </ProCard>
            <ProCard title="蛋白列表" gutter={[0, 16]}>
              <ProFormGroup>
                <ProFormSelect
                  name="select"
                  width={216}
                  label="靶库"
                  options={[
                    { label: '全部', value: 'all' },
                    { label: '未解决', value: 'open' },
                    { label: '已解决', value: 'closed' },
                    { label: '解决中', value: 'processing' },
                  ]}
                  fieldProps={{
                    optionItemRender(item) {
                      return item.label + ' - ' + item.value;
                    },
                  }}
                  placeholder="Please select a country"
                  rules={[{ required: true, message: 'Please select your country!' }]}
                />
                <ProFormSelect
                  name="select"
                  width={216}
                  label="Select"
                  options={[
                    { label: '全部', value: 'all' },
                    { label: '未解决', value: 'open' },
                    { label: '已解决', value: 'closed' },
                    { label: '解决中', value: 'processing' },
                  ]}
                  fieldProps={{
                    optionItemRender(item) {
                      return item.label + ' - ' + item.value;
                    },
                  }}
                  placeholder="Please select a country"
                  rules={[{ required: true, message: 'Please select your country!' }]}
                />
              </ProFormGroup>
            </ProCard>
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </ProCard>
    
      <ProCard direction="column" gutter={[0, 16]}>
        {/* <ReactECharts
          option={handleOption}
          style={{ width: `100%`, height: Height }}
          lazyUpdate={true}
        /> */}
      </ProCard>
    </PageContainer>
  );
};

export default TableList;
