import os from 'os';
import flatMap from 'flatmap';

function getIpAddresses() {
  const networkInterfaces = os.networkInterfaces();
  return flatMap(Object.keys(networkInterfaces), (interfaceName, alias) => {
    return networkInterfaces[interfaceName].map(networkInterface => {
      if(networkInterface.family !== 'IPV4' || networkInterface.internal !== false) return null;

      const result = {};
      if(alias >= 1) {
        result[`${interfaceName}:${alias}`] = networkInterface.address;
      }
      else {
        result[interfaceName] = networkInterface.address;
      }
      return result;
    }).reduce((arr, item) => {
      if(item !== null) arr.push(item);
      return arr;
    }, []);
  });
}

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function isNotBlank(str) {
  return !isBlank(str);
}

const Utils = { getIpAddresses, isBlank, isNotBlank };
export default Utils;