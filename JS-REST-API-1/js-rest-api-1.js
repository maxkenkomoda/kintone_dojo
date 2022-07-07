(() => {
  'use strict';

  kintone.events.on('app.record.create.show', (event) => {
    const tableRecords = event.record.Table.value;
    // レコード追加画面に取得したeventのテーブルの値の配列の先頭はなにも入ってないので、消す
    tableRecords.shift();

    const params = {
      app: kintone.app.getId()
    };

    // REST APIで取得
    return kintone
      .api(kintone.api.url('/k/v1/app/form/fields.json', true), 'GET', params)
      .then((response) => {
        const options = response.properties.Table.fields.Action5.options;

        // index順に並び替え
        const orderedOptionTitles = Object.keys(options).sort((a, b) => {
          const titleAIndex = options[a].index;
          const titleBIndex = options[b].index;
          return titleAIndex > titleBIndex ? 1 : -1;
        });

        for (const title of orderedOptionTitles) {
          const tableData = {
            value: {
              Action5: {
                type: 'DROP_DOWN',
                value: title,
              },
              課題: { type: 'MULTI_LINE_TEXT', value: '' },
              状況: { type: 'CHECK_BOX', value: ['未振り返り'] },
            },
          };
          tableRecords.push(tableData);
        }
        return event;
      })
      .catch((error) => {
        console.error(error);
        return event;
      });
  });
})();
