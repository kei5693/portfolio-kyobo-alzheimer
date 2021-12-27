Vue.config.devtools = true;

Vue.component('top-header', {
  template: '<div id="header"></div>'
})

var vm = new Vue({
  el: '#app',
  data() {
    return {
      userAgentKakao: false,    // 카카오 인앱 브라우저에서 하단 버튼 가리는 문제로 스타일 분리
      showUrlAlert: false,      // 공유 팝업
      showMainPopup: false,     // intro 팝업
      showResultPopup: false,   // 결과페이지 한눈에 보는 치매 정보 팝업
      resultPopupIndex: 0,
      testIndex: 0,             // 질문 페이지 Index
      testQustions: [
        "<strong>“지난 주말에 어디 갔더라…”</strong><p>최근에 일어난 일을<br />기억하는 것이 어렵나요?</p>",
        "<strong>“그때 말했다고? 난 기억 안나는데?”</strong><p>며칠 전에 나눈 대화 내용을 <br /> 기억하기 어렵나요?</p>",
        "<strong>“우리 오늘 보기로 했다고?”</strong><p>며칠 전에 한 약속을<br />기억하기 어렵나요?</p>",
        "<strong>“그 친구 이름이 뭐였지?”</strong><p>친한 사람의 이름을<br />기억하기 어렵나요?</p>",
        "<strong>“휴대폰을 내가 어디에 뒀더라”</strong><p>물건 둔 곳을<br />기억하기 어렵나요?</p>",
        "<strong>“아차, 또 우산을 두고 왔네!”</strong><p>이전에 비해<br />물건을 자주 잃어버리나요?</p>",
        "<strong>“103동이 어디 있었지?”</strong><p>집 근처에서<br />길을 잃은 적이 있나요?</p>",
        "<strong>“사려고 했던게 뭐였지?”</strong><p>가게에서 2-3가지 물건을<br />사려고 할 때 <br /> 물건 이름을 기억하기 어렵나요?</p>",
        "<strong>“가스불을 끄고 나왔나…기억이 안나네”</strong><p>가스불이나 전깃불 끄는 것을<br />기억하기 어렵나요?</p>",
        "<strong>“4885였나 4886이었나.. 기억이 안 나네”</strong><p>본인이나 자녀의 전화번호를<br />기억하기 어렵나요?</p>",
      ], // 질문의 제목들
      testQustionsSelected: [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ], // 선택된 질문의 선택된 값
      popupDataLists:[
        {
          title: '누구도 예외 일 수<br> 없습니다!',
          images: './images/img_popup_01.jpg',
        },
        {
          title: '빨리 늙는 한국<br> 급증하는 치매인구!',
          images: './images/img_popup_02.jpg',
        },
        {
          title: '가장 두려운<br> 질병은?',
          images: './images/img_popup_03.jpg',
        },
        {
          title: '온 가족이<br> 함께 앓는 질병!',
          images: './images/img_popup_04.jpg',
        },
        {
          title: '가족력<br> 있다, 없다?',
          images: './images/img_popup_05.jpg',
        },
        {
          title: '치매, 준비없이<br> 맞이하시겠습니까?',
          images: './images/img_popup_06.jpg',
        },
      ], // 결과 페이지 팝업 데이터
      copyURL: 'http://www.kyobo-letter.co.kr/simul/alzheimer/' // URL 복사시 복사되는 URL
    }
  },
  mounted() {
    if (document.querySelector(".test-page") && this.testIndex == 0) {
      if (location.search.indexOf("type=back") >= 0) {
        this.testIndex = 9
        this.testQustionsSelected = JSON.parse(localStorage.getItem("testQustionsSelected"))
      } else {
        console.log("testQustionsSelected 초기화")
        localStorage.setItem("testQustionsSelected", JSON.stringify([null, null, null, null, null, null, null, null, null, null]))
      }
    }

    if(navigator.userAgent.match(/KAKAOTALK/i) != null){
      this.userAgentKakao = true;
    }
  },
  watch: {
    testIndex(value) {
      if (value == 10) {
        var count = this.testQustionsSelected.reduce((result, value) => {
          return value == true ? result + 1 : result;
        }, 0)
        window.location.href = "./result.html?c=".concat(count)
      }
    },
    testQustionsSelected(value) {
      localStorage.setItem("testQustionsSelected", JSON.stringify(value))
    }
  },
  computed: {
    // 결과 화면에서 보여시는 값 자동계산 변수 (YES를 누른 카운트)
    trueCount() {
      var _parammap = {};
      document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
          return decodeURIComponent(s.split("+").join(" "));
        }
        _parammap[decode(arguments[1])] = decode(arguments[2]);
      });

      var intCount = parseInt(_parammap["c"])
      intCount = isNaN(intCount) ? 0 : intCount
      return intCount >= 10 ? intCount : "0".concat(intCount);
    },
    // 결과 화면에서 보여시는 값 자동계산 변수 (trueCount 값에 의해서 변경되는 결과값)
    resultText() {
      return parseInt(this.trueCount) >= 5 ? "있는" : "없는"
    }
  },
  methods: {
    /* 메인 팝업 */
    mainPopupToggle() {
      this.showMainPopup = !this.showMainPopup;
    },
    /* 결과 팝업 */
    resultPopupToggle(index){
      this.resultPopupIndex = index;
      this.showResultPopup = !this.showResultPopup;
    },
    /* 홈으로 */
    onClickGotoHome() {
      window.location.href = "./index.html"
    },
    /* 검사 시작 */
    onClickStart() {
      window.location.href = "./question.html"
    },
    /* 이전 */
    onClickPrev() {
      if (this.testIndex == 0) {
        window.location.href = "./index.html"
        return
      }
      this.testIndex = this.testIndex - 1;
    },
    /* 다음 */
    onClickNext() {
      if(this.testQustionsSelected[this.testIndex] != null){
        this.testIndex = this.testIndex + 1;
      } else {
        alert('답변을 선택하지 않으셨습니다.\n답변 선택 후 다음 버튼을 눌러주세요.');
      }
    },
    /* 설문 답변 선택 */
    selectedValue(qustionIndex, selectValue) {
      this.testQustionsSelected[qustionIndex] = selectValue;
      this.testQustionsSelected = this.testQustionsSelected.slice();
    },
    /* 결과 페이지 url copy */
    onClickUrlCopy() {
      var clipboard = new ClipboardJS('.url-copy');
      clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
      });

      clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
      });

      alert('URL이 복사되었습니다.');
    },
    onClickKakao(){
      console.log('카카오');
      
      Kakao.Link.sendCustom({
        templateId: 52654,
        templateArgs: {
          'title': '치매진단 시뮬레이터',
          'description': '10가지 문항을 통해 치매 여부를 간단히 확인해보세요.'     
        }
      });
    },
    onClickShare(){
      this.showUrlAlert = !this.showUrlAlert;
    }
  },
})