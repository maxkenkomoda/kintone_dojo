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
   * @param {string} _query ex limit 3, order by day descなど。引数を省略しても可。
   * 本来なら引数のチェックも行いたいですが、組み合わせが膨大なので、割愛します。。。。。
   * @returns
   */
  const getNews = async (_query) => {
    const query = _query ? _query : '';
    try {
      const response = await axios.get(dojoUrl, {
        params: {
          id: 'dojo',
          query,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 指定のHTMLテーブルのbodyを作成する関数
   * @param {data} data axiosで取得したデータを想定
   */
  const createTableBody = (data) => {
    // 一度テーブルデータを削除
    newsTableBody.innerHTML = '';
    const dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      const newRow = newsTableBody.insertRow();

      // 日付の<td>作成
      createTableData(data[key].day.value, newRow, 'day');
      // カテゴリ用の<td>作成
      createTableData(
        data[key].category.value,
        newRow,
        `${data[key].label.value}`
      );

      //タイトル用の<td>作成
      createAnchorInTableData(
        data[key].content.value,
        newRow,
        data[key].url.value,
        data[key].target.value,
        'content'
      );
    });
  };

  /**
   * 引数をもとに<td></td>を作成する関数
   * @param {string} text innerTextとして使う
   * @param {HTMLElement} targetRow 指定の列
   * @param {string} className cssで使用するClass名を指定
   */
  const createTableData = (text, targetRow, className) => {
    const newCell = targetRow.insertCell();
    newCell.innerText = text;
    newCell.classList = className;
  };

  /**
   * 引数をもとに、<td><a></a></td>を作る関数
   * @param {string} text innerTextとして使う
   * @param {HTMLElement} targetRow 指定の列
   * @param {string} link URL
   * @param {string} target target=_blankなどを想定
   */
  const createAnchorInTableData = (
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
    //以下2行ハードコードな気がしますが、繰り返しを使うとさらに行数を使うので、今回はハードコードで。。
    newAnchor.setAttribute('href', link);
    newAnchor.setAttribute('target', target);

    newCell.appendChild(newAnchor);
  };

  /**
   * 引数の文字列がmaxLength以上の場合、...をつける関数
   * @param {string} text
   * @returns
   */
  const truncateSentence = (text) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  /**
   * ページが呼び込まれたら実行される
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
        createTableBody(data);
      });
    });
  }
})();
