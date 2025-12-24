/**
 * SVG 필터 및 그라디언트 동적 생성 스크립트
 * 파일 크기를 줄이면서 동일한 시각적 결과 제공
 */
(function (window) {
  "use strict";

  const SVGEnhancer = {
    // 필터 정의
    filters: [
      `<filter id="filter0_f_24_1056" x="-327.168" y="67" width="1804.1" height="539" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter1_iin_24_1056" x="-338.069" y="70" width="1814" height="531" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.758013 0 0 0 0 0.700919 0 0 0 0 0.586731 0 0 0 0.5 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.895833 0 0 0 0 0.883702 0 0 0 0 0.839844 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="effect1_innerShadow_24_1056" result="effect2_innerShadow_24_1056"/>
<feTurbulence type="fractalNoise" baseFrequency="1 1" stitchTiles="stitch" numOctaves="3" result="noise" seed="8423" />
<feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
<feComponentTransfer in="alphaNoise" result="coloredNoise1">
<feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
</feComponentTransfer>
<feComposite operator="in" in2="effect2_innerShadow_24_1056" in="coloredNoise1" result="noise1Clipped" />
<feFlood flood-color="rgba(213, 197, 167, 0.1)" result="color1Flood" />
<feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
<feMerge result="effect3_noise_24_1056">
<feMergeNode in="effect2_innerShadow_24_1056" />
<feMergeNode in="color1" />
</feMerge>
</filter>`,
      `<filter id="filter2_i_24_1056" x="-385.069" y="71" width="1834" height="522" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter3_i_24_1056" x="-386.069" y="70" width="1835" height="522" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="2"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.786859 0 0 0 0 0.601696 0 0 0 0 0.467828 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter4_dd_24_1056" x="9.58084" y="570.358" width="54.7011" height="34.7011" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3.70849"/>
<feGaussianBlur stdDeviation="6.67528"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.472756 0 0 0 0 0.254801 0 0 0 0 0.153797 0 0 0 0.25 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1.4834"/>
<feGaussianBlur stdDeviation="0.741698"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.472756 0 0 0 0 0.254801 0 0 0 0 0.153797 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter5_i_24_1056" x="24.9314" y="576" width="25" height="9" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="0.528863" dy="0.528863"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.790064 0 0 0 0 0.646514 0 0 0 0 0.47733 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter6_f_24_1056" x="21.7555" y="574.824" width="14.3518" height="11.3518" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="2.58795" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter7_f_24_1056" x="29.7555" y="574.824" width="14.3518" height="11.3518" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="2.58795" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter8_f_24_1056" x="32.2035" y="577.272" width="9.45577" height="7.4559" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="1.86394" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter9_d_24_1056" x="1360.93" y="429" width="40" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter10_d_24_1056" x="1358.39" y="431.732" width="45.0732" height="22.0732" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="3.26831"/>
<feGaussianBlur stdDeviation="3.26831"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.386218 0 0 0 0 0.330307 0 0 0 0 0.218485 0 0 0 1 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter11_i_24_1056" x="1366.93" y="430" width="28" height="11" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="0.605703" dy="0.605703"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.611478 0 0 0 0 0.793269 0 0 0 0 0.737942 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter12_d_24_1056" x="891.059" y="220.876" width="24.7456" height="9.74556" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.749113"/>
<feGaussianBlur stdDeviation="0.936391"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.386218 0 0 0 0 0.330307 0 0 0 0 0.218485 0 0 0 0.8 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter13_i_24_1056" x="893.931" y="219" width="18" height="7" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="0.267075" dy="0.267075"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.815705 0 0 0 0 0.815705 0 0 0 0 0.815705 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter14_d_24_1056" x="231.259" y="244.997" width="22.3443" height="8.34425" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.668851"/>
<feGaussianBlur stdDeviation="0.836063"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.386218 0 0 0 0 0.330307 0 0 0 0 0.218485 0 0 0 0.8 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter15_i_24_1056" x="233.931" y="243" width="17" height="7" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="0.23846" dy="0.23846"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.815705 0 0 0 0 0.815705 0 0 0 0 0.815705 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter16_d_24_1056" x="606.791" y="349.716" width="28.2806" height="11.2806" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.856129"/>
<feGaussianBlur stdDeviation="1.07016"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.386218 0 0 0 0 0.330307 0 0 0 0 0.218485 0 0 0 0.8 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter17_i_24_1056" x="609.931" y="347" width="21" height="9" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="0.305229" dy="0.305229"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.815705 0 0 0 0 0.815705 0 0 0 0 0.815705 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter18_d_24_1056" x="205.315" y="580.43" width="33.2335" height="13.2335" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1.04669"/>
<feGaussianBlur stdDeviation="1.30837"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.386218 0 0 0 0 0.330307 0 0 0 0 0.218485 0 0 0 0.8 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter19_i_24_1056" x="209.931" y="578" width="25" height="9" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="0.373169" dy="0.373169"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.754808 0 0 0 0 0.612374 0 0 0 0 0.564896 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter20_i_24_1056" x="3.59774" y="516.666" width="5.33365" height="83.3337" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-1.33365" dy="-1.33365"/>
<feGaussianBlur stdDeviation="0.666827"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.69391 0 0 0 0 0.568235 0 0 0 0 0.510424 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter21_i_24_1056" x="58.5977" y="475.666" width="5.33365" height="83.3337" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="-1.33365" dy="-1.33365"/>
<feGaussianBlur stdDeviation="0.666827"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.69391 0 0 0 0 0.568235 0 0 0 0 0.510424 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter22_i_24_1056" x="21.4397" y="496.576" width="40.2026" height="43.2223" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.764423 0 0 0 0 0.606746 0 0 0 0 0.559842 0 0 0 0.5 0"/>
<feBlend mode="multiply" in2="shape" result="effect1_innerShadow_24_1056"/>
</filter>`,
      `<filter id="filter23_f_24_1056" x="55" y="555.069" width="13.8628" height="6.86277" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.965692" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter24_f_24_1056" x="59.2577" y="557.326" width="6.34748" height="2.34748" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.336869" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter25_f_24_1056" x="1.15633e-05" y="596.069" width="13.8628" height="6.86277" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.965692" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter26_f_24_1056" x="4.25766" y="598.326" width="6.34748" height="2.34748" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="0.336869" result="effect1_foregroundBlur_24_1056"/>
</filter>`,
      `<filter id="filter27_dd_24_1056" x="390.931" y="576.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter28_dd_24_1056" x="525.931" y="576.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter29_dd_24_1056" x="660.931" y="575.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter30_dd_24_1056" x="795.931" y="572.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter31_dd_24_1056" x="930.931" y="569.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter32_dd_24_1056" x="1065.93" y="563.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter33_dd_24_1056" x="1200.93" y="552.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter34_dd_24_1056" x="1342.93" y="532.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter35_dd_24_1056" x="1049.93" y="357" width="67" height="53" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0942469 0 0 0 0 0.560096 0 0 0 0 0.418316 0 0 0 0.2 0"/>
<feBlend mode="plus-lighter" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="7"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0942469 0 0 0 0 0.560096 0 0 0 0 0.418316 0 0 0 0.4 0"/>
<feBlend mode="plus-lighter" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter36_dd_24_1056" x="1068.93" y="373.125" width="29" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="1"/>
<feGaussianBlur stdDeviation="0.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter37_dd_24_1056" x="809.547" y="354.946" width="26.7694" height="18.4246" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.923077"/>
<feGaussianBlur stdDeviation="1.84615"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.923077"/>
<feGaussianBlur stdDeviation="0.461538"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter38_dd_24_1056" x="348.547" y="331.946" width="26.7694" height="18.4246" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.923077"/>
<feGaussianBlur stdDeviation="1.84615"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.923077"/>
<feGaussianBlur stdDeviation="0.461538"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter39_dd_24_1056" x="138.547" y="278.946" width="26.7694" height="18.4246" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.923077"/>
<feGaussianBlur stdDeviation="1.84615"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.923077"/>
<feGaussianBlur stdDeviation="0.461538"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter40_dd_24_1056" x="434.136" y="225.357" width="18.5896" height="12.8082" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.641026"/>
<feGaussianBlur stdDeviation="1.28205"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.641026"/>
<feGaussianBlur stdDeviation="0.320513"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter41_dd_24_1056" x="734.136" y="219.357" width="18.5896" height="12.8082" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.641026"/>
<feGaussianBlur stdDeviation="1.28205"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.641026"/>
<feGaussianBlur stdDeviation="0.320513"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter42_dd_24_1056" x="1054.14" y="213.357" width="18.5896" height="12.8082" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.641026"/>
<feGaussianBlur stdDeviation="1.28205"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.641026"/>
<feGaussianBlur stdDeviation="0.320513"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter43_dd_24_1056" x="1236.62" y="175.972" width="19.6153" height="13.8338" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.769231"/>
<feGaussianBlur stdDeviation="1.53846"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.769231"/>
<feGaussianBlur stdDeviation="0.384615"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter44_dd_24_1056" x="1085.5" y="142.127" width="14.8716" height="10.3426" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="1.02564"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="0.25641"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter45_dd_24_1056" x="778.495" y="127.127" width="14.8716" height="10.3426" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="1.02564"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="0.25641"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter46_dd_24_1056" x="572.495" y="121.127" width="14.8716" height="10.3426" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="1.02564"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="0.25641"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
      `<filter id="filter47_dd_24_1056" x="347.495" y="103.127" width="14.8716" height="10.3426" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="1.02564"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow_24_1056"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="0.512821"/>
<feGaussianBlur stdDeviation="0.25641"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="multiply" in2="effect1_dropShadow_24_1056" result="effect2_dropShadow_24_1056"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_24_1056" result="shape"/>
</filter>`,
    ],

    // 그라디언트 정의
    gradients: [
      `<linearGradient id="paint0_linear_24_1056" x1="1577.1" y1="685.047" x2="782.331" y2="11.4077" gradientUnits="userSpaceOnUse">
<stop stop-color="#D9D9D9" stop-opacity="0"/>
<stop offset="0.0652711" stop-color="#737373"/>
</linearGradient>`,
      `<linearGradient id="paint1_linear_24_1056" x1="572.432" y1="603.774" x2="572.432" y2="71" gradientUnits="userSpaceOnUse">
<stop offset="0.647646" stop-color="#6F5D3A"/>
<stop offset="0.85" stop-color="#D5B26F" stop-opacity="0"/>
</linearGradient>`,
      `<linearGradient id="paint2_linear_24_1056" x1="652.802" y1="47.9779" x2="652.802" y2="746.594" gradientUnits="userSpaceOnUse">
<stop stop-color="#EFE7D7"/>
<stop offset="1" stop-color="#EFD7A6"/>
</linearGradient>`,
      `<linearGradient id="paint3_linear_24_1056" x1="43.1551" y1="332.027" x2="1447.93" y2="332.027" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFC176" stop-opacity="1"/>
<stop offset="0.55" stop-color="#FF9A49"/>
<stop offset="1" stop-color="#FFC176" stop-opacity="1"/>
</linearGradient>`,
      `<linearGradient id="paint4_linear_24_1056" x1="24.4014" y1="583.937" x2="50.0564" y2="583.918" gradientUnits="userSpaceOnUse">
<stop stop-color="#AC8B61"/>
<stop offset="0.5" stop-color="#EECFA8"/>
<stop offset="1" stop-color="#AC8B61"/>
</linearGradient>`,
      `<linearGradient id="paint5_linear_24_1056" x1="36.9314" y1="586" x2="36.9314" y2="575" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint6_linear_24_1056" x1="37.4314" y1="585" x2="37.4314" y2="576" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint7_linear_24_1056" x1="1366.61" y1="439.429" x2="1395.93" y2="439.407" gradientUnits="userSpaceOnUse">
<stop stop-color="#527A6D"/>
<stop offset="0.5" stop-color="#6BBCA3"/>
<stop offset="1" stop-color="#527A6D"/>
</linearGradient>`,
      `<linearGradient id="paint8_linear_24_1056" x1="1380.93" y1="441" x2="1380.93" y2="429" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint9_linear_24_1056" x1="1380.93" y1="441" x2="1380.93" y2="430" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint10_linear_24_1056" x1="894.034" y1="224.953" x2="913.275" y2="224.938" gradientUnits="userSpaceOnUse">
<stop stop-color="#787878"/>
<stop offset="0.5" stop-color="#C0C0C0"/>
<stop offset="1" stop-color="#7E7E7E"/>
</linearGradient>`,
      `<linearGradient id="paint11_linear_24_1056" x1="903.431" y1="226" x2="903.431" y2="218" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint12_linear_24_1056" x1="903.431" y1="218" x2="903.431" y2="226" gradientUnits="userSpaceOnUse">
<stop stop-color="#E4E4E4"/>
<stop offset="0.471154" stop-color="#FAFAFA"/>
<stop offset="1" stop-color="#E4E4E4"/>
</linearGradient>`,
      `<linearGradient id="paint13_linear_24_1056" x1="902.931" y1="226" x2="902.931" y2="219" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint14_linear_24_1056" x1="233.929" y1="248.461" x2="251.338" y2="248.447" gradientUnits="userSpaceOnUse">
<stop stop-color="#787878"/>
<stop offset="0.5" stop-color="#C0C0C0"/>
<stop offset="1" stop-color="#7E7E7E"/>
</linearGradient>`,
      `<linearGradient id="paint15_linear_24_1056" x1="242.431" y1="249" x2="242.431" y2="242" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint16_linear_24_1056" x1="242.431" y1="242" x2="242.431" y2="249" gradientUnits="userSpaceOnUse">
<stop stop-color="#E4E4E4"/>
<stop offset="0.471154" stop-color="#FAFAFA"/>
<stop offset="1" stop-color="#E4E4E4"/>
</linearGradient>`,
      `<linearGradient id="paint17_linear_24_1056" x1="242.431" y1="250" x2="242.431" y2="243" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint18_linear_24_1056" x1="610.191" y1="354.445" x2="632.181" y2="354.429" gradientUnits="userSpaceOnUse">
<stop stop-color="#787878"/>
<stop offset="0.5" stop-color="#C0C0C0"/>
<stop offset="1" stop-color="#7E7E7E"/>
</linearGradient>`,
      `<linearGradient id="paint19_linear_24_1056" x1="620.931" y1="356" x2="620.931" y2="346" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint20_linear_24_1056" x1="620.931" y1="346" x2="620.931" y2="356" gradientUnits="userSpaceOnUse">
<stop stop-color="#E4E4E4"/>
<stop offset="0.471154" stop-color="#FAFAFA"/>
<stop offset="1" stop-color="#E4E4E4"/>
</linearGradient>`,
      `<linearGradient id="paint21_linear_24_1056" x1="620.431" y1="356" x2="620.431" y2="347" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint22_linear_24_1056" x1="209.401" y1="585.937" x2="235.056" y2="585.918" gradientUnits="userSpaceOnUse">
<stop stop-color="#7A6152"/>
<stop offset="0.5" stop-color="#BC8B6B"/>
<stop offset="1" stop-color="#7A6252"/>
</linearGradient>`,
      `<linearGradient id="paint23_linear_24_1056" x1="221.931" y1="588" x2="221.931" y2="577" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint24_linear_24_1056" x1="221.931" y1="577" x2="221.931" y2="588" gradientUnits="userSpaceOnUse">
<stop stop-color="#E39B60"/>
<stop offset="0.471154" stop-color="#FFFAF4"/>
<stop offset="1" stop-color="#F7C195"/>
</linearGradient>`,
      `<linearGradient id="paint25_linear_24_1056" x1="222.431" y1="587" x2="222.431" y2="578" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint26_linear_24_1056" x1="6.9314" y1="518" x2="6.9314" y2="600" gradientUnits="userSpaceOnUse">
<stop stop-color="#E9DDD8"/>
<stop offset="0.25" stop-color="#C7AFA4"/>
<stop offset="0.9" stop-color="#B99D90"/>
<stop offset="1" stop-color="#BA7759"/>
</linearGradient>`,
      `<linearGradient id="paint27_linear_24_1056" x1="61.9314" y1="477" x2="61.9314" y2="559" gradientUnits="userSpaceOnUse">
<stop stop-color="#E9DDD8"/>
<stop offset="0.25" stop-color="#C7AFA4"/>
<stop offset="0.9" stop-color="#B99D90"/>
<stop offset="1" stop-color="#BA7759"/>
</linearGradient>`,
      `<linearGradient id="paint28_linear_24_1056" x1="34.9255" y1="503.071" x2="52.0237" y2="541.655" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF7536"/>
<stop offset="1" stop-color="#CD2C00"/>
</linearGradient>`,
      `<linearGradient id="paint29_linear_24_1056" x1="35.5165" y1="515.542" x2="43.3977" y2="530.978" gradientUnits="userSpaceOnUse">
<stop stop-color="#FCF3EE"/>
<stop offset="1" stop-color="#FCF3EE" stop-opacity="0.6"/>
</linearGradient>`,
      `<linearGradient id="paint30_linear_24_1056" x1="415.931" y1="585.441" x2="394.931" y2="585.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint31_linear_24_1056" x1="412.931" y1="588.74" x2="404.084" y2="576.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint32_linear_24_1056" x1="405.431" y1="579.125" x2="405.431" y2="590.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint33_linear_24_1056" x1="550.931" y1="585.441" x2="529.931" y2="585.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint34_linear_24_1056" x1="547.931" y1="588.74" x2="539.084" y2="576.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint35_linear_24_1056" x1="540.431" y1="579.125" x2="540.431" y2="590.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint36_linear_24_1056" x1="685.931" y1="584.441" x2="664.931" y2="584.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint37_linear_24_1056" x1="682.931" y1="587.74" x2="674.084" y2="575.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint38_linear_24_1056" x1="675.431" y1="578.125" x2="675.431" y2="589.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint39_linear_24_1056" x1="820.931" y1="581.441" x2="799.931" y2="581.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint40_linear_24_1056" x1="817.931" y1="584.74" x2="809.084" y2="572.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint41_linear_24_1056" x1="810.431" y1="575.125" x2="810.431" y2="586.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint42_linear_24_1056" x1="955.931" y1="578.441" x2="934.931" y2="578.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint43_linear_24_1056" x1="952.931" y1="581.74" x2="944.084" y2="569.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint44_linear_24_1056" x1="945.431" y1="572.125" x2="945.431" y2="583.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint45_linear_24_1056" x1="1090.93" y1="572.441" x2="1069.93" y2="572.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint46_linear_24_1056" x1="1087.93" y1="575.74" x2="1079.08" y2="563.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint47_linear_24_1056" x1="1080.43" y1="566.125" x2="1080.43" y2="577.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint48_linear_24_1056" x1="1225.93" y1="561.441" x2="1204.93" y2="561.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint49_linear_24_1056" x1="1222.93" y1="564.74" x2="1214.08" y2="552.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint50_linear_24_1056" x1="1215.43" y1="555.125" x2="1215.43" y2="566.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint51_linear_24_1056" x1="1367.93" y1="541.441" x2="1346.93" y2="541.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint52_linear_24_1056" x1="1364.93" y1="544.74" x2="1356.08" y2="532.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint53_linear_24_1056" x1="1357.43" y1="535.125" x2="1357.43" y2="546.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint54_linear_24_1056" x1="1093.93" y1="382.441" x2="1072.93" y2="382.441" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint55_linear_24_1056" x1="1090.93" y1="385.74" x2="1082.08" y2="373.366" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint56_linear_24_1056" x1="1083.43" y1="376.125" x2="1083.43" y2="387.022" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint57_linear_24_1056" x1="832.624" y1="363.526" x2="813.239" y2="363.526" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint58_linear_24_1056" x1="829.854" y1="366.561" x2="821.723" y2="355.151" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint59_linear_24_1056" x1="822.931" y1="357.715" x2="822.931" y2="367.741" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint60_linear_24_1056" x1="371.624" y1="340.526" x2="352.239" y2="340.526" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint61_linear_24_1056" x1="368.854" y1="343.561" x2="360.723" y2="332.151" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint62_linear_24_1056" x1="361.931" y1="334.715" x2="361.931" y2="344.741" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint63_linear_24_1056" x1="161.624" y1="287.526" x2="142.239" y2="287.526" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint64_linear_24_1056" x1="158.854" y1="290.561" x2="150.723" y2="279.151" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint65_linear_24_1056" x1="151.931" y1="281.715" x2="151.931" y2="291.741" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint66_linear_24_1056" x1="450.162" y1="231.322" x2="436.7" y2="231.322" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint67_linear_24_1056" x1="448.239" y1="233.434" x2="442.579" y2="225.506" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint68_linear_24_1056" x1="443.431" y1="227.28" x2="443.431" y2="234.254" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint69_linear_24_1056" x1="750.162" y1="225.322" x2="736.7" y2="225.322" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint70_linear_24_1056" x1="748.239" y1="227.434" x2="742.579" y2="219.506" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint71_linear_24_1056" x1="743.431" y1="221.28" x2="743.431" y2="228.254" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint72_linear_24_1056" x1="1070.16" y1="219.322" x2="1056.7" y2="219.322" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint73_linear_24_1056" x1="1068.24" y1="221.434" x2="1062.58" y2="213.506" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint74_linear_24_1056" x1="1063.43" y1="215.28" x2="1063.43" y2="222.254" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint75_linear_24_1056" x1="1253.16" y1="182.322" x2="1239.7" y2="182.322" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint76_linear_24_1056" x1="1251.24" y1="184.434" x2="1245.58" y2="176.506" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint77_linear_24_1056" x1="1246.43" y1="178.28" x2="1246.43" y2="185.254" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint78_linear_24_1056" x1="1098.32" y1="146.949" x2="1087.55" y2="146.949" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint79_linear_24_1056" x1="1096.78" y1="148.665" x2="1092.16" y2="142.291" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint80_linear_24_1056" x1="1092.93" y1="143.665" x2="1092.93" y2="149.332" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint81_linear_24_1056" x1="791.316" y1="131.949" x2="780.547" y2="131.949" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint82_linear_24_1056" x1="789.777" y1="133.665" x2="785.156" y2="127.291" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint83_linear_24_1056" x1="785.931" y1="128.665" x2="785.931" y2="134.332" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint84_linear_24_1056" x1="585.316" y1="125.949" x2="574.547" y2="125.949" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint85_linear_24_1056" x1="583.777" y1="127.665" x2="579.156" y2="121.291" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint86_linear_24_1056" x1="579.931" y1="122.665" x2="579.931" y2="128.332" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
      `<linearGradient id="paint87_linear_24_1056" x1="360.316" y1="107.949" x2="349.547" y2="107.949" gradientUnits="userSpaceOnUse">
<stop/>
<stop offset="0.5" stop-opacity="0"/>
<stop offset="1"/>
</linearGradient>`,
      `<linearGradient id="paint88_linear_24_1056" x1="358.777" y1="109.665" x2="354.156" y2="103.291" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0"/>
<stop offset="1" stop-color="white"/>
</linearGradient>`,
      `<linearGradient id="paint89_linear_24_1056" x1="354.931" y1="104.665" x2="354.931" y2="110.332" gradientUnits="userSpaceOnUse">
<stop stop-color="white" stop-opacity="0.25"/>
<stop offset="0.25" stop-color="white" stop-opacity="0"/>
<stop offset="0.5" stop-color="white"/>
<stop offset="0.75" stop-color="white" stop-opacity="0.25"/>
<stop offset="1" stop-color="white" stop-opacity="0.5"/>
</linearGradient>`,
    ],

    /**
     * SVG에 필터와 그라디언트 적용
     * @param {string|SVGElement} target - SVG 선택자 또는 요소
     */
    enhance(target) {
      const svg =
        typeof target === "string" ? document.querySelector(target) : target;

      if (!svg) {
        console.error("SVG를 찾을 수 없습니다:", target);
        return false;
      }

      const svgNS = "http://www.w3.org/2000/svg";
      let defs = svg.querySelector("defs");

      // defs가 없으면 생성
      if (!defs) {
        defs = document.createElementNS(svgNS, "defs");
        svg.insertBefore(defs, svg.firstChild);
      }

      // innerHTML로 한번에 추가 (더 빠름)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = `<svg xmlns="${svgNS}">${this.filters.join("")}${this.gradients.join("")}</svg>`;

      const tempSVG = tempDiv.querySelector("svg");
      while (tempSVG.firstChild) {
        defs.appendChild(tempSVG.firstChild);
      }

      console.log(
        `✓ SVG 향상 완료: ${this.filters.length} 필터, ${this.gradients.length} 그라디언트 추가`
      );
      return true;
    },

    /**
     * data-enhance 속성이 있는 모든 SVG 자동 처리
     */
    autoEnhance() {
      // 인라인 SVG
      const svgs = document.querySelectorAll("svg[data-enhance]");
      svgs.forEach((svg) => this.enhance(svg));

      // Object 태그로 로드된 SVG
      const objects = document.querySelectorAll("object[data-enhance]");
      objects.forEach((obj) => {
        obj.addEventListener("load", () => {
          try {
            const svgDoc = obj.contentDocument;
            if (svgDoc) {
              const svg = svgDoc.querySelector("svg");
              if (svg) this.enhance(svg);
            }
          } catch (e) {
            console.error("Object SVG 접근 실패 (CORS?):", e);
          }
        });
      });

      console.log(
        `✓ 자동 향상 활성화: ${svgs.length}개 SVG, ${objects.length}개 Object`
      );
    },
  };

  // 전역으로 노출
  window.SVGEnhancer = SVGEnhancer;

  // DOM 로드 시 자동 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      SVGEnhancer.autoEnhance()
    );
  } else {
    SVGEnhancer.autoEnhance();
  }
})(window);
