import { tip } from '../tip'
class Message {

  error = (info) => {
    return new Promise((resolve) => {
      //alert("错误：" + info);
      tip.error(info);
      resolve();
    });
  };

  success = (info) => {
    return new Promise((resolve) => {
      tip.suceess(info);
      resolve();
    });
  };

  confirm = ({ title, content }) => {
    return new Promise((resolve, reject) => {

        if(confirm(content)){
            resolve();
        }else{
            reject();
        }
      
    });
  };
}


export default new Message();