// 今回はHTMLファイルに<script>タグでaxiosのライブラリ参照を埋め込んでいるので、
// const axios = require('axios');と変数定義していないくても使える。
(() => {
  'use strict';

  // 変数の定義
  const dojoUrl =
    'https://54o76ppvn8.execute-api.ap-northeast-1.amazonaws.com/prod/bb-dojo';

  const newsTableBody = document.getElementById('news-table-body');
  const options = document.getElementsByClassName('option');
  const maxLength = 30;

  /**
   *
   * @param {string} _query ex limit 3, order by day descなど
   * 本来なら引数のチェックも行いたいですが、組み合わせが膨大なので、割愛します。。。。。
   * @returns
   */
  const getNews = async (_query) => {
    const query = _query ? _query : '';
    try {
      const response = await axios.get(dojoUrl, {
        params: {
          id: 'dojo',
          query: query,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *
   * @param {data} data axiosで取得したデータを想定
   */
  const createTableBody = (data) => {
    const dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      const newRow = newsTableBody.insertRow();
      newRow.id = key;

      // 日付セル作成
      createTableElement(data[key].day.value, newRow, 'day');
      // カテゴリセル作成
      createTableElement(
        data[key].category.value,
        newRow,
        `${data[key].label.value}`
      );

      //コンテンツセル作成
      createTableAnchorElement(
        data[key].content.value,
        newRow,
        data[key].url.value,
        data[key].target.value,
        'content'
      );
    });
  };

  /**
   *
   * @param {string} text innerTextとして使う
   * @param {HTML Element} targetRow 指定の列
   * @param {string} className cssで使用するため
   */
  const createTableElement = (text, targetRow, className) => {
    const newCell = targetRow.insertCell();
    newCell.innerText = text;
    newCell.classList = className;
  };

  /**
   *
   * @param {string} text innerTextとして使う
   * @param {HTML Element} targetRow 指定の列
   * @param {string} link URL
   * @param {string} target target=_blankなどを想定
   */
  const createTableAnchorElement = (
    text,
    targetRow,
    link,
    target,
    className
  ) => {
    const newCell = targetRow.insertCell();
    newCell.classList = className;
    const newAnchor = document.createElement('a');
    newAnchor.innerText = truncateSentence(text);
    newAnchor.setAttribute('href', link);
    newAnchor.setAttribute('target', target);
    newCell.appendChild(newAnchor);
  };

  const truncateSentence = (text) => {
    return text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
  };

  /**
   * ページが呼び込まれたら実行されるやつ
   */
  getNews('order by day desc').then((data) => {
    createTableBody(data);
  });

  /**
   * オプションが変更されたら、オプションの値から新たにqueryを作成し、テーブル更新する
   */
  for (const option of options) {
    option.addEventListener('change', () => {
      const query = `${options[1].value} ${options[0].value}`;

      getNews(query).then((data) => {
        //一度テーブルを削除
        newsTableBody.innerHTML = '';
        createTableBody(data);
      });
    });
  }
})();
