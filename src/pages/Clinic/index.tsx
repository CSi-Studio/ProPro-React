import type { IdName } from '@/components/Commons/common';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Button, Empty, Form, Input, message, Select, Space, Tabs, Tag, Checkbox, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import type { PrepareData } from './data';
import ReactECharts from 'echarts-for-react';
import { getExpData, getPeptideRefs, prepare } from './service';
import { IrtOption } from './charts';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const { Option, OptGroup } = Select;

// 每行grid的个数
const gridNumberInRow = 3;
// 横坐标
const xName = `rt`;
// 纵坐标
const yName = `int`;
// 单张高度（单位px）
const gridHeight = 200;
// 行间间隔高度（单位px）
const gridPaddingHeight = 80;
let Height = 0;

const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [tags, setTags] = useState<IdName[]>([]);
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const [handleOption, setHandleOption] = useState<any>();
  const [handleSubmit, setHandleSubmit] = useState<any>(false);
  const [prepareData, setPrepareData] = useState<PrepareData>();
  const [peptideRefs, setPeptideRefs] = useState<string[]>([]);
  const [onlyDefault, setOnlyDefault] = useState<boolean>(true);
  // 表单提交的useState
  const [handlePeptideRef, setHandlePeptideRef] = useState<any>();
  useEffect(() => {
    /* 准备数据 从Promise中拿值 */
    const init = async () => {
      try {
        const result = await prepare({ projectId });
        setPrepareData(result.data);
        const { expList } = result.data;
        const expTags = expList.map((item: any) => {
          return {
            id: item.id,
            name: item.alias ? item.alias : item.name,
          };
        });
        setTags(expTags);
        return true;
      } catch (err) {
        return false;
      }
    };
    init();
    setSelectedTags(
      tags?.map((item: any) => {
        return item.id;
      }),
    );
  }, []);

  useEffect(() => {
    async function doAnalyze() {
      if(!checkParams()){
        return false
      }

      const result = await getExpData({
        projectId,
        peptideRef: handlePeptideRef,
        expIds: selectedTags,
        onlyDefault
      });
      console.log(result);
      console.log(tags);

      const irt = new IrtOption(
        result.data,
        gridNumberInRow,
        xName,
        yName,
        gridHeight,
        gridPaddingHeight,
      );
      const option = irt.getIrtOption();
      Height = Math.ceil(result.data.length / gridNumberInRow) * (gridHeight + gridPaddingHeight);
      console.log('option---', option);

      setHandleOption(option);
      return true;
    }
    doAnalyze();
  }, [handleSubmit]);

  const handleChange = (item: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, item]
      : selectedTags.filter((t: string) => t !== item);
    setSelectedTags(nextSelectedTags);
  };

  const checkParams = () =>{
    if (selectedTags.length === 0) {
      message.warn('请至少选择一个实验');
      return false;
    }
    return true
  }
  async function doSubmit(values: any) {
    if(!checkParams()){
      return false
    }
    const peptideRef = values.customPeptideRef ? values.customPeptideRef : values.peptideRef
    if(peptideRef === undefined || peptideRef === ''){
      message.warn("请选择一个PeptideRef")
      return false
    }
    setHandlePeptideRef(peptideRef);
    // console.log('result', result);
    setHandleSubmit(!handleSubmit);
    return true;
  }

  async function onProteinChange(value: string) {
    if (prepareData && prepareData.anaLib) {
      const result = await getPeptideRefs({
        libraryId: prepareData?.anaLib?.id,
        protein: value,
      });
      setPeptideRefs(result.data);
    }
  }

  const selectAll = () => {
    setSelectedTags(
      tags?.map((item: any) => {
        return item.id;
      }),
    );
  };

  const selectReverse = () => {
    const reverse = tags.map((item) => item.id).filter((id) => !selectedTags.includes(id));
    setSelectedTags(reverse);
  };

  return (
    <PageContainer
      header={{
        onBack: () => window.history.back(),
        title: '蛋白诊所',
        tags: <Tag>{prepareData?.project?.name}</Tag>,
        extra: (
          <Form name="analyzeForm" layout="inline" onFinish={doSubmit}>
            <Form.Item name="protein" label="蛋白">
              <Select onChange={onProteinChange} showSearch key="1" style={{ width: 300 }}>
                {prepareData?.anaProteins?.map((protein) => (
                  <Option key={protein} value={protein}>
                    {protein}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="peptideRef" label="肽段">
              <Select style={{ width: 300 }}>
                {peptideRefs?.map((peptideRef) => (
                  <Option key={peptideRef} value={peptideRef}>
                    {peptideRef}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="customPeptideRef" label="自定义肽段">
              <Input style={{ width: 300 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                诊断
              </Button>
            </Form.Item>
          </Form>
        ),
      }}
    >
      <ProCard>
        <Tabs size="small" defaultActiveKey="1">
          <TabPane tab="实验列表" key="1">
            <Space>
              <Tooltip title="仅选择实验默认的overview"><Checkbox checked={onlyDefault} onChange={(e)=>{
                setOnlyDefault(e.target.checked)
              }}>仅默认</Checkbox></Tooltip>
            
              <Button size="small" onClick={() => selectAll()}>
                全选
              </Button>
              <Button size="small" onClick={selectReverse}>
                反选
              </Button>
              {tags.length > 0 &&
                tags?.map((item: IdName) => (
                  <Badge
                    size="small"
                    count={prepareData?.overviewMap[item.id]?.length}
                    offset={[-5, 0]}
                    key={item.id}
                  >
                    <CheckableTag
                      checked={selectedTags?.indexOf(item.id) > -1}
                      onChange={(checked) => {
                        handleChange(item.id, checked);
                        if (handleOption) {
                          setHandleSubmit(!handleSubmit);
                        }
                      }}
                    >
                      {item.name}
                    </CheckableTag>
                  </Badge>
                ))}
            </Space>
          </TabPane>
          <TabPane tab="方法参数" key="2">
            <Space>
              <Tag color="blue">{prepareData?.insLib?.name}</Tag>
              <Tag color="blue">{prepareData?.anaLib?.name}</Tag>
              <Tag color="blue">{prepareData?.method?.name}</Tag>
            </Space>
          </TabPane>
        </Tabs>
      </ProCard>

      <ProCard direction="column" gutter={[0, 16]}>
        {selectedTags.length > 0 && handleOption !== undefined ? (
          <ReactECharts
            option={handleOption}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: '100%', height: Height }}
          />
        ) : (
          <Empty description="请先选择实验" style={{ width: '100%', height: '75vh' }} />
        )}
      </ProCard>
    </PageContainer>
  );
};

export default TableList;
