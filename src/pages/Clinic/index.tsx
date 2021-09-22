/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import type { IdNameAlias } from '@/components/Commons/common';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Badge,
  Button,
  Empty,
  Input,
  message,
  Space,
  Tabs,
  Tag,
  Checkbox,
  Tooltip,
  Row,
  Col,
  Spin,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import type { PrepareData, Peptide, PeptideTableItem } from './data';
import ReactECharts from 'echarts-for-react';
import { getExpData, getPeptideRatio, getPeptideRefs, getSpectra, prepare } from './service';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import IrtCharts from './components/Irt';
import QtCharts from './components/Qt';
import CutInfo from './components/CutInfo';
import Spectrum from './components/Spectra';
import { irtList } from '../Irt/service';
import xic from './components/xic';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

/* echarts参数 */
let gridNumberInRow = 3; // 每行grid的个数
const xName = `rt/s`; // 横坐标
const yName = `int/s`; // 纵坐标
const gridHeight = 200; // 单张高度（单位px）
const gridPaddingHeight = 80; // 行间间隔高度（单位px）
let Height = 0;

const TableList: React.FC = (props: any) => {
  const projectId = props?.location?.query?.projectId;
  const [exps, setExps] = useState<IdNameAlias[]>([]); // 当前项目下所有的exp信息,包含id和name,其中name字段的规则为:当该exp.alias名称存在时使用alias,否则使用exp.name,这么设计的目的是因为alias名字比较简短,展示的时候信息密度可以更高
  const [expData, setExpData] = useState<[]>([]); // 选中exp,存放的真实值为exp.id列表
  const [selectedExpIds, setSelectedExpIds] = useState<string[]>([]); // 选中exp,存放的真实值为exp.id列表
  const [peptideRatioData, setPeptideRatioData] = useState<any>(); // 存放分析结果的初始数据
  const [handleOption, setHandleOption] = useState<any>(); // 存放 Echarts的option
  const [handleSubmit, setHandleSubmit] = useState<any>(false); // 点击 诊断的状态变量
  const [prepareData, setPrepareData] = useState<PrepareData>(); // 进入蛋白诊所的时候初始化的数据,包含实验列表,蛋白质列表
  const [peptideList, setPeptideList] = useState<Peptide[]>([]); // 肽段的Table行
  const [onlyDefault, setOnlyDefault] = useState<boolean>(true); // 默认overview
  const [smooth, setSmooth] = useState<boolean>(false); // 默认不进行smooth计算
  const [denoise, setDenoise] = useState<boolean>(false); // 默认不进行降噪计算
  const [peptideRef, setPeptideRef] = useState<any>(); // 当前选中的peptideRef
  const [loading, setLoading] = useState<boolean>(true); // 蛋白table loading
  const [peptideLoading, setPeptideLoading] = useState<boolean>(true); // 肽段table loading
  const [chartsLoading, setChartsLoading] = useState<boolean>(true); // charts loading
  // 选中行的ID
  const [proteinRowKey, setProteinRowKey] = useState<any>();
  const [peptideRowKey, setPeptideRowKey] = useState<any>();
  /* table 搜索 */
  const [searchText, setSearchText] = useState<any>();
  const [searchedCol, setSearchedCol] = useState<any>('protein');
  /* 键盘事件 */
  const [proteinsIndex, setProteinsIndex] = useState<number>(0); // 蛋白table当前选中
  const [proteinPage, setProteinPage] = useState<number>(1); // 蛋白table当前页数
  const [peptidesIndex, setPeptidesIndex] = useState<number>(0); // 肽段table当前选中
  const [peptidePage, setPeptidePage] = useState<number>(1); // 肽段table当前页数
  /* Irt charts相关 */
  const [irtData, setIrtData] = useState<any>();
  /* 当前Tab */
  const [currentTab, setCurrentTab] = useState<string>('1');
  /* CutInfo弹窗 */
  const [cutInfoVisible, setCutInfoVisible] = useState<boolean>(false);
  /* 光谱图弹窗 */
  const [spectrumVisible, setSpectrumVisible] = useState<boolean>(false);
  const [spectra, setSpectra] = useState<boolean>(false);
  /* 获取echarts实例，使用其Api */
  const [echarts, setEcharts] = useState<any>();

  /** ******** Table Columns Definition ************* */
  // 肽段列表 Column
  const peptideColumn: ProColumns<PeptideTableItem>[] = [
    {
      title: 'Uni',
      dataIndex: 'isUnique',
      key: 'isUnique',
      width: 25,
      render: (dom, entity) => {
        if (entity.isUnique) {
          return <Tag color="success">T</Tag>;
        }
        return <Tag color="error">F</Tag>;
      },
    },
    {
      title: '肽段',
      dataIndex: 'peptide',
      key: 'peptide',
    },
    {
      title: 'm/z',
      dataIndex: 'mz',
      key: 'mz',
      render: (dom, entity) => {
        return <Tag>{entity.mz.toFixed(3)}</Tag>;
      },
    },
  ];

  /** **************  网络调用相关接口 start  ****************** */
  async function fetchEicDataList(predict: boolean, changeCharge: boolean) {
    if (selectedExpIds.length === 0) {
      return false;
    }
    if (!peptideRef) {
      message.warn('请选择一个PeptideRef');
      return false;
    }
    setChartsLoading(true);
    try {
      const result = await getExpData({
        projectId,
        libraryId: prepareData?.anaLib?.id,
        predict,
        changeCharge,
        peptideRef,
        expIds: selectedExpIds,
        onlyDefault,
        smooth,
        denoise,
      });

      // 将实验 别名 给 getExpData接口得到的数据
      result.data.forEach((item: any) => {
        exps?.forEach((_item: any) => {
          if (item.expId === _item.id) {
            item.alias = _item.alias;
          }
        });
      });
      setExpData(result.data);

      /* 碎片Mz echarts toolbox */
      const getCutInfo = () => {
        setCutInfoVisible(true);
        setExpData(result.data);
      };

      /* 展示碎片光谱图 */
      const spectraFn = async (values: any) => {
        const hide = message.loading('正在获取光谱图');
        try {
          const data = await getSpectra({
            expId: selectedExpIds[Math.floor((values[0].seriesIndex + 1) / selectedExpIds.length)],
            mz: peptideList.find((item) => item.peptideRef === peptideRef).mz,
            rt: values[0].axisValue,
          });
          data.expData = result.data;
          setSpectra(data);
          setSpectrumVisible(true);
          hide();
          return true;
        } catch (error) {
          hide();
          return false;
        }
      };

      /* 获取option */
      const option = xic({ result: result.data, getCutInfo, spectraFn });
      gridNumberInRow = selectedExpIds.length > 2 ? 3 : 2;
      Height =
        Math.ceil(result.data.length / gridNumberInRow) * (gridHeight + gridPaddingHeight) + 50;
      setHandleOption(option);
      setChartsLoading(false);
      setPeptideLoading(false);

      return true;
    } catch (error) {
      message.error('获取EIC Matrix失败，请重试!');
      setPeptideLoading(false);
      setChartsLoading(false);
      return false;
    }
  }

  /* **************  Irt result  ****************** */
  const getIrtData = async (values: any) => {
    try {
      const result = await irtList(values.selectedExpIds);
      result.data.forEach((value: { id: any; alias: any }) => {
        values.exps.forEach((item: { id: any; alias: any }) => {
          if (item.id === value.id) {
            value.alias = item.alias;
          }
        });
      });
      result.data.sort((a: { alias: string }, b: { alias: string }) =>
        a.alias > b.alias ? 1 : -1,
      );
      setIrtData(result.data);
      return true;
    } catch (error) {
      return false;
    }
  };

  /** **************  use effect start  ****************** */
  useEffect(() => {
    /* 准备数据 */
    const init = async () => {
      try {
        const result = await prepare({ projectId });
        setPrepareData(result.data); // 放蛋白列表
        const { expList } = result.data;
        setExps(expList); // 放实验列表
        setSelectedExpIds(
          expList?.map((item: any) => {
            return item.id;
          }),
        );
        getIrtData({
          selectedExpIds: expList?.map((item: any) => {
            return item.id;
          }),
          exps: expList,
        });

        setLoading(false);
        const rationData = await getPeptideRatio({ projectId });
        setPeptideRatioData(rationData);
        return true;
      } catch (err) {
        return false;
      }
    };
    init();
  }, []);

  useEffect(() => {
    // 根据第一个蛋白获得肽段列表
    if (prepareData) {
      onProteinChange(prepareData.proteins[0]);
      setProteinRowKey(prepareData?.proteins[0]);
    }
  }, [prepareData]);

  useEffect(() => {
    setPeptideRef(peptideList[0]?.peptideRef); // 取第一个肽段
    setPeptideRowKey(peptideList[0]?.peptideRef);
    setHandleSubmit(!handleSubmit); // 触发设置option
  }, [peptideList[0]?.peptideRef]);

  useEffect(() => {
    fetchEicDataList(false, false);
  }, [handleSubmit, gridNumberInRow]);

  useEffect(() => {
    fetchEicDataList(false, false);
  }, [smooth, denoise]);

  // 点击选择 tags
  const handleExpTagChange = (item: string, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedExpIds, item]
      : selectedExpIds.filter((t: string) => t !== item);
    setSelectedExpIds(nextSelectedTags);
  };

  /* 全选所有实验Tag */
  const selectAll = () => {
    setSelectedExpIds(
      exps?.map((item: any) => {
        return item.id;
      }),
    );
    setHandleSubmit(!handleSubmit);
  };

  /* 反选当前选择的实验Tag */
  const selectReverse = () => {
    const reverse = exps.map((item) => item.id).filter((id) => !selectedExpIds.includes(id));
    setSelectedExpIds(reverse);
    setHandleSubmit(!handleSubmit);
  };

  /* 肽段点击行选中 */
  const selectPeptideRow = (record: any) => {
    if (record !== undefined) {
      setPeptideRef(record);
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

  // Proteins Table切换所选项时触发的事件
  async function onProteinChange(value: any) {
    if (prepareData && prepareData.anaLib) {
      const result = await getPeptideRefs({
        libraryId: prepareData?.anaLib?.id,
        protein: value,
      });
      setPeptideList(result.data);
      setPeptideLoading(false);
      return true;
    }
    return false;
  }

  /* 打分结果Columns */
  let scoreColumns: any = [
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      render: (dom: any) => {
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: '鉴定态',
      dataIndex: 'status',
      key: 'status',
      render: (dom: any, entity: any) => {
        switch (entity.status) {
          case 0:
            return <Tag color="blue">尚未鉴定</Tag>;
            break;
          case 1:
            return <Tag color="success">鉴定成功</Tag>;
            break;
          case 2:
            return <Tag color="error">鉴定失败</Tag>;
            break;
          case 3:
            return <Tag color="warning">碎片不足</Tag>;
            break;
          case 4:
            return <Tag color="warning">没有峰组</Tag>;
            break;
          case 5:
            return <Tag color="warning">EIC为空</Tag>;
            break;
          default:
            return <Tag color="warning">没有峰组</Tag>;
            break;
        }
      },
    },
    {
      title: '最低总分',
      dataIndex: 'minTotalScore',
      key: 'minTotalScore',
      width: 70,
      render: (dom: any) => {
        return <Tag color="blue">{dom?.toFixed(3)}</Tag>;
      },
    },
  ];
  if (prepareData) {
    const scoreColumn = prepareData.method.score.scoreTypes.map((type: string, index: number) => ({
      title: index === 0 ? '0(总分)' : index,
      dataIndex: index,
      key: index,
      width: 70,
      render: (dom: any, entity: any) => {
        if (
          entity.selectIndex !== null &&
          entity.scoreList !== null &&
          entity.scoreList[entity.selectIndex].scores[index] !== null &&
          prepareData.overviewMap[entity.expId] != null &&
          prepareData.overviewMap[entity.expId].length > 0
        ) {
          return (
            <>
              
              {index === 0 ? <Tag color="blue">
                {entity.scoreList[entity.selectIndex].scores[index]?.toFixed(4)}
              </Tag> : (
                <Tag color="success">
                  {(prepareData.overviewMap[entity.expId][0].weights[type] * entity.scoreList[entity.selectIndex].scores[index]).toFixed(4)}
                </Tag>
              )}
            </>
          );
        }
        return null;
      },
    }));
    scoreColumns.push(scoreColumn);
  }
  scoreColumns = [].concat(...scoreColumns); // 拍平数组

  /* 蛋白table键盘事件 */
  const onProteinKey = useCallback(
    (e) => {
      if (e.keyCode === 38 && e.shiftKey) {
        if (proteinsIndex % 13 === 0) {
          setProteinPage(proteinPage - 1);
        }
        setProteinsIndex(proteinsIndex - 1);
      }
      if (e.keyCode === 40 && e.shiftKey) {
        if ((proteinsIndex + 1) % 13 === 0) {
          setProteinPage(proteinPage + 1);
        }
        setProteinsIndex(proteinsIndex + 1);
      }
    },
    [proteinsIndex],
  );

  useEffect(() => {
    if (prepareData) {
      if (proteinPage < 1 || proteinPage > Math.ceil(prepareData.proteins.length / 13)) {
        setProteinPage(1);
      }
      if (proteinsIndex < 0 || proteinsIndex >= prepareData.proteins.length) {
        setProteinsIndex(0);
        setProteinPage(1);
      } else {
        onProteinChange(prepareData?.proteins[proteinsIndex]);
        setProteinRowKey(prepareData?.proteins[proteinsIndex]);
        setPeptideLoading(true);
        setChartsLoading(true);
      }
      document.addEventListener('keydown', onProteinKey);
      return () => {
        document.removeEventListener('keydown', onProteinKey);
      };
    }
    return () => {};
  }, [onProteinKey]);

  /* 肽段table键盘事件 */
  const onPeptideKey = useCallback(
    (e) => {
      if (e.keyCode === 38) {
        if (peptidesIndex % 9 === 0) {
          setPeptidePage(peptidePage - 1);
        }
        setPeptidesIndex(peptidesIndex - 1);
      }
      if (e.keyCode === 40) {
        if ((peptidesIndex + 1) % 9 === 0) {
          setPeptidePage(peptidePage + 1);
        }
        setPeptidesIndex(peptidesIndex + 1);
      }
    },
    [peptidesIndex],
  );

  useEffect(() => {
    const peptideArr = peptideList.map((item) => {
      return item.peptideRef;
    });
    if (peptidePage < 1 || peptidePage > Math.ceil(peptideArr.length / 9)) {
      setPeptidePage(1);
    }
    if (peptidesIndex < 0 || peptidesIndex >= peptideArr.length) {
      setPeptidesIndex(0);
      setPeptidePage(1);
    } else {
      selectPeptideRow(peptideArr[peptidesIndex]);
      setHandleSubmit(!handleSubmit);
      setPeptideRowKey(peptideArr[peptidesIndex]);
      setChartsLoading(true);
    }

    document.addEventListener('keydown', onPeptideKey);
    return () => {
      document.removeEventListener('keydown', onPeptideKey);
    };
    return () => {};
  }, [onPeptideKey]);

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
    filterIcon: () => <SearchOutlined style={{ color: '#1890ff', fontSize: '14px' }} />,
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

  /* 点击坐标点展示光谱图 */
  // echarts?.getEchartsInstance().off('click'); // 防止多次触发
  // echarts?.getEchartsInstance().on('click', (params: any) => {
  //   spectraFn({
  //     expId: selectedExpIds[Math.floor((params.seriesIndex + 1) / selectedExpIds.length)],
  //     mz: peptideList.find((item) => item.peptideRef === peptideRef).mz,
  //     rt: params.data[0],
  //   });
  // });

  return (
    <PageContainer
      header={{
        onBack: () => window.history.back(),
        title: '蛋白诊所',
        tags: <Tag>{prepareData?.project?.name}</Tag>,
        extra: (
          <Space>
            <Button type="primary" htmlType="submit" onClick={() => fetchEicDataList(true, false)}>
              自身肽段预测
            </Button>
            <Button type="primary" htmlType="submit" onClick={() => fetchEicDataList(true, true)}>
              异电肽段预测
            </Button>
          </Space>
        ),
      }}
    >
      <ProCard style={{ padding: '0 18px' }}>
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
                  toolBarRender={false}
                  tableAlertRender={false}
                  rowClassName={(record) => {
                    return record.key === proteinRowKey ? 'clinicTableBgc' : '';
                  }}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        setPeptideLoading(true);
                        setProteinRowKey(record.key);
                        onProteinChange(record.protein);
                        if (prepareData) {
                          setProteinsIndex(prepareData.proteins.indexOf(record.protein));
                        }
                      },
                    };
                  }}
                  onChange={(page) => {
                    if (page.current) {
                      setProteinPage(page.current);
                    }
                  }}
                  loading={loading}
                  pagination={{
                    current: proteinPage,
                    size: 'small',
                    showSizeChanger: false,
                    showQuickJumper: false,
                    pageSize: 13,
                    showTotal: () => null,
                    position: ['bottomRight'],
                  }}
                />
              </Col>
              <Col span={24}>
                <ProTable
                  columns={peptideColumn}
                  dataSource={peptideList?.map((item) => {
                    return {
                      key: item.peptideRef,
                      peptide: item.peptideRef,
                      isUnique: item.isUnique,
                      mz: item.mz,
                    };
                  })}
                  size="small"
                  search={false}
                  scroll={{ x: 'max-content' }}
                  toolBarRender={false}
                  tableAlertRender={false}
                  loading={peptideLoading}
                  tableClassName="peptideTable"
                  rowClassName={(record: any) => {
                    return record.key === peptideRowKey ? 'clinicTableBgc' : '';
                  }}
                  pagination={{
                    hideOnSinglePage: true,
                    current: peptidePage,
                    size: 'small',
                    showSizeChanger: false,
                    showQuickJumper: false,
                    pageSize: 9,
                    showTotal: () => null,
                    position: ['bottomRight'],
                  }}
                  onChange={(page) => {
                    if (page.current) {
                      setPeptidePage(page.current);
                    }
                  }}
                  onRow={(record: any) => {
                    return {
                      onClick: () => {
                        setPeptideRowKey(record.key);
                        selectPeptideRow(record.peptide);
                        setHandleSubmit(!handleSubmit);
                        setChartsLoading(true);
                        const peptideArr = peptideList.map((item) => {
                          return item.peptideRef;
                        });
                        setPeptidesIndex(peptideArr.indexOf(record.peptide));
                      },
                    };
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={20}>
            <Tabs
              size="small"
              defaultActiveKey="1"
              destroyInactiveTabPane={true}
              onChange={(activeKey) => {
                setCurrentTab(activeKey);
              }}
            >
              <TabPane tab="EIC列表" key="1">
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
                  <Col span={24}>
                    <Button style={{ marginRight: 5 }} size="small" onClick={() => selectAll()}>
                      全选
                    </Button>
                    <Button style={{ marginRight: 5 }} size="small" onClick={selectReverse}>
                      反选
                    </Button>
                    {exps.length > 0 &&
                      exps?.map((item: IdNameAlias) => (
                        <Badge
                          style={{ marginTop: 5 }}
                          size="small"
                          count={prepareData?.overviewMap[item.id]?.length}
                          offset={[-5, 0]}
                          key={item.id}
                        >
                          <Tooltip style={{ marginTop: 5 }} title={item.name}>
                            <CheckableTag
                              style={{ marginTop: 5, marginLeft: 5 }}
                              checked={selectedExpIds?.indexOf(item.id) > -1}
                              onChange={(checked) => {
                                handleExpTagChange(item.id, checked);
                                if (handleOption) {
                                  setHandleSubmit(!handleSubmit);
                                }
                              }}
                            >
                              {item.alias}
                            </CheckableTag>
                          </Tooltip>
                        </Badge>
                      ))}
                  </Col>
                  <Col span={24}>
                    <Spin spinning={chartsLoading}>
                      {selectedExpIds.length > 0 && handleOption !== undefined ? (
                        <ReactECharts
                          ref={(e) => {
                            setEcharts(e);
                          }}
                          option={handleOption}
                          notMerge={true}
                          lazyUpdate={false}
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
              </TabPane>
              <TabPane tab="打分结果" key="2">
                <Row>
                  <Col span={3.5}>
                    <ProTable
                      columns={[
                        {
                          title: 'Index',
                          dataIndex: 'index',
                          key: 'index',
                        },
                        {
                          title: '打分类别',
                          dataIndex: 'type',
                          key: 'type',
                        },
                      ]}
                      dataSource={prepareData?.method.score.scoreTypes.map(
                        (name: any, index: number) => {
                          return { index, type: name, key: name };
                        },
                      )}
                      rowKey={'key'}
                      size="small"
                      search={false}
                      scroll={{ x: 'max-content' }}
                      toolBarRender={false}
                      tableAlertRender={false}
                      pagination={{
                        hideOnSinglePage: true,
                        size: 'small',
                        showSizeChanger: false,
                        showQuickJumper: false,
                        pageSize: 24,
                        showTotal: () => null,
                        position: ['bottomRight'],
                      }}
                    />
                  </Col>
                  <Col span={20}>
                    <ProTable
                      style={{ width: '69vw' }}
                      columns={scoreColumns}
                      dataSource={expData}
                      rowKey={'id'}
                      size="small"
                      search={false}
                      scroll={{ x: 'max-content' }}
                      toolBarRender={false}
                      tableAlertRender={false}
                      pagination={{
                        hideOnSinglePage: true,
                        pageSize: 24,
                        size: 'small',
                      }}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="定量结果" key="3">
                <Spin spinning={!peptideRatioData}>
                  {peptideRatioData ? (
                    <QtCharts values={{ peptideRatioData }} />
                  ) : (
                    <Empty
                      description="正在加载中"
                      style={{ padding: '10px', color: '#B0B8C1' }}
                      imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
                    />
                  )}
                </Spin>
              </TabPane>
              <TabPane tab="方法参数" key="4">
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
              <TabPane tab="Irt结果" key="5">
                <IrtCharts values={irtData} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </ProCard>
      <CutInfo
        cutInfoVisible={cutInfoVisible}
        values={{ expData }}
        handleCancel={() => {
          setCutInfoVisible(false);
        }}
      />
      <Spectrum
        spectrumVisible={spectrumVisible}
        values={spectra}
        handleCancel={() => {
          setSpectrumVisible(false);
        }}
      />
    </PageContainer>
  );
};

export default TableList;
