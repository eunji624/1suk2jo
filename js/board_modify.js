import { collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

import { db } from './firebase.js';

//데이터 가져와주기
let docs = await getDocs(collection(db, 'board'));

//주소 끝에 num값 가져오기
let que = window.location.search.substr(11);
console.log(que);

// 게시글 DB불러와서 붙여주기
docs.forEach((eachDoc) => {
  let row = eachDoc.data();
  let writeTitle = decodeURIComponent(row['writeTitle']);
  let writeName = decodeURIComponent(row['writeName']);
  let when = row['when'];
  let writeText = row['writeText'];
  let num = row['num'];
  let ID = eachDoc.id;
  let which;
  // console.log(writeTitle, writeText, writeName, when)
  console.log('row=> ', row);
  console.log('num =>', num);
  console.log('que =>', que);
  if (num === que) {
    console.log('같아');
    $('.inputContainer').empty();
    const append_html = `
      <div class="inputValue">
        <div class="title">
        <textarea id="writeTitle" name="content" class="writeTextArea input" placeholder="제목을 적어주세요">${writeTitle}</textarea>
        </div>
        <div class = 'name'>
          <input 
            id = 'writeName'  
            class="input" 
            type="text" 
            name="writer" 
            placeholder="10글자 이내로 닉네임 적어주세요" 
            maxlength="10" 
            value = ${writeName}
          />
        </div>
        <div class="text">
          <textarea
            id="writeText"
            name="content"
            class="writeTextArea"
            placeholder="내용!! 하고싶은 말을 적어주세요"
          >${writeText}</textarea>
        </div>
      </div>
      <input 
        class="input" 
        type="submit" 
        value="저장하기" 
        id="submit" />
      <div class="blank"></div>`;
    $('.inputContainer').append(append_html);

    //저장하기 버튼 누르면 데이터 베이스에 있는 내용 수정하기.
    $('#writeFrm').submit(async function (e) {
      e.preventDefault();

      let writeTitle = $('#writeTitle').val().trim();
      let writeText = $('#writeText').val().trim();
      let writeName = $('#writeName').val().trim();
      let dataDocs = {
        writeTitle: writeTitle,
        writeText: writeText,
        writeName: writeName,
      };

      let data = doc(db, 'board', ID);
      await updateDoc(data, dataDocs);
      console.log(data);
      alert('수정 완료');

      window.location.href = `board_view.html?ID=" +${que}`;
    });
  }
});
