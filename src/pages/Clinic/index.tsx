import { Tag, Button, Tabs, Select, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ReactECharts from 'echarts-for-react';
import { experimentList } from '../Experiment/service';
import { ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
import { prepare } from './service';
import { PrepareData } from './data';
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const { Option, OptGroup } = Select;

const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [tags, setTags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [prepareData, setPrepareData] = useState<PrepareData>()
  useEffect(() => {
    /* 准备数据 从Promise中拿值*/
    const init = async () => {
      try {
        const result = await prepare({ projectId })
        setPrepareData(result.data)
        const expList = result.data.expList
        setTags(
          expList.map((item: any) => {
            return item.alias?item.alias:item.name;
          }),
        )
        setSelectedTags(
          tags?.map((item: string) => {
            return item;
          }),
        )
      } catch (err) {
        console.log(err)
      }
    }
    init()
  }, [])

  const handleChange = (item: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, item]
      : selectedTags.filter((t: string) => t !== item);
    setSelectedTags(nextSelectedTags);
  };

  const doAnalyze = () =>{

  }

  const onProteinSelectChange = () =>{

  }

  return (
    <PageContainer
      header={{
        onBack: () => window.history.back(),
        title: '蛋白诊所',
        tags: <><Tag color="blue">{prepareData?.insLib?.name}</Tag><Tag color="blue">{prepareData?.anaLib?.name}</Tag><Tag color="blue">{prepareData?.method?.name}</Tag></>,
        subTitle: prepareData?.project?.name,
        extra:<Form name="analyzeForm" layout="inline" onFinish={doAnalyze}>
                <Form.Item name="protein" label="蛋白">
                  <Select onChange={onProteinSelectChange} showSearch key="1" style={{width:400}}>
                    <OptGroup key="ins" label="内标库">
                      {prepareData?.insProteins?.map(protein=>
                        (<Option key={protein} value={protein}>{protein}</Option>)
                      )}
                    </OptGroup>
                    <OptGroup key="ana" label="标准库">
                      {prepareData?.anaProteins?.map(protein=>
                        (<Option key={protein} value={protein}>{protein}</Option>)
                      )}
                    </OptGroup>
                  </Select>
                </Form.Item>
                <Form.Item name="peptideRef" label="肽段">
                  <Select style={{width:400}}>
                    
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    开始诊断
                  </Button>
                </Form.Item>
              </Form>
      }}>
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
          <TabPane tab="方法参数" key="2">
            Content of Tab Pane 2
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
