/**
 * 진행률 표시 관리 클래스
 */
class ProgressIndicator {
  constructor(config, gaugeManager) {
    this.config = config;
    this.gaugeManager = gaugeManager;
    this.indicator = null;
    this.gaugeSvg = document.getElementById("gauge-svg");

    // 곡선 스타일 설정 (변경 가능)
    // 'arc-up': 위로 휘어지는 호 (기본)
    // 'arc-down': 아래로 휘어지는 호
    // 'wave': 물결 모양
    // 'steep-arc': 가파른 호
    // 'gentle-arc': 완만한 호
    this.curveStyle = "arc-up";
  }

  /**
   * 곡선 경로 반환
   * @private
   * @returns {string} SVG path 문자열
   */
  _getCurvePath() {
    switch (this.curveStyle) {
      case "arc-up":
        // 위로 휘어지는 호 (상단 배치)
        return '<path id="curve-path" d="M 10 40 Q 66 -5, 122 40" fill="none"/>';

      case "arc-down":
        // 아래로 휘어지는 호
        return '<path id="curve-path" d="M 10 5 Q 66 25, 122 5" fill="none"/>';

      case "wave":
        // 물결 모양
        return '<path id="curve-path" d="M 10 10 Q 33 0, 66 10 T 122 10" fill="none"/>';

      case "steep-arc":
        // 가파른 호
        return '<path id="curve-path" d="M 10 20 Q 66 -10, 122 20" fill="none"/>';

      case "gentle-arc":
        // 완만한 호
        return '<path id="curve-path" d="M 10 12 Q 66 2, 122 12" fill="none"/>';

      default:
        return '<path id="curve-path" d="M 10 15 Q 66 -5, 122 15" fill="none"/>';
    }
  }

  /**
   * 진행률 표시 생성
   */
  createIndicator() {
    // 컨테이너 생성
    this.indicator = document.createElement("div");
    this.indicator.className = "progress-indicator";
    this.indicator.id = "progress-indicator";

    // 곡선 경로 가져오기
    const curvePath = this._getCurvePath();

    // SVG 이미지 추가
    this.indicator.innerHTML = `
      <svg width="131" height="145" viewBox="0 0 131 145" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
        <!-- 트로피 이미지 -->
        <g filter="url(#filter0_d_2000_114823)">
          <path d="M94.6002 110.324C94.6002 114.487 81.8209 120.434 66.0569 120.434C50.2929 120.434 37.5137 113.892 37.5137 110.324C37.5137 106.756 37.5137 104.117 37.5137 104.117H94.6002C94.6002 104.117 94.6002 106.161 94.6002 110.324Z" fill="url(#paint0_linear_2000_114823)"/>
        </g>
        <ellipse cx="66.0569" cy="104.375" rx="28.5432" ry="11.2971" fill="#D4D4D4"/>
        <ellipse cx="66.0569" cy="104.375" rx="28.5432" ry="11.2971" fill="url(#paint1_linear_2000_114823)" fill-opacity="0.4"/>
        <g filter="url(#filter1_i_2000_114823)">
          <ellipse cx="66.0575" cy="104.706" rx="25.1181" ry="9.9873" fill="#D4D4D4"/>
          <ellipse cx="66.0575" cy="104.706" rx="25.1181" ry="9.9873" fill="url(#paint2_linear_2000_114823)" fill-opacity="0.8" style="mix-blend-mode:color-dodge"/>
        </g>
        <g style="mix-blend-mode:multiply" opacity="0.5" filter="url(#filter2_f_2000_114823)">
          <ellipse cx="65.5158" cy="107.185" rx="11.8947" ry="2.97361" fill="#A4A4A4"/>
        </g>
        <g style="mix-blend-mode:multiply" opacity="0.3" filter="url(#filter3_f_2000_114823)">
          <ellipse cx="64.9751" cy="106.917" rx="5.4067" ry="1.08131" fill="#A4A4A4"/>
        </g>
        <path d="M84.3611 69.3898C85.556 68.4177 92.4565 64.205 96.2351 60.6564C99.1848 57.8834 100.326 50.6427 95.7884 47.1207C89.889 42.5468 84.2265 47.3491 84.2265 47.3491C84.2265 47.3491 83.7313 44.6345 80.2865 43.0408C75.9481 41.0328 70.4525 40.2837 65.3982 40.3475C60.5 40.4059 55.9894 40.9903 51.9848 42.9293C48.3999 44.6664 48.1846 47.1419 48.1846 47.1419C48.1846 47.1419 43.4803 42.7061 37.7155 46.3079C31.9561 49.9149 33.6086 57.1397 36.3806 60.173C39.9923 64.1253 44.3307 66.1387 46.3007 67.5943C48.2654 69.0498 50.1493 70.4363 50.1493 71.6847C50.1493 72.9331 49.5895 73.2094 49.3742 73.1403C49.1643 73.0713 48.7929 71.8547 47.8294 72.3753C46.516 73.0925 46.9144 75.9824 49.6541 76.2586C52.3077 76.5296 52.8137 73.7618 52.8137 73.7618L53.2335 71.0579L57.588 74.0381L62.3624 77.9214L62.2225 81.2469C62.2225 81.2469 62.0125 83.8127 60.7476 86.0333C59.4827 88.2538 57.4481 90.469 57.4481 90.469L57.3835 92.4771L75.0869 92.0627L74.5271 90.1237C74.5271 90.1237 72.2449 87.6482 70.8723 84.9921C69.8927 83.0903 69.7366 81.1725 69.7366 81.1725L69.6935 76.4021L78.8816 70.8454C78.8816 70.8454 79.8666 71.6104 79.7267 71.8866C79.5867 72.1628 79.5544 74.9943 81.7613 76.0461C83.9413 77.0873 85.696 75.7699 85.4861 73.9637C85.2761 72.1628 84.1512 72.7844 83.8013 73.0606C83.4514 73.3369 82.6763 73.4059 82.4664 72.3647C82.2511 71.3341 83.1662 70.362 84.3611 69.3898ZM39.1311 59.5833L37.0265 53.2617L39.5725 49.9734L42.4253 49.15C42.4253 49.15 46.0693 51.8327 46.1985 52.0505C46.3276 52.2683 48.5237 56.7253 48.5237 56.7253L51.4196 67.0737L39.1311 59.5833ZM80.5018 67.8971C80.5448 67.6793 83.22 56.8103 83.22 56.8103C83.22 56.6828 85.1039 55.8169 85.1039 55.6416C85.1039 55.4663 88.5272 49.9681 88.5272 49.9681L94.2328 50.1859L95.417 55.7691L92.5642 60.4014C92.5696 60.4067 80.4587 68.1096 80.5018 67.8971Z" fill="#ECECEC"/>
        <path d="M96.0509 54.3519C95.6365 49.4006 90.7384 48.2159 88.725 48.9331C86.7115 49.6503 85.4047 50.9944 84.9584 52.9069C84.5972 54.4528 84.2359 55.4834 83.8215 55.6428C83.3647 55.8128 82.945 55.7437 82.945 55.7437C82.945 55.7437 82.8706 52.3969 82.8918 51.0475C82.945 48.2638 83.795 47.5519 83.795 47.5519C83.795 47.5519 83.6143 46.6116 83.2531 46.0909C82.8918 45.5756 82.2225 44.9062 82.2225 44.9062C82.2225 44.9062 82.3765 46.245 81.7072 46.5584C81.0378 46.8719 80.3153 46.4044 80.3153 46.4044L80.9847 49.1881C80.9847 49.1881 79.9009 63.0644 79.8 63.3725C79.699 63.6806 75.6243 70.7463 75.6243 70.7463C75.6243 70.7463 73.2497 72.9669 72.1181 73.4822C70.9812 73.9975 70.0037 75.3416 65.6209 75.3894C61.2381 75.4425 57.4715 71.9841 57.4715 71.9841L53.705 68.3716L50.9212 60.1691L50.5068 51.8125L50.6822 48.7737L50.8043 47.5041L50.6078 46.8613C50.6078 46.8613 50.2465 47.2225 49.5772 47.0684C48.9078 46.9144 48.6475 46.0378 48.6475 46.0378C48.6475 46.0378 48.3872 46.4522 48.3393 46.6594C48.2862 46.8666 48.2331 47.3447 48.2331 47.3447C48.2331 47.3447 48.9556 48.1044 49.1097 49.1881C49.2637 50.2719 49.0565 54.7609 48.2862 54.6547C47.5106 54.5537 47.7656 50.7872 44.8278 49.3422C42.2831 48.0884 38.4847 48.4656 36.9334 51.6106C35.3875 54.7556 36.519 58.4691 41.3693 61.9275C46.2197 65.3859 51.3834 68.2919 52.2015 71.065C53.179 74.3641 50.9637 76.3244 50.9637 76.3244C50.9637 76.3244 52.5734 76.1012 53.365 74.3747C53.62 73.8169 53.7156 73.0041 53.7528 72.5206C55.5856 74.9112 58.024 76.9353 61.254 77.9128C62.4759 78.3325 63.8518 78.545 65.7643 78.545C66.0406 78.545 66.3115 78.5344 66.5825 78.5238C68.819 78.4441 70.7315 78.0244 72.5856 77.1053C75.0878 75.9472 77.0268 74.1781 78.525 72.17C78.4825 72.6481 78.7747 73.8381 79.3325 74.7784C80.31 76.4306 81.9622 76.5316 81.9622 76.5316C81.9622 76.5316 79.6937 75.1928 80.1559 71.9947C80.6181 68.7966 82.7325 67.6597 85.9306 65.5984C89.1393 63.5319 96.46 59.3031 96.0509 54.3519ZM43.6431 61.3697C42.2034 60.355 39.68 59.0003 38.6387 56.9338C37.2522 54.1766 38.3784 50.8456 41.0134 50.4366C46.4853 49.5759 46.5862 56.3706 46.9475 57.1941C47.3087 58.0175 48.3393 58.0706 48.3393 58.0706C48.3393 58.0706 48.3765 58.5275 48.5253 59.4094C48.5306 59.4359 48.5359 59.4572 48.5359 59.4837L48.5518 59.5634C48.6528 60.1637 48.7962 60.9128 48.9981 61.7681L49.014 61.8319C49.1256 62.3153 49.2425 62.7722 49.3647 63.1919C49.609 64.0737 49.9065 65.0247 50.2731 66.0022C49.7418 65.6409 46.6978 63.5319 43.6431 61.3697ZM93.214 57.55C92.0718 59.3987 89.7609 60.7747 88.0556 61.9328C85.8562 63.4256 82.5837 65.6675 81.6593 66.2944C81.8718 65.7312 82.0578 65.1734 82.2278 64.6262C82.504 63.9037 82.7962 63.0219 82.9981 62.0709C83.5293 59.5741 83.6197 57.3906 83.6197 57.3906C83.6197 57.3906 84.7034 57.6988 85.3728 56.9763C86.0422 56.2538 86.2918 54.0119 86.9187 52.9547C87.8962 51.3025 89.8565 49.6025 92.7997 51.6638C94.4997 52.8591 94.5634 55.3612 93.214 57.55ZM64.4947 80.2078L67.4962 80.1706C67.4962 80.1706 67.5759 83.4484 68.0487 85.8922C68.5215 88.3413 69.1537 91.0612 69.1537 91.0612C69.1537 91.0612 63.039 93.1119 63.0762 90.9019C63.1134 88.6919 64.0218 84.3887 64.0218 84.3887C64.0218 84.3887 64.5743 79.2622 64.4947 80.2078Z" fill="#BFBFBF"/>
        <path d="M59.4601 46.1539C59.4601 46.1539 62.8016 45.7767 65.9095 45.8245C69.0173 45.8723 72.2154 46.4833 72.2154 46.4833C72.2154 46.4833 72.0294 56.8851 71.461 62.7236C70.8979 68.562 68.6879 72.9342 68.0982 74.172C67.5298 75.3726 67.1154 76.0154 67.1154 76.0154L64.1191 75.6648L58.9395 65.2629L59.4601 46.1539Z" fill="#BFBFBF"/>
        <path d="M55.4575 47.7006C55.4575 47.7006 56.3978 47.2278 57.7631 46.7125C59.0009 46.245 60.1166 46.1016 60.1166 46.1016C60.1166 46.1016 60.1484 52.9972 60.26 57.9166C60.3556 62.1081 61.9069 68.9772 62.6613 70.8153C63.4156 72.6534 64.7756 75.4584 64.7756 75.4584C64.7756 75.4584 62.0397 75.0653 60.3556 72.9297C59.4684 71.8034 55.3194 63.0909 55.1759 57.3481C55.0325 51.6053 55.5956 47.5572 55.4575 47.7006Z" fill="#E2E2E2"/>
        <path d="M53.9034 48.4963C53.8077 48.7778 53.0587 54.7119 54.2327 60.2156C55.4068 65.7194 57.144 69.4859 58.2915 70.9788C59.3115 72.3016 59.9755 72.9284 60.3527 72.9284C60.7299 72.9284 58.8015 68.365 57.9037 64.7844C57.0112 61.2091 56.5384 56.9219 56.4427 54.8075C56.3471 52.6878 56.2568 47.2266 56.2568 47.2266C56.2568 47.2266 55.2209 47.6994 54.9871 47.8375C54.7534 47.9809 53.9034 48.4963 53.9034 48.4963Z" fill="white"/>
        <path d="M60.6777 90.685C60.6777 90.685 62.7018 87.3913 63.1268 84.8944C63.5518 82.3975 63.7855 80.1875 63.7855 80.1875L65.0393 80.2406C65.0393 80.2406 64.9171 83.8584 64.7737 86.3075C64.6302 88.7566 64.2105 91.1578 64.2105 91.1578L60.6777 90.685Z" fill="#E2E2E2"/>
        <path d="M62.2368 78.1403C62.2368 78.1403 63.1771 77.2212 65.7643 77.2212C68.3515 77.2212 69.4618 78.2147 69.4618 78.2147L69.5308 81.4075C69.5308 81.4075 67.8096 80.8709 65.7165 80.8444C63.974 80.8231 62.0986 81.4712 62.0986 81.4712L62.2368 78.1403ZM50.9371 46.43C51.3727 46.0262 55.5483 42.8919 65.4349 42.8069C76.0705 42.7112 80.0602 45.7925 80.3099 45.9625C80.5915 46.1484 80.9208 46.9984 80.7827 47.3756C80.6393 47.7528 80.3577 47.8909 79.5608 47.5616C78.7586 47.2322 74.8061 44.3475 65.2968 44.645C56.1646 44.9266 52.2918 47.705 51.8827 47.9387C51.5533 48.1247 50.9424 48.1725 50.6608 47.7953C50.374 47.4234 50.6555 46.6956 50.9371 46.43ZM80.7827 48.6453C79.5608 48.7409 80.4055 58.5797 77.8183 64.7422C75.0452 71.335 71.5071 73.2156 71.6505 73.5928C71.794 73.97 75.2577 72.9234 77.4411 69.8262C79.4652 66.9575 80.6871 64.4128 81.2555 61.0234C81.8133 57.6341 82.1427 48.5391 80.7827 48.6453ZM50.6768 49.7716C50.3686 49.7556 50.6821 54.6644 50.1827 56.8212C49.9915 57.65 49.524 57.82 49.4761 58.0059C49.4283 58.1919 50.5015 64.5084 52.3024 67.2816C54.0449 69.9644 57.4821 73.3059 58.0452 72.7428C58.6083 72.1797 55.5483 70.2937 53.4818 66.1978C52.2918 63.8497 51.0805 60.3116 51.0327 56.2634C51.0008 53.5859 51.3355 49.8087 50.6768 49.7716Z" fill="#D0D0D0"/>
        <path d="M78.4416 97.9588L78.4363 90.3672H54.0678C54.1422 90.3672 54.0838 96.5403 54.0731 97.9853H50.6094V103.484H81.5547V97.9853L78.4416 97.9588Z" fill="#A6A6A6"/>
        <path d="M61.8773 94.347C61.277 94.3205 60.5863 94.4427 60.5598 95.1864C60.5332 95.9302 60.5332 98.0817 60.5332 98.4908C60.5332 98.8998 60.8679 99.2558 61.7073 99.2823C62.5466 99.3089 70.4251 99.2823 70.9776 99.2823C71.5301 99.2823 71.817 98.8042 71.8382 98.3261C71.8648 97.848 71.8116 95.8345 71.8116 95.2873C71.8116 94.3789 70.9988 94.3789 70.4463 94.3789C69.8513 94.3683 61.8773 94.347 61.8773 94.347Z" fill="#E6E2D6"/>
        
        <!-- 곡선 경로 정의 -->
        <defs>
          ${curvePath}
        </defs>
        
        <!-- 퍼센트 텍스트 (곡선 경로를 따라 배치) -->
        <text class="progress-percent" font-size="22" font-weight="bold" stroke="white" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke fill" pointer-events="none">
          <textPath href="#curve-path" startOffset="50%" text-anchor="middle">
            <tspan class="progress-label" fill="#7E5746">진도율</tspan>
            <tspan class="progress-value" fill="#FF6B00">0%</tspan>
          </textPath>
        </text>
        
        <defs>
          <filter id="filter0_d_2000_114823" x="33.5137" y="102.117" width="65.0864" height="24.3174" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="2"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2000_114823"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2000_114823" result="shape"/>
          </filter>
          <filter id="filter1_i_2000_114823" x="40.9395" y="94.7188" width="50.2363" height="19.9746" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="1"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2000_114823"/>
          </filter>
          <filter id="filter2_f_2000_114823" x="50.9144" y="101.505" width="29.2028" height="11.361" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="1.35338" result="effect1_foregroundBlur_2000_114823"/>
          </filter>
          <filter id="filter3_f_2000_114823" x="56.8616" y="103.129" width="16.226" height="7.5776" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="1.35338" result="effect1_foregroundBlur_2000_114823"/>
          </filter>
          <linearGradient id="paint0_linear_2000_114823" x1="40.5107" y1="112.147" x2="92.8162" y2="112.108" gradientUnits="userSpaceOnUse">
            <stop stop-color="#A0A0A0"/>
            <stop offset="0.5" stop-color="#D4D4D4"/>
            <stop offset="1" stop-color="#A0A0A0"/>
          </linearGradient>
          <linearGradient id="paint1_linear_2000_114823" x1="66.0569" y1="115.672" x2="66.0569" y2="93.0781" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0"/>
            <stop offset="1" stop-color="white"/>
          </linearGradient>
          <linearGradient id="paint2_linear_2000_114823" x1="66.0575" y1="114.693" x2="66.0575" y2="94.7188" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0"/>
            <stop offset="1" stop-color="white"/>
          </linearGradient>
        </defs>
      </svg>
    `;

    // 초기 위치 설정
    this._positionIndicator();

    // 컨테이너에 추가
    document.querySelector(".learning-gauge").appendChild(this.indicator);

    // 리사이즈 핸들러 설정
    this._setupResizeHandler();

    console.log("[ProgressIndicator] 진행률 표시 생성 완료");
  }

  /**
   * 진행률 표시 위치 설정
   * @private
   */
  _positionIndicator() {
    if (!this.gaugeSvg || !this.indicator) return;

    const viewBox = this.gaugeSvg.viewBox.baseVal;

    // 경로의 끝 지점 (100% 위치)
    const endPoint = this.gaugeManager.getPointAtPercent(1.0);

    // 퍼센트 기반 위치 계산
    const percentX = (endPoint.x / viewBox.width) * 100 + 26;
    const percentY = (endPoint.y / viewBox.height) * 100 + 5;

    // 위치 설정 (경로 끝점 위쪽에 배치)
    this.indicator.style.position = "absolute";
    this.indicator.style.left = `${percentX}%`;
    this.indicator.style.top = `${percentY}%`;
    this.indicator.style.transform = "translate(-50%, -120%)"; // 위로 120% 이동
    this.indicator.style.zIndex = "15";
    this.indicator.style.pointerEvents = "none"; // 클릭 이벤트 통과

    console.log(
      `[ProgressIndicator] 위치 설정 (라인 끝): (${percentX.toFixed(2)}%, ${percentY.toFixed(2)}%)`
    );
  }

  /**
   * 리사이즈 핸들러 설정
   * @private
   */
  _setupResizeHandler() {
    let resizeTimer;

    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        console.log("[ProgressIndicator] 리사이즈 감지: 위치 재계산");
        this._positionIndicator();
      }, 100);
    });
  }

  /**
   * 진행률 업데이트
   * @param {Array} allMarkers - 전체 마커 배열
   */
  updateProgress(allMarkers) {
    if (!this.indicator) return;

    const completedCount = allMarkers.filter((m) => m.completed).length;
    const totalCount = allMarkers.length;
    const percent = Math.round((completedCount / totalCount) * 100);

    // tspan 요소 찾기
    const valueSpan = this.indicator.querySelector(".progress-value");
    if (valueSpan) {
      valueSpan.textContent = `${percent}%`;
    }

    console.log(
      `[ProgressIndicator] 진행률 업데이트: ${percent}% (${completedCount}/${totalCount})`
    );
  }
}
