// 大数据量性能测试

interface Log {
  id: number;
  timestamp: string;
  level: string;
  message: string;
}

let groupCount = 0;

function createRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789      ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const logLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

  const groupStart = '::group::this is a group';
  const groupEnd = '::endgroup::';

  const isGroupStart = Math.random() < 0.1;
  const isGroupEnd = !isGroupStart && Math.random() < 0.1;

  if(isGroupStart && groupCount < 6) {
    groupCount++;
    return groupStart;
  }
  if(isGroupEnd) return groupEnd;

  return `[${logLevels[parseInt(`${Math.random() * 4}`)]}] ${result}`;
}

function generateLogs(count: number) {
  return Array(count)
    .fill('')
    .map((item, index) => {
      if(index === 9000) return 'this is test';
      return createRandomString(parseInt(`${Math.random() * 300}`))
    });
}

console.time('MOCK_BIG_DATA');

const logData = generateLogs(100000);

console.timeEnd('MOCK_BIG_DATA');

console.log('logData size:', parseInt(`${JSON.stringify(logData).length / 1024 / 1024}`) + 'M');

export default logData;
