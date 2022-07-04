(() => {
  'use strict';

  const dropDownOptions = [
    'あくなき探求',
    '不屈の心体',
    '理想への共感',
    '心を動かす',
    '知識を増やす',
    '公明正大',
  ];

  kintone.events.on('app.record.create.show', (event) => {
    const tableRecords = event.record.Table.value;
    // レコード追加画面に取得したeventのテーブルの値の配列の先頭はなにも入ってないので、消す
    tableRecords.shift();

    dropDownOptions.forEach((option) => {
      const tableData = {
        value: {
          Action5: {
            type: 'DROP_DOWN',
            value: option,
          },
          課題: { type: 'MULTI_LINE_TEXT', value: '' },
          状況: { type: 'CHECK_BOX', value: ['未振り返り'] },
        },
      };

      // テーブルに追加
      tableRecords.push(tableData);
    });

    return event;
  });
})();
