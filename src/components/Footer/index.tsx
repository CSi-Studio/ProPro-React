import { useIntl } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'ProPro Server Developed by CSi Studio',
  });

  return <DefaultFooter copyright={`2021 ${defaultMessage}`} />;
};
