import component from './en-US/component';
import menu from './en-US/menu';
import pages from './en-US/pages';
import messages from './en-US/messages';
import table from './en-US/table';
import clinic from './en-US/clinic';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'ProPro Server Developed by CSi Studio',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...menu,
  ...component,
  ...pages,
  ...messages,
  ...table,
  ...clinic,
};
