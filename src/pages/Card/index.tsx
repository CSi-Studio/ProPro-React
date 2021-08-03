import { useState } from 'react';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

const { Statistic } = StatisticCard;

export default () => {
  const [responsive, setResponsive] = useState(false);

  return (
    <PageContainer>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <ProCard split={responsive ? 'horizontal' : 'vertical'}>
          <StatisticCard
            colSpan={responsive ? 24 : 6}
            title="肽段"
            statistic={{
              value: 82.6,
              suffix: '亿',
              description: <Statistic title="日同比" value="6.47%" trend="up" />,
            }}
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/PmKfn4qvD/mubiaowancheng-lan.svg"
                alt="进度条"
                width="100%"
              />
            }
            footer={
              <>
                <Statistic value="70.98%" title="财年业绩完成率" layout="horizontal" />
                <Statistic value="86.98%" title="去年同期业绩完成率" layout="horizontal" />
                <Statistic value="88.98%" title="前年同期业绩完成率" layout="horizontal" />
              </>
            }
          />
        </ProCard>
      </RcResizeObserver>
    </PageContainer>
  );
};
