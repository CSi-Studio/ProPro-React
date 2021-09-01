import { Tag, Button, Tabs, Select, Form, Input, Space, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ReactECharts from 'echarts-for-react';
import { experimentList } from '../Experiment/service';
import { ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
import { getPeptideRefs, prepare } from './service';
import { PrepareData } from './data';
const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const { Option, OptGroup } = Select;

const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [tags, setTags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [prepareData, setPrepareData] = useState<PrepareData>()
  const [peptideRefs, setPeptideRefs] = useState<string[]>([])
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

  const doAnalyze = (values:any) =>{
      console.log(values)
  }

  async function onProteinChange(value: string){
    if(prepareData && prepareData.anaLib){
      const result = await getPeptideRefs({
        libraryId: prepareData?.anaLib?.id,
        protein: value
      })
      setPeptideRefs(result.data)
    }
  }

  return (
    <PageContainer
      header={{
        onBack: () => window.history.back(),
        title: '蛋白诊所',
        tags: <Tag>{prepareData?.project?.name}</Tag>,
        extra:<Form name="analyzeForm" layout="inline" onFinish={doAnalyze}>
                <Form.Item name="protein" label="蛋白">
                  <Select onChange={onProteinChange} showSearch key="1" style={{width:300}}>
                    {prepareData?.anaProteins?.map(protein=>
                      (<Option key={protein} value={protein}>{protein}</Option>)
                    )}
                  </Select>
                </Form.Item>
                <Form.Item name="peptideRef" label="肽段">
                  <Select  style={{width:300}}>
                    {peptideRefs?.map(peptideRef=>
                      (<Option key={peptideRef} value={peptideRef}>{peptideRef}</Option>)
                    )}
                  </Select>
                </Form.Item>
                <Form.Item name="customPeptideRef" label="自定义肽段">
                  <Input  style={{width:300}}>
                    
                  </Input>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    诊断
                  </Button>
                </Form.Item>
              </Form>
      }}>
      <ProCard>
        <Tabs size="small" defaultActiveKey="1">
          <TabPane tab="实验列表" key="1">
            <Row>
            {tags.length > 0 &&
                tags?.map((item: string) => (
                  <CheckableTag
                    key={item}
                    checked={selectedTags?.indexOf(item) > -1}
                    onChange={(checked) => {
                      handleChange(item, checked);
                    }}>
                    {item}
                  </CheckableTag>
                ))}
            </Row>
          </TabPane>
          <TabPane tab="方法参数" key="2">
             <Space><Tag color="blue">{prepareData?.insLib?.name}</Tag><Tag color="blue">{prepareData?.anaLib?.name}</Tag><Tag color="blue">{prepareData?.method?.name}</Tag></Space>
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
