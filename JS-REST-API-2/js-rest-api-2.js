(() => {
  'use strict';
  const kintoneEvents = [
    'app.record.create.submit',
    'app.record.edit.submit',
  ];

  kintone.events.on(kintoneEvents, (event) => {
    const uniqueCtrlName = event.record.重複禁止項目.value;
    const query =
      event.type === 'app.record.create.submit'
        ? `重複禁止項目 = "${uniqueCtrlName}"`
        : // レコード編集の場合、検索結果から自分のレコードは外す(Userが何も編集せず、保存ボタン押した場合は保存させたいため)
          `重複禁止項目 = "${uniqueCtrlName}" and $id != ${event.record.$id.value}`;

    const params = {
      app: 20,
      query,
      totalCount: true,
    };

    return kintone
      .api(kintone.api.url('/k/v1/records.json', true), 'GET', params)
      .then((response) => {
        const recordCount = Number(response.totalCount);

        // 検索した結果、一致するものがなかった場合
        if (recordCount === 0) {
          return event;
        }

        // それ以外の場合
        const isUserContinue = confirm(
          `${uniqueCtrlName}はレコードが重複しています。このまま保存しますか？`
        );

        // ダイアログの結果から保存するかエラー出すかの処理
        if (isUserContinue) {
          return event;
        } else {
          window.alert('保存中止しました');
          return false;
        }
      })
      .catch((error) => {
        console.error(error);
        return event;
      });
  });
})();
