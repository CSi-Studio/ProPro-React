/* eslint-disable no-param-reassign */
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
  Spin,
} from 'antd';
import React, { useEffect, useState } from 'react';
import type { PrepareData, Peptide, PeptideRow } from './data';
import ReactECharts from 'echarts-for-react';
import { getExpData, getPeptideRefs, prepare, report } from './service';
import { IrtOption } from './xic';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

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
  const [exps, setExps] = useState<IdName[]>([]); // 当前项目下所有的exp信息,包含id和name,其中name字段的规则为:当该exp.alias名称存在时使用alias,否则使用exp.name,这么设计的目的是因为alias名字比较简短,展示的时候信息密度可以更高
  const [selectedTags, setSelectedTags] = useState<any>([]); // 选中exp,存放的真实值为exp.id列表
  const [handleOption, setHandleOption] = useState<any>(); // 存放 Echarts的option
  const [handleSubmit, setHandleSubmit] = useState<any>(false); // 点击 诊断的状态变量
  const [prepareData, setPrepareData] = useState<PrepareData>(); // 项目名 蛋白下拉菜单渲染
  const [peptideList, setPeptideList] = useState<Peptide[]>([]); // 肽段下拉菜单渲染
  const [peptideRowList, setPeptideRowList] = useState<PeptideRow[]>([]); // 肽段下拉菜单渲染
  const [onlyDefault, setOnlyDefault] = useState<boolean>(true); // 默认overview
  const [smooth, setSmooth] = useState<boolean>(false); // 默认不进行smooth计算
  const [denoise, setDenoise] = useState<boolean>(false); // 默认不进行降噪计算
  const [peptideRef, setPeptideRef] = useState<any>(); // 当前选中的peptideRef
  const [loading, setLoading] = useState<boolean>(true); // loading
  const [peptideLoading, setPeptideLoading] = useState<boolean>(true); // loading
  const [chartsLoading, setChartsLoading] = useState<boolean>(true); // loading
  // 选中行的ID
  const [proteinRowKey, setProteinRowKey] = useState<any>();
  const [peptideRowKey, setPeptideRowKey] = useState<any>();
  /* table 搜索 */
  const [searchText, setSearchText] = useState<any>();
  const [searchedCol, setSearchedCol] = useState<any>('protein');

  // 获取肽段列表
  async function onProteinChange(value: string) {
    if (value[0] !== undefined) {
      if (prepareData && prepareData.anaLib) {
        const result = await getPeptideRefs({
          libraryId: prepareData?.anaLib?.id,
          protein: value,
        });
        // setPeptideData(result.data);
        setPeptideList(result.data);
        setPeptideLoading(false);
        return true;
      }
    }
    return false;
  }

  async function doAnalyze() {
    if (selectedTags.length === 0) {
      return false;
    }
    try {
      const result = await getExpData({
        projectId,
        peptideRef,
        expIds: selectedTags,
        onlyDefault,
        smooth,
        denoise,
      });
      // 将实验 别名 给 getExpData接口得到的数据
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
      // setLoading(false);
      setChartsLoading(false);
      // message.success('获取EIC Matrix数据成功');
      return true;
    } catch (error) {
      message.error('获取EIC Matrix失败，请重试!');
      return false;
    }
  }

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

  // 诊断Form 提交
  async function fetchSumMatrix() {
    if (!checkParams()) {
      return false;
    }
  
    let result = await report(selectedTags);
    if(result){
      
    }
    return true;
  }

  useEffect(() => {
    /* 准备数据 */
    const init = async () => {
      try {
        const result = await prepare({ projectId });
        setPrepareData(result.data); // 放蛋白列表
        const { expList } = result.data;
        const expTags = expList.map((item: any) => {
          return {
            id: item.id,
            name: item.alias ? item.alias : item.name,
          };
        });
        // setDefProtein([result?.data?.proteins[0]]); // table默认选择第一个蛋白
        setExps(expTags); // 放实验列表
        setSelectedTags(
          expTags?.map((item: any) => {
            return item.id;
          }),
        );
        setLoading(false);
        return true;
      } catch (err) {
        return false;
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (prepareData) {
      onProteinChange(prepareData.proteins[0]);
      setProteinRowKey(prepareData?.proteins[0]);
    }
    // 根据第一个蛋白获得肽段列表
  }, [prepareData]);

  useEffect(() => {
    setPeptideRef(peptideList[0]?.peptideRef); // 取第一个肽段
    setPeptideRowKey(peptideList[0]?.peptideRef);
    setHandleSubmit(!handleSubmit); // 触发设置option
  }, [peptideList[0]?.peptideRef]);

  useEffect(() => {
    doAnalyze();
  }, [handleSubmit]);

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

  

  /* 全选 */
  const selectAll = () => {
    setSelectedTags(
      exps?.map((item: any) => {
        return item.id;
      }),
    );
    setHandleSubmit(!handleSubmit);
  };

  /* 反选 */
  const selectReverse = () => {
    const reverse = exps.map((item) => item.id).filter((id) => !selectedTags.includes(id));
    setSelectedTags(reverse);
    setHandleSubmit(!handleSubmit);
  };

  /* 蛋白点击行选中 */
  const selectProteinRow = (record: any) => {
    if (record !== undefined) {
      onProteinChange(record.protein);
    }
  };

  /* 肽段点击行选中 */
  const selectPeptideRow = (record: any) => {
    if (record !== undefined) {
      setPeptideRef(record.peptide);
    }
  };

  /* table 搜索 */
  const handleSearch = (selectedKeys: any[], confirm: () => void, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedCol(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  let searchInput: any;
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`搜索肽段`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys, confirm, dataIndex);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      searchedCol === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.props.children : ''}
        />
      ) : (
        '暂无数据'
      ),
  });

  return (
    <PageContainer
      header={{
        onBack: () => window.history.back(),
        title: '蛋白诊所',
        tags: <Tag>{prepareData?.project?.name}</Tag>,
        extra: (
          <Form name="analyzeForm" layout="inline" onFinish={doSubmit}>
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
      <ProCard style={{ padding: '0 18px' }}>
        <Tabs size="small" defaultActiveKey="1">
          <TabPane tab="实验列表" key="1">
            <Row>
              <Col span={4}>
                <Row>
                  <Col span={24}>
                    <ProTable
                      columns={[
                        {
                          title: '蛋白',
                          dataIndex: 'protein',
                          key: 'protein',
                          ellipsis: true,
                          ...getColumnSearchProps('protein'),
                        },
                      ]}
                      dataSource={prepareData?.proteins.map((protein) => {
                        return { key: protein, protein };
                      })}
                      size="small"
                      search={false}
                      scroll={{ y: 380 }}
                      toolBarRender={false}
                      tableAlertRender={false}
                      rowClassName={(record) => {
                        return record.key === proteinRowKey ? 'clinicTableBgc' : '';
                      }}
                      onRow={(record) => {
                        return {
                          onClick: () => {
                            setProteinRowKey(record.key);
                            selectProteinRow(record);
                            setPeptideLoading(true);
                          },
                        };
                      }}
                      loading={loading}
                      style={{ height: 440 }}
                      pagination={{
                        size: 'small',
                        showSizeChanger: false,
                        showQuickJumper: false,
                        pageSize: 12,
                        showTotal: () => null,
                        position: ['bottomCenter'],
                      }}
                    />
                  </Col>
                  <Col span={24}>
                    <ProTable
                      columns={[
                        {
                          title: 'Unique',
                          dataIndex: 'isUnique',
                          key: 'isUnique',
                          width: 75,
                          render: (dom, entity) => {
                            if (entity.isUnique) {
                              return 'true';
                            }
                            return 'false';
                          },
                        },
                        {
                          title: '肽段',
                          dataIndex: 'peptide',
                          key: 'peptide',
                        },
                      ]}
                      dataSource={peptideList?.map((item) => {
                        return {
                          key: item.peptideRef,
                          peptide: item.peptideRef,
                          isUnique: item.isUnique,
                        };
                      })}
                      size="small"
                      search={false}
                      scroll={{ y: 330, x: 'max-content' }}
                      toolBarRender={false}
                      tableAlertRender={false}
                      pagination={false}
                      loading={peptideLoading}
                      style={{ height: 363 }}
                      rowClassName={(record) => {
                        return record.key === peptideRowKey ? 'clinicTableBgc' : '';
                      }}
                      onRow={(record) => {
                        return {
                          onClick: () => {
                            setPeptideRowKey(record.key);
                            selectPeptideRow(record);
                            setHandleSubmit(!handleSubmit);
                            setChartsLoading(true);
                          },
                        };
                      }}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={20}>
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
                    <Checkbox
                      checked={smooth}
                      onChange={(e) => {
                        setSmooth(e.target.checked);
                      }}
                    >
                      数据平滑
                    </Checkbox>
                    <Checkbox
                      checked={denoise}
                      onChange={(e) => {
                        setDenoise(e.target.checked);
                      }}
                    >
                      数据降噪
                    </Checkbox>
                  </Col>
                  <Col span={24} style={{ marginTop: 5 }}>
                    <Button style={{ marginRight: 5 }} size="small" onClick={() => selectAll()}>
                      全选
                    </Button>
                    <Button style={{ marginRight: 5 }} size="small" onClick={selectReverse}>
                      反选
                    </Button>
                    {exps.length > 0 &&
                      exps?.map((item: IdName) => (
                        <Badge
                          style={{ marginTop: 5 }}
                          size="small"
                          count={prepareData?.overviewMap[item.id]?.length}
                          offset={[-5, 0]}
                          key={item.id}
                        >
                          <Tooltip style={{ marginTop: 5 }} title={item.id}>
                            <CheckableTag
                              style={{ marginTop: 5, marginLeft: 5 }}
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
                          </Tooltip>
                        </Badge>
                      ))}
                  </Col>
                  <Col span={24}>
                    <Spin spinning={chartsLoading}>
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
                    </Spin>
                  </Col>
                </Row>
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
                <>分数类型({prepareData?.method?.score?.scoreTypes?.length}种): </>
                {prepareData?.method?.score?.scoreTypes?.map((type: any) => {
                  return (
                    <Tag style={{ marginTop: 5 }} key={type} color="blue">
                      {type}
                    </Tag>
                  );
                })}
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Irt结果" key="3" />
          <TabPane tab="定量矩阵" key="4">
            <Button
              style={{ marginRight: 5 }}
              size="small"
              onClick={() => fetchSumMatrix({ expIds: selectedTags })}>
              获取定量矩阵
            </Button>
            <ProTable
              columns={[{ title: '蛋白', dataIndex: 'proteins', key: 'proteins' },{ title: '肽段', dataIndex: 'peptide', key: 'peptide' },{ title: '定量值', dataIndex: 'sum', key: 'sum' }]}
              dataSource={peptideRowList}
              size="small"
              search={false}
              toolBarRender={false}
              tableAlertRender={false}
              pagination={false}
              loading={!peptideRowList}
            />
          </TabPane>
        </Tabs>
      </ProCard>
    </PageContainer>
  );
};

export default TableList;
