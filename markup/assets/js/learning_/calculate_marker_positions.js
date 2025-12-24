/**
 * 브라우저 콘솔에서 실행하여 정확한 pathPercent 계산하기
 * 
 * 사용 방법:
 * 1. 브라우저에서 learning.html 열기
 * 2. F12 개발자 도구 열기
 * 3. 콘솔에 이 코드 붙여넣기 실행
 */

(function calculateMarkerPositions() {
  // SVG에 그려진 실제 마커(ellipse) 좌표들
  const svgMarkers = [
    { cx: 36.93, cy: 580.5 },      // 1
    { cx: 151.93, cy: 286.73 },    // 2
    { cx: 354.93, cy: 107.5 },     // 3
    { cx: 361.93, cy: 339.73 },    // 4
    { cx: 405.43, cy: 584.57 },    // 5
    { cx: 443.43, cy: 230.77 },    // 6
    { cx: 540.43, cy: 584.57 },    // 7
    { cx: 579.93, cy: 125.5 },     // 8
    { cx: 675.43, cy: 583.57 },    // 9
    { cx: 743.43, cy: 224.77 },    // 10
    { cx: 785.93, cy: 131.5 },     // 11
    { cx: 810.43, cy: 580.57 },    // 12
    { cx: 822.93, cy: 362.73 },    // 13
    { cx: 945.43, cy: 577.57 },    // 14
    { cx: 1063.43, cy: 218.77 },   // 15
    { cx: 1080.43, cy: 571.57 },   // 16
    { cx: 1083.43, cy: 381.57 },   // 17
    { cx: 1092.93, cy: 146.5 },    // 18
    { cx: 1215.43, cy: 560.57 },   // 19
    { cx: 1246.43, cy: 181.77 },   // 20
    { cx: 1357.43, cy: 540.57 },   // 21
  ];

  // maskPath 가져오기
  const maskPath = document.getElementById('maskPath');
  if (!maskPath) {
    console.error('maskPath를 찾을 수 없습니다!');
    return;
  }

  const pathLength = maskPath.getTotalLength();
  console.log(`경로 총 길이: ${pathLength.toFixed(2)}`);
  console.log('');

  // 각 SVG 마커와 가장 가까운 경로상의 위치 찾기
  const results = svgMarkers.map((marker, index) => {
    let minDistance = Infinity;
    let bestPercent = 0;
    let bestPoint = null;

    // 0%부터 100%까지 0.1% 간격으로 검사
    for (let p = 0; p <= 1; p += 0.001) {
      const point = maskPath.getPointAtLength(pathLength * p);
      const distance = Math.sqrt(
        Math.pow(point.x - marker.cx, 2) + 
        Math.pow(point.y - marker.cy, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        bestPercent = p;
        bestPoint = point;
      }
    }

    return {
      index: index + 1,
      svgMarker: marker,
      pathPercent: bestPercent,
      pathPoint: { x: bestPoint.x.toFixed(2), y: bestPoint.y.toFixed(2) },
      distance: minDistance.toFixed(2)
    };
  });

  // 결과 출력
  console.log('=== 마커 위치 계산 결과 ===');
  console.log('');
  
  results.forEach(r => {
    console.log(
      `마커 ${r.index}: ` +
      `pathPercent: ${r.pathPercent.toFixed(3)}, ` +
      `SVG(${r.svgMarker.cx}, ${r.svgMarker.cy}) → ` +
      `경로(${r.pathPoint.x}, ${r.pathPoint.y}), ` +
      `거리: ${r.distance}px`
    );
  });

  console.log('');
  console.log('=== config.js용 코드 ===');
  console.log('');
  
  results.forEach(r => {
    console.log(`{ pathPercent: ${r.pathPercent.toFixed(3)} }, // 마커 ${r.index}`);
  });

  // 클립보드에 복사할 수 있도록 JSON 반환
  return results.map(r => ({
    pathPercent: parseFloat(r.pathPercent.toFixed(3)),
    cx: r.svgMarker.cx,
    cy: r.svgMarker.cy
  }));
})();
