// import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = 'ProPro Analyze Platform Developed by CSi Studio';

  // return <DefaultFooter copyright={`2021 ${defaultMessage}`} />;
  return (
    <div style={{ textAlign: 'center', color: '#666', width: '100%', margin: '6px 0' }}>
      2021 © {defaultMessage}
    </div>
  );
};
