import moment from "moment";

export const format = datatime => {
  return moment(datatime).format('YYYY-MM-DD HH:mm:ss')
}

export const formatNoYear = datatime => {
  return moment(datatime).format('MM-DD HH:mm:ss')
}
