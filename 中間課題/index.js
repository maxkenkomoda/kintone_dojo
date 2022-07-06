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
      const newsData = data[key];

      newRow.innerHTML +=
      `<td class="day">
      ${truncateSentence(newsData.day.value)}
      </td>
      <td class="${newsData.label.value}">
      ${truncateSentence(newsData.category.value)}
      </td>
      <td>
      <a href="${newsData.url.value}" target="${newsData.target.value}" class="content">
      ${truncateSentence(newsData.content.value)}
      </a>
      </td>`;
    });
  };

  /**
   * 引数の文字列がmaxLength以上の場合、...をつける関数
   * @param {string} text
   * @return string text
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
