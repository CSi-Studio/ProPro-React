import { message } from 'antd';

export async function handle(
  value: any,
  callback: any,
  msgOne: string,
  msgTwo: string,
  msgThree: string,
) {
  const hide = message.loading(msgOne);
  try {
    await callback({ ...value });
    hide();
    message.success(msgTwo);
    return true;
  } catch (error) {
    hide();
    message.error(msgThree);
    return false;
  }
}
