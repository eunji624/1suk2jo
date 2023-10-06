import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  orderBy,
  query,
  doc,
  setDoc,
  startAt,
  endAt,
  startAfter,
  deleteDoc,
  updateDoc,
  limit,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcYRfJBHpKg9mG3EJp6urawO5OlhPHoIs",
  authDomain: "soo-test-15c67.firebaseapp.com",
  projectId: "soo-test-15c67",
  storageBucket: "soo-test-15c67.appspot.com",
  messagingSenderId: "239246841609",
  appId: "1:239246841609:web:0ade4f7652e36060eba5d8",
  measurementId: "G-7BLCRSRLW5"
  };
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const board = collection(db, "board");
let lastVisibleDoc = null; //이전 페이지의 마지막 문서
const que = await query(board, orderBy("when", "desc"));

//게시글 번호
const countAll = await getCountFromServer(que);
// console.log(countAll.data().count);
let listNum = countAll.data().count + 1;

// list

let docs = await getDocs(que);

// pagination
// currentPage: 현재 페이지
// totalCount: 총 데이터의 갯수
// pageCount: 화면에 나타날 페이지 갯수
// limit: 한 페이지 당 나타낼 데이터의 갯수
let currentPage = 1;
let totalCount = listNum - 1;
let pageCount = 5;
let limitNum = 5;

// 총 데이터의 개수를 한 페이지당 나타낼 데이터의 개수로 나눠주기.
// 올림의 이유 마지막 페이지가
let totalPage = Math.ceil(totalCount / limitNum);
let pageGroup = Math.ceil(currentPage / pageCount);

let lastNumber = pageGroup * pageCount;
if (lastNumber > totalPage) {
  lastNumber = totalPage;
}
let firstNumber = lastNumber - (pageCount - 1);

// const next = lastNumber + 1;
// const prev = firstNumber - 1;

// 1~5만큼 페이지네이션 그려줌

for (let i = firstNumber; i <= lastNumber; i++) {
  if (i === 1) {
    let pageAppend = `
    <span id="page${i}" class="active">${i}</span>`;
    $(".pages").append(pageAppend);
  } else {
    let pageAppend = `
    <span id="page${i}">${i}</span>`;
    $(".pages").append(pageAppend);
  }
}

//forEach 문에 파라미터 eachDoc 으로 바꿨어요 __ 바꾸니까 데이터 수정기능 동작하더라구요
docs.forEach((eachDoc) => {
  //데이터의 문서id 값 출력해 봤어요
  console.log(eachDoc.id);

  listNum--;
  let row = eachDoc.data();
  let writeTitle = row["writeTitle"];
  let writeName = row["writeName"];
  let when = row["when"];
  let num = row["num"].toString();
  var howMany = row["howMany"];

  let id = eachDoc.id;

  // 제목 너무 길면 줄이고 말줄임(...) 처리,
  // css로 하니 다 깨져서 css는 삭제했슴당
  let limitLength = 35;
  if (writeTitle.length > limitLength) {
    writeTitle = writeTitle.substr(0, limitLength - 2) + "...";
  }

  let append_html = `
  <tr>
      <td class="listNum">${listNum}</td>
      <td style = 'display : none'>${num}</td>
      <td class="listTitle">
        ${writeTitle}
      </td>
      <td class="listAutor">${writeName}</td>
      <td class="listDate">${when}</td>
      <td class="listViews">${howMany}</td>
  </tr>`;

  $("#listCard").append(append_html);

  // console.log(writeTitle, writeName);
  // console.log(typeof writeTitle, typeof writeName);

  $(document).click(async function (e) {
    e.preventDefault();
    let clickNum = e.target.previousElementSibling.innerText;

    if (clickNum === num) {
      //조회수 데이터 수정하기
      let newHowMany = howMany + 1;
      // console.log(newHowMany );
      let b = doc(db, "board", id);
      await updateDoc(b, { howMany: newHowMany });
      // console.log(row['howMany']);

      // alert('과연');  //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요.

      //클릭한 게시물 보여주도록
      window.location.href = `board_view.html?ID=" +${num}`;
    } else if (clickNum !== num) {
      // alert('존재하지 않는 게시글을 눌렀습니다.');
    }
  });
});

// pagination

// 누르는 페이지 마다 class=active; 추가, 색상 변경
$(".paging").click(async function (e) {
  $(".active").removeClass("active");
  $(e.target).addCgitass("active");
});

// 검색기능
// DB 데이터 값 중에서 writeTitle 값만 가져옴
let searbb = await getDocs(collection(db, "board"));
docs.forEach((eachDoc) => {
  let row = eachDoc.data();
  let writeTitle = row["writeTitle"];
  
});

// jquery 에서 searchContent 값으로 DB값과 비교
$(document).ready(function(){
  $("#searchContent").keyup(function() {
    var k = $(this).val(); // searchContent 값 지정
    $("tr").hide(); // tr요소를 숨김
    var temp = $("tr:contains('" + k + "')"); // tr요소 중 contains()의 값과 비교해서 지정
    $(temp).show(); //지정된 temp를 보여줌
  });
});