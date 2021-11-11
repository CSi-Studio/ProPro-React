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
// import ReactECharts from 'echarts-for-react';
import {
  getExpData,
  getPeptideRatio,
  getPeptideRefs,
  getRtPairs,
  getSpectra,
  prepare,
} from './service';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import IrtCharts from './components/Irt';
import CutInfo from './components/CutInfo';
import Spectrum from './components/Spectra';
import { irtList } from '../Irt/service';
// import xic from './components/xic';
import RtPairsCharts from './components/RtPairs';
import { peptideList as getPeptideList } from '../Peptide/service';
import { Link } from 'umi';
import LFQBench from './components/LFQBench';
import OverView from './components/OverView';
import PeptideDis from './components/PeptideDis';
import { overviewList } from '../Overview/service';
import { useIntl, FormattedMessage } from 'umi';
import XicCharts from './components/xic';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;
const { Search } = Input;

/* echarts参数 */
let gridNumberInRow = 3; // 每行grid的个数
// const xName = `rt/s`; // 横坐标
// const yName = `int/s`; // 纵坐标
const gridHeight = 200; // 单张高度（单位px）
const gridPaddingHeight = 105; // 行间间隔高度（单位px）
let Height = 0;
/* 蛋白、肽段table 参数 */
const proteinPageSize = 13;
const peptidePageSize = 9;

const TableList: React.FC = (props: any) => {
  const intl = useIntl();

  const projectId = props?.location?.query?.projectId;
  const overviewIdsInt = props?.location?.query?.overviewIds;
  const [exps, setExps] = useState<IdNameAlias[]>([]); // 当前项目下所有的exp信息,包含id和name,其中name字段的规则为:当该exp.alias名称存在时使用alias,否则使用exp.name,这么设计的目的是因为alias名字比较简短,展示的时候信息密度可以更高
  const [expData, setExpData] = useState<any>([]); // 选中exp,存放的真实值为exp.id列表
  const [featureMap, setFeatureMap] = useState<any>([]); // 存放featureMap
  const [selectedExpIds, setSelectedExpIds] = useState<string[]>([]); // 选中exp,存放的真实值为exp.id列表
  const [peptideRatioData, setPeptideRatioData] = useState<any>(); // 存放分析结果的初始数据
  // const [handleOption, setHandleOption] = useState<any>(); // 存放 Echarts的option
  const [handleSubmit, setHandleSubmit] = useState<any>(false); // 点击 诊断的状态变量
  const [prepareData, setPrepareData] = useState<PrepareData>(); // 进入蛋白诊所的时候初始化的数据,包含实验列表,蛋白质列表
  const [peptideList, setPeptideList] = useState<Peptide[]>([]); // 肽段的Table行
  const [onlyDefault, setOnlyDefault] = useState<boolean>(true); // 默认overview
  const [smooth, setSmooth] = useState<boolean>(false); // 默认不进行smooth计算
  const [denoise, setDenoise] = useState<boolean>(false); // 默认不进行降噪计算
  const [peptideRef, setPeptideRef] = useState<any>(''); // 默认选中的peptideRef
  const [peptideSel, setPeptideSel] = useState<any>(); // 当前选中的peptideRef
  const [lfqStatus, setLfqStatus] = useState<any>(false); // 是否点击lfqStatus
  const [loading, setLoading] = useState<boolean>(false); // 蛋白table loading
  const [peptideLoading, setPeptideLoading] = useState<boolean>(false); // 肽段table loading
  const [chartsLoading, setChartsLoading] = useState<boolean>(false); // charts loading
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
  /* CutInfo弹窗 */
  const [cutInfoVisible, setCutInfoVisible] = useState<boolean>(false);
  /* 光谱图弹窗 */
  const [spectrumVisible, setSpectrumVisible] = useState<boolean>(false);
  const [spectra, setSpectra] = useState<any>();
  /* RtPairs */
  const [rtPairs, setRtPairs] = useState<any>();
  /* 获取echarts实例，使用其Api */
  // const [echarts, setEcharts] = useState<any>();
  /* 控制tabs */
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');
  const [peptideName, setPeptideName] = useState<string>(); // 根据肽段查找蛋白
  const [xicChart, setXicChart] = useState<any>(); // XIC图

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
      title: <FormattedMessage id="menu.peptide" />,
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
    setXicChart('');
    let selectedOverviewIds = [];
    if (!overviewIdsInt) {
      selectedOverviewIds = []
        .concat(
          ...selectedExpIds?.map((expId) => {
            return prepareData?.overviewMap[expId];
          }),
        )
        .map((item: any) => {
          return item?.id;
        });
    }

    if (!peptideRef) {
      // message.warn('请选择一个PeptideRef');
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
        smooth,
        denoise,
        overviewIds: overviewIdsInt ? overviewIdsInt?.split(',') : selectedOverviewIds,
      });

      // project对应的ov列表
      const expValues = await overviewList({
        projectId,
      });

      // 将实验 别名 给 getExpData接口得到的数据
      result.data.forEach((item: any) => {
        exps?.forEach((_item: any) => {
          if (item.expId === _item.id) {
            item.alias = _item.alias;
          }
        });
        expValues?.data?.forEach((_item: any) => {
          if (item.expId === _item.expId) {
            item.name = _item.expName;
          }
        });
      });
      result.data.sort((a: any, b: any) => a.alias.charCodeAt(0) - b.alias.charCodeAt(0));

      setExpData(result.data);
      setFeatureMap(result.featureMap.intensityMap);
      /* 碎片Mz echarts toolbox */
      // const getCutInfo = () => {
      //   setCutInfoVisible(true);
      // };

      /* 展示碎片光谱图 */
      const spectraFn = async (item: any) => {
        const messageSpec = intl.formatMessage({
          id: 'message.getSpectra',
          defaultMessage: '正在获取光谱图',
        });
        const hide = message.loading(messageSpec);
        try {
          const data = await getSpectra({
            expId: selectedExpIds[Math.floor(item[0].seriesIndex / selectedExpIds.length)],
            mz: peptideList.find((_item: any) => _item.peptideRef === peptideRef)?.mz,
            rt: item[0].axisValue,
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

      /* 碎片信息 */
      const allCutInfo: any = [];
      const allCutMz: any = {};
      result.data.forEach((item: any) => {
        Object.keys(item.cutInfoMap).forEach((key: any) => {
          allCutMz[key] = item.cutInfoMap[key];
          allCutInfo.push(key);
        });
      });
      const intensityValue: any = [];
      Object.keys(result.featureMap.intensityMap).forEach((key: any) => {
        intensityValue.push({ name: key, data: result.featureMap.intensityMap[key] });
      });

      intensityValue.sort((a: { data: number }, b: { data: number }) =>
        b.data === a.data ? 0 : a.data < b.data ? 1 : -1,
      );

      // /* 获取option */
      // const option = xic({
      //   result: result.data.sort((a: any, b: any) => b.alias - a.alias),
      //   spectraFn,
      // });
      gridNumberInRow = selectedExpIds.length > 2 ? 3 : 2;
      Height =
        Math.ceil(result.data.length / gridNumberInRow) * (gridHeight + gridPaddingHeight) + 50;
      const charts = (
        <XicCharts
          values={{
            result: result.data.sort((a: any, b: any) => b.alias - a.alias),
            spectraFn,
            gridNumberInRow,
            intensityValue,
          }}
        />
      );
      setXicChart(charts);

      // setHandleOption(option);
      setLoading(false);
      setChartsLoading(false);
      setPeptideLoading(false);
      return true;
    } catch (error) {
      const messageFailSpec = intl.formatMessage({
        id: 'message.getEICFail',
        defaultMessage: '获取EIC Matrix失败，请重试！',
      });
      message.error(messageFailSpec);
      setLoading(false);
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

  /* **************  RtPairs result  ****************** */
  const rtPairsData = async (values: {
    projectId: string;
    onlyDefault: boolean;
    expIds: string[];
  }) => {
    try {
      const result = await getRtPairs({
        projectId: values.projectId,
        onlyDefault: values.onlyDefault,
        expIds: values.expIds,
      });
      setRtPairs(result);
      return true;
    } catch (error) {
      return false;
    }
  };

  /** **************  use effect start  ****************** */
  useEffect(() => {
    /* 准备数据 */
    const init = async () => {
      fetchEicDataList(false, false);

      if (overviewIdsInt) {
        setSelectedExpIds(overviewIdsInt?.split(','));
      }
      try {
        const result = await prepare({ projectId });
        setPrepareData(result.data); // 放蛋白列表
        const { expList } = result.data;
        setExps(expList); // 放实验列表

        if (!overviewIdsInt) {
          setSelectedExpIds(
            expList?.map((item: any) => {
              return item.id;
            }),
          );
        }
        getIrtData({
          selectedExpIds: expList?.map((item: any) => {
            return item.id;
          }),
          exps: expList,
        });
        setLoading(false);
        if (result.data?.project?.name.substring(0, 3) === 'HYE') {
          const rationData = await getPeptideRatio({ projectId });
          setPeptideRatioData(rationData);
        }
        rtPairsData({
          projectId,
          onlyDefault: true,
          expIds: expList?.map((item: any) => {
            return item.id;
          }),
        });
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
      onProteinChange(prepareData?.proteins[0]);
      setProteinRowKey(prepareData?.proteins[0]);
    }
  }, [prepareData]);

  // 每次蛋白发生变化，都取第一个肽段作为展示
  useEffect(() => {
    if (!lfqStatus && !peptideName) {
      setPeptideRef(peptideList[0]?.peptideRef); // 取第一个肽段
      setPeptideRowKey(peptideList[0]?.peptideRef);
      setHandleSubmit(!handleSubmit); // 触发设置option
      console.log('111');
    }
  }, [peptideList]);

  useEffect(() => {
    setPeptideRef(peptideSel);
    setPeptideRowKey(peptideSel);
    setHandleSubmit(!handleSubmit);
  }, [peptideSel]);

  useEffect(() => {
    fetchEicDataList(false, false);
  }, [handleSubmit]);

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
    if (overviewIdsInt) {
      setSelectedExpIds(overviewIdsInt?.split(','));
    } else {
      setSelectedExpIds(
        exps?.map((item: any) => {
          return item.id;
        }),
      );
    }
    setHandleSubmit(!handleSubmit);
  };

  /* 反选当前选择的实验Tag */
  const selectReverse = () => {
    if (overviewIdsInt) {
      const reverse = overviewIdsInt
        ?.split(',')
        .map((item: string) => item)
        .filter((_item: string) => !selectedExpIds.includes(_item));
      setSelectedExpIds(reverse);
    } else {
      const reverse = exps.map((item) => item.id).filter((id) => !selectedExpIds.includes(id));
      setSelectedExpIds(reverse);
    }
    setHandleSubmit(!handleSubmit);
  };

  /* 肽段点击行选中 */
  const selectPeptideRow = (record: any) => {
    if (record !== undefined) {
      setPeptideRef(record);
    }
  };

  /* table 搜索 */
  const handleSearch = (selectedKeys: any, confirm?: () => void, dataIndex?: string) => {
    if (confirm) {
      confirm();
    }
    setSearchText(selectedKeys);
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
      return result.data;
    }
    return false;
  }

  /* 蛋白table键盘事件 */
  const onProteinKey = useCallback(
    (e) => {
      if (loading === true) {
        if (e.keyCode === 38 && e.shiftKey) {
          if (proteinsIndex % proteinPageSize === 0) {
            setProteinPage(proteinPage - 1);
          }
          setProteinsIndex(proteinsIndex - 1);
        }
        if (e.keyCode === 40 && e.shiftKey) {
          if ((proteinsIndex + 1) % proteinPageSize === 0) {
            setProteinPage(proteinPage + 1);
          }
          setProteinsIndex(proteinsIndex + 1);
        }
      }
    },
    [proteinsIndex],
  );

  useEffect(() => {
    setLfqStatus(false);
    setLoading(true);
    setPeptideLoading(true);
    if (prepareData) {
      if (
        proteinPage < 1 ||
        proteinPage > Math.ceil(prepareData.proteins.length / proteinPageSize)
      ) {
        setProteinPage(1);
      }
      if (proteinsIndex < 0 || proteinsIndex >= prepareData.proteins.length) {
        setProteinsIndex(0);
        setProteinPage(1);
      } else {
        onProteinChange(prepareData?.proteins[proteinsIndex]);
        setProteinRowKey(prepareData?.proteins[proteinsIndex]);
      }
    }

    document.addEventListener('keydown', onProteinKey);
    return () => {
      document.removeEventListener('keydown', onProteinKey);
    };
  }, [onProteinKey]);

  /* 肽段table键盘事件 */
  const onPeptideKey = useCallback(
    (e) => {
      if (e.keyCode === 38 && !e.shiftKey) {
        if (peptidesIndex % peptidePageSize === 0) {
          setPeptidePage(peptidePage - 1);
        }
        setPeptidesIndex(peptidesIndex - 1);
      }
      if (e.keyCode === 40 && !e.shiftKey) {
        if ((peptidesIndex + 1) % peptidePageSize === 0) {
          setPeptidePage(peptidePage + 1);
        }
        setPeptidesIndex(peptidesIndex + 1);
      }
    },
    [peptidesIndex],
  );

  useEffect(() => {
    setLfqStatus(false);
    const peptideArr = peptideList.map((item) => {
      return item.peptideRef;
    });
    if (peptidePage < 1 || peptidePage > Math.ceil(peptideArr.length / peptidePageSize)) {
      setPeptidePage(1);
    }
    if (peptidesIndex < 0 || peptidesIndex >= peptideArr.length) {
      setPeptidesIndex(0);
      setPeptidePage(1);
    } else {
      setPeptideLoading(true);
      setChartsLoading(true);
      selectPeptideRow(peptideArr[peptidesIndex]);
      setHandleSubmit(!handleSubmit);
      setPeptideRowKey(peptideArr[peptidesIndex]);
    }
    document.addEventListener('keydown', onPeptideKey);
    return () => {
      document.removeEventListener('keydown', onPeptideKey);
    };
  }, [onPeptideKey]);

  let searchInput: any;
  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={intl.formatMessage({
            id: 'table.searchPeptides',
            defaultMessage: '搜索肽段',
          })}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys[0], confirm, dataIndex);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              handleSearch(selectedKeys[0], confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            <FormattedMessage id="table.searchBtn" />
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            <FormattedMessage id="table.resetBtn" />
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
        <FormattedMessage id="table.noData" />
      ),
  });

  /* 点击LFQBench里的点切换EIC图 */
  const LFQClick = async (protein: string, peptide: string) => {
    if (protein) {
      setLfqStatus(true);
      // 切换蛋白和肽段
      setProteinRowKey(protein);
      const peptideResult = await onProteinChange(protein);
      setPeptideSel(peptide);
      setTabActiveKey('1');

      /* 设置table 页码 */
      prepareData?.proteins.forEach((item, index) => {
        if (item === protein) {
          setProteinPage(Math.ceil((index + 1) / proteinPageSize));
        }
      });
      const peptideArr = peptideResult.map((item: { peptideRef: any }) => {
        return item.peptideRef;
      });
      setPeptidePage(Math.ceil((peptideArr.indexOf(peptide) + 1) / peptidePageSize));
    }
  };

  /* 碎片信息 */
  const allCutInfo: any = [];
  const allCutMz: any = {};
  expData.forEach((item: any) => {
    Object.keys(item.cutInfoMap).forEach((key: any) => {
      allCutMz[key] = item.cutInfoMap[key];
      allCutInfo.push(key);
    });
  });
  const intensityData: any = [];
  Object.keys(featureMap).forEach((key: any) => {
    intensityData.push({ name: key, data: featureMap[key] });
  });

  intensityData.sort((a: { data: number }, b: { data: number }) =>
    b.data === a.data ? 0 : a.data < b.data ? 1 : -1,
  );

  /* 根据肽段搜索蛋白 */
  const onSearch = async (value: any) => {
    setPeptideName(value);
    setXicChart('');
    if (prepareData) {
      const messageFail = intl.formatMessage({
        id: 'message.noCorrespondProtein',
        defaultMessage: '未找到相应蛋白，请检查输入是否正确！',
      });
      const msg = await getPeptideList({ libraryId: prepareData.anaLib.id, peptideRef: value });
      if (msg.data.length > 0) {
        const peptideRes = await onProteinChange(msg?.data[0]?.proteins[0]);
        if (msg?.data[0]?.proteins[0]) {
          await onProteinChange(msg?.data[0]?.proteins[0]); //table选择搜索蛋白
          setProteinRowKey(msg?.data[0]?.proteins[0]); //table选中搜索蛋白行
          setProteinPage(
            Math.ceil(prepareData.proteins.indexOf(msg?.data[0]?.proteins[0]) / proteinPageSize),
          ); //跳转到搜索蛋白所在的页
          const peptideArr = peptideRes.map((item: { peptideRef: any }) => {
            return item.peptideRef;
          }); //当前蛋白的所有肽段
          setPeptideRowKey(value); //table选择搜索肽段
          selectPeptideRow(value); //table选中搜索肽段行
          setPeptidePage(Math.ceil(peptideArr.indexOf(value) / peptidePageSize)); //跳转到搜索肽段所在的页
          setPeptidesIndex(peptideArr.indexOf(value));
          setProteinsIndex(prepareData.proteins.indexOf(msg?.data[0]?.proteins[0]));
          return true;
        } else {
          message.warn(messageFail);
          return false;
        }
      } else {
        message.warn(messageFail);
        return false;
      }
    }
    return false;
  };

  return (
    <PageContainer
      header={{
        title: <FormattedMessage id="menu.proteinClinic" />,
        tags: (
          <Link
            target="_blank"
            to={{
              pathname: '/',
            }}
          >
            <Tag>{prepareData?.project?.name}</Tag>
          </Link>
        ),
        extra: (
          <Space>
            <Search
              placeholder={intl.formatMessage({
                id: 'table.inputSearchPeptides',
                defaultMessage: '请输入要搜索的肽段',
              })}
              allowClear
              onSearch={onSearch}
              style={{ width: 300 }}
            />

            <Button type="primary" htmlType="submit" onClick={() => fetchEicDataList(true, false)}>
              <FormattedMessage id="table.selfPeptidePredict" />
            </Button>
            <Button type="primary" htmlType="submit" onClick={() => fetchEicDataList(true, true)}>
              <FormattedMessage id="table.diffPeptidePredict" />
            </Button>
          </Space>
        ),
      }}
    >
      <ProCard style={{ padding: '0 18px', minHeight: '1000px' }}>
        <Row>
          <Col span={4}>
            <Row>
              <Col span={24}>
                <ProTable
                  columns={[
                    {
                      title: <FormattedMessage id="menu.protein" />,
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
                        setLfqStatus(false);
                        setLoading(true);
                        setPeptideLoading(true);
                        setProteinRowKey(record.key);
                        // onProteinChange(record.protein);
                        if (prepareData) {
                          setProteinsIndex(prepareData.proteins.indexOf(record.protein));
                        }
                        setXicChart('');
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
                    showQuickJumper: true,
                    pageSize: proteinPageSize,
                    showTotal: () => null,
                    position: ['bottomRight'],
                  }}
                />
              </Col>
              <Col span={24}>
                <ProTable
                  scroll={{ x: 'max-content' }}
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
                  toolBarRender={false}
                  tableAlertRender={false}
                  loading={peptideLoading}
                  tableClassName="peptideTable"
                  pagination={{
                    hideOnSinglePage: true,
                    current: peptidePage,
                    size: 'small',
                    showSizeChanger: false,
                    showQuickJumper: false,
                    pageSize: peptidePageSize,
                    showTotal: () => null,
                    position: ['bottomRight'],
                  }}
                  onChange={(page) => {
                    if (page.current) {
                      setPeptidePage(page.current);
                    }
                  }}
                  rowClassName={(record: any) => {
                    return record.key === peptideRowKey ? 'clinicTableBgc' : '';
                  }}
                  onRow={(record: any) => {
                    return {
                      onClick: () => {
                        setLfqStatus(false);
                        setPeptideLoading(true);
                        setChartsLoading(true);
                        setPeptideRowKey(record.peptide);
                        selectPeptideRow(record.peptide);
                        // setHandleSubmit(!handleSubmit);
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
              activeKey={tabActiveKey}
              destroyInactiveTabPane={true}
              onTabClick={(key) => {
                setTabActiveKey(key);
              }}
            >
              <TabPane
                tab={intl.formatMessage({
                  id: 'table.EICList',
                  defaultMessage: 'EIC列表',
                })}
                key="1"
              >
                <Row>
                  <Col span={24}>
                    <span>
                      {expData.length > 0 ? (
                        <>
                          <strong>Protein: </strong>
                          <span style={{ userSelect: 'all' }}>{expData[0].proteins[0]}</span>
                          &nbsp;&nbsp;
                          <strong>Peptide</strong>:{' '}
                          <span style={{ userSelect: 'all' }}>{expData[0].peptideRef}</span>
                          &nbsp;&nbsp;
                          <Tag>{[...new Set([].concat(...allCutInfo))].length}&nbsp; Ions</Tag>
                          <strong>Intensity: </strong>&nbsp;&nbsp;
                        </>
                      ) : (
                        ''
                      )}
                    </span>
                    <>
                      {intensityData.map((item: any) => {
                        return (
                          <Tag key={item.name.toString()}>
                            {item.name}:{item.data}
                          </Tag>
                        );
                      })}
                    </>
                  </Col>
                  <Col span={24}>
                    <Tooltip
                      title={intl.formatMessage({
                        id: 'table.defaultOverview',
                        defaultMessage: '仅选择实验默认的overview',
                      })}
                    >
                      <Checkbox
                        checked={onlyDefault}
                        onChange={(e) => {
                          setOnlyDefault(e.target.checked);
                        }}
                      >
                        <FormattedMessage id="table.justDefault" />
                      </Checkbox>
                    </Tooltip>
                    <Checkbox
                      checked={smooth}
                      onChange={(e) => {
                        setSmooth(e.target.checked);
                      }}
                    >
                      <FormattedMessage id="table.dataSmooth" />
                    </Checkbox>
                    <Checkbox
                      checked={denoise}
                      onChange={(e) => {
                        setDenoise(e.target.checked);
                      }}
                    >
                      <FormattedMessage id="table.dataNR" />
                    </Checkbox>
                  </Col>
                  <Col span={24}>
                    <Button style={{ marginRight: 5 }} size="small" onClick={() => selectAll()}>
                      <FormattedMessage id="table.allBtn" />
                    </Button>
                    <Button style={{ marginRight: 5 }} size="small" onClick={selectReverse}>
                      <FormattedMessage id="table.invBtn" />
                    </Button>
                    {overviewIdsInt
                      ? expData
                          .sort((a: any, b: any) => (a.alias > b.alias ? 1 : -1))
                          ?.map((item: any) => (
                            <Badge
                              style={{ marginTop: 5 }}
                              size="small"
                              count={1}
                              offset={[-5, 0]}
                              key={item.id}
                            >
                              <Tooltip
                                title={() => {
                                  return (
                                    <>
                                      <span>{item.name}</span>
                                      <br />
                                      <span>{item.expId}</span>
                                    </>
                                  );
                                }}
                                overlayStyle={{ maxWidth: '100%', marginTop: 5 }}
                              >
                                <CheckableTag
                                  style={{ marginTop: 5, marginLeft: 5 }}
                                  checked={selectedExpIds?.indexOf(item.id) > -1}
                                  onChange={(checked) => {
                                    handleExpTagChange(item.id, checked);
                                  }}
                                >
                                  {item.alias}
                                </CheckableTag>
                              </Tooltip>
                            </Badge>
                          ))
                      : exps.length > 0 &&
                        exps?.map((item: IdNameAlias) => (
                          <Badge
                            style={{ marginTop: 5 }}
                            size="small"
                            count={prepareData?.overviewMap[item.id]?.length}
                            offset={[-5, 0]}
                            key={item.id}
                          >
                            <Tooltip
                              title={() => {
                                return (
                                  <>
                                    <span>{item.name}</span>
                                    <br />
                                    <span>{item.id}</span>
                                  </>
                                );
                              }}
                              overlayStyle={{ maxWidth: '100%', marginTop: 5 }}
                            >
                              <CheckableTag
                                style={{ marginTop: 5, marginLeft: 5 }}
                                checked={selectedExpIds?.indexOf(item.id) > -1}
                                onChange={(checked) => {
                                  handleExpTagChange(item.id, checked);
                                  // if (handleOption) {
                                  //   setHandleSubmit(!handleSubmit);
                                  // }
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
                      {xicChart ? (
                        <>
                          {/* <ReactECharts
                            ref={(e) => {
                              setEcharts(e);
                            }}
                            option={handleOption}
                            notMerge={true}
                            lazyUpdate={false}
                            style={{ width: '100%', height: Height }}
                          /> */}
                          {xicChart}
                        </>
                      ) : (
                        <Empty
                          description="Loading..."
                          style={{ padding: '10px', color: '#B0B8C1' }}
                          imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
                        />
                      )}
                    </Spin>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={intl.formatMessage({
                  id: 'table.scoreRes',
                  defaultMessage: '打分结果',
                })}
                key="2"
              >
                <Spin spinning={!expData}>
                  {expData.length > 0 ? (
                    <OverView values={{ prepareData, expData }} />
                  ) : (
                    <Empty
                      style={{ padding: '10px', color: '#B0B8C1' }}
                      imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
                    />
                  )}
                </Spin>
              </TabPane>
              {prepareData?.project?.name.substring(0, 3) === 'HYE' ? (
                <TabPane tab="LFQBench" key="3">
                  <Spin spinning={!peptideRatioData}>
                    {peptideRatioData ? (
                      <LFQBench values={{ peptideRatioData, LFQClick }} />
                    ) : (
                      <Empty
                        description="Loading..."
                        style={{ padding: '10px', color: '#B0B8C1' }}
                        imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
                      />
                    )}
                  </Spin>
                </TabPane>
              ) : null}
              <TabPane
                tab={intl.formatMessage({
                  id: 'table.methodPara',
                  defaultMessage: '方法参数',
                })}
                key="4"
              >
                <Row>
                  <Col span={24}>
                    <Space>
                      <Tag color="blue">
                        <FormattedMessage id="table.innerLibrary" />: {prepareData?.insLib?.name}
                      </Tag>
                      <Tag color="blue">
                        <FormattedMessage id="table.standardLibrary" />: {prepareData?.anaLib?.name}
                        (<FormattedMessage id="table.peptideNum" />:{prepareData?.peptideCount}
                        &nbsp;&nbsp;
                        <FormattedMessage id="table.proteinNum" />:{prepareData?.proteinCount})
                      </Tag>
                      <Tag color="blue">{prepareData?.method?.name}</Tag>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <>
                      <FormattedMessage id="table.scoreType" />(
                      {prepareData?.method?.score?.scoreTypes?.length}):{' '}
                    </>
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
              <TabPane
                tab={intl.formatMessage({
                  id: 'table.IrtRes',
                  defaultMessage: 'iRT结果',
                })}
                key="5"
              >
                <IrtCharts values={irtData} />
              </TabPane>
              <TabPane
                tab={intl.formatMessage({
                  id: 'table.RtRes',
                  defaultMessage: 'RT结果',
                })}
                key="6"
              >
                <Spin spinning={!rtPairs}>
                  {rtPairs ? (
                    <RtPairsCharts values={{ rtPairs, expData }} />
                  ) : (
                    <Empty
                      description={intl.formatMessage({
                        id: 'table.loadRtRes',
                        defaultMessage: '正在加载中，数据较大，请耐心等待',
                      })}
                      style={{ padding: '10px', color: '#B0B8C1' }}
                      imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
                    />
                  )}
                </Spin>
              </TabPane>
              <TabPane
                tab={intl.formatMessage({
                  id: 'table.peptideDis',
                  defaultMessage: '肽段分布',
                })}
                key="7"
              >
                <Spin spinning={!expData}>
                  {expData !== undefined ? (
                    <PeptideDis values={{ prepareData, expData }} />
                  ) : (
                    <Empty
                      style={{ padding: '10px', color: '#B0B8C1' }}
                      imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
                    />
                  )}
                </Spin>
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
