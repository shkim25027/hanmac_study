function keywordChange() {
  // 키워드 모달 내 .kw-add 체크박스와 label 내부 체크박스 동기화
  document.querySelectorAll(".kw-box").forEach((kwBox) => {
    const kwAddCheckbox = kwBox.querySelector(".kw-add");
    const labelCheckbox = kwBox.querySelector('label input[type="checkbox"]');

    if (kwAddCheckbox && labelCheckbox) {
      // .kw-add 체크박스 변경 이벤트 리스너
      kwAddCheckbox.addEventListener("change", function () {
        if (this.checked) {
          // .kw-add가 checked 상태일 때
          labelCheckbox.disabled = false;
          labelCheckbox.checked = true;
        } else {
          // .kw-add가 unchecked 상태일 때
          labelCheckbox.checked = false;
          labelCheckbox.disabled = true;
        }
      });

      // 초기 상태 설정 (페이지 로드 시)
      if (kwAddCheckbox.checked) {
        labelCheckbox.disabled = false;
        labelCheckbox.checked = true;
      } else {
        labelCheckbox.checked = false;
        labelCheckbox.disabled = true;
      }
    }
  });
}

// 모달 닫을 때 선택된 키워드를 .keyword-list에 동기화
function syncKeywordsToList() {
  const keywordList = document.getElementById("myKeyword");
  const selectedAllowKeywords = [];

  // .kw-add가 checked된 항목들 추출 (label 내부 체크박스 상태와 무관)
  document.querySelectorAll(".kw-box").forEach((kwBox) => {
    const kwAddCheckbox = kwBox.querySelector(".kw-add");
    const labelCheckbox = kwBox.querySelector('label input[type="checkbox"]');
    const labelText = kwBox.querySelector("label").textContent.trim();

    if (kwAddCheckbox && kwAddCheckbox.checked) {
      selectedAllowKeywords.push({
        text: labelText,
        checked: labelCheckbox ? labelCheckbox.checked : false,
      });
    }
  });

  // 기존 .kw-allow 항목들 제거
  keywordList.querySelectorAll(".kw-allow").forEach((item) => item.remove());

  // 새로운 .kw-allow 항목들 추가 (중복 제거)
  const uniqueKeywordsMap = new Map();
  selectedAllowKeywords.forEach((kw) => {
    if (!uniqueKeywordsMap.has(kw.text)) {
      uniqueKeywordsMap.set(kw.text, kw.checked);
    }
  });

  let index = 0;
  uniqueKeywordsMap.forEach((isChecked, keywordText) => {
    const label = document.createElement("label");
    label.className = "kw-allow";
    label.setAttribute("for", `chk_allow_${index + 1}`);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `chk_allow_${index + 1}`;
    checkbox.setAttribute("for", `chk_allow_${index + 1}`);
    checkbox.checked = isChecked;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + keywordText));

    // .kw-deny 항목들 앞에 추가
    const firstDeny = keywordList.querySelector(".kw-deny");
    if (firstDeny) {
      keywordList.insertBefore(label, firstDeny);
    } else {
      keywordList.appendChild(label);
    }

    index++;
  });
}
