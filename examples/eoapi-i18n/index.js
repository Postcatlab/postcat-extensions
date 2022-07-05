export const exportFunc = (data = {}) => {
  console.log(eo.i18n.localize('export-id','I am origin text'))
  
  //localize(id:string,originText:string,...args)
  console.log(eo.i18n.localize('now-lanuage','Now lanuage is: {0}',eo.i18n.getSystemLanguage()))
  
  //id can be ignore in default localize i18n json
  console.log(eo.i18n.localize('multiple-variable','Replace multiple variable: {0} {1}',0,'1'))
  return {
    name: 'eoapi',
  };
};
