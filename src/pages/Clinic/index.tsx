import type { IdName } from '@/components/Commons/common';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Badge,
  Button,
  Empty,
  Form,
  Input,
  message,
  Select,
  Space,
  Tabs,
  Tag,
  Checkbox,
  Tooltip,
  Row,
  Col,
} from 'antd';
import React, { useEffect, useState } from 'react';
import type { PrepareData } from './data';
import ReactECharts from 'echarts-for-react';
import { getExpData, getPeptideRefs, prepare } from './service';
import { IrtOption } from './charts';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const { Option } = Select;

const gridNumberInRow = 3; // 每行grid的个数
const xName = `rt/s`; // 横坐标
const yName = `int/s`; // 纵坐标
const gridHeight = 200; // 单张高度（单位px）
const gridPaddingHeight = 80; // 行间间隔高度（单位px）
let Height = 0;

const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [exps, setExps] = useState<IdName[]>([]); // 渲染 tags
  const [selectedTags, setSelectedTags] = useState<any>([]); // 选中 tags
  const [handleOption, setHandleOption] = useState<any>(); // 存放 Echarts的option
  const [handleSubmit, setHandleSubmit] = useState<any>(false); // 点击 诊断的状态变量
  const [prepareData, setPrepareData] = useState<PrepareData>(); // 项目名 蛋白下拉菜单渲染
  const [peptideData, setPeptideData] = useState<string[]>([]); // 肽段下拉菜单渲染
  const [onlyDefault, setOnlyDefault] = useState<boolean>(true); // 默认ov
  const [peptideRef, setPeptideRef] = useState<any>(); // 表单提交的peptideRef,对应后端接口
  useEffect(() => {
    /* 准备数据 */
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
        setExps(expTags);
        setSelectedTags(
          expTags?.map((item: any) => {
            return item.id;
          }),
        );
        return true;
      } catch (err) {
        return false;
      }
    };
    init();
  }, []);

  useEffect(() => {
    /* 诊断数据 */
    async function doAnalyze() {
      if (selectedTags.length === 0) {
        return false;
      }
      const hide = message.loading('正在诊断，请稍后');
      try {
        const result = await getExpData({
          projectId,
          peptideRef,
          expIds: selectedTags,
          onlyDefault,
        });
        result.data.map((item: any) => {
          exps?.forEach((_item: any) => {
            if (item.expId === _item.id) {
              item.name = _item.name;
            }
          });
          return true;
        });
        const irt = new IrtOption(
          result.data,
          gridNumberInRow,
          xName,
          yName,
          gridHeight,
          gridPaddingHeight,
        );
        const option = irt.getIrtOption();
        Height =
          Math.ceil(result.data.length / gridNumberInRow) * (gridHeight + gridPaddingHeight) + 50;
        setHandleOption(option);
        hide();
        message.success('生成诊断数据成功');
        return true;
      } catch (error) {
        hide();
        message.error('生成诊断数据失败，请重试!');
        return false;
      }
    }
    doAnalyze();
  }, [handleSubmit]);
  console.log('handleOption', handleOption);

  // 点击选择 tags
  const handleChange = (item: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, item]
      : selectedTags.filter((t: string) => t !== item);
    setSelectedTags(nextSelectedTags);
  };

  // 诊断前判断
  const checkParams = () => {
    if (selectedTags.length === 0) {
      message.warn('请至少选择一个实验');
      return false;
    }
    return true;
  };

  // 诊断Form 提交
  async function doSubmit(values: any) {
    if (!checkParams()) {
      return false;
    }
    const submitData = values.customPeptideRef ? values.customPeptideRef : values.peptideRef;
    if (!values.peptideRef) {
      message.warn('请选择一个PeptideRef');
      return false;
    }
    setPeptideRef(submitData);
    setHandleSubmit(!handleSubmit);
    return true;
  }

  // 获取蛋白列表
  async function onProteinChange(value: string) {
    if (prepareData && prepareData.anaLib) {
      const result = await getPeptideRefs({
        libraryId: prepareData?.anaLib?.id,
        protein: value,
      });
      setPeptideData(result.data);
    }
  }

  // 全选
  const selectAll = () => {
    setSelectedTags(
      exps?.map((item: any) => {
        return item.id;
      }),
    );
  };

  // 反选
  const selectReverse = () => {
    const reverse = exps.map((item) => item.id).filter((id) => !selectedTags.includes(id));
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
                {peptideData?.map((item) => (
                  <Option key={item} value={item}>
                    {item}
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
      <ProCard style={{ padding: '0 18px'}}>
        <Tabs size="small" defaultActiveKey="1">
          <TabPane tab="实验列表" key="1">
            <Row>
              <Col span={24}>
                <Tooltip title="仅选择实验默认的overview">
                  <Checkbox
                    checked={onlyDefault}
                    onChange={(e) => {
                      setOnlyDefault(e.target.checked);
                    }}
                  >
                    仅默认
                  </Checkbox>
                </Tooltip>
                <Button size="small" onClick={() => selectAll()}>
                  全选
                </Button>
                <Button  style={{marginLeft:5}} size="small" onClick={selectReverse}>
                  反选
                </Button>
              </Col>
              <Col span={24} style={{marginTop:5}}>
                {exps.length > 0 &&
                  exps?.map((item: IdName) => (
                    <Badge
                      style={{marginTop:5}}
                      size="small"
                      count={prepareData?.overviewMap[item.id]?.length}
                      offset={[-5, 0]}
                      key={item.id}
                    >
                      <Tooltip style={{marginTop:5}} title={item.id}>
                        <CheckableTag
                          style={{marginTop:5, marginLeft:5}}
                          checked={selectedTags?.indexOf(item.id) > -1}
                          onChange={(checked) => {
                            handleChange(item.id, checked);
                            if (handleOption) {
                              setHandleSubmit(!handleSubmit);
                            }
                          }}>
                          {item.name}
                        </CheckableTag>
                      </Tooltip>
                    </Badge>
                  ))}
              </Col>
              </Row>
          </TabPane>
          <TabPane tab="方法参数" key="2">
            <Row>
              <Col span={24}>
                <Space>
                  <Tag color="blue">{prepareData?.insLib?.name}</Tag>
                  <Tag color="blue">{prepareData?.anaLib?.name}</Tag>
                  <Tag color="blue">{prepareData?.method?.name}</Tag>
                </Space>
              </Col>
              <Col span={24}>
                <>分数类型({prepareData?.method?.score?.scoreTypes?.length}种):   </>
                {
                  prepareData?.method?.score?.scoreTypes?.map(type=>{
                     return <Tag style={{marginTop:5}} key={type} color="blue">{type}</Tag>
                  })
                }
              </Col>
            </Row>  
          </TabPane>
        </Tabs>
      </ProCard>
      <ProCard style={{ padding: '6px 5px 6px 10px' }}>
        {selectedTags.length > 0 && handleOption !== undefined ? (
          <ReactECharts
            option={handleOption}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: '100%', height: Height }}
          />
        ) : (
          <Empty
            description="请先选择实验"
            style={{ padding: '10px', color: '#B0B8C1' }}
            imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
          />
        )}
      </ProCard>
    </PageContainer>
  );
};

export default TableList;
